PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_post_tags` (
	`postId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`postId`, `tagId`)
);
--> statement-breakpoint
INSERT INTO `__new_post_tags`("postId", "tagId") SELECT "postId", "tagId" FROM `post_tags`;--> statement-breakpoint
DROP TABLE `post_tags`;--> statement-breakpoint
ALTER TABLE `__new_post_tags` RENAME TO `post_tags`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_thread_tags` (
	`threadId` text NOT NULL,
	`tagId` text NOT NULL,
	PRIMARY KEY(`threadId`, `tagId`)
);
--> statement-breakpoint
INSERT INTO `__new_thread_tags`("threadId", "tagId") SELECT "threadId", "tagId" FROM `thread_tags`;--> statement-breakpoint
DROP TABLE `thread_tags`;--> statement-breakpoint
ALTER TABLE `__new_thread_tags` RENAME TO `thread_tags`;