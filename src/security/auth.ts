import argon2 from "argon2";

function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

export {
  hashPassword,
  checkPasswordHash,
}