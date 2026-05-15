import { Request, Response, NextFunction } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { env } from "../config/env";
import redis from "../config/redis";

export const userProxyMiddleware = createProxyMiddleware({
  target: env.USER_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/auth${path}`,
});

export const taskReadProxyMiddleware = createProxyMiddleware({
  target: env.TASK_SERVICE_URL,
  changeOrigin: true,
  pathRewrite: (path) => `/api/tasks${path}`,
  on: {
    proxyRes: (proxyRes, req: any) => {
      if (req.method !== "GET") return;

      const userId = req.user?.userId;
      if (!userId) return;

      const url = req.originalUrl || req.url || "";
      const isTaskList = url === "/api/tasks" || url.endsWith("/api/tasks");
      if (!isTaskList) return;

      const cacheKey = `tasks:${userId}`;
      const chunks: Buffer[] = [];

      proxyRes.on("data", (chunk: Buffer) => chunks.push(chunk));

      proxyRes.on("end", () => {
        try {
          const body = Buffer.concat(chunks).toString("utf8");
          JSON.parse(body); // verify it is valid JSON before caching
          redis
            .set(cacheKey, body, "EX", 3600)
            .then(() => console.log(`Cache written for ${cacheKey}`))
            .catch((err) => console.error("Redis write error:", err));
        } catch {
          console.log("Response was not JSON — skipping cache");
        }
      });
    },
  },
});

export const taskWriteProxyMiddleware = createProxyMiddleware({
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
