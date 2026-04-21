"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Upload, Brain, Mic, FileText, BarChart3, CheckCircle2, Zap, Target, TrendingUp, Loader2 } from "lucide-react";

export default function HowItWorksPage() {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartInterview = () => {
    setIsStarting(true);
    // Simulate loading before redirect
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1000);
  };

  const steps = [
    {
      number: "01",
      icon: Upload,
      title: "Upload Your Resume or Job Description",
      description: "Start by uploading your resume (PDF format) or manually enter the job title and description. Our AI analyzes your background and the role requirements to generate personalized questions.",
      color: "from-gray-700 to-gray-300",
      delay: 0
    },
    {
      number: "02",
      icon: Brain,
      title: "AI Generates Custom Questions",
      description: "Our intelligent system creates targeted interview questions based on your resume, job description, and industry best practices. Each session includes 3-5 relevant questions.",
      color: "from-gray-700 to-gray-300",
      delay: 100
    },
    {
      number: "03",
      icon: Mic,
      title: "Practice with AI Avatar Interviewer",
      description: "Experience a realistic interview with our AI avatar. Use your microphone to answer questions naturally - just like a real interview! No typing required.",
      color: "from-gray-700 to-gray-300",
      delay: 200
    },
    {
      number: "04",
      icon: FileText,
      title: "Get Instant AI Feedback",
      description: "Receive detailed feedback including overall score, question-by-question analysis, strengths, and areas for improvement. Learn what works and what needs practice.",
      color: "from-gray-700 to-gray-300",
      delay: 300
    },
    {
      number: "05",
      icon: BarChart3,
      title: "Track Your Progress",
      description: "Access your dashboard to view all past interviews, track improvement over time, and identify patterns in your performance before your real interview.",
      color: "from-gray-700 to-gray-300",
      delay: 400
    }
  ];

  const features = [
    { icon: Zap, title: "AI-Powered Questions", description: "Smart question generation", color: "from-amber-200 to-amber-600" },
    { icon: Mic, title: "Voice Recognition", description: "Natural speech input", color: "from-amber-200 to-amber-600" },
    { icon: TrendingUp, title: "Instant Feedback", description: "Real-time analysis", color: "from-amber-200 to-amber-600" },
    { icon: Target, title: "Performance Analytics", description: "Track your growth", color: "from-amber-200 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 font-bold text-neutral-600 hover:text-neutral-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header with animations */}
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 animate-pulse" />
            AI-Powered Platform
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 animate-slideUp">
            How PrepWise Works
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto animate-slideUp animation-delay-100">
            Master your interview skills with our intelligent AI mock interview platform
          </p>
        </div>

        {/* Steps with staggered animations */}
        <div className="space-y-12 mb-16">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="relative animate-slideRight"
              style={{ animationDelay: `${step.delay}ms` }}
            >
              {index < steps.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-px bg-gradient-to-b from-neutral-200 to-transparent hidden md:block"></div>
              )}
              <div className="flex flex-col md:flex-row gap-6 items-start group">
                <div className="flex-shrink-0">
                  <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 group-hover:-translate-y-1">
                    <div className="flex items-center gap-3 mb-3">
                      <step.icon className="w-6 h-6 text-neutral-700" />
                      <h3 className="text-xl font-semibold text-neutral-900">{step.title}</h3>
                    </div>
                    <p className="text-neutral-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Key Features with hover animations */}
        <div className="bg-neutral-900 rounded-2xl p-8 mb-12 transform hover:scale-[1.02] transition-transform duration-300">
          <h2 className="text-2xl font-bold text-white text-center mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center group animate-scaleIn"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                <p className="text-neutral-400 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits and CTA with loading animation */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6 animate-fadeIn">Why Choose PrepWise?</h2>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {["Realistic interview simulation", "Personalized question generation", "Comprehensive feedback system"].map((benefit, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 animate-slideUp"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5 animate-bounce-in" />
                <p className="text-neutral-600 text-sm">{benefit}</p>
              </div>
            ))}
          </div>
          
          <button
            onClick={handleStartInterview}
            disabled={isStarting}
            className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 text-white rounded-lg hover:bg-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isStarting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Start Your First Interview
                <ArrowLeft className="w-4 h-4 group-hover:translate-x-1 transition-transform rotate-180" />
              </>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideRight {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideRight {
          animation: slideRight 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out forwards;
          opacity: 0;
        }
        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}