CREATE TABLE `account` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`accountId` text NOT NULL,
	`providerId` text NOT NULL,
	`userId` text NOT NULL,
	`accessToken` text,
	`refreshToken` text,
	`idToken` text,
	`accessTokenExpiresAt` integer,
	`refreshTokenExpiresAt` integer,
	`scope` text,
	`password` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `invitation` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`organizationId` text NOT NULL,
	`email` text NOT NULL,
	`role` text,
	`status` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`inviterId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `member` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`organizationId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text NOT NULL,
	`createdAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `organization` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`name` text NOT NULL,
	`slug` text,
	`logo` text,
	`createdAt` integer NOT NULL,
	`metadata` text
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`expiresAt` integer NOT NULL,
	`token` text NOT NULL,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`ipAddress` text,
	`userAgent` text,
	`userId` text NOT NULL,
	`impersonatedBy` text,
	`activeOrganizationId` text
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer NOT NULL,
	`image` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`role` text,
	`banned` integer,
	`banReason` text,
	`banExpires` integer,
	`handle` text NOT NULL,
	`bio` text
);
--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expiresAt` integer NOT NULL,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`slug` text NOT NULL,
	`parentId` text,
	`order` integer DEFAULT 0 NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer NOT NULL,
	`createdById` text,
	`metadata` text
);
--> statement-breakpoint
CREATE TABLE `post_versions` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`postId` text NOT NULL,
	`content` text NOT NULL,
	`contentHtml` text,
	`editedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`editedById` text NOT NULL,
	`editReason` text
);
--> statement-breakpoint
CREATE TABLE `posts` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`threadId` text NOT NULL,
	`authorId` text NOT NULL,
	`content` text NOT NULL,
	`parentId` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	`deletedAt` integer,
	`deletedById` text,
	`isHidden` integer DEFAULT false NOT NULL,
	`hiddenReason` text
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL,
	`updatedAt` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `threads` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`categoryId` text NOT NULL,
	`authorId` text NOT NULL,
	`isPinned` integer DEFAULT false NOT NULL,
	`isLocked` integer DEFAULT false NOT NULL,
	`viewCount` integer DEFAULT 0 NOT NULL,
	`lastActivityAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer NOT NULL,
	`isDeleted` integer DEFAULT false NOT NULL,
	`deletedAt` integer,
	`deletedById` text,
	`userId` text,
	`tagId` text
);
--> statement-breakpoint
CREATE TABLE `bookmarks` (
	`userId` text NOT NULL,
	`threadId` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`notes` text
);
--> statement-breakpoint
CREATE TABLE `flags` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`type` text NOT NULL,
	`resourceType` text NOT NULL,
	`resourceId` text NOT NULL,
	`userId` text NOT NULL,
	`reason` text NOT NULL,
	`reasonDetails` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`reviewedAt` integer,
	`reviewedById` text
);
--> statement-breakpoint
CREATE TABLE `likes` (
	`userId` text NOT NULL,
	`postId` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`userId` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`message` text NOT NULL,
	`resourceType` text NOT NULL,
	`resourceId` text NOT NULL,
	`actorId` text,
	`isRead` integer DEFAULT false NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`readAt` integer,
	`emailSent` integer DEFAULT false NOT NULL,
	`emailSentAt` integer
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`userId` text NOT NULL,
	`resourceType` text NOT NULL,
	`resourceId` text NOT NULL,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`notifyEmail` integer DEFAULT true NOT NULL,
	`notifyInApp` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_follows` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`followerId` text NOT NULL,
	`followedId` text NOT NULL,
	`createdAt` integer DEFAULT (cast((julianday('now') - 2440587.5)*86400000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `user_settings` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`userId` text NOT NULL
);
