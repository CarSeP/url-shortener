import { Elysia } from "elysia";
import { codeRouter } from "@/routes/code.router";
import appPage from "@/views/app/app.html";

export const createServer = () => {
  return new Elysia().get("/", appPage).use(codeRouter);
};
