"use client";

import { api } from "@/convex/_generated/api";
import { useConvex } from "convex/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { Mic, MicOff, ChevronRight, Square, Loader2 } from "lucide-react";

type Question = { question: string; answer: string };
type ConversationItem = { question: string; answer: string };

export default function StartInterview() {
  const { interviewId } = useParams<{ interviewId: string }>();
  const router = useRouter();
  const convex = useConvex();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [conversation, setConversation] = useState<ConversationItem[]>([]);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isMicOn, setIsMicOn] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const [submitting, setSubmitting] = useState(false);

  // Fetch questions safely
  useEffect(() => {
    if (!interviewId) return;
    convex
      .query(api.interview.GetInterviewQuestions, {
        interviewRecordId: interviewId as any,
      })
      .then((data) => {
        // ✅ Guard against missing or empty questions
        if (
          !data ||
          !Array.isArray(data.interviewQuestions) ||
          data.interviewQuestions.length === 0
        ) {
          console.error("No questions found for this interview", data);
          router.push("/dashboard");
          return;
        }
        const qs = data.interviewQuestions;
        setQuestions(qs);
        setConversation(
          qs.map((q: Question) => ({ question: q.question, answer: "" })),
        );
        if (qs[0]?.question) generateAvatar(qs[0].question);
      })
      .catch((err) => {
        console.error("Failed to fetch interview questions:", err);
        router.push("/dashboard");
      });
  }, [interviewId, convex, router]);

  // Generate avatar video
  const generateAvatar = useCallback(async (text: string) => {
    setAvatarLoading(true);
    setVideoUrl(null);
    try {
      const res = await fetch("/api/did", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!data.id) throw new Error("No talk ID");
      for (let i = 0; i < 30; i++) {
        await new Promise((r) => setTimeout(r, 2000));
        const pollRes = await fetch(`/api/did-result?id=${data.id}`);
        const pollData = await pollRes.json();
        if (pollData.status === "done" && pollData.result_url) {
          setVideoUrl(pollData.result_url);
          break;
        } else if (pollData.status === "error") break;
      }
    } catch (err) {
      console.error("Avatar error:", err);
    } finally {
      setAvatarLoading(false);
    }
  }, []);

  useEffect(() => {
    if (videoUrl && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoUrl]);

  // Speech recognition
  const startListening = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported. Please use Chrome.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript + " ";
        else interim += result[0].transcript;
      }
      setTranscript(finalTranscript + interim);
    };
    recognition.onerror = () => setIsMicOn(false);
    recognition.onend = () => {
      if (finalTranscript.trim()) saveAnswer(finalTranscript.trim());
      setIsMicOn(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsMicOn(true);
    setTranscript("");
  };

  const stopListening = () => recognitionRef.current?.stop();

  const saveAnswer = (answer: string) => {
    if (!answer) return;
    setConversation((prev) => {
      const updated = [...prev];
      if (updated[currentIndex]) updated[currentIndex].answer = answer;
      return updated;
    });
  };

  const handleNext = async () => {
    if (isMicOn) stopListening();
    await new Promise((r) => setTimeout(r, 100));
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setTranscript("");
      generateAvatar(questions[currentIndex + 1].question);
    }
  };

  const handleEndInterview = async () => {
    if (isMicOn) stopListening();
    await new Promise((r) => setTimeout(r, 200));
    setSubmitting(true);
    try {
      const finalConversation = conversation.map((item) => ({
        question: item.question,
        answer: item.answer || "[No answer provided]",
      }));
      const res = await fetch("/api/save-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewId, conversation: finalConversation }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push(`/interview/${interviewId}/feedback`);
    } catch (err) {
      console.error(err);
      alert("Failed to save interview.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state while questions are being fetched
  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-gray-400 mb-2" />
        <p className="text-gray-500">Loading interview questions...</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex]?.question;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Progress bar */}
        <div>
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-full bg-black rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Avatar & question */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-[380px] bg-gray-900 flex items-center justify-center">
            {avatarLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-10">
                <Loader2 className="animate-spin text-white w-8 h-8 mb-2" />
                <p className="text-gray-300 text-sm">
                  Interviewer is preparing...
                </p>
              </div>
            )}
            {videoUrl ? (
              <video
                ref={videoRef}
                src={videoUrl}
                className="h-full w-full object-contain"
                autoPlay
                playsInline
              />
            ) : !avatarLoading ? (
              <p className="text-gray-400">Waiting for interviewer...</p>
            ) : null}
          </div>
          <div className="p-6 border-t">
            <p className="text-xs font-semibold text-gray-400 mb-2">
              Question {currentIndex + 1}
            </p>
            <p className="text-lg font-medium">{currentQuestion}</p>
          </div>
        </div>

        {/* Transcript / answer */}
        <div className="bg-white rounded-2xl shadow-sm p-5 min-h-[100px]">
          <p className="text-xs font-semibold text-gray-400 mb-2">
            Your Answer
          </p>
          {transcript ? (
            <p>{transcript}</p>
          ) : conversation[currentIndex]?.answer ? (
            <p>{conversation[currentIndex].answer}</p>
          ) : (
            <p className="text-gray-400 italic">
              {isMicOn ? "Listening..." : "Press the mic to start answering"}
            </p>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-between gap-4">
          <button
            onClick={isMicOn ? stopListening : startListening}
            disabled={avatarLoading || submitting}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium ${
              isMicOn
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
            } disabled:opacity-50`}
          >
            {isMicOn ? <MicOff size={18} /> : <Mic size={18} />}
            {isMicOn ? "Stop Recording" : "Start Recording"}
          </button>

          <div className="flex gap-3">
            <button
              onClick={handleEndInterview}
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-3 rounded-full border border-gray-300 hover:bg-gray-100"
            >
              <Square size={16} /> End Interview
            </button>
            {currentIndex + 1 === questions.length ? (
              <button
                onClick={handleEndInterview}
                disabled={submitting}
                className="px-6 py-3 rounded-full bg-black text-white"
              >
                {submitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Finish Interview"
                )}
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={avatarLoading || submitting}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white"
              >
                Next <ChevronRight size={16} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
