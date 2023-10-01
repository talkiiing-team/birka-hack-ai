DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('at_work', 'done');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "predict_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"status" "status" DEFAULT 'at_work',
	"ts" timestamp DEFAULT now(),
	"result" jsonb
);
