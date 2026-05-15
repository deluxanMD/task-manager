import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middleware/errorHandler";
import { proxyRouter } from "./routes/proxy.routes";

const app = express();

// Middlewares
app.use(cors());
app.use(cookieParser());

// Proxy routes
app.use(proxyRouter);

// Error Handler
app.use(errorHandler);

export { app };
