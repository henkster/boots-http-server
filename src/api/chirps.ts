import type { Request, Response } from "express";
import { replace_profanity } from "./profanityChecker.js";
import { AuthenticationError, AuthorizationError, BadRequestError, NotFoundError } from "./errors.js";
import { createChirp, deleteChirp, getAllChirps, getChirp } from "../db/queries/chirps.js";
import { getBearerToken, validateJWT } from "../security/auth.js";
import { config } from "../config.js";
import { Chirp } from "../db/schema.js";

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters ={
    body: string;
    //userId: string;
  }

  const params: parameters = req.body;

  const maxChirpLength = 140;

  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.secret);

  if (!userId) {
    throw new AuthenticationError();
  }

  if (params.body.length <= maxChirpLength) {
    const cleanedBody = replace_profanity(params.body);
    const chirp = await createChirp({body: cleanedBody, userId: userId});
    res.status(201);
    res.send(JSON.stringify(chirp));
  } else {
    throw new BadRequestError(`Chirp is too long. Max length is ${maxChirpLength}`);
  }
}

export async function handlerGetAllChirps(req: Request, res: Response) {

  let authorId = "";
  let authorIdQuery = req.query.authorId;
  if (typeof authorIdQuery === "string") {
    authorId = authorIdQuery;
  }

  const chirps = await getAllChirps(authorId);

  const sortedChirps = sortChirps(chirps, String(req.query.sort ?? "asc"));
  /*
    From Boots chat: 
    String(undefined)        // "undefined"
    String("desc")           // "desc"
    String(["desc", "asc"])  // "desc,asc"  (arrays join with commas)
    String(["desc"])         // "desc"      (single-element array still works!)
    String({ foo: "desc" })  // "[object Object]"
  */
  
  res.status(200);
  res.send(JSON.stringify(sortedChirps));
}

function sortChirps(chirps: Chirp[], direction: string) {
  if (direction === "desc") {
    return chirps.toSorted((c1, c2) => c2.createdAt.getTime() - c1.createdAt.getTime());
  }
  return chirps.toSorted((c1, c2) => c1.createdAt.getTime() - c2.createdAt.getTime());
}

export async function handlerGetChirp(req: Request, res: Response) {

  const id = req.params.id;

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

export async function handlerDeleteChirp(req: Request, res: Response) {
  const id = req.params.id;

  if (id === undefined) {
    throw new BadRequestError("Id is required");
  }

  if (Array.isArray(id)) {
    throw new BadRequestError("Id cannot be an array");
  }
  
  const token = getBearerToken(req);

  const userId = validateJWT(token, config.api.secret);

  const chirp = await getChirp(id);

  if (!chirp) {
    throw new NotFoundError("chirp not found");
  }

  if (chirp.userId !== userId) {
    throw new AuthorizationError();
  }

  const isDeleted = await deleteChirp(id);

  if (!isDeleted) { // a double-check, albeit redundant
    throw new NotFoundError("chirp not found");
  }

  res.status(204).send();
}