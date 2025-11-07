import type { BunRequest } from "bun";
import { createShortUrl, getShortUrl } from "../services/shortUrl.service";

const addUrl = {
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

      const reqUrl = req.url;
      const data = createShortUrl(url, reqUrl);

      if (!data) {
        return Response.json(
          { error: "Field 'url' is not a valid URL" },
          { status: 400 },
        );
      }

      return Response.json(data);
    } catch {
      return Response.json({ error: "Server error" }, { status: 500 });
    }
  },
};

const getUrl = {
  async GET(req: BunRequest) {
    try {
      const { code } = req.params;

      const data = getShortUrl(code);

      if (!data) {
        return Response.json(
          {
            error: `The URL associated with the code '${code}' does not exist.`,
          },
          { status: 404 },
        );
      }

      return Response.redirect(data.redirect, 301);
    } catch {
      return Response.json({ error: "Server error" }, { status: 500 });
    }
  },
};

export const shortUrlController = {
  addUrl,
  getUrl,
};
