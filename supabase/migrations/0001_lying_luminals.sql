CREATE TABLE "code-connect_user" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatarUrl" varchar(500),
	"createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "code-connect_post" ADD COLUMN "userId" uuid;--> statement-breakpoint
CREATE INDEX "email_idx" ON "code-connect_user" USING btree ("email");--> statement-breakpoint
ALTER TABLE "code-connect_post" ADD CONSTRAINT "code-connect_post_userId_code-connect_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."code-connect_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "user_idx" ON "code-connect_post" USING btree ("userId");