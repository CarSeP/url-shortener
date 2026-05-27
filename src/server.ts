import { Elysia } from "elysia";
import { codeRouter } from "@/routes/code.router";
import { authRouter } from "@/routes/auth.router";
import { ipPlugin } from "@/utils/services/ip.service";
import appPage from "@/views/app/app.html";

export const createServer = () => {
  return new Elysia()
    .use(ipPlugin)
    .get("/", appPage)
    .use(authRouter)
    .use(codeRouter);
};
