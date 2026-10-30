import type { Request, Response } from "express";
import { replace_profanity } from "./profanityChecker.js";
import { BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";

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
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
}

export async function handlerGetAllChirps(req: Request, res: Response) {

  const chirps = await getAllChirps();
  
  res.status(200);
  res.send(JSON.stringify(chirps));
}

export async function handlerGetChirp(req: Request, res: Response) {

  let id = req.params.id;

  if (id === undefined) {
    throw new BadRequestError("Id is required");
  }

  if (Array.isArray(id)) {
    throw new BadRequestError("Id cannot be an array");
  }

  const chirp = await getChirp(id);

  if (chirp === null || chirp === undefined) {
    throw new NotFoundError("Chirp cannot be found by that id.");
  }

  res.status(200);
  res.send(JSON.stringify(chirp));
}