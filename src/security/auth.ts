import argon2 from "argon2";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";
import { AuthenticationError, BadRequestError } from "../api/errors.js";

function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

function checkPasswordHash(password: string, hash: string): Promise<boolean> {
  return argon2.verify(hash, password);
}

function makeJWT(userID: string, expiresIn: number, secret: string): string {

  type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

  const issuedTime = Math.floor(Date.now() / 1000);
  
  const jwtPayload: payload = {
    iss: "chirpy",
    sub: userID,
    iat: issuedTime,
    exp: issuedTime + expiresIn,
  }

  return jwt.sign(jwtPayload, secret);
}

function validateJWT(tokenString: string, secret: string): string {
  try {
    const tokenPayload = jwt.verify(tokenString, secret);

    if (typeof tokenPayload === "string") {
      throw Error("Missing JWT payload");
    }

    const userId = tokenPayload.sub;

    if (userId === undefined) {
      throw new Error("Missing sub");
    }

    return userId;

  } catch (err) {
    console.error("JWT validation failed:", err);
    throw new AuthenticationError("Invalid JWT");
  }
}

function extractBearerToken(authorization: string | undefined): string {
  if (authorization === undefined) {
    throw new BadRequestError("empty authorization header");
  }

  const [bearerPrefix, tokenString] = authorization.trim().split(/\s+/);

  if (bearerPrefix.toLocaleLowerCase().indexOf("bearer") === -1) {
    throw new BadRequestError("authorization requires Bearer scheme");
  }

  const trimmedTokenString = tokenString?.trim();
  
  if (!trimmedTokenString) {
    throw new BadRequestError("authorization missing token");
  }

  return trimmedTokenString;
}

export {
  hashPassword,
  checkPasswordHash,
  makeJWT,
  validateJWT,
  extractBearerToken,
}