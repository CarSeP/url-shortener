import type { Context } from "elysia";
import { upsertUser } from "@/utils/services/user.service";

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || "";
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || "";
const GITHUB_REDIRECT_URI =
  process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/auth/github/callback";

const redirectToGitHub = ({ redirect }: Context) => {
  const githubAuthUrl = new URL("https://github.com/login/oauth/authorize");
  githubAuthUrl.searchParams.set("client_id", GITHUB_CLIENT_ID);
  githubAuthUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
  githubAuthUrl.searchParams.set("scope", "user:email");

  return redirect(githubAuthUrl.toString());
};

const handleGitHubCallback = async ({
  query,
  redirect,
  cookie,
}: Context) => {
  const code = (query as Record<string, string>).code;

  if (!code) {
    return { error: "Authorization code not provided" };
  }

  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: GITHUB_REDIRECT_URI,
      }),
    }
  );

  const tokenData = (await tokenResponse.json()) as {
    access_token?: string;
    error?: string;
  };

  if (tokenData.error || !tokenData.access_token) {
    return { error: "Failed to obtain access token" };
  }

  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      Accept: "application/json",
    },
  });

  const userData = (await userResponse.json()) as {
    id: number;
    login: string;
    avatar_url: string;
    name?: string;
    email?: string;
  };

  await upsertUser(userData, tokenData.access_token);

  const authToken = cookie.auth_token!;
  authToken.value = tokenData.access_token;
  authToken.maxAge = 60 * 60 * 24 * 7;
  authToken.httpOnly = true;
  authToken.sameSite = "lax";
  authToken.path = "/";

  const userCookie = cookie.user!;
  userCookie.value = JSON.stringify(userData);
  userCookie.maxAge = 60 * 60 * 24 * 7;
  userCookie.httpOnly = false;
  userCookie.sameSite = "lax";
  userCookie.path = "/";

  return redirect("/");
};

export const authController = {
  redirectToGitHub,
  handleGitHubCallback,
};
