import dotenv from "dotenv";
import * as z from "zod";

dotenv.config();

const envSchema = z.object({
  PORT: z
    .string()
    .default("3001")
    .transform((val) => parseInt(val, 10)),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  MONGODB_URI: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("24h"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("❌ Invalid environment variables:");
  console.error(JSON.stringify(_env.error.format(), null, 2));

  process.exit(1);
}

export const env = _env.data;
