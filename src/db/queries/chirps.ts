import { asc, eq } from "drizzle-orm";
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

export async function getAllChirps() {
  return await db
    .select()
    .from(chirps)
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