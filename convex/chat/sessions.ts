import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

import { asyncMap } from "../utils";

export const getAllSessions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const sessions = await ctx.db
      .query("chatSessions")
      .withIndex("by_user_title", (q) =>
        q
          .eq("userId", userId)
      )
      .order("desc")
      .collect();

    return sessions;
  },
});

export const getSession = query({
  args: {
    id: v.id("chatSessions")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const session = await ctx.db.get(args.id);

    if (!session) {
      throw new Error("Chat session not found!");
    }

    if (session.userId !== userId) {
      throw new Error("Unauthorized!");
    }
    return session;
  },
});

export const createSession = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const session = await ctx.db.insert("chatSessions", {
      title: args.title,
      userId
    });

    return session;
  }
});

export const removeSession = mutation({
  args: { id: v.id("chatSessions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingSession = await ctx.db.get(args.id);

    if (!existingSession) {
      throw new Error("Message Not found!");
    }

    if (existingSession.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const relatedMessages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_session", (q) =>
        q
          .eq("userId", userId)
          .eq("chatSession", args.id)
      )
      .collect();

    asyncMap(relatedMessages, (message) =>
      ctx.db.delete(message._id)
    );

    const deletedSession = await ctx.db.delete(args.id);

    return deletedSession;
  }
});

export const updateSessionTitle = mutation({
  args: {
    id: v.id("chatSessions"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated!");
    }

    const userId = identity.subject;

    const existingSession = await ctx.db.get(args.id);

    if (!existingSession) {
      throw new Error("Session not found!");
    }

    if (existingSession.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const session = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return session;
  },
});
