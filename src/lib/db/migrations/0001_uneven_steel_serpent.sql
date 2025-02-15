CREATE TYPE "public"."note_type" AS ENUM('journal', 'knowledge');--> statement-breakpoint
ALTER TABLE "note" ADD COLUMN "type" "note_type" NOT NULL;