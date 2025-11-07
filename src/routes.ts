import type { BunRequest } from "bun";
import homePage from "./app/app.html";
import { shortUrlController } from "./controllers/shortUrl.controller";

export const routes = {
  "/": homePage,
  "/api": shortUrlController.addUrl,
  "/:code": shortUrlController.getUrl,
};
