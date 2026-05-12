import { NextFunction, Request, Response } from "express";
import {
  createTask,
  getTaskById,
  getTasksByUser,
  updateTask,
} from "../services/task.service";

export const create = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const task = await createTask(userId, req.body);
    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const getByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const tasks = await getTasksByUser(userId);
    res.status(200).json({ success: true, tasks });
  } catch (error) {
    next(error);
  }
};

export const getById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const task = await getTaskById(taskId, userId);
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

export const update = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const taskId = req.params.id as string;
    const updated = await updateTask(taskId, userId, req.body);
    res.status(200).json({ success: true, task: updated });
  } catch (error) {
    next(error);
  }
};
