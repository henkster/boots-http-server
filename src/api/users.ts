import { type Request, type Response } from "express";
import { createUser } from "../db/queries/users.js";
import { NewUser, } from "../db/schema.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters ={
    email: string;
  }

  const params: parameters = req.body;

  const user = await createUser({email: params.email});
  
  res.status(201);
  res.send(JSON.stringify({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));
}