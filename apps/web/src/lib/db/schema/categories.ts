import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";
import { bookmarks, likes } from "./interactions";
import { threads, posts } from "./content";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = sqliteTable("categories", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  slug: text("slug").notNull(),
  parentId: text("parentId"),
  order: integer("order", { mode: "number" }).default(0).notNull(),
  isActive: integer("isActive", { mode: "boolean" }).default(true).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  createdById: text("createdById"),
  metadata: text("metadata"),
});

export const tags = sqliteTable("tags", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  color: text("color"),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const categoriesRelations = relations(categories, (helpers) => ({
  parent: helpers.one(categories, {
    relationName: "CategoryHierarchy",
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: helpers.many(categories, { relationName: "CategoryHierarchy" }),
  threads: helpers.many(threads, { relationName: "CategoryToThread" }),
  createdBy: helpers.one(users, {
    relationName: "CategoryToUser",
    fields: [categories.createdById],
    references: [users.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  threads: many(threadTags),
  posts: many(postTags),
}));

export const postTags = sqliteTable(
  "post_tags",
  {
    postId: text("postId")
      .notNull()
      .references(() => posts.id),
    tagId: text("tagId")
      .notNull()
      .references(() => tags.id),
  },

  (t) => [primaryKey({ columns: [t.postId, t.tagId] })]
);

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const threadTags = sqliteTable(
  "thread_tags",
  {
    threadId: text("threadId")
      .notNull()
      .references(() => threads.id),
    tagId: text("tagId")
      .notNull()
      .references(() => tags.id),
  },
  (t) => [primaryKey({ columns: [t.threadId, t.tagId] })]
);

export const threadTagsRelations = relations(threadTags, ({ one }) => ({
  thread: one(threads, {
    fields: [threadTags.threadId],
    references: [threads.id],
  }),
  tag: one(tags, {
    fields: [threadTags.tagId],
    references: [tags.id],
  }),
}));

// Create Zod schemas from Drizzle schema
export const categorySelectSchema = createSelectSchema(categories);
export const categoryInsertSchema = createInsertSchema(categories, {
  id: z.string().optional(), // ID is auto-generated
  createdAt: z.date().optional(), // Created time is auto-generated
  updatedAt: z.date().optional(), // Updated time is auto-generated
});

// Type definitions based on schemas
export type Category = z.infer<typeof categorySelectSchema>;
export type CategoryCreateInput = Omit<
  z.infer<typeof categoryInsertSchema>,
  "id" | "createdAt" | "updatedAt"
>;

// Type for category with thread and post counts
export type CategoryWithStats = Category & {
  threadCount: number;
  postCount: number;
};
