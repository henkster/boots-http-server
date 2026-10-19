import { type Request, type Response } from "express";
import { config } from "../config.js";

export async function handlerHitResetter(_: Request, res: Response) {
  config.fileserverHits = 0;
  res.set("Content-Type", "text/plain; charset=utf-8");
  res.send("Reset successful");
};
