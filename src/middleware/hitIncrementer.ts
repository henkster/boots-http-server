import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareHitIncrementer (req: Request, __: Response, next: NextFunction) {
  config.fileserverHits++;
  next();
}
