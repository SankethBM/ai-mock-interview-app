import { NextRequest, NextResponse } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

function generateMockFeedback(
  conversation: { question: string; answer: string }[],
) {
  const total = conversation.length;
  const overallScore = Math.floor(Math.random() * 5) + 5; // 5-9
  const strengths = [
    "Clear communication",
    "Good use of examples",
    "Shows enthusiasm",
    "Structured answers",
    "Confident tone",
  ].slice(0, 3);
  const improvements = [
    "Provide more specific metrics",
    "Pause between points",
    "Elaborate on technical details",
    "Use STAR method",
  ].slice(0, 3);
  const questionFeedback = conversation.map((item, idx) => ({
    question: item.question,
    answer: item.answer || "[No answer provided]",
    score: Math.floor(Math.random() * 5) + 5,
    comment: [
      "Good answer, but be more concise.",
      "Strong points, add an example.",
      "Well structured. Keep it up!",
      "Relevant, work on delivery.",
      "Excellent! Very clear.",
    ][idx % 5],
  }));
  return {
    overallScore,
    summary: `You answered ${total} questions. Score: ${overallScore}/10.`,
    strengths,
    improvements,
    questionFeedback,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { interviewId, conversation } = await req.json();
    console.log("📥 Save interview:", interviewId);
    if (!interviewId || !conversation) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // 1. Save conversation
    await convex.mutation(api.interview.SaveInterviewAnswers, {
      interviewRecordId: interviewId,
      conversation,
    });
    console.log("✅ Conversation saved");

    // 2. Generate and save feedback
    const feedback = generateMockFeedback(conversation);
    await convex.mutation(api.interview.SaveInterviewFeedback, {
      interviewRecordId: interviewId,
      feedback,
    });
    console.log("✅ Feedback saved");

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("❌ Error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
  