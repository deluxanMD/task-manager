import { env } from "./config/env";
import { Kafka } from "kafkajs";

// Kafka Client
const kafka = new Kafka({
  clientId: "notif-service",
  brokers: [env.KAFKA_BROKER],
});

// Consumer
const consumer = kafka.consumer({ groupId: "notification-service" });

const run = async () => {
  try {
    console.log("Connecting to Kafka...");
    await consumer.connect();
    await consumer.subscribe({ topic: "task.completed", fromBeginning: false });

    console.log("Notification service is listening for events");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;

        const payload = JSON.parse(message.value.toString());
        const { title, userId, taskId } = payload;

        console.log(
          `Notification: Task "${title}" (ID: ${taskId}) completed by user ${userId}`,
        );
      },
    });
  } catch (error) {
    console.error("Error in Notification Service:", error);
    process.exit(1);
  }
};

const shutdown = async () => {
  console.log("Stopping consumer...");
  await consumer.disconnect();
  console.log("Notification Service disconnected cleanly.");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

run();
