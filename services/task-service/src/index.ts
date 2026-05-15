import { env } from "./config/env";
import { app } from "./app";
import db from "./config/db";
import { connectProducer, disconnectProducer } from "./config/kafka";

const startServer = async () => {
  try {
    console.log("Checking database connection...", "⏳");
    await db.raw("SELECT 1");
    await connectProducer();
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

process.on("SIGTERM", async () => {
  await disconnectProducer();
  process.exit(0);
});

startServer();
