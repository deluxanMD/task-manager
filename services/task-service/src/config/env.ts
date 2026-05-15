import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("3002")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DB_HOST: z.string().min(1),
  DB_PORT: z
    .string()
    .default("5432")
    .transform((val) => parseInt(val, 10)),
  DB_USER: z.string().min(1),
  DB_PASSWORD: z.string().min(1),
  DB_NAME: z.string().min(1),
  DB_TEST_NAME: z.string().min(1).default("taskmanager_tasks_test"),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("24h"),
  KAFKA_BROKER: z.string().default("localhost:9092"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));

  process.exit(1);
}

export const env = _env.data;
