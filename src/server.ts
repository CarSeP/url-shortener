import { Elysia } from "elysia";
import { routes } from "./routes";

export const createServer = () => {
  return new Elysia().use(routes);
};
