import { type Request, type Response } from "express";
import { createUser, updateUserEmailAndPassword } from "../db/queries/users.js";
import { getBearerToken, hashPassword, validateJWT } from "../security/auth.js"
import { config } from "../config.js";

type parameters ={
  email: string;
  password: string;
}

export async function handlerCreateUser(req: Request, res: Response) {
  const params: parameters = req.body;

  const hashedPassword = await hashPassword(params.password);

  const user = await createUser({email: params.email, hashedPassword});
  
  res.status(201);
  res.send(JSON.stringify({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}

export async function handlerUpdateUser(req: Request, res: Response) {

  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.secret);

  const params: parameters = req.body;

  const hashedPassword = await hashPassword(params.password);

  const updatedUser = await updateUserEmailAndPassword(userId, params.email, hashedPassword);

  res.status(200).json({
    id: updatedUser.id,
    email: updatedUser.email,
    createdAt: updatedUser.createdAt,
    updatedAt: updatedUser.updatedAt,
  });
}