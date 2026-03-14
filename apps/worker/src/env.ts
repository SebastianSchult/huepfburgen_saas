import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  REDIS_URL: z.string().default("redis://localhost:6379"),
  WORKER_CONCURRENCY: z.coerce.number().int().positive().default(5)
});

export const env = envSchema.parse(process.env);
