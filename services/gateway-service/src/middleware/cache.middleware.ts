import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.method !== "GET") return next();

  const userId = req.user?.userId;
  if (!userId) return next();

  const cacheKey = `tasks:${userId}`;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      try {
        return res.status(200).json(JSON.parse(cachedData));
      } catch {
        await redis.del(cacheKey);
        console.log(`Corrupt cache cleared for ${cacheKey}`);
      }
    }

    console.log(`Cache miss for ${cacheKey}`);
    next();
  } catch (error) {
    console.error("Cache read error:", error);
    next();
  }
};
