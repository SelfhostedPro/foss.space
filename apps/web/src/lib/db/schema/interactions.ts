import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { posts, threads } from "./content";

export const likes = sqliteTable("likes", {
  userId: text("userId").notNull(),
  postId: text("postId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const bookmarks = sqliteTable("bookmarks", {
  userId: text("userId").notNull(),
  threadId: text("threadId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  notes: text("notes"),
});



export const flags = sqliteTable("flags", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  type: text("type").notNull(),
  resourceType: text("resourceType").notNull(),
  resourceId: text("resourceId").notNull(),
  userId: text("userId").notNull(),
  reason: text("reason").notNull(),
  reasonDetails: text("reasonDetails"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  reviewedAt: integer("reviewedAt", { mode: "timestamp" }),
  reviewedById: text("reviewedById"),
});

export const likesRelations = relations(likes, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserLikes",
    fields: [likes.userId],
    references: [users.id],
  }),
  post: helpers.one(posts, {
    relationName: "LikeToPost",
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

export const bookmarksRelations = relations(bookmarks, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserBookmarks",
    fields: [bookmarks.userId],
    references: [users.id],
  }),
  thread: helpers.one(threads, {
    relationName: "BookmarkToThread",
    fields: [bookmarks.threadId],
    references: [threads.id],
  }),
}));



export const flagsRelations = relations(flags, (helpers) => ({
  user: helpers.one(users, {
    relationName: "FlagToUser",
    fields: [flags.userId],
    references: [users.id],
  }),
  reviewedBy: helpers.one(users, {
    relationName: "FlagReviewer",
    fields: [flags.reviewedById],
    references: [users.id],
  }),
}));
