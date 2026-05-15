import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("4000")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  JWT_SECRET: z.string().min(32),
  USER_SERVICE_URL: z.string().min(1),
  TASK_SERVICE_URL: z.string().min(1),
  REDIS_HOST: z.string().default("127.0.0.1"),
  REDIS_PORT: z
    .string()
    .default("6379")
    .transform((val) => parseInt(val, 10)),
  REDIS_PASSWORD: z.string().optional(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));

  process.exit(1);
}

export const env = _env.data;
