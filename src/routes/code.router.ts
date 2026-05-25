import { Elysia, t } from "elysia";
import { shortUrlController } from "@/controllers/shortUrl.controller";
import { shortUrlSchema } from "@/utils/schemas/shortUrl.schema";

export const codeRouter = new Elysia()
  .get("/:code", shortUrlController.getUrl)
  .post("/api", shortUrlController.addUrl, shortUrlSchema(t));
