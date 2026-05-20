import type { FastifyPluginAsync } from "fastify";
import healthRoute from "./health.js";
import authRoutes from "./auth.js";
import tenantRoutes from "./tenant.js";
import equipmentRoutes from "./equipment.js";

const apiRoutes: FastifyPluginAsync = async (app) => {
  await app.register(healthRoute);
  await app.register(authRoutes);
  await app.register(tenantRoutes);
  await app.register(equipmentRoutes);
};

export default apiRoutes;
