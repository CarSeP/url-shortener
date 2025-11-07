import homePage from "./public/app.html";
import { shortUrlController } from "./controllers/shortUrl.controller";

export const routes = {
  "/": homePage,
  "/api": shortUrlController.addUrl,
  "/:code": shortUrlController.getUrl,
};
