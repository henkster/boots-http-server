import type { Request, Response } from "express";
import { getUser } from "../db/queries/users.js";
import { AuthenticationError, NotFoundError } from "./errors.js";
import { checkPasswordHash } from "../security/auth.js";
import { NewUser } from "../db/schema.js";

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string,
    password: string
  }

  const params: parameters = req.body;

  const user = await getUser(params.email);

  if (user === undefined) {
    throw new NotFoundError("User not found");
  }

  type UserInfo = Omit<NewUser, "hashedPassword">;

  const userInfo: UserInfo = user;

  if (await checkPasswordHash(params.password, user.hashedPassword)) {
    res.status(200);
    res.send(JSON.stringify(userInfo));
  }
  else {
    throw new AuthenticationError("incorrect email or password");
  }
}