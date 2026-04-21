import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveInterviewQuestion = mutation({
  args: {
    questions: v.array(v.object({ question: v.string(), answer: v.string() })),
    uid: v.id("UserTable"),
    resumeUrl: v.union(v.string(), v.null()),
    jobTitle: v.union(v.string(), v.null()),
    jobDescription: v.union(v.string(), v.null()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("InterviewSessionTable", {
      interviewQuestions: args.questions,
      resumeUrl: args.resumeUrl,
      userId: args.uid,
      status: "draft",
      jobTitle: args.jobTitle,
      jobDescription: args.jobDescription,
    });
    return id;
  },
});

export const GetInterviewQuestions = query({
  args: { interviewRecordId: v.id("InterviewSessionTable") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interviewRecordId);
  },
});

export const SaveInterviewAnswers = mutation({
  args: {
    interviewRecordId: v.id("InterviewSessionTable"),
    conversation: v.array(v.object({ question: v.string(), answer: v.string() })),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewRecordId, {
      conversation: args.conversation,
      status: "completed",
      completedAt: Date.now(),
    });
  },
});

export const SaveInterviewFeedback = mutation({
  args: {
    interviewRecordId: v.id("InterviewSessionTable"),
    feedback: v.object({
      overallScore: v.number(),
      summary: v.string(),
      strengths: v.array(v.string()),
      improvements: v.array(v.string()),
      questionFeedback: v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
          score: v.number(),
          comment: v.string(),
        })
      ),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.interviewRecordId, {
      feedback: args.feedback,
      feedbackGeneratedAt: Date.now(),
    });
  },
});

export const GetInterviewFeedback = query({
  args: { interviewRecordId: v.id("InterviewSessionTable") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.interviewRecordId);
  },
});

export const GetUserInterviews = query({
  args: { userId: v.id("UserTable") },
  handler: async (ctx, args) => {
    const interviews = await ctx.db
      .query("InterviewSessionTable")
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .order("desc")
      .collect();
    return interviews;
  },
});