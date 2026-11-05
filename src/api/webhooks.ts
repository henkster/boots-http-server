import type { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "./errors.js";
import { upgradeToRed } from "../db/queries/users.js";

export async function handlerPolkaWebhooks(req: Request, res: Response) {
  type parameters = {
    event: string;
    data: {
      userId: string;
    }
  }

  const params = req.body;

  if (params.event !== "user.upgraded") {
    res.sendStatus(204);
    return;
  }

  if (!params.data?.userId) {
    throw new BadRequestError("missing data");
  }

  if (await upgradeToRed(params.data.userId)) {
    return res.sendStatus(204);
  }
  throw new NotFoundError("user not found");
}