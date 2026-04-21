import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  UserTable: defineTable({
    name: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  }),

  InterviewSessionTable: defineTable({
    // Input data
    interviewQuestions: v.array(v.object({ question: v.string(), answer: v.string() })),
    resumeUrl: v.union(v.string(), v.null()),
    userId: v.id("UserTable"),
    jobTitle: v.union(v.string(), v.null()),
    jobDescription: v.union(v.string(), v.null()),

    // Runtime data
    status: v.string(),                 // "draft" | "completed"
    conversation: v.optional(v.array(v.object({
      question: v.string(),
      answer: v.string(),
    }))),
    completedAt: v.optional(v.number()),
    feedback: v.optional(v.object({
      overallScore: v.number(),
      summary: v.string(),
      strengths: v.array(v.string()),
      improvements: v.array(v.string()),
      questionFeedback: v.array(v.object({
        question: v.string(),
        answer: v.string(),
        score: v.number(),
        comment: v.string(),
      })),
    })),
    feedbackGeneratedAt: v.optional(v.number()),
  }),
});