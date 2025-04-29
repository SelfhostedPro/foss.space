import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { posts, postVersions, threads } from "./content";
import { categories } from "./categories";
import { userFollows, userSettings } from "./user";
import { bookmarks, flags, likes } from "./interactions";
import { notifications, subscriptions } from "./notifications";

export const users = sqliteTable("user", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  emailVerified: integer("emailVerified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }),
  banReason: text("banReason"),
  banExpires: integer("banExpires", { mode: "timestamp" }),
  handle: text("handle").notNull(),
  bio: text("bio"),
});

export const sessions = sqliteTable("session", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  token: text("token").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId").notNull(),
  impersonatedBy: text("impersonatedBy"),
  activeOrganizationId: text("activeOrganizationId"),
});

export const accounts = sqliteTable("account", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: integer("accessTokenExpiresAt", { mode: "timestamp" }),
  refreshTokenExpiresAt: integer("refreshTokenExpiresAt", {
    mode: "timestamp",
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).notNull(),
});

export const verifications = sqliteTable("verification", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }),
  updatedAt: integer("updatedAt", { mode: "timestamp" }),
});

export const organizations = sqliteTable("organization", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  name: text("name").notNull(),
  slug: text("slug"),
  logo: text("logo"),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
  metadata: text("metadata"),
});

export const members = sqliteTable("member", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  organizationId: text("organizationId").notNull(),
  userId: text("userId").notNull(),
  role: text("role").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).notNull(),
});

export const invitations = sqliteTable("invitation", {
  id: text("id")
    .default(sql`(uuid())`)
    .primaryKey(),
  organizationId: text("organizationId").notNull(),
  email: text("email").notNull(),
  role: text("role"),
  status: text("status").notNull(),
  expiresAt: integer("expiresAt", { mode: "timestamp" }).notNull(),
  inviterId: text("inviterId").notNull(),
});

export const usersRelations = relations(users, (helpers) => ({
  sessions: helpers.many(sessions, { relationName: "SessionToUser" }),
  accounts: helpers.many(accounts, { relationName: "AccountToUser" }),
  members: helpers.many(members, { relationName: "MemberToUser" }),
  invitations: helpers.many(invitations, { relationName: "InvitationToUser" }),
  authoredThreads: helpers.many(threads, { relationName: "ThreadAuthor" }),
  deletedThreads: helpers.many(threads, { relationName: "ThreadDeleter" }),
  authoredPosts: helpers.many(posts, { relationName: "PostAuthor" }),
  deletedPosts: helpers.many(posts, { relationName: "PostDeleter" }),
  editedVersions: helpers.many(postVersions, { relationName: "VersionEditor" }),
  following: helpers.many(userFollows, { relationName: "Follower" }),
  followers: helpers.many(userFollows, { relationName: "Followed" }),
  createdCategories: helpers.many(categories, {
    relationName: "CategoryToUser",
  }),
  notifications: helpers.many(notifications, {
    relationName: "UserNotifications",
  }),
  triggeredNotifications: helpers.many(notifications, {
    relationName: "NotificationActor",
  }),
  settings: helpers.one(userSettings),
  subscriptions: helpers.many(subscriptions, {
    relationName: "UserSubscriptions",
  }),
  likes: helpers.many(likes, { relationName: "UserLikes" }),
  bookmarks: helpers.many(bookmarks, { relationName: "UserBookmarks" }),
  flags: helpers.many(flags, { relationName: "FlagToUser" }),
  reviewedFlags: helpers.many(flags, { relationName: "FlagReviewer" }),
}));

export const sessionsRelations = relations(sessions, (helpers) => ({
  user: helpers.one(users, {
    relationName: "SessionToUser",
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const accountsRelations = relations(accounts, (helpers) => ({
  user: helpers.one(users, {
    relationName: "AccountToUser",
    fields: [accounts.userId],
    references: [users.id],
  }),
}));

export const organizationsRelations = relations(organizations, (helpers) => ({
  members: helpers.many(members, { relationName: "MemberToOrganization" }),
  invitations: helpers.many(invitations, {
    relationName: "InvitationToOrganization",
  }),
}));

export const membersRelations = relations(members, (helpers) => ({
  organization: helpers.one(organizations, {
    relationName: "MemberToOrganization",
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: helpers.one(users, {
    relationName: "MemberToUser",
    fields: [members.userId],
    references: [users.id],
  }),
}));

export const invitationsRelations = relations(invitations, (helpers) => ({
  organization: helpers.one(organizations, {
    relationName: "InvitationToOrganization",
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
  user: helpers.one(users, {
    relationName: "InvitationToUser",
    fields: [invitations.inviterId],
    references: [users.id],
  }),
}));
