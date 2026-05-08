import { env } from "./config/env";
import { app } from "./app";
import mongoose from "mongoose";

const startServer = async () => {
  try {
    await mongoose.connect(env.MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    app.listen(env.PORT, () => {
      console.log(
        `👨🏻‍⚕️ User service running on port ${env.PORT} in ${env.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();
