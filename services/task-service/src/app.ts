import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { taskRouter } from "./routes/task.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

// Health check route
app.get("/api/tasks/health", (req, res) => {
  res.status(200).json({ status: "UP", service: "task-service" });
});

// Task routes
app.use("/api/tasks", taskRouter);

// Error Handler
app.use(errorHandler);

export { app };
