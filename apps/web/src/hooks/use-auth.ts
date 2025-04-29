import { authClient } from "@/lib/auth-client";
import { createAuthHooks, prefetchSession } from "@daveyplate/better-auth-tanstack";

export const {
  useSession,
  usePrefetchSession,
  useToken,
  useListAccounts,
  useListSessions,
  useListPasskeys,
} = createAuthHooks<typeof authClient>(authClient);
