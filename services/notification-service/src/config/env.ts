import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const envSchema = z.object({
  KAFKA_BROKER: z.string().default("localhost:9092"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));

  process.exit(1);
}

export const env = _env.data;
