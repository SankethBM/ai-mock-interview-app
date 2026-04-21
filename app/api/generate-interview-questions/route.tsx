import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import ImageKit from "imagekit";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    // 1. Get user
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.log("User email:", user.primaryEmailAddress?.emailAddress);

    // 2. Get or create Convex user
    let convexUser = await convex.query(api.users.GetUserByEmail, {
      email: user.primaryEmailAddress?.emailAddress!,
    }).catch(err => {
      console.error("GetUserByEmail query failed:", err);
      return null;
    });

    if (!convexUser) {
      convexUser = await convex.mutation(api.users.CreateNewUser, {
        name: user.fullName!,
        email: user.primaryEmailAddress?.emailAddress!,
        imageUrl: user.imageUrl!,
      });
    }
    const convexUserId = convexUser._id;
    console.log("Convex user ID:", convexUserId);

    // 3. Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobTitle = formData.get("jobTitle") as string | null;
    const jobDescription = formData.get("jobDescription") as string | null;

    // 4. Upload resume if provided
    let resumeUrl: string | null = null;
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `resume-${Date.now()}.pdf`,
        isPrivateFile: false,
        isPublished: true,
      });
      resumeUrl = uploadResponse.url;
      console.log("Resume uploaded:", resumeUrl);
    }

    // 5. Call n8n webhook to generate questions
    let questions = [];
    try {
      const n8nResponse = await axios.post(
        process.env.N8N_GENERATE_QUESTIONS_WEBHOOK!,
        {
          resumeUrl,
          jobTitle: jobTitle || null,
          jobDescription: jobDescription || null,
        },
        { timeout: 30000 }
      );
      console.log("n8n raw response:", n8nResponse.data);

      // Handle various response shapes
      let raw = n8nResponse.data;
      if (raw && typeof raw === 'object') {
        if (Array.isArray(raw)) {
          questions = raw;
        } else if (raw.questions && Array.isArray(raw.questions)) {
          questions = raw.questions;
        } else if (raw.data && Array.isArray(raw.data)) {
          questions = raw.data;
        } else {
          console.warn("Unexpected n8n response structure, using fallback");
          questions = [];
        }
      } else if (Array.isArray(raw)) {
        questions = raw;
      } else {
        questions = [];
      }
    } catch (n8nError: any) {
      console.error("n8n call failed:", n8nError.message);
      // Fallback to mock questions
      questions = [];
    }

    // Validate and shape questions
    if (!Array.isArray(questions) || questions.length === 0) {
      questions = [
        { question: "Tell me about yourself.", answer: "" },
        { question: "Why are you interested in this role?", answer: "" },
        { question: "What are your greatest strengths?", answer: "" },
        { question: "Where do you see yourself in 5 years?", answer: "" },
      ];
    }
    const formattedQuestions = questions.map((q: any) => ({
      question: q.question || q.text || "Tell me about yourself",
      answer: "", // always empty for new interview
    }));

    // 6. Save interview session to Convex
    const interviewId = await convex.mutation(api.interview.saveInterviewQuestion, {
      questions: formattedQuestions,
      uid: convexUserId,
      resumeUrl,
      jobTitle: jobTitle || null,
      jobDescription: jobDescription || null,
    });

    console.log("Interview created with ID:", interviewId);
    return NextResponse.json({ interviewId });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }   
}