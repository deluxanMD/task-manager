import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(errorHandler);

// Health Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "user-service" });
});

// Auth Routes
app.use("/api/auth", authRouter);

export { app };
