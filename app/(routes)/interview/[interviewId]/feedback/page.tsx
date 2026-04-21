"use client";

import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2, Home, RefreshCw, CheckCircle2, TrendingUp, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

type Feedback = {
  overallScore: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  questionFeedback: { question: string; answer: string; score: number; comment: string }[];
};

export default function FeedbackPage() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const convex = useConvex();
  const router = useRouter();
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [expanded, setExpanded] = useState<number | null>(null);

  const loadFeedback = async () => {
    try {
      setLoading(true);
      setError(false);
      const data = await convex.query(api.interview.GetInterviewFeedback, {
        interviewRecordId: interviewId as any,
      });
      if (data?.feedback) {
        setFeedback(data.feedback);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeedback();
  }, [interviewId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400" />
      </div>
    );
  }

  if (error || !feedback) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Feedback not available</h2>
        <p className="text-gray-500">It may still be generating or there was an error.</p>
        <div className="flex gap-3">
          <button
            onClick={loadFeedback}
            className="flex items-center gap-2 px-4 py-2 rounded-full border hover:bg-gray-50"
          >
            <RefreshCw size={16} /> Retry
          </button>
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-black text-white"
          >
            <Home size={16} /> Dashboard
          </button>
        </div>
      </div>
    );
  }

  const scoreColor = (score: number) =>
    score >= 8 ? "text-green-600" : score >= 5 ? "text-yellow-600" : "text-red-500";

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Interview Feedback</h1>
          <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 px-4 py-2 rounded-full border">
            <Home size={16} /> Dashboard
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 flex gap-6 items-center shadow-sm">
          <div className="w-20 h-20 rounded-full border-4 flex items-center justify-center">
            <span className={`text-3xl font-bold ${scoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}<span className="text-base text-gray-400">/10</span>
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Overall Score</h2>
            <p className="text-gray-600">{feedback.summary}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="text-green-500" size={20} />
              <h3 className="font-semibold">Strengths</h3>
            </div>
            <ul className="space-y-2">
              {feedback.strengths.map((s, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="text-yellow-500" size={20} />
              <h3 className="font-semibold">Areas to Improve</h3>
            </div>
            <ul className="space-y-2">
              {feedback.improvements.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="font-semibold">Question by Question</h3>
          </div>
          {feedback.questionFeedback.map((qf, i) => (
            <div key={i} className="border-b last:border-b-0">
              <button className="w-full flex justify-between items-center px-6 py-4 text-left" onClick={() => setExpanded(expanded === i ? null : i)}>
                <div className="flex gap-3 items-center">
                  <span className={`font-bold ${scoreColor(qf.score)}`}>{qf.score}/10</span>
                  <span className="text-sm line-clamp-1">{qf.question}</span>
                </div>
                {expanded === i ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {expanded === i && (
                <div className="px-6 pb-5 space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Your Answer</p>
                    <p className="text-sm bg-gray-50 p-3 rounded-lg mt-1">{qf.answer || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400">Feedback</p>
                    <div className="flex gap-2 mt-1 text-sm">
                      <AlertCircle size={16} className="text-gray-400" />
                      <p>{qf.comment}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}