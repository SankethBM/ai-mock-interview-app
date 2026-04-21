import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const response = await axios.post(
      "https://api.d-id.com/talks",
      {
        source_url: "https://d-id-public-bucket.s3.amazonaws.com/alice.jpg",
        script: {
          type: "text",
          input: text,
          provider: {
            type: "microsoft",
            voice_id: "en-US-JennyNeural",
          },
        },
      },
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            process.env.DID_API_KEY + ":",
          ).toString("base64")}`,
          "Content-Type": "application/json",
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("🔥 D-ID ERROR:", error.response?.data || error.message);

    return NextResponse.json(
      {
        error: error.response?.data || error.message,
      },
      { status: 500 },
    );
  }
}
