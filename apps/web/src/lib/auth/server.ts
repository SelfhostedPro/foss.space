"use server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { openAPI } from "better-auth/plugins";
import { db } from "@/lib/db/db.server";
// import { getCloudflareContext } from "../clouflare-helpers";
import { env } from "@/env";

export const auth = betterAuth({
  baseUrl: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL || ""],
  database: drizzleAdapter(db, {
    provider: "sqlite",
  }),
  // secondaryStorage: {
  //   get: async (key) => {
  //     const { env } = await getCloudflareContext();
  //     return (await env.AUTH_CACHE_KV?.get(`_auth:${key}`, "json")) || null;
  //   },
  //   set: async (key, value, ttl) => {
  //     const { env } = await getCloudflareContext();
  //     return await env.AUTH_CACHE_KV?.put(
  //       `_auth:${key}`,
  //       JSON.stringify(value),
  //       {
  //         expirationTtl: ttl,
  //       }
  //     );
  //   },
  //   delete: async (key) => {
  //     const { env } = await getCloudflareContext();
  //     return await env.AUTH_CACHE_KV?.delete(`_auth:${key}`);
  //   },
  // },
  emailAndPassword: {
    enabled: false,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID || "",
      clientSecret: env.GITHUB_CLIENT_SECRET || "",
    },
    gitlab: {
      clientId: env.GITLAB_CLIENT_ID || "",
      clientSecret: env.GITLAB_CLIENT_SECRET || "",
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID || "",
      clientSecret: env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [admin(), openAPI()],
  rateLimit: {
    enabled: true,
    // storage: "secondary-storage",
    window: 60, // time window in seconds
    max: 10, // max requests in the window
  },
});

export default auth;
