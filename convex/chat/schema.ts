import { defineTable } from "convex/server";
import { v } from "convex/values";

export const chatTables = {
  chatSessions: defineTable({
    userId: v.string(),
    title: v.string(),
  })
  .index("by_user", ["userId"])
  .index("by_user_title", ["userId", "title"])
  .searchIndex("search_title", {
    searchField: "title",
    filterFields: ["userId"],
  }),
  chatMessages: defineTable({
    userId: v.string(),
    speaker: v.union(
      v.literal("system"),
      v.literal("user"),
    ),
    content: v.string(),
    chatSession: v.id("chatSessions"),
  })
  .index("by_user", ["userId"])
  .index("by_user_session", ["userId", "chatSession"]),
};
