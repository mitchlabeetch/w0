ALTER TABLE "users" ALTER COLUMN "email" TYPE varchar(320);
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "password" TYPE varchar(255);
--> statement-breakpoint
UPDATE "users" SET "email" = lower(trim("email"));
--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_email_unique" UNIQUE ("email");
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';
--> statement-breakpoint
ALTER TABLE "anonymous_chat_logs" ALTER COLUMN "created_at" TYPE timestamp with time zone USING "created_at" AT TIME ZONE 'UTC';
--> statement-breakpoint
CREATE TYPE "chat_visibility" AS ENUM ('private', 'unlisted', 'public');
--> statement-breakpoint
CREATE TYPE "message_role" AS ENUM ('system', 'user', 'assistant');
--> statement-breakpoint
CREATE TABLE "chats" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar(255),
	"parent_chat_id" varchar(255),
	"visibility" "chat_visibility" NOT NULL DEFAULT 'private',
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "chats" ADD CONSTRAINT "chats_parent_chat_id_chats_id_fk" FOREIGN KEY ("parent_chat_id") REFERENCES "public"."chats"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"chat_id" varchar(255) NOT NULL,
	"role" "message_role" NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_chat_id_chats_id_fk" FOREIGN KEY ("chat_id") REFERENCES "public"."chats"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "system_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(120) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "system_prompts" ADD CONSTRAINT "system_prompts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "llm_configurations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider_name" varchar(64) NOT NULL,
	"active_model" varchar(128) NOT NULL,
	"api_key_encrypted" text,
	"base_url" text,
	"is_active" boolean NOT NULL DEFAULT true,
	"created_at" timestamp with time zone NOT NULL DEFAULT now(),
	"updated_at" timestamp with time zone NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "llm_configurations" ADD CONSTRAINT "llm_configurations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "chats_user_id_idx" ON "chats" ("user_id");
--> statement-breakpoint
CREATE INDEX "chats_parent_chat_id_idx" ON "chats" ("parent_chat_id");
--> statement-breakpoint
CREATE INDEX "messages_chat_id_created_at_idx" ON "messages" ("chat_id","created_at");
--> statement-breakpoint
CREATE INDEX "system_prompts_user_id_idx" ON "system_prompts" ("user_id");
--> statement-breakpoint
CREATE INDEX "llm_configurations_user_id_idx" ON "llm_configurations" ("user_id");
--> statement-breakpoint
CREATE UNIQUE INDEX "llm_configurations_one_active_per_user_idx" ON "llm_configurations" ("user_id") WHERE "is_active" = true;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
--> statement-breakpoint
CREATE TRIGGER chats_set_updated_at
BEFORE UPDATE ON "chats"
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
--> statement-breakpoint
CREATE TRIGGER system_prompts_set_updated_at
BEFORE UPDATE ON "system_prompts"
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
--> statement-breakpoint
CREATE TRIGGER llm_configurations_set_updated_at
BEFORE UPDATE ON "llm_configurations"
FOR EACH ROW EXECUTE FUNCTION set_updated_at_timestamp();
--> statement-breakpoint
INSERT INTO "chats" ("id", "user_id", "created_at", "updated_at")
SELECT "v0_chat_id", "user_id", "created_at" AT TIME ZONE 'UTC', now()
FROM "chat_ownerships"
ON CONFLICT ("id") DO NOTHING;
--> statement-breakpoint
DROP TABLE "chat_ownerships";

