import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import { liftTarget } from "@tiptap/pm/transform";

dotenv.config({
  path: ".env.local",
});

export default defineConfig({
  dialect: "postgresql",
  schema: "./server/schema.ts",
  out: "./server/migrations",
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
});
