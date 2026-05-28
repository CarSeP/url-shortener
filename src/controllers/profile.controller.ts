import type { Context } from "elysia";
import { db } from "@/utils/services/db.service";
import { getRecentClicks } from "@/utils/services/click.service";

const getUserIdFromCookie = async (cookie: Context["cookie"]) => {
  const userCookie = cookie.user?.value;
  if (!userCookie) return null;

  try {
    let user: { id?: number };
    if (typeof userCookie === "string") {
      user = JSON.parse(decodeURIComponent(userCookie));
    } else if (typeof userCookie === "object" && userCookie !== null) {
      user = userCookie as { id?: number };
    } else {
      return null;
    }
    if (!user.id) return null;
    const result = await db("SELECT id FROM users WHERE github_id = $1;", [String(user.id)]);
    return result?.[0]?.id ?? null;
  } catch {
    return null;
  }
};

const getUserLinks = async ({ cookie, set }: Context) => {
  const userId = await getUserIdFromCookie(cookie);
  if (!userId) {
    set.status = 401;
    return { error: "Unauthorized" };
  }

  const links = await db(
    "SELECT id, redirect, code, clicks, created_at FROM url WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50;",
    [String(userId)]
  );

  return links || [];
};

const getUserStats = async ({ cookie, set }: Context) => {
  const userId = await getUserIdFromCookie(cookie);
  if (!userId) {
    set.status = 401;
    return { error: "Unauthorized" };
  }

  const stats = await db(
    `SELECT
      COUNT(*) as total_links,
      COALESCE(SUM(clicks), 0) as total_clicks,
      COUNT(*) as active_links
    FROM url WHERE user_id = $1;`,
    [String(userId)]
  );

  return stats?.[0] || { total_links: 0, total_clicks: 0, active_links: 0 };
};

const deleteLink = async ({ cookie, set, params }: Context) => {
  const userId = await getUserIdFromCookie(cookie);
  if (!userId) {
    set.status = 401;
    return { error: "Unauthorized" };
  }

  const { id } = params as { id: string };
  await db("DELETE FROM url WHERE id = $1 AND user_id = $2;", [id, String(userId)]);

  return { success: true };
};

const getRecentLinkClicks = async ({ cookie, set, params }: Context) => {
  const userId = await getUserIdFromCookie(cookie);
  if (!userId) {
    set.status = 401;
    return { error: "Unauthorized" };
  }

  const { code } = params as { code: string };
  const link = await db("SELECT id FROM url WHERE code = $1 AND user_id = $2;", [code, String(userId)]);
  if (!link || link.length === 0) {
    set.status = 404;
    return { error: "Link not found" };
  }

  const clicks = await getRecentClicks(code, 10);
  return clicks;
};

export const profileController = {
  getUserLinks,
  getUserStats,
  deleteLink,
  getRecentLinkClicks,
};
