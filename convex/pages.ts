import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

import { asyncMap } from "./utils";

export const getPage = query({
  args: {
    id: v.id("pages")
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const page = await ctx.db.get(args.id);

    if (!page) {
      throw new Error("Page not found!");
    }

    if (page.userId !== userId) {
      throw new Error("Unauthorized!");
    }
    return page;
  },
});

export const getAllPages = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const pages = await ctx.db
      .query("pages")
      .withIndex("by_user_title", (q) =>
        q
          .eq("userId", userId)
      )
      .order("desc")
      .collect();

    return pages;
  },
});

export const searchPagesByTitle = query({
  args: {
    query: v.string(),
    num_collect: v.number()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const pages = await ctx.db
      .query("pages")
      .withSearchIndex("search_title", (q) => 
        q.search("title", args.query))
      .filter((q) =>
        q.eq(q.field("userId"), userId),
      )
      .take(args.num_collect);

    return pages;
  }
});

export const searchPagesByMarkdown = query({
  args: {
    query: v.string(),
    num_collect: v.number()
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const pages = await ctx.db
      .query("pages")
      .withSearchIndex("search_markdown", (q) => 
        q.search("markdown", args.query))
      .filter((q) =>
        q.eq(q.field("userId"), userId),
      )
      .take(args.num_collect);

    return pages;
  }
});

export const createPage = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const page = await ctx.db.insert("pages", {
      title: args.title,
      userId
    });

    return page;
  }
});

// Need some tests
export const removePage = mutation({
  args: { id: v.id("pages") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated!");
    }

    const userId = identity.subject;

    const existingPage = await ctx.db.get(args.id);

    if (!existingPage) {
      throw new Error("Page Not found!");
    }

    if (existingPage.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const relations = await ctx.db
      .query("pageRelations")
      .withIndex("by_page", (q) =>
        q
          .eq("fromPage", args.id)
      )
      .collect();

    const backRelations = await ctx.db
      .query("pageRelations")
      .withIndex("by_backPage", (q) =>
        q
          .eq("toPage", args.id)
      )
      .collect();

    const relationIds = relations.map((relation) => relation._id);
    const backDistinct = backRelations.filter((relation) => 
      !relationIds.includes(relation._id)
    );

    const allRelations = relations.concat(backDistinct);

    asyncMap(allRelations, (relation) =>
      ctx.db.delete(relation._id)
    );

    const deletedPage = await ctx.db.delete(args.id);

    return deletedPage;
  }
});

export const updatePageTitle = mutation({
  args: {
    id: v.id("pages"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingPage = await ctx.db.get(args.id);

    if (!existingPage) {
      throw new Error("Page not found!");
    }

    if (existingPage.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const page = await ctx.db.patch(args.id, {
      title: args.title
    });

    return page;
  },
});

export const updatePageContent = mutation({
  args: {
    id: v.id("pages"),
    content: v.string(),
    markdown: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthenticated");
    }

    const userId = identity.subject;

    const existingPage = await ctx.db.get(args.id);

    if (!existingPage) {
      throw new Error("Page not found!");
    }

    if (existingPage.userId !== userId) {
      throw new Error("Unauthorized!");
    }

    const page = await ctx.db.patch(args.id, {
      content: args.content,
      markdown: args.markdown
    });

    return page;
  },
});
