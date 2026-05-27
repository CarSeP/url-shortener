import { Elysia } from "elysia";
import { codeRouter } from "@/routes/code.router";
import { authRouter } from "@/routes/auth.router";
import { ipPlugin } from "@/utils/services/ip.service";
import appPage from "@/views/app/app.html";
import profilePage from "@/views/profile/profile.html";
import { profileRouter } from "@/routes/profile.router";

export const createServer = () => {
  return new Elysia()
    .use(ipPlugin)
    .get("/", appPage)
    .get("/profile", profilePage)
    .use(authRouter)
    .use(codeRouter)
    .use(profileRouter);
};
