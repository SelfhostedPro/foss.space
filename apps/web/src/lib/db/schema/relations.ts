import { relations } from "drizzle-orm";
import {
  user,
  categories,
  threads,
  posts,
  likes,
  bookmarks,
  threadSubscriptions,
  categorySubscriptions,
  notifications,
  tags,
  threadTags,
  tagSubscriptions,
} from ".";

// Define relationships for the user table
export const usersRelations = relations(user, ({ many }) => ({
  threads: many(threads),
  posts: many(posts),
  likes: many(likes),
  bookmarks: many(bookmarks),
  threadSubscriptions: many(threadSubscriptions),
  categorySubscriptions: many(categorySubscriptions),
  tagSubscriptions: many(tagSubscriptions),
  notifications: many(notifications),
}));

// Define relationships for the categories table
export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
    relationName: "parent_child",
  }),
  children: many(categories, {
    relationName: "parent_child",
  }),
  threads: many(threads),
  categorySubscriptions: many(categorySubscriptions),
}));

// Define relationships for the tags table
export const tagsRelations = relations(tags, ({ many }) => ({
  threadTags: many(threadTags),
  tagSubscriptions: many(tagSubscriptions),
}));

// Define relationships for the threads table
export const threadsRelations = relations(threads, ({ one, many }) => ({
  category: one(categories, {
    fields: [threads.categoryId],
    references: [categories.id],
  }),
  author: one(user, {
    fields: [threads.userId],
    references: [user.id],
  }),
  posts: many(posts),
  threadTags: many(threadTags),
  bookmarks: many(bookmarks),
  threadSubscriptions: many(threadSubscriptions),
}));

// Define relationships for the thread tags junction table
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

// Define relationships for the posts table
export const postsRelations = relations(posts, ({ one, many }) => ({
  thread: one(threads, {
    fields: [posts.threadId],
    references: [threads.id],
  }),
  author: one(user, {
    fields: [posts.userId],
    references: [user.id],
  }),
  parent: one(posts, {
    fields: [posts.parentId],
    references: [posts.id],
    relationName: "post_replies",
  }),
  replies: many(posts, { relationName: "post_replies" }),
  likes: many(likes),
}));

// Define relationships for the likes table
export const likesRelations = relations(likes, ({ one }) => ({
  user: one(user, {
    fields: [likes.userId],
    references: [user.id],
  }),
  post: one(posts, {
    fields: [likes.postId],
    references: [posts.id],
  }),
}));

// Define relationships for the bookmarks table
export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
  user: one(user, {
    fields: [bookmarks.userId],
    references: [user.id],
  }),
  thread: one(threads, {
    fields: [bookmarks.threadId],
    references: [threads.id],
  }),
}));

// Define relationships for the tag subscriptions table
export const tagSubscriptionsRelations = relations(
  tagSubscriptions,
  ({ one }) => ({
    user: one(user, {
      fields: [tagSubscriptions.userId],
      references: [user.id],
    }),
    tag: one(tags, {
      fields: [tagSubscriptions.tagId],
      references: [tags.id],
    }),
  })
);

// Define relationships for the thread subscriptions table
export const threadSubscriptionsRelations = relations(
  threadSubscriptions,
  ({ one }) => ({
    user: one(user, {
      fields: [threadSubscriptions.userId],
      references: [user.id],
    }),
    thread: one(threads, {
      fields: [threadSubscriptions.threadId],
      references: [threads.id],
    }),
  })
);

// Define relationships for the category subscriptions table
export const categorySubscriptionsRelations = relations(
  categorySubscriptions,
  ({ one }) => ({
    user: one(user, {
      fields: [categorySubscriptions.userId],
      references: [user.id],
    }),
    category: one(categories, {
      fields: [categorySubscriptions.categoryId],
      references: [categories.id],
    }),
  })
);

// Define relationships for the notifications table
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(user, {
    fields: [notifications.userId],
    references: [user.id],
  }),
}));
