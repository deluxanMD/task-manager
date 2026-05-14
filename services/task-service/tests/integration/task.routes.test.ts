import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../../src/app";
import { CreateTaskInput, UpdateTaskInput } from "../../src/models/task.model";
import { env } from "../../src/config/env";

const userId = "test-user-mongodb-id";
const token = jwt.sign({ userId }, env.JWT_SECRET);
const cookie = `token=${token}`;

const nonExistentId = "00000000-0000-0000-0000-000000000000";

const createTaskPayload = {
  title: "Test task",
  description: "Sample description",
  status: "in_progress",
};

const updateTaskPayload: UpdateTaskInput = {
  title: "updated Sample Task",
  description: "updated Sample description",
  status: "completed",
};

describe("Task service - Integration Test", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  describe("POST /api/tasks", () => {
    it("should return 400 for bad request", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send({ ...createTaskPayload, title: "" });

      expect(response.status).toBe(400);
      expect(response.body).toMatchObject({
        success: false,
        errors: {
          title: ["Title is required"],
        },
      });
    });

    it("should create a task and return 201", async () => {
      const response = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send(createTaskPayload);

      expect(response.status).toBe(201);
      expect(response.body.task).toHaveProperty("id");
      expect(response.body.task.title).toBe("Test task");
      expect(response.body.task.user_id).toBe(userId);
    });
  });

  describe("GET /api/tasks", () => {
    it("should return [] for no tasks", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Cookie", cookie)
        .send("invalid_user_id");

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        success: true,
        tasks: [],
      });
    });

    it("should return 200 and all tasks related to the user", async () => {
      await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send({ ...createTaskPayload, title: "Task 1" });

      await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send({ ...createTaskPayload, title: "Task 2" });

      const response = await request(app)
        .get("/api/tasks")
        .set("Cookie", cookie)
        .send(userId);

      expect(response.status).toBe(200);
      expect(response.body.tasks).toHaveLength(2);
    });
  });

  describe("GET /api/tasks/:id", () => {
    it("should return 404 for task not found", async () => {
      const response = await request(app)
        .get(`/api/tasks/${nonExistentId}`)
        .set("Cookie", cookie)
        .send({ id: nonExistentId });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Task not found",
      });
    });

    it("should return 403 for forbidden", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send(createTaskPayload);

      const taskId = createResponse.body.task.id;

      // Generate a different user's cookie
      const otherToken = jwt.sign({ userId: "other-user-id" }, env.JWT_SECRET);
      const otherCookie = `token=${otherToken}`;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", otherCookie);

      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        success: false,
        message: "Forbidden",
      });
    });

    it("should return 200 and task object", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send(createTaskPayload);

      const taskId = createResponse.body.task.id;

      const response = await request(app)
        .get(`/api/tasks/${taskId}`)
        .set("Cookie", cookie);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.id).toBe(taskId);
      expect(response.body.task.title).toBe(createTaskPayload.title);
      expect(response.body.task.user_id).toBe(userId);
    });
  });

  describe("PATCH /api/tasks/:id", () => {
    it("should return 404 for task not found", async () => {
      const response = await request(app)
        .patch(`/api/tasks/${nonExistentId}`)
        .set("Cookie", cookie)
        .send({ id: nonExistentId });

      expect(response.status).toBe(404);
      expect(response.body).toMatchObject({
        success: false,
        message: "Task not found",
      });
    });

    it("should return 403 for forbidden", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send(createTaskPayload);

      const taskId = createResponse.body.task.id;

      // Generate a different user's cookie
      const otherToken = jwt.sign({ userId: "other-user-id" }, env.JWT_SECRET);
      const otherCookie = `token=${otherToken}`;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Cookie", otherCookie)
        .send(updateTaskPayload);

      expect(response.status).toBe(403);
      expect(response.body).toMatchObject({
        success: false,
        message: "Forbidden",
      });
    });

    it("should return 200 and task object", async () => {
      const createResponse = await request(app)
        .post("/api/tasks")
        .set("Cookie", cookie)
        .send(createTaskPayload);

      const taskId = createResponse.body.task.id;

      const response = await request(app)
        .patch(`/api/tasks/${taskId}`)
        .set("Cookie", cookie)
        .send(updateTaskPayload);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.task.id).toBe(taskId);
      expect(response.body.task.title).toBe(updateTaskPayload.title);
      expect(response.body.task.user_id).toBe(userId);
    });
  });
});
