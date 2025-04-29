import { createAuthClient } from "better-auth/react";
import {
  inferAdditionalFields,
  organizationClient,
  adminClient,
} from "better-auth/client/plugins";
import type { auth } from "./auth";

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
  plugins: [
    adminClient(),
    inferAdditionalFields<typeof auth>(),
    organizationClient(),
  ],
});
