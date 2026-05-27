import { db } from "@/utils/services/db.service";
import { type Handler } from "elysia";
import { createShortUrl, getShortUrl } from "@/utils/services/shortUrl.service";

const addUrl: Handler = async ({ status, body, request, cookie }) => {
  const reqUrl = new URL(request.url).toString();
  const { url } = body as { url: string };

  let userId: number | undefined;
  const userValue = cookie.user.value;

  if (userValue && typeof userValue === "object" && "id" in userValue) {
    const githubId = (userValue as { id: number }).id;
    const result = await db("SELECT id FROM users WHERE github_id = $1;", [String(githubId)]);
    if (result && result[0]) {
      userId = result[0].id;
    }
  }

  const data = await createShortUrl(url, reqUrl, userId);

  if (!data) {
    return status(400, { error: "Field 'url' is not a valid URL" });
  }

  return status(200, data);
};

const getUrl: Handler = async ({ status, params, redirect }) => {
  const { code } = params as { code: string };
  const data =  await getShortUrl(code);

  if (!data) {
    return status(404, {
      error: `The URL associated with the code '${code}' does not exist.`,
    });
  }

  return redirect(data.redirect);
};

export const codeController = {
  addUrl,
  getUrl,
};
