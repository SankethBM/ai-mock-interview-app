import { aj } from "@/utils/arcjet";
import { currentUser } from "@clerk/nextjs/server";
import axios from "axios";
import { error } from "console";
import ImageKit from "imagekit";
import { NextRequest, NextResponse } from "next/server";

var imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_URL_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_URL_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobTitle = formData.get("jobTitle") as File;
    const jobDescription = formData.get("jobDescription") as File;

    const decision = await aj.protect(req, {
      userId: user?.primaryEmailAddress?.emailAddress ?? "",
      requested: 5,
    }); // Deduct 5 tokens from the bucket
    console.log("Arcjet decision", decision);

    //@ts-ignore  
    if (decision?.reason?.remaining == 0) {
      return NextResponse.json({
        status: 429,
        result: "No Free credits remaining, Try again after 24 hours",
      });
    }

    // if (!file) {
    //   return NextResponse.json({ error: "No File Found !" }, { status: 404 });
    // }
    if (file) {
      console.log("file", formData);
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadResponse = await imagekit.upload({
        file: buffer,
        fileName: `upload-${Date.now()}.pdf`,
        isPrivateFile: false, // optional
        isPublished: true,
      });

      // call n8n webhook
      const result = await axios.post(
        "http://localhost:5678/webhook/generate-interview-question",
        {
          resumeUrl: uploadResponse?.url,
        },
      );

      console.log(result.data);

      return NextResponse.json({
        questions: result.data,
        resumeUrl: uploadResponse?.url,
        status:200
      });
    } else {
      const result = await axios.post(
        "http://localhost:5678/webhook/generate-interview-question",
        {
          resumeUrl: null,
          jobTitle: jobTitle,
          jobDescription: jobDescription,
        },
      );

      console.log(result.data);

      return NextResponse.json({
        questions: result.data,
        resumeUrl: null,
      });
    }
  } catch (error: any) {
    console.log("Upload Error :", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
