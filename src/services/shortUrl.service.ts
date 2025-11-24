import { getCode } from "./code.service";
import { isValidUrl } from "./url.service";
import { pg } from "./sqlite.service";

export const createShortUrl = async (url: string, reqUrl: string) => {
  if (!isValidUrl(url)) return null;

  const code = getCode();
  const newURL = `${reqUrl.replace("/api", "")}/${code}`;

  await pg`INSERT INTO url (redirect, code) VALUES (${url}, ${code});`;

  return { code, newURL };
};
export const getShortUrl = async (code: string) => {
  const data = await pg`SELECT redirect from url where code = ${code};`;

  if (!data.length) {
    return null;
  }
  return data[0];
};
