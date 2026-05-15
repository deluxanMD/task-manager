import { Request, Response, NextFunction } from "express";
import redis from "../config/redis";

export const cacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;

  if (!userId) return next();
  if (req.method !== "GET") return next();

  const cacheKey = `tasks:${userId}`;

  try {
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      console.log(`Cache hit for ${cacheKey}`);
      return res.status(200).json(JSON.parse(cachedData));
    }

    console.log(`Cache miss for ${cacheKey}`);

    const originalJson = res.json.bind(res);

    res.json = (body): Response => {
      if (res.statusCode === 200) {
        redis
          .set(cacheKey, JSON.stringify(body), "EX", 3600)
          .catch((err) => console.error("Redis save error:", err));
      }

      return originalJson(body);
    };

    next();
  } catch (error) {
    console.error("Cache middleware error:", error);
    next();
  }
};
