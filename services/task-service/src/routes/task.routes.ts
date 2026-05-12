import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validate";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/task.validator";
import {
  create,
  getById,
  getByUser,
  update,
} from "../controllers/task.controller";

const router = Router();

router.post("/", authMiddleware, validate(createTaskSchema), create);
router.get("/", authMiddleware, getByUser);
router.get("/:id", authMiddleware, getById);
router.patch("/:id", authMiddleware, validate(updateTaskSchema), update);

export { router as taskRouter };
