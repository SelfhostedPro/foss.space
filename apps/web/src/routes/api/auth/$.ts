import { auth } from "@/lib/auth";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: async ({ request }) => auth.handler(request),
  POST: async ({ request }) => auth.handler(request),
});
