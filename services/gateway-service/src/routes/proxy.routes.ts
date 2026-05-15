import { Router } from "express";
import {
  invalidateCacheMiddleware,
  taskReadProxyMiddleware,
  taskWriteProxyMiddleware,
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
  taskWriteProxyMiddleware,
);
router.patch(
  "/api/tasks/:id",
  authMiddleware,
  invalidateCacheMiddleware,
  taskWriteProxyMiddleware,
);
router.use(
  "/api/tasks",
  authMiddleware,
  cacheMiddleware,
  taskReadProxyMiddleware,
);

export { router as proxyRouter };
