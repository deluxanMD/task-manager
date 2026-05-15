import { Kafka, Producer } from "kafkajs";
import { env } from "./env";

// Kafka Client
const kafka = new Kafka({
  clientId: "task-service",
  brokers: [env.KAFKA_BROKER],
});

// Kafka Producer
export const producer: Producer = kafka.producer();

// Connect Producer
export const connectProducer = async () => {
  try {
    await producer.connect();
    console.log("Successfully connected to Kafka Producer");
  } catch (error) {
    console.error("Error connecting to Kafka Producer:", error);
    throw error;
  }
};

// Disconnect Producer
export const disconnectProducer = async () => {
  await producer.disconnect();
  console.log("Kafka producer disconnect");
};
