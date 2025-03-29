import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { env } from "@/env";

export function db() {
  return drizzle({
    connection: {
      url: env.TURSO_CONNECTION_URL,
      authToken: env.TURSO_AUTH_TOKEN,
    },
    schema,
  });
}
