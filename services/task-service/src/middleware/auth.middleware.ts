import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AppError } from "../errors/AppError";

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError(401, "Unauthorized: No token specified"));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: string };

    req.user = { userId: decoded.userId };

    next();
  } catch (error) {
    next(new AppError(401, "Unauthorized: Invalid token"));
  }
};
