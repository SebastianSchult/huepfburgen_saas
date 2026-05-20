import type { Prisma, PrismaClient } from "@prisma/client";
import {
  equipmentListResponseSchema,
  type EquipmentListQuery,
  type EquipmentListResponse
} from "./equipment.schemas.js";

const createEquipmentWhereInput = (tenantId: string, query: EquipmentListQuery): Prisma.EquipmentWhereInput => {
  const search = query.search?.trim();

  return {
    tenantId,
    active: true,
    ...(query.status !== undefined ? { status: query.status } : {}),
    ...(query.categoryId !== undefined ? { categoryId: query.categoryId } : {}),
    ...(query.locationId !== undefined ? { locationId: query.locationId } : {}),
    ...(search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              description: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              sku: {
                contains: search,
                mode: "insensitive"
              }
            },
            {
              serialNumber: {
                contains: search,
                mode: "insensitive"
              }
            }
          ]
        }
      : {})
  };
};

export const listEquipment = async (
  prisma: PrismaClient,
  tenantId: string,
  query: EquipmentListQuery
): Promise<EquipmentListResponse> => {
  const where = createEquipmentWhereInput(tenantId, query);
  const skip = (query.page - 1) * query.pageSize;

  const [items, totalItems] = await prisma.$transaction([
    prisma.equipment.findMany({
      where,
      skip,
      take: query.pageSize,
      orderBy: [{ createdAt: "desc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        description: true,
        sku: true,
        serialNumber: true,
        status: true,
        imageUrl: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        category: {
          select: {
            id: true,
            name: true
          }
        },
        location: {
          select: {
            id: true,
            name: true
          }
        }
      }
    }),
    prisma.equipment.count({ where })
  ]);

  return equipmentListResponseSchema.parse({
    items,
    pagination: {
      page: query.page,
      pageSize: query.pageSize,
      totalItems,
      totalPages: Math.ceil(totalItems / query.pageSize)
    }
  });
};
