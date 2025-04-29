import { defineConfig } from "drizzle-kit";

// console.log(process.env)
export default defineConfig({
  out: "./migrations",
  schema: "./src/lib/db/schema/index.ts",
  dialect: "turso",
  dbCredentials: process.env.NODE_ENV !== "production" ? {
    url: "file:db.sqlite",
  } : {
    url: process.env.TURSO_DATABASE_URL || "",
    authToken: process.env.TURSO_AUTH_TOKEN || "",
  },
});
