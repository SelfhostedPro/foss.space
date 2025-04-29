import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";

export const db = drizzle({
  connection:
    process.env.NODE_ENV === "development"
      ? {
          url: "file:db.sqlite",
        }
      : {
          url: process.env.TURSO_DATABASE_URL || "",
          authToken: process.env.TURSO_AUTH_TOKEN || "",
        },
  schema,
});
