import type { Request, Response, NextFunction } from "express";
import { AuthenticationError, AuthorizationError, BadRequestError, NotFoundError } from "../api/errors.js";

export function errorHandler(
  err: Error, // JS built-in interface
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(`An error occurred: ${err}`);
  if (err instanceof BadRequestError) {
    res.status(400);
    res.json({
      error: err.message
    });
  } else if (err instanceof AuthenticationError) {
    res.status(401);
    res.json({
      error: err.message
    });
  } else if (err instanceof AuthorizationError) {
    res.status(403);
    res.json({
      error: err.message
    });
  } else if (err instanceof NotFoundError) {
    res.status(404);
    res.json({
      error: err.message
    });
  } else {
    res.status(500).json({
      error: "Something went wrong on our end",
    });
  }
}