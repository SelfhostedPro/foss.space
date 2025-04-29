CREATE TABLE `post_tags` (
	`postId` text NOT NULL,
	`tagId` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `thread_tags` (
	`threadId` text NOT NULL,
	`tagId` text NOT NULL
);
