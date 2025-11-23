import { Elysia, t } from "elysia";
import homePage from "./public/app.html";
import { shortUrlController } from "./controllers/shortUrl.controller";
import { shortUrlSchema } from "./schemas/shortUrl.schema";

export const routes = new Elysia()
  .get("/", homePage)
  .get("/:code", shortUrlController.getUrl)
  .post("/api", shortUrlController.addUrl, shortUrlSchema(t));
