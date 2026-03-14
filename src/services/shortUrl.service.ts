import { getCode } from "./code.service";
import { db } from "./db.service";
import { isValidUrl } from "./url.service";

export const createShortUrl = async (url: string, reqUrl: string) => {
  if (!isValidUrl(url)) return null;

  const code = getCode();
  const newURL = `${reqUrl.replace("/api", "")}/${code}`;

  await db("INSERT INTO url (redirect, code) VALUES ($1, $2);", [url, code]);

  return { code, newURL };
};
export const getShortUrl = async (code: string) => {
  const data = await db("SELECT redirect from url where code = $1;", [code]);

  if (!data) return null;
  if (!data[0]) return null;

  return data[0];
};
