import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
} from "drizzle-orm/sqlite-core";

// Threads table
export const threads = sqliteTable("threads", {
  id: text("id").primaryKey(), // UUID
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: text("category_id").notNull(), // Will be handled in relations
  userId: text("user_id").notNull(), // Will be handled in relations
  isPinned: integer("is_pinned", { mode: "boolean" }).notNull().default(false),
  isLocked: integer("is_locked", { mode: "boolean" }).notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// Posts (replies in threads) table
export const posts = sqliteTable("posts", {
  id: text("id").primaryKey(), // UUID
  content: text("content").notNull(),
  threadId: text("thread_id").notNull(), // Will be handled in relations
  userId: text("user_id").notNull(), // Will be handled in relations
  parentId: text("parent_id"), // For nested replies - will be handled in relations
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});
