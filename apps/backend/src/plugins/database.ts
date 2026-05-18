import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

const databasePlugin = fp(async (app) => {
  const prisma = new PrismaClient();

  app.decorate("prisma", prisma);
  app.decorate("verifyDatabaseConnection", async () => {
    await prisma.$queryRaw`SELECT 1`;
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

export default databasePlugin;
