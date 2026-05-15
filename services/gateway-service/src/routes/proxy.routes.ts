import { Router } from "express";
import {
  invalidateCacheMiddleware,
  taskProxyMiddleware,
  userProxyMiddleware,
} from "../middleware/proxy.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { cacheMiddleware } from "../middleware/cache.middleware";

const router = Router();

router.use("/api/auth", userProxyMiddleware);
router.post(
  "/api/tasks",
  authMiddleware,
  invalidateCacheMiddleware,
  taskProxyMiddleware,
);
router.patch(
  "/api/tasks/:id",
  authMiddleware,
  invalidateCacheMiddleware,
  taskProxyMiddleware,
);
router.use("/api/tasks", authMiddleware, cacheMiddleware, taskProxyMiddleware);

export { router as proxyRouter };
