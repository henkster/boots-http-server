import type { Request, Response } from "express";
import { replace_profanity } from "./profanityChecker.js";
import { BadRequesError } from "../errors.js";

export async function handlerChirpValidator(req: Request, res: Response) {
  type parameters ={
    body: string;
  }

  const params: parameters = req.body;
  const maxChirpLength = 140;

  let messageObj;

  if (params.body.length <= maxChirpLength) {
    res.status(200);
      messageObj = { cleanedBody: replace_profanity(params.body) };
  } else {
    //res.status(400);
    //messageObj = { error: "Chirp is too long" };
    throw new BadRequesError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }

  res.send(JSON.stringify(messageObj));
}