import type { Request, Response } from "express";
import { replace_profanity } from "./profanityChecker.js";
import { BadRequesError } from "./errors.js";
import { createChirp } from "../db/queries/chirps.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters ={
    body: string;
    userId: string;
  }

  const params: parameters = req.body;

  const maxChirpLength = 140;

  if (params.body.length <= maxChirpLength) {
    const cleanedBody = replace_profanity(params.body);
    const chirp = await createChirp({body: cleanedBody, userId: params.userId});
    res.status(201);
    res.send(JSON.stringify(chirp));
  } else {
    throw new BadRequesError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
}