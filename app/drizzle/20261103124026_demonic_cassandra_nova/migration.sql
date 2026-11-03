ALTER TABLE "film_list_user" ALTER COLUMN "role" SET DEFAULT 'Owner'::"film_user_role";--> statement-breakpoint
ALTER TABLE "film_list_user" ALTER COLUMN "role" SET NOT NULL;