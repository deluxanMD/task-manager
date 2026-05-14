import { env } from "./config/env";
import { app } from "./app";
import db from "./config/db";

const startServer = async () => {
  try {
    console.log("Checking database connection...", "⏳");
    await db.raw("SELECT 1");
    console.log("Database connection verified successfully", "✅");

    app.listen(env.PORT, () => {
      console.log(
        `Task service is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error("Database connection failed:", error, "❌");
    process.exit(1);
  }
};

startServer();
