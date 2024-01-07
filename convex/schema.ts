import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  pages: defineTable({
    title: v.string(),
    userId: v.string(),
  })
  .index("by_user", ["userId"])
  .index("by_user_title", ["userId", "title"])
  .searchIndex("search_title", {
    searchField: "title",
    filterFields: ["userId"],
  }),
  blocks: defineTable({
    blockNoteId: v.string(),
    userId: v.string(),
    content: v.optional(v.string()),
    markdown: v.optional(v.string()),
    parent: v.id("pages"),
    blockIndex: v.number(),
    minRelations: v.int64(),
    relations: v.optional(v.array(v.string())),
  })
  .index("common_case", ["userId", "parent", "blockIndex"])
  .searchIndex("search_markdown", {
    searchField: "markdown",
    filterFields: ["userId"],
  }),
});
