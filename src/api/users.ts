import { type Request, type Response } from "express";
import { createUser } from "../db/queries/users.js";
import { hashPassword } from "../security/auth.js"

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters ={
    email: string;
    password: string;
  }

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