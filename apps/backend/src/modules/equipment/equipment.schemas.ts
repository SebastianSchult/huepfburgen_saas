import { z } from "zod";

const equipmentStatusValues = ["available", "reserved", "maintenance", "inactive"] as const;

export const equipmentListQuerySchema = z.object({
  search: z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const trimmedValue = value.trim();
    return trimmedValue === "" ? undefined : trimmedValue;
  }, z.string().max(120).optional()),
  status: z.enum(equipmentStatusValues).optional(),
  categoryId: z.string().uuid().optional(),
  locationId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

export const equipmentListItemSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().nullable(),
  sku: z.string().nullable(),
  serialNumber: z.string().nullable(),
  status: z.enum(equipmentStatusValues),
  imageUrl: z.string().nullable(),
  active: z.boolean(),
  category: z
    .object({
      id: z.string().uuid(),
      name: z.string().min(1)
    })
    .nullable(),
  location: z
    .object({
      id: z.string().uuid(),
      name: z.string().min(1)
    })
    .nullable(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const equipmentListResponseSchema = z.object({
  items: z.array(equipmentListItemSchema),
  pagination: z.object({
    page: z.number().int().min(1),
    pageSize: z.number().int().min(1).max(100),
    totalItems: z.number().int().min(0),
    totalPages: z.number().int().min(0)
  })
});

export type EquipmentListQuery = z.infer<typeof equipmentListQuerySchema>;
export type EquipmentListResponse = z.infer<typeof equipmentListResponseSchema>;
