import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { bookmarks, likes } from "./interactions";
import { categories, threadTags, postTags } from "./categories";

export const threads = sqliteTable("threads", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull(),
  categoryId: text("categoryId").notNull(),
  authorId: text("authorId").notNull(),
  isPinned: integer("isPinned", { mode: "boolean" }).default(false).notNull(),
  isLocked: integer("isLocked", { mode: "boolean" }).default(false).notNull(),
  viewCount: integer("viewCount", { mode: "number" }).default(0).notNull(),
  lastActivityAt: integer("lastActivityAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  isDeleted: integer("isDeleted", { mode: "boolean" }).default(false).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
  deletedById: text("deletedById"),
  userId: text("userId"),
  tagId: text("tagId"),
});

export const posts = sqliteTable("posts", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  threadId: text("threadId").notNull(),
  authorId: text("authorId").notNull(),
  content: text("content").notNull(),
  parentId: text("parentId"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  isDeleted: integer("isDeleted", { mode: "boolean" }).default(false).notNull(),
  deletedAt: integer("deletedAt", { mode: "timestamp" }),
  deletedById: text("deletedById"),
  isHidden: integer("isHidden", { mode: "boolean" }).default(false).notNull(),
  hiddenReason: text("hiddenReason"),
});

export const postVersions = sqliteTable("post_versions", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  postId: text("postId").notNull(),
  content: text("content").notNull(),
  contentHtml: text("contentHtml"),
  editedAt: integer("editedAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  editedById: text("editedById").notNull(),
  editReason: text("editReason"),
});

export const threadsRelations = relations(threads, (helpers) => ({
  category: helpers.one(categories, {
    relationName: "CategoryToThread",
    fields: [threads.categoryId],
    references: [categories.id],
  }),
  author: helpers.one(users, {
    relationName: "ThreadAuthor",
    fields: [threads.authorId],
    references: [users.id],
  }),
  deletedBy: helpers.one(users, {
    relationName: "ThreadDeleter",
    fields: [threads.deletedById],
    references: [users.id],
  }),
  posts: helpers.many(posts, { relationName: "PostToThread" }),
  bookmarks: helpers.many(bookmarks, { relationName: "BookmarkToThread" }),
  tags: helpers.many(threadTags),
}));

export const postsRelations = relations(posts, (helpers) => ({
  thread: helpers.one(threads, {
    relationName: "PostToThread",
    fields: [posts.threadId],
    references: [threads.id],
  }),
  author: helpers.one(users, {
    relationName: "PostAuthor",
    fields: [posts.authorId],
    references: [users.id],
  }),
  deletedBy: helpers.one(users, {
    relationName: "PostDeleter",
    fields: [posts.deletedById],
    references: [users.id],
  }),
  parent: helpers.one(posts, {
    relationName: "ReplyHierarchy",
    fields: [posts.parentId],
    references: [posts.id],
  }),
  tags: helpers.many(postTags),
  replies: helpers.many(posts, { relationName: "ReplyHierarchy" }),
  likes: helpers.many(likes, { relationName: "LikeToPost" }),
  versions: helpers.many(postVersions, { relationName: "PostToPostVersion" }),
}));

export const postVersionsRelations = relations(postVersions, (helpers) => ({
  post: helpers.one(posts, {
    relationName: "PostToPostVersion",
    fields: [postVersions.postId],
    references: [posts.id],
  }),
  editedBy: helpers.one(users, {
    relationName: "VersionEditor",
    fields: [postVersions.editedById],
    references: [users.id],
  }),
}));
