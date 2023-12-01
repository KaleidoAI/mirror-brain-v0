import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { chatTables } from "./chat/schema";

export default defineSchema({
  pages: defineTable({
    title: v.string(),
    userId: v.string(),
    content: v.optional(v.string()),
    markdown: v.optional(v.string()),
  })
  .index("by_user", ["userId"])
  .index("by_user_title", ["userId", "title"])
  .searchIndex("search_title", {
    searchField: "title",
    filterFields: ["userId"],
  })
  .searchIndex("search_markdown", {
    searchField: "markdown",
    filterFields: ["userId"],
  }),
  pageRelations: defineTable({
    fromPage: v.id("pages"),
    toPage: v.id("pages"),
    context: v.optional(v.string()),
    type: v.union(
      v.literal("in-text"),
      v.literal("whole-text"),
    ),
  })
  .index("by_page", ["fromPage"])
  .index("by_backPage", ["toPage"])
  .index("by_page_type", ["fromPage", "type"]),

  ...chatTables,
});
