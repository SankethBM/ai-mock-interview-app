import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function POST(req: NextRequest) {
  try {
    const { interviewId, feedback } = await req.json();
    if (!interviewId || !feedback) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 👇 This is critical – make sure the mutation name and args are correct
    await convex.mutation(api.interview.SaveInterviewFeedback, {
      interviewRecordId: interviewId,
      feedback,
    });

    console.log(`✅ Feedback saved for interview ${interviewId}`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Callback error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
} 