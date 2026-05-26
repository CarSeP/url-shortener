import { Elysia } from "elysia";
import { authController } from "@/controllers/auth.controller";

export const authRouter = new Elysia({ prefix: "/auth" })
  .get("/github", authController.redirectToGitHub)
  .get("/github/callback", authController.handleGitHubCallback);
