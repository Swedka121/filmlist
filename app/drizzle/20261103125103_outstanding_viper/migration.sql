ALTER TABLE "film_list" ADD COLUMN "isPublic" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "film_list_user" ALTER COLUMN "role" SET DEFAULT 'Read'::"film_user_role";