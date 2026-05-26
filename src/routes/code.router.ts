import { Elysia, t } from "elysia";
import { shortUrlSchema } from "@/utils/schemas/shortUrl.schema";
import { codeController } from "@/controllers/code.controller";

export const codeRouter = new Elysia()
  .get("/:code", codeController.getUrl)
  .post("/api", codeController.addUrl, shortUrlSchema(t));
