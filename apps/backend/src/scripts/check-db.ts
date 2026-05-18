import { PrismaClient } from "@prisma/client";
import { config as loadEnv } from "dotenv";
import { z } from "zod";

loadEnv();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1)
});

const env = envSchema.parse(process.env);
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  }
});

try {
  await prisma.$queryRaw`SELECT 1`;
  console.log("Database connection successful.");
} catch (error) {
  console.error(
    "Database connection failed. Ensure PostgreSQL is running (`docker compose up -d postgres`) and DATABASE_URL is correct."
  );
  console.error(error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
