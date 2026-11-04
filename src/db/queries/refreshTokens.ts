import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { NewRefreshToken, refreshTokens } from "../schema.js";

export async function createRefreshToken(refreshToken: NewRefreshToken) {
  const [result] = await db
    .insert(refreshTokens)
    .values(refreshToken)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getRefreshToken(token: string) {
  const result = await db
    .query
    .refreshTokens
    .findFirst({
      where: eq(refreshTokens.token, token),
    });
  return result;
}

export async function updateRefreshToken(token: NewRefreshToken) {
  const now = new Date(Date.now());
  await db
    .update(refreshTokens)
    .set({ updatedAt: now, revokedAt: now })
    .where(eq(refreshTokens.token, token.token));
}