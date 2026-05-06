import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Health Route
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "UP", service: "user-service" });
});

// Auth Routes
app.use("/api/auth", authRouter);

// Error Handler
app.use(
  (
    err: Error & { statusCode?: number },
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
      success: false,
      message: err.message || "Internal Server Error",
      stack: env.NODE_ENV === "development" ? err.stack : undefined,
    });
  },
);

export { app };
