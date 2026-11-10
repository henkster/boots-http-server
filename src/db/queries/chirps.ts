import { asc, eq, sql } from "drizzle-orm";
import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getAllChirps(authorId?: string) {
  return await db
    .select()
    .from(chirps)
    .where(authorId ? eq(chirps.userId, authorId) : undefined) // NOTE: This expects a happy path; will fail with anything but uuid or falsy.
    .orderBy(asc(chirps.createdAt));
}

export async function getChirp(id: string) {
  const results = await db
    .select()
    .from(chirps)
    .where(eq(chirps.id, id))
    .limit(1);

  return results.length > 0 ? results[0] : null; // return undefined?

  // const result = await db
  //   .query
  //   .chirps
  //   .findFirst({
  //     where: eq(chirps.id, id),
  //   });

  // return result; // returns undefined
}

export async function deleteChirp(id: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return rows.length > 0;
}