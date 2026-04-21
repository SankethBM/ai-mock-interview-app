"use client";

import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useConvex } from "convex/react";
import { api } from "@/convex/_generated/api";
import EmptyState from "./EmptyState";
import CreateInterviewDialog from "../_components/CreateInterviewDialog";
import { 
  Calendar, 
  Star, 
  TrendingUp, 
  Clock, 
  ArrowRight, 
  Briefcase, 
  FileText,
  Award,
  Target,
  Zap,
  BarChart3,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  Medal,
  Activity,
  Layers,
  PenTool
} from "lucide-react";
import Link from "next/link";

type InterviewSession = {
  _id: string;
  jobTitle: string | null;
  jobDescription?: string | null;
  completedAt?: number;
  feedback?: { overallScore: number };
  status: string;
  createdAt?: number;
};

export default function Dashboard() {
  const { user } = useUser();
  const convex = useConvex();
  const [interviewList, setInterviewList] = useState<InterviewSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [convexUserId, setConvexUserId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    convex
      .query(api.users.GetUserByEmail, {
        email: user.primaryEmailAddress?.emailAddress!,
      })
      .then((userRecord) => {
        if (userRecord) setConvexUserId(userRecord._id);
        else setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [user, convex]);

  useEffect(() => {
    if (!convexUserId) return;
    convex
      .query(api.interview.GetUserInterviews, { userId: convexUserId as any })
      .then((data) => {
        setInterviewList(data as InterviewSession[]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [convexUserId, convex]);

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-emerald-600";
    if (score >= 6) return "text-amber-600";
    return "text-rose-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 8) return "bg-emerald-50 border-emerald-200";
    if (score >= 6) return "bg-amber-50 border-amber-200";
    return "bg-rose-50 border-rose-200";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 8) return <Medal className="w-4 h-4" />;
    if (score >= 6) return <TrendingUp className="w-4 h-4" />;
    return <TrendingDown className="w-4 h-4" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Excellent";
    if (score >= 6) return "Good";
    return "Needs Improvement";
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "Not started";
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const completedCount = interviewList.filter(i => i.status === "completed").length;
  const averageScore = interviewList
    .filter(i => i.feedback?.overallScore)
    .reduce((acc, i) => acc + (i.feedback?.overallScore || 0), 0) / (interviewList.filter(i => i.feedback?.overallScore).length || 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-gray-400 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          <p className="text-gray-400 text-sm mt-1">Preparing your interview insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg">
                  <PenTool className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-black">Dashboard</h1>
                  <p className="text-gray-500 text-sm">
                    Welcome back, {user?.fullName?.split(" ")[0] || "Professional"} 👋
                  </p>
                </div>
              </div>
            </div>
            <CreateInterviewDialog />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-transparent opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Briefcase className="w-6 h-6 text-gray-600" />
                </div>
                <TrendingUp className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Total Interviews</p>
              <p className="text-3xl font-bold text-black mt-1">{interviewList.length}</p>
              <p className="text-xs text-gray-400 mt-2">+{interviewList.length} total sessions</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <CheckCircle2 className="w-6 h-6 text-gray-600" />
                </div>
                <Activity className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Completed</p>
              <p className="text-3xl font-bold text-black mt-1">{completedCount}</p>
              <p className="text-xs text-gray-400 mt-2">{Math.round((completedCount / interviewList.length) * 100) || 0}% completion rate</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Award className="w-6 h-6 text-gray-600" />
                </div>
                <Target className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold text-black mt-1">{Math.round(averageScore) || 0}<span className="text-lg text-gray-400">/10</span></p>
              <p className="text-xs text-gray-400 mt-2">Performance metric</p>
            </div>
          </div>

          <div className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200">
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-6 h-6 text-gray-600" />
                </div>
                <Sparkles className="w-4 h-4 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Improvement</p>
              <p className="text-3xl font-bold text-black mt-1">+15<span className="text-lg text-gray-400">%</span></p>
              <p className="text-xs text-gray-400 mt-2">vs last month</p>
            </div>
          </div>
        </div>

        {/* Interviews Section */}
        {interviewList.length === 0 ? (
          <EmptyState />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-black">Your Interviews</h2>
                <p className="text-gray-500 text-sm mt-1">Review your performance and track progress</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-500">{interviewList.length} total sessions</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {interviewList.map((interview, index) => (
                <div
                  key={interview._id}
                  className="group relative bg-white rounded-4xl shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 hover:border-gray-300 animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Gradient Border Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl blur-xl -z-10" />
                  
                  {/* Card Content */}
                  <div className="relative bg-white rounded-2xl overflow-hidden">
                    {/* Header - Black Gradient */}
                    <div className="relative h-40 bg-gradient-to-r from-black via-gray-800 to-black overflow-hidden">
                      <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute top-4 right-4">
                        {interview.feedback?.overallScore && (
                          <div className={`${getScoreBg(interview.feedback.overallScore)} rounded-full px-3 py-1.5 flex items-center gap-2 backdrop-blur-sm border`}>
                            {getScoreIcon(interview.feedback.overallScore)}
                            <span className={`text-sm font-bold ${getScoreColor(interview.feedback.overallScore)}`}>
                              {interview.feedback.overallScore}/10
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-4 left-6 right-6">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/20">
                            <FileText className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-bold text-xl truncate">
                              {interview.jobTitle || "Professional Interview"}
                            </h3>
                            <div className="flex items-center gap-3 text-gray-300 text-xs mt-1">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatDate(interview.completedAt)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                <span>{interview.status === "completed" ? "Completed" : "In Progress"}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                      {interview.jobDescription && (
                        <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                            {interview.jobDescription}
                          </p>
                        </div>
                      )}
                      
                      {interview.feedback?.overallScore && (
                        <div className="mb-4 flex items-center gap-3">
                          <div className="flex-1">
                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                              <span>Performance Level</span>
                              <span>{getScoreLabel(interview.feedback.overallScore)}</span>
                            </div>
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                  interview.feedback.overallScore >= 8 ? "bg-emerald-500" :
                                  interview.feedback.overallScore >= 6 ? "bg-amber-500" : "bg-gray-500"
                                }`}
                                style={{ width: `${(interview.feedback.overallScore / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Status</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${interview.status === "completed" ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
                              <span className="text-sm font-medium text-gray-700 capitalize">
                                {interview.status === "completed" ? "Completed" : "Draft"}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <Link href={`/interview/${interview._id}/feedback`}>
                          <button className="group/btn relative flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium overflow-hidden transition-all hover:gap-3 hover:bg-primary">
                            <span className="relative z-10">View Details</span>
                            <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover/btn:translate-x-0.5" />
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}