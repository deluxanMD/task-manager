import TaskModel, { CreateTaskInput } from "../../src/models/task.model";
import {
  createTask,
  getTaskById,
  getTasksByUser,
  updateTask,
} from "../../src/services/task.service";

jest.mock("../../src/models/task.model");

const mockTask: CreateTaskInput = {
  title: "Sample Title",
  description: "Sample description",
  status: "pending",
  user_id: "12345",
};

const mockUser = {
  _id: "user123",
  email: "test@example.com",
  passwordHash: "some_hashed_string",
};

describe("Task Service - Unit Tests", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("createTask", () => {
    it("should throw 500 for unexpected error", async () => {
      (TaskModel.create as jest.Mock).mockRejectedValue({
        email: "test@test.com",
      });

      await expect(createTask("12345", mockTask)).rejects.toMatchObject({
        statusCode: 500,
        message: "Error on creating task",
      });
    });

    it("should create task successfully", async () => {
      (TaskModel.create as jest.Mock).mockResolvedValue(mockTask);

      const result = await createTask("12345", mockTask);

      expect(result).toMatchObject(mockTask);
    });
  });

  describe("getTasksByUser", () => {
    it("should throw 500 for unexpected error", async () => {
      (TaskModel.findByUserId as jest.Mock).mockRejectedValue({
        userId: "12345",
      });

      await expect(getTasksByUser("12345")).rejects.toMatchObject({
        statusCode: 500,
        message: "Error on getting task by user id",
      });
    });

    it("should return tasks for user", async () => {
      const mockTasks = [
        { ...mockTask, id: "task1" },
        { ...mockTask, id: "task2" },
      ];
      (TaskModel.findByUserId as jest.Mock).mockResolvedValue(mockTasks);

      const result = await getTasksByUser("12345");

      expect(result).toMatchObject(mockTasks);
    });
  });

  describe("getTaskById", () => {
    it("should throw 500 for unexpected error", async () => {
      (TaskModel.findById as jest.Mock).mockRejectedValue({
        id: "task1",
      });

      await expect(getTaskById("task1", "12345")).rejects.toMatchObject({
        statusCode: 500,
        message: "Error on getting task by task id",
      });
    });

    it("should throw 404 if task not found", async () => {
      (TaskModel.findById as jest.Mock).mockResolvedValue(undefined);

      await expect(getTaskById("task1", "12345")).rejects.toMatchObject({
        statusCode: 404,
        message: "Task not found",
      });
    });

    it("should throw 403 if user not owner of task", async () => {
      (TaskModel.findById as jest.Mock).mockResolvedValue({
        ...mockTask,
        id: "task1",
        user_id: "other_user",
      });

      await expect(getTaskById("task1", "12345")).rejects.toMatchObject({
        statusCode: 403,
        message: "Forbidden",
      });
    });

    it("should return task if found and user is owner", async () => {
      (TaskModel.findById as jest.Mock).mockResolvedValue(mockTask);
      const result = await getTaskById("task1", "12345");

      expect(result).toMatchObject(mockTask);
    });
  });

  describe("updateTask", () => {
    it("should throw 500 for unexpected error", async () => {
      (TaskModel.findById as jest.Mock).mockResolvedValue({
        ...mockTask,
        id: "task1",
        user_id: "12345",
      });
      (TaskModel.updateById as jest.Mock).mockRejectedValue(
        new Error("DB error"),
      );

      await expect(
        updateTask("task1", "12345", { title: "Updated Title" }),
      ).rejects.toMatchObject({
        statusCode: 500,
        message: "Error on updating task",
      });
    });

    it("should update task successfully", async () => {
      (TaskModel.findById as jest.Mock).mockResolvedValue({
        ...mockTask,
        id: "task1",
        user_id: "12345",
      });
      (TaskModel.updateById as jest.Mock).mockResolvedValue({
        ...mockTask,
        title: "Updated Title",
      });

      const result = await updateTask("task1", "12345", {
        title: "Updated Title",
      });

      expect(result).toMatchObject({
        ...mockTask,
        title: "Updated Title",
      });

      expect(TaskModel.updateById).toHaveBeenCalledWith("task1", {
        title: "Updated Title",
      });
    });
  });
});
