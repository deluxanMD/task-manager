import { AppError } from "../errors/AppError";
import TaskModel, {
  CreateTaskInput,
  Task,
  UpdateTaskInput,
} from "../models/task.model";
import { producer } from "../config/kafka";

export const createTask = async (
  userId: string,
  data: CreateTaskInput,
): Promise<Task> => {
  try {
    return await TaskModel.create({ ...data, user_id: userId });
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error on creating task", error);
    throw new AppError(500, "Error on creating task");
  }
};

export const getTasksByUser = async (userId: string): Promise<Task[]> => {
  try {
    return await TaskModel.findByUserId(userId);
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error on getting task by user id", error);
    throw new AppError(500, "Error on getting task by user id");
  }
};

export const getTaskById = async (
  id: string,
  userId: string,
): Promise<Task> => {
  try {
    const task = await TaskModel.findById(id);

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    if (task.user_id !== userId) {
      throw new AppError(403, "Forbidden");
    }

    return task;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error on getting task by task id", error);
    throw new AppError(500, "Error on getting task by task id");
  }
};

export const updateTask = async (
  id: string,
  userId: string,
  data: UpdateTaskInput,
): Promise<Task> => {
  try {
    await getTaskById(id, userId);
    const updated = await TaskModel.updateById(id, data);
    if (!updated) throw new AppError(404, "Task not found");

    if (data.status === "completed") {
      try {
        await producer.send({
          topic: "task.completed",
          messages: [
            {
              key: id,
              value: JSON.stringify({
                taskId: updated.id,
                userId: updated.user_id,
                title: updated.title,
                completedAt: new Date().toISOString(),
              }),
            },
          ],
        });
        console.log(`Event published to task.completed for task ${id}`);
      } catch (kafkaError) {
        console.error("Failed to publish task.completed event:", kafkaError);
      }
    }

    return updated;
  } catch (error) {
    if (error instanceof AppError) throw error;
    console.error("Error on updating task", error);
    throw new AppError(500, "Error on updating task");
  }
};
