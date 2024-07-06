CREATE TABLE IF NOT EXISTS "email_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "email_tokens_token_expires_pk" PRIMARY KEY("token","expires")
);
