import { v } from "convex/values";

import { mutation, query } from "../_generated/server";

export const getMessagesBySession = query({
  args: {
    session_id: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_session", (q) =>
        q
          .eq("userId", userId)
          .eq("chatSession", args.session_id)
      )
      .order("desc")
      .collect();

    return messages;
  },
});

export const createMessage = mutation({
  args: {
    speaker: v.union(
      v.literal("system"),
      v.literal("user"),
    ),
    content: v.string(),
    chatSession: v.id("chatSessions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const message = await ctx.db.insert("chatMessages", {
      speaker: args.speaker,
      content: args.content,
      chatSession: args.chatSession,
      userId
    });

    return message;
  }
});

export const removeMessage = mutation({
  args: { id: v.id("chatMessages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingMessage = await ctx.db.get(args.id);

    if (!existingMessage) {
      throw new Error("Message Not found!");
    }

    if (existingMessage.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const deletedMessage = await ctx.db.delete(args.id);

    return deletedMessage;
  }
});

export const updateMessageContent = mutation({
  args: {
    id: v.id("chatMessages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated!");
    }

    const userId = identity.subject;

    const existingMessage = await ctx.db.get(args.id);

    if (!existingMessage) {
      throw new Error("Message not found!");
    }

    if (existingMessage.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const message = await ctx.db.patch(args.id, {
      content: args.content,
    });

    return message;
  },
});
