CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE TYPE "film_status" AS ENUM('Viewed', 'InQueue');--> statement-breakpoint
CREATE TYPE "film_user_role" AS ENUM('Owner', 'Edit', 'Read');--> statement-breakpoint
CREATE TABLE "film" (
	"id" uuid PRIMARY KEY,
	"film_list_id" uuid,
	"position" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"link_to" text NOT NULL,
	"status" "film_status" DEFAULT 'InQueue'::"film_status",
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "film_title_list_idx" UNIQUE("title","film_list_id")
);
--> statement-breakpoint
CREATE TABLE "film_list" (
	"id" uuid PRIMARY KEY,
	"name" text NOT NULL,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "film_list_user" (
	"user_id" text,
	"film_list_id" uuid,
	"role" "film_user_role" DEFAULT 'Read'::"film_user_role",
	CONSTRAINT "film_list_user_pkey" PRIMARY KEY("user_id","film_list_id")
);
--> statement-breakpoint
CREATE INDEX "idx_film_status" ON "film" ("status");--> statement-breakpoint
CREATE INDEX "film_title_trgm_idx" ON "film" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "film_desc_idx" ON "film" USING gin ("description" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "idx_film_list_name" ON "film_list" ("name");--> statement-breakpoint
CREATE INDEX "film_list_name_trgm_idx" ON "film_list" USING gin ("name" gin_trgm_ops);--> statement-breakpoint
ALTER TABLE "film" ADD CONSTRAINT "film_film_list_id_film_list_id_fkey" FOREIGN KEY ("film_list_id") REFERENCES "film_list"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "film_list_user" ADD CONSTRAINT "film_list_user_user_id_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "film_list_user" ADD CONSTRAINT "film_list_user_film_list_id_film_list_id_fkey" FOREIGN KEY ("film_list_id") REFERENCES "film_list"("id") ON DELETE CASCADE;