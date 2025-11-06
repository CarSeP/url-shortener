import type { BunRequest } from "bun";
import homePage from "./index.html";
import { isValidUrl } from "./services/url.service";
import { sqlite } from "./services/sqlite.service";
import { getCode } from "./services/code.service";

export const routes = {
  "/": homePage,
  "/api": {
    async POST(req: BunRequest) {
      try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
          return Response.json(
            { error: "Field 'url' not provided" },
            { status: 400 },
          );
        }

        if (!isValidUrl(url)) {
          return Response.json(
            { error: "Field 'url' is not a valid URL" },
            { status: 400 },
          );
        }

        const code = getCode();
        const newURl = `${req.url.replace("/api", "")}/${code}`;

        sqlite
          .prepare("INSERT INTO url (redirect, code) VALUES (?, ?);")
          .all(url, code);

        return Response.json({ code, newURl });
      } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
      }
    },
  },
  "/:code": {
    async GET(req: BunRequest) {
      try {
        const { code } = req.params;

        const data = sqlite
          .prepare("SELECT redirect from url where code = ?;")
          .all(code);

        if (!data[0]) {
          return Response.json(
            {
              error: `The URL associated with the code '${code}' does not exist.`,
            },
            { status: 404 },
          );
        }

        return Response.redirect(data[0].redirect, 301);
      } catch {
        return Response.json({ error: "Server error" }, { status: 500 });
      }
    },
  },
};
