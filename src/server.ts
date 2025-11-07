import { routes } from "./routes";

export const createServer = (port: string) => {
  return Bun.serve({
    port,
    routes,
    fetch() {
      return Response.json({ error: "Unmatched route" });
    },
  });
};
