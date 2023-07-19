CREATE TABLE `sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`pass_code` text(15),
	`score_keeper_user_name` text(320),
	FOREIGN KEY (`score_keeper_user_name`) REFERENCES `users`(`user_name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_name` text(320) PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_user_name_unique` ON `users` (`user_name`);