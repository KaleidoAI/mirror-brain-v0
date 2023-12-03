import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getPage = query({
  args: {
    id: v.id("pages")
  },
  handler: async (ctx, args) => {
    const page = await ctx.db.get(args.id);

    if (!page) {
      throw new Error("Page not found!");
    }

    return page;
  },
});

export const searchPagesByMarkdown = query({
  args: {
    query: v.string(),
    num_collect: v.number(),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const pages = await ctx.db
      .query("pages")
      .withSearchIndex("search_markdown", (q) => 
        q.search("markdown", args.query))
      .filter((q) =>
        q.eq(q.field("userId"), args.userId),
      )
      .take(args.num_collect);

    return pages;
  }
});

export const getPageRelation = query({
  args: {
    id: v.id("pageRelations"),
  },
  handler: async (ctx, args) => {
    const relation = await ctx.db.get(args.id)

    if (!relation) {
      throw new Error("Relation not found!");
    }

    return relation;
  },
});

export const updateRelationContext = mutation({
  args: {
    id: v.id("pageRelations"),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingRelation = await ctx.db.get(args.id);

    if (!existingRelation) {
      throw new Error("Relation not found!");
    }

    const relation = await ctx.db.patch(args.id, {
      context: args.context,
    });

    return relation;
  },
});

export const getMessagesBySession = query({
  args: {
    session_id: v.id("chatSessions"),
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("chatMessages")
      .withIndex("by_user_session", (q) =>
        q
          .eq("userId", args.userId)
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
    userId: v.string()
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.insert("chatMessages", {
      speaker: args.speaker,
      content: args.content,
      chatSession: args.chatSession,
      userId: args.userId
    });

    return message;
  }
});
