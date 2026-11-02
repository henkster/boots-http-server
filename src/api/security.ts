import type { Request, Response } from "express";
import { getUser } from "../db/queries/users.js";
import { AuthenticationError } from "./errors.js";
import { checkPasswordHash, makeJWT, makeRefreshToken } from "../security/auth.js";
import { config } from "../config.js";
import { createRefreshToken } from "../db/queries/refreshTokens.js";

const TOKEN_EXPIRATION_SECONDS = 3600;
const REFRESH_TOKEN_DURATION_DAYS = 60;

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string,
    password: string
  }

  const params: parameters = req.body;

  const user = await getUser(params.email);

  if (user === undefined) {
    throw new AuthenticationError("incorrect email or password");
  }

  const matching = await checkPasswordHash(params.password, user.hashedPassword);
  if (!matching) {
    throw new AuthenticationError("incorrect email or password");
  }

  const tokenString = makeJWT(user.id, TOKEN_EXPIRATION_SECONDS, config.api.secret);
  const refreshToken = makeRefreshToken();

  // TODO Add try-catch, especially for DB issues
  await createRefreshToken({ token: refreshToken, userId: user.id, expiresAt: new Date(Date.now() + REFRESH_TOKEN_DURATION_DAYS * 24 * 60 * 60 * 1000) }) ;

  res.status(200).json({
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    email: user.email,
    token: tokenString,
    refreshToken: refreshToken,
  });
}