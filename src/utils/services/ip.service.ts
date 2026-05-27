import { Elysia } from "elysia";

export const ipPlugin = (app: Elysia) =>
  app.onRequest(({ request, server, store }) => {
    const address = server?.requestIP(request)?.address;
    (store as Record<string, unknown>).clientIP =
      address ||
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
  });
