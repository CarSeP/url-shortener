import { getCode } from "./code.service";
import { isValidUrl } from "./url.service";
import { sqlite } from "./sqlite.service";

export const createShortUrl = (url: string, reqUrl: string) => {
  if (!isValidUrl(url)) return null;

  const code = getCode();
  const newURL = `${reqUrl.replace("/api", "")}/${code}`;

  sqlite
    .prepare("INSERT INTO url (redirect, code) VALUES (?, ?);")
    .all(url, code);

  return { code, newURL };
};
export const getShortUrl = (code: string) => {

  const data = sqlite
    .prepare("SELECT redirect from url where code = ?;")
    .all(code);

  if (!data[0]) return null;

  return data[0];
};
