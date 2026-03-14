import type { FastifyPluginAsync } from "fastify";
import healthRoute from "./health.js";
import authRoutes from "./auth.js";

const apiRoutes: FastifyPluginAsync = async (app) => {
  await app.register(healthRoute);
  await app.register(authRoutes);
};

export default apiRoutes;
