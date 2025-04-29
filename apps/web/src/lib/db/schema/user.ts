import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { users } from "./auth";

export const userFollows = sqliteTable("user_follows", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  followerId: text("followerId").notNull(),
  followedId: text("followedId").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).defaultNow().notNull(),
});

export const userSettings = sqliteTable("user_settings", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  userId: text("userId").notNull(),
});

export const userFollowsRelations = relations(userFollows, (helpers) => ({
  follower: helpers.one(users, {
    relationName: "Follower",
    fields: [userFollows.followerId],
    references: [users.id],
  }),
  followed: helpers.one(users, {
    relationName: "Followed",
    fields: [userFollows.followedId],
    references: [users.id],
  }),
}));

export const userSettingsRelations = relations(userSettings, (helpers) => ({
  user: helpers.one(users, {
    relationName: "UserToUserSettings",
    fields: [userSettings.userId],
    references: [users.id],
  }),
}));
