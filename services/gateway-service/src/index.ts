import { env } from "./config/env";
import { app } from "./app";
import redis from "./config/redis";

const startServer = async () => {
  try {
    await redis.ping();
    console.log("✅ Redis connected");

    app.listen(env.PORT, () => {
      console.log(
        `Gateway service is running on port ${env.PORT} in ${env.NODE_ENV} mode`,
      );
    });
  } catch (error) {
    console.error("Gateway server connection failed:", error, "❌");
    process.exit(1);
  }
};

startServer();
