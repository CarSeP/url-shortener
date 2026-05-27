import { db } from "@/utils/services/db.service";

type GitHubUser = {
  id: number;
  login: string;
  avatar_url: string;
  name?: string;
  email?: string;
};

export const upsertUser = async (user: GitHubUser, accessToken: string) => {
  return await db(
    `INSERT INTO users (github_id, login, avatar_url, name, email, access_token)
     VALUES ($1, $2, $3, $4, $5, $6)
     ON CONFLICT (github_id) DO UPDATE SET
       login = EXCLUDED.login,
       avatar_url = EXCLUDED.avatar_url,
       name = EXCLUDED.name,
       email = EXCLUDED.email,
       access_token = EXCLUDED.access_token;`,
    [
      String(user.id),
      user.login,
      user.avatar_url,
      user.name ?? "",
      user.email ?? "",
      accessToken,
    ],
  );
};
