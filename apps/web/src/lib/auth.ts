"use server";
import { betterAuth } from "better-auth";
import { admin, openAPI, organization } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";

// Only used for code-gen
// const _prisma = new PrismaClient();

export const auth = betterAuth({
  baseUrl: process.env.BETTER_AUTH_URL,
  trustedOrigins: [process.env.BETTER_AUTH_URL || ""],
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
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
    gitlab: {
      clientId: process.env.GITLAB_CLIENT_ID || "",
      clientSecret: process.env.GITLAB_CLIENT_SECRET || "",
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    deleteUser: {
      enabled: true,
    },
    additionalFields: {
      handle: {
        type: "string",
        required: true,
        input: true,
        unique: true,
      },
      bio: {
        type: "string",
        required: false,
        input: true,
      },
    },
  },
  plugins: [admin(), openAPI(), organization({})],
  rateLimit: {
    enabled: true,
    // storage: "secondary-storage",
    window: 60, // time window in seconds
    max: 10, // max requests in the window
  },
});
