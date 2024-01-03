import { v } from "convex/values";

import { query, mutation } from "./_generated/server";

export const getPageRelation = query({
  args: {
    id: v.id("pageRelations"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const relation = await ctx.db.get(args.id)

    if (!relation) {
      throw new Error("Relation not found!");
    }

    return relation;
  },
});

export const getAllPageRelations = query({
  args: {
    id: v.id("pages"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const relations = await ctx.db
      .query("pageRelations")
      .withIndex("by_page", (q) =>
        q
          .eq("fromPage", args.id)
      )
      .order("desc")
      .collect();

    return relations;
  },
});

export const getAllPageRelationsByType = query({
  args: {
    id: v.id("pages"),
    type: v.union(
      v.literal("in-text"),
      v.literal("whole-text"),
    ),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const relations = await ctx.db
      .query("pageRelations")
      .withIndex("by_page_type", (q) =>
        q
          .eq("fromPage", args.id)
          .eq("type", args.type)
      )
      .order("desc")
      .collect();

    return relations;
  },
});

export const createRelation = mutation({
  args: {
    fromPage: v.id("pages"),
    toPage: v.id("pages"),
    context: v.optional(v.string()),
    type: v.union(
      v.literal("in-text"),
      v.literal("whole-text"),
    ),
    blockNoteIds: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const relation = await ctx.db.insert("pageRelations", {
      fromPage: args.fromPage,
      toPage: args.toPage,
      context: args.context,
      type: args.type,
      blockNoteIds: args.blockNoteIds,
    });

    return relation;
  }
});

export const updateRelationContext = mutation({
  args: {
    id: v.id("pageRelations"),
    context: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

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

export const updateRelationBlockId = mutation({
  args: {
    id: v.id("pageRelations"),
    blockNoteId: v.string()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const existingRelation = await ctx.db.get(args.id);

    if (!existingRelation) {
      throw new Error("Relation not found!");
    }

    let existingIds = existingRelation.blockNoteIds;
    if (!existingIds) existingIds = [];
    existingIds.push(args.blockNoteId);

    const relation = await ctx.db.patch(args.id, {
      blockNoteIds: existingIds,
    });

    return relation;
  },
});

export const removeRelation = mutation({
  args: { id: v.id("pageRelations") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const existingRelation = await ctx.db.get(args.id);

    if (!existingRelation) {
      throw new Error("Page Not found!");
    }

    const deletedRelation = await ctx.db.delete(args.id);

    return deletedRelation;
  }
});
