CREATE TABLE "code-connect_org_member" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"org_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"role" varchar(20) DEFAULT 'viewer' NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "code-connect_organization" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"slug" varchar(100) NOT NULL,
	"owner_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "code-connect_organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "code-connect_project" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" varchar(1000),
	"slug" varchar(100) NOT NULL,
	"org_id" uuid NOT NULL,
	"created_by_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "code-connect_post" RENAME TO "code-connect_file";--> statement-breakpoint
ALTER TABLE "code-connect_file" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "code-connect_file" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "code-connect_user" RENAME COLUMN "avatarUrl" TO "avatar_url";--> statement-breakpoint
ALTER TABLE "code-connect_user" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "code-connect_user" RENAME COLUMN "updatedAt" TO "updated_at";--> statement-breakpoint
ALTER TABLE "code-connect_file" DROP CONSTRAINT "code-connect_post_userId_code-connect_user_id_fk";
--> statement-breakpoint
DROP INDEX "name_idx";--> statement-breakpoint
DROP INDEX "user_idx";--> statement-breakpoint
ALTER TABLE "code-connect_file" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "code-connect_file" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "code-connect_file" ALTER COLUMN "id" DROP IDENTITY;--> statement-breakpoint
ALTER TABLE "code-connect_file" ALTER COLUMN "name" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "code-connect_file" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD COLUMN "path" varchar(1000) NOT NULL;--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD COLUMN "type" varchar(50) DEFAULT 'file' NOT NULL;--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD COLUMN "project_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD COLUMN "created_by_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "code-connect_org_member" ADD CONSTRAINT "code-connect_org_member_org_id_code-connect_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."code-connect_organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code-connect_org_member" ADD CONSTRAINT "code-connect_org_member_user_id_code-connect_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."code-connect_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code-connect_organization" ADD CONSTRAINT "code-connect_organization_owner_id_code-connect_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."code-connect_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code-connect_project" ADD CONSTRAINT "code-connect_project_org_id_code-connect_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."code-connect_organization"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code-connect_project" ADD CONSTRAINT "code-connect_project_created_by_id_code-connect_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."code-connect_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "org_member_org_idx" ON "code-connect_org_member" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "org_member_user_idx" ON "code-connect_org_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "org_member_unique_idx" ON "code-connect_org_member" USING btree ("org_id","user_id");--> statement-breakpoint
CREATE INDEX "org_slug_idx" ON "code-connect_organization" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "org_owner_idx" ON "code-connect_organization" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "project_org_idx" ON "code-connect_project" USING btree ("org_id");--> statement-breakpoint
CREATE INDEX "project_slug_idx" ON "code-connect_project" USING btree ("org_id","slug");--> statement-breakpoint
CREATE INDEX "project_creator_idx" ON "code-connect_project" USING btree ("created_by_id");--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD CONSTRAINT "code-connect_file_project_id_code-connect_project_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."code-connect_project"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "code-connect_file" ADD CONSTRAINT "code-connect_file_created_by_id_code-connect_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."code-connect_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "file_project_idx" ON "code-connect_file" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "file_path_idx" ON "code-connect_file" USING btree ("project_id","path");--> statement-breakpoint
CREATE INDEX "file_creator_idx" ON "code-connect_file" USING btree ("created_by_id");--> statement-breakpoint
ALTER TABLE "code-connect_file" DROP COLUMN "userId";