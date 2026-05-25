import { expect, test } from "bun:test";
import { createShortUrl, getShortUrl } from "../services/shortUrl.service";

const URL = "https://example.com/abc/123";
const INVALID_VALUE = "qwe123";
let code = "";

test("should create short URL when valid URL is provided", async () => {
  const data = await createShortUrl(URL, "");
  if (data) code = data.code;
  expect(data).toBeTruthy();
});

test("should redirect to original URL when valid short code is provided", async () => {
  const data = await getShortUrl(code);
  expect(data).toBeTruthy();
});

test("should return false when invalid URL is provided", async () => {
  const data = await createShortUrl(INVALID_VALUE, "");
  expect(data).toBeFalsy();
});

test("should return false when invalid short code is provided", async () => {
  const data = await getShortUrl(INVALID_VALUE);
  expect(data).toBeFalsy();
});
