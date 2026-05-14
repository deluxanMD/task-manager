import { NextFunction, Request, Response } from "express";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: env.NODE_ENV === "development" ? err.stack : undefined,
  });
};
