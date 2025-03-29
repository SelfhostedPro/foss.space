import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  primaryKey,
} from "drizzle-orm/sqlite-core";

// Thread Tags junction table
export const threadTags = sqliteTable(
  "thread_tags",
  {
    threadId: text("thread_id").notNull(),
    tagId: text("tag_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.threadId, table.tagId] })]
);

// Likes table (for posts)
export const likes = sqliteTable(
  "likes",
  {
    userId: text("user_id").notNull(),
    postId: text("post_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.postId] })]
);

// Bookmarks table (for threads)
export const bookmarks = sqliteTable(
  "bookmarks",
  {
    userId: text("user_id").notNull(),
    threadId: text("thread_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.threadId] })]
);

// Tag subscriptions table
export const tagSubscriptions = sqliteTable(
  "tag_subscriptions",
  {
    userId: text("user_id").notNull(),
    tagId: text("tag_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.tagId] })]
);

// Thread subscriptions table
export const threadSubscriptions = sqliteTable(
  "thread_subscriptions",
  {
    userId: text("user_id").notNull(),
    threadId: text("thread_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.threadId] })]
);

// Category subscriptions table
export const categorySubscriptions = sqliteTable(
  "category_subscriptions",
  {
    userId: text("user_id").notNull(),
    categoryId: text("category_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp" })
      .notNull()
      .default(sql`(unixepoch())`),
  },
  (table) => [primaryKey({ columns: [table.userId, table.categoryId] })]
);

// Notifications table
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey(), // UUID
  userId: text("user_id").notNull(), // Will be handled in relations
  type: text("type").notNull(), // 'mention', 'reply', 'like', etc.
  message: text("message").notNull(),
  resourceId: text("resource_id"), // ID of the related resource (post, thread, etc.)
  resourceType: text("resource_type"), // Type of the related resource ('post', 'thread', etc.)
  isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
