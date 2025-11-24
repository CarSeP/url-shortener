import { type Handler } from "elysia";
import { createShortUrl, getShortUrl } from "../services/shortUrl.service";

const addUrl: Handler = async ({ status, body, request }) => {
  const reqUrl = new URL(request.url).toString();
  const { url } = body as { url: string };
  const data = await createShortUrl(url, reqUrl);

  if (!data) {
    return status(400, { error: "Field 'url' is not a valid URL" });
  }

  return status(200, data);
};

const getUrl: Handler = async ({ status, params, redirect }) => {
  const { code } = params as { code: string };
  const data = await getShortUrl(code);

  if (!data) {
    return status(404, {
      error: `The URL associated with the code '${code}' does not exist.`,
    });
  }

  return redirect(data.redirect);
};

export const shortUrlController = {
  addUrl,
  getUrl,
};
