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
CREATE TABLE `post_tags` (
	`postId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`postId`, `tagId`),
	FOREIGN KEY (`postId`) REFERENCES `posts`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tags` (
	`id` text PRIMARY KEY DEFAULT (uuid()) NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`color` text,
	`createdAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updatedAt` integer DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `thread_tags` (
	`threadId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`threadId`, `tagId`),
	FOREIGN KEY (`threadId`) REFERENCES `threads`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`tagId`) REFERENCES `tags`(`id`) ON UPDATE no action ON DELETE no action
);
