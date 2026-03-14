import { Worker, type Job } from "bullmq";
import { env } from "./env.js";
import { JOB_TYPES, QUEUE_NAME } from "./jobs.js";

const redisUrl = new URL(env.REDIS_URL);
const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  username: redisUrl.username || undefined,
  password: redisUrl.password || undefined,
  db: redisUrl.pathname && redisUrl.pathname !== "/" ? Number(redisUrl.pathname.slice(1)) : 0
};

const worker = new Worker(
  QUEUE_NAME,
  async (job: Job) => {
    switch (job.name) {
      case JOB_TYPES.bookingConfirmationEmail:
        console.log("[worker] booking confirmation placeholder", job.data);
        break;
      case JOB_TYPES.documentGeneration:
        console.log("[worker] document generation placeholder", job.data);
        break;
      case JOB_TYPES.reminderScheduling:
        console.log("[worker] reminder scheduling placeholder", job.data);
        break;
      default:
        console.warn("[worker] unknown job type", job.name, job.data);
    }
  },
  {
    connection,
    concurrency: env.WORKER_CONCURRENCY
  }
);

worker.on("completed", (job) => {
  console.log(`[worker] completed job ${job.id} (${job.name})`);
});

worker.on("failed", (job, error) => {
  console.error(`[worker] failed job ${job?.id} (${job?.name})`, error);
});

console.log(`[worker] listening on queue '${QUEUE_NAME}' with concurrency ${env.WORKER_CONCURRENCY}`);

const shutdown = async () => {
  await worker.close();
  process.exit(0);
};

process.on("SIGINT", () => void shutdown());
process.on("SIGTERM", () => void shutdown());
