"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, CheckCircle2, Zap, Brain, BarChart3, Download, Star, Crown, Loader2 } from "lucide-react";

export default function UpgradePage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isNotified, setIsNotified] = useState(false);

  const handleNotify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsNotified(true);
    setEmail("");
    
    // Reset notification message after 3 seconds
    setTimeout(() => setIsNotified(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Back Button with loading state */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 font-bold text-neutral-600 hover:text-neutral-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 font-bold group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header with fade-in animation */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse">
            <Sparkles className="w-4 h-4" />
            Coming Soon
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4 animate-slideUp">
            Upgrade Your Interview Experience
          </h1>
          <p className="text-xl text-neutral-500 max-w-2xl mx-auto animate-slideUp animation-delay-100">
            Get unlimited access to premium features and ace your next interview
          </p>
        </div>

        {/* Under Development Banner with shimmer effect */}
        <div className="bg-neutral-900 text-white rounded-2xl p-8 mb-12 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <Crown className="w-12 h-12 mx-auto mb-4 text-amber-400 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2">Under Development</h2>
          <p className="text-neutral-300">
            We're working hard to bring you these amazing features. Stay tuned for updates!
          </p>
        </div>

        {/* Features Grid with staggered animations */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Zap, title: "Unlimited Interviews", desc: "Practice as much as you want with no session limits", color: "from-gray-700   to-gray-300" },
            { icon: Brain, title: "Advanced AI Analytics", desc: "Get deeper insights into your performance patterns", color: "from-gray-700   to-gray-300" },
            { icon: BarChart3, title: "Custom Questions", desc: "Create your own interview questions tailored to your needs", color: "from-gray-700   to-gray-300" },
            { icon: Download, title: "Download Reports", desc: "Export your interview results as PDF reports", color: "from-gray-700   to-gray-300" },
            { icon: Star, title: "Priority Support", desc: "Get faster responses and dedicated support", color: "from-gray-700   to-gray-300" },
            { icon: Sparkles, title: "Video Recording", desc: "Record your sessions and review your body language", color: "from-gray-700   to-gray-300" },
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scaleIn group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{feature.title}</h3>
              <p className="text-neutral-500 text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Notification Form with loading animation */}
        <div className="max-w-md mx-auto text-center">
          <p className="text-neutral-600 text-sm mb-4">Get notified when premium features are available</p>
          <form onSubmit={handleNotify} className="flex gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-neutral-900 text-white rounded-lg hover:bg-primary transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed min-w-[110px] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                "Notify Me"
              )}
            </button>
          </form>
          {isNotified && (
            <div className="mt-3 text-sm text-emerald-600 animate-fadeIn">
              ✓ Thanks! We'll notify you when ready.
            </div>
          )}
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
          opacity: 0;
        }
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animate-bounce {
          animation: bounce 1s ease-in-out infinite;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </div>
  );
}   