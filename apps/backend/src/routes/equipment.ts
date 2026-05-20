import type { FastifyPluginAsync } from "fastify";
import { equipmentListQuerySchema } from "../modules/equipment/equipment.schemas.js";
import { listEquipment } from "../modules/equipment/equipment.service.js";

const equipmentRoutes: FastifyPluginAsync = async (app) => {
  app.get("/equipment", { preHandler: app.authenticate }, async (request) => {
    const context = app.requireRequestContext(request);
    const query = equipmentListQuerySchema.parse(request.query);

    return listEquipment(app.prisma, context.tenant.id, query);
  });
};

export default equipmentRoutes;
