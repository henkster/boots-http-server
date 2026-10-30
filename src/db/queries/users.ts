import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq } from "drizzle-orm";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUser(email: string) {
    const results = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);
  
    return results.length > 0 ? results[0] : undefined;
}