import type { Request, Response, NextFunction } from "express";
import { BadRequesError } from "../errors.js";

export function errorHandler(
  err: Error, // JS built-in interface
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`An error occurred: ${err}`);
  if (err instanceof BadRequesError) {
    res.status(400);
    res.json({
        error: err.message
    });
  } else {
    res.status(500).json({
        error: "Something went wrong on our end",
    });
  }
}