import { db } from "@/utils/services/db.service";

export const recordClick = async (code: string, ip: string, userAgent: string) => {
  await db("INSERT INTO clicks (code, ip, user_agent) VALUES ($1, $2, $3);", [code, ip, userAgent]);
};

export const getClicksByCode = async (code: string) => {
  const result = await db("SELECT COUNT(*) as total FROM clicks WHERE code = $1;", [code]);
  if (!result || !result[0]) return { total: 0 };
  return result[0];
};

export const getRecentClicks = async (code: string, limit: number = 10) => {
  const result = await db(
    "SELECT ip, user_agent, created_at FROM clicks WHERE code = $1 ORDER BY created_at DESC LIMIT $2;",
    [code, String(limit)]
  );
  return result || [];
};
