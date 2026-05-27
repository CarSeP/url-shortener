import { getCode } from "@/utils/services/code.service";
import { db } from "@/utils/services/db.service";
import { isValidUrl } from "@/utils/services/url.service";

export const createShortUrl = async (url: string, reqUrl: string, userId?: number) => {
  if (!isValidUrl(url)) return null;

  const code = getCode();
  const newURL = `${reqUrl.replace("/api", "")}/${code}`;

  if (userId) {
    await db("INSERT INTO url (redirect, code, user_id) VALUES ($1, $2, $3);", [url, code, String(userId)]);
  } else {
    await db("INSERT INTO url (redirect, code) VALUES ($1, $2);", [url, code]);
  }

  return { code, newURL };
};
export const getShortUrl = async (code: string) => {
  const data = await db("SELECT redirect from url where code = $1;", [code]);

  if (!data) return null;
  if (!data[0]) return null;

  return data[0];
};
