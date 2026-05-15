import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "../config/env";
import redis from "../config/redis";

export const userProxyMiddleware = createProxyMiddleware({
  target: env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/auth${path}`,
});

export const taskProxyMiddleware = createProxyMiddleware({
  target: env.TASK_SERVICE_URL,
  changeOrigin: true,
});

export const invalidateCacheMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.userId;
  if (userId) {
    await redis.del(`tasks:${userId}`);
  }
  next();
};
