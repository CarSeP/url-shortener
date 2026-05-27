import { Elysia } from "elysia";
import { profileController } from "@/controllers/profile.controller";

export const profileRouter = new Elysia({ prefix: "/profile" })
  .get("/api/links", profileController.getUserLinks)
  .get("/api/stats", profileController.getUserStats)
  .delete("/api/links/:id", profileController.deleteLink);
