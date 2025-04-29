import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";

export const notifications = sqliteTable("notifications", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  userId: text("userId").notNull(),
  type: text("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  resourceType: text("resourceType").notNull(),
  resourceId: text("resourceId").notNull(),
  actorId: text("actorId"),
  isRead: integer("isRead", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  readAt: integer("readAt", { mode: "timestamp" }),
  emailSent: integer("emailSent", { mode: "boolean" }).default(false).notNull(),
  emailSentAt: integer("emailSentAt", { mode: "timestamp" }),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  userId: text("userId").notNull(),
  resourceType: text("resourceType").notNull(),
  resourceId: text("resourceId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
  notifyEmail: integer("notifyEmail", { mode: "boolean" })
    .default(true)
    .notNull(),
  notifyInApp: integer("notifyInApp", { mode: "boolean" })
    .default(true)
    .notNull(),
});

export const notificationsRelations = relations(notifications, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserNotifications",
    fields: [notifications.userId],
    references: [users.id],
  }),
  actor: helpers.one(users, {
    relationName: "NotificationActor",
    fields: [notifications.actorId],
    references: [users.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserSubscriptions",
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
