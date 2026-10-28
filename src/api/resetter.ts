import { type Request, type Response } from "express";
import { deleteUsers } from "../db/queries/users.js";
import { AuthorizationError } from "./errors.js";
import { config } from "../config.js";

export async function handlerResetter(_: Request, res: Response) {
  if (config.api.platform !== "dev") {
    throw new AuthorizationError("Reset is only allowed in dev environment.");
  }

  await deleteUsers();

  config.api.fileserverHits = 0;

  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("Reset successful");
};
