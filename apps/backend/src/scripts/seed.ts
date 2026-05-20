import { PrismaClient, type Prisma } from "@prisma/client";
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

const seedIds = {
  tenantId: "10000000-0000-4000-8000-000000000001",
  ownerUserId: "10000000-0000-4000-8000-000000000002",
  staffUserId: "10000000-0000-4000-8000-000000000003",
  locationId: "10000000-0000-4000-8000-000000000004",
  categoryId: "10000000-0000-4000-8000-000000000005",
  equipmentId: "10000000-0000-4000-8000-000000000006",
  customerId: "10000000-0000-4000-8000-000000000007",
  bookingId: "10000000-0000-4000-8000-000000000008",
  bookingItemId: "10000000-0000-4000-8000-000000000009",
  unavailabilityId: "10000000-0000-4000-8000-000000000010"
} as const;

const seedTenant = {
  id: seedIds.tenantId,
  name: "Demo Huepfburgen GmbH",
  slug: "demo-huepfburgen",
  plan: "pro" as const,
  status: "active" as const
};

const bookingStartDate = new Date("2026-06-20T00:00:00.000Z");
const bookingEndDate = new Date("2026-06-21T00:00:00.000Z");
const unavailabilityStartDate = new Date("2026-06-24T00:00:00.000Z");
const unavailabilityEndDate = new Date("2026-06-25T00:00:00.000Z");

const seedUsers = [
  {
    id: seedIds.ownerUserId,
    tenantId: seedTenant.id,
    firstName: "Demo",
    lastName: "Owner",
    email: "owner@demo-huepfburgen.local",
    passwordHash: "$seed$owner-password-not-for-production",
    role: "owner" as const,
    status: "active" as const
  },
  {
    id: seedIds.staffUserId,
    tenantId: seedTenant.id,
    firstName: "Demo",
    lastName: "Staff",
    email: "staff@demo-huepfburgen.local",
    passwordHash: "$seed$staff-password-not-for-production",
    role: "staff" as const,
    status: "active" as const
  }
];

const seedLocations = [
  {
    id: seedIds.locationId,
    tenantId: seedTenant.id,
    name: "Hauptlager Hamburg",
    street: "Musterweg",
    houseNumber: "12a",
    postalCode: "21035",
    city: "Hamburg",
    notes: "Default demo location"
  }
];

const seedCategories = [
  {
    id: seedIds.categoryId,
    tenantId: seedTenant.id,
    name: "Huepfburgen",
    description: "Standard category for inflatable castles"
  }
];

const seedEquipment = [
  {
    id: seedIds.equipmentId,
    tenantId: seedTenant.id,
    categoryId: seedIds.categoryId,
    locationId: seedIds.locationId,
    name: "Piratenburg XL",
    description: "Große Themen-Huepfburg fuer Kinderfeste.",
    sku: "HB-PRT-XL-001",
    serialNumber: "PRT-XL-2026-001",
    status: "available" as const,
    imageUrl: null,
    active: true
  }
];

const seedCustomers = [
  {
    id: seedIds.customerId,
    tenantId: seedTenant.id,
    type: "private" as const,
    companyName: null,
    firstName: "Lena",
    lastName: "Sommer",
    email: "lena.sommer@example.com",
    phone: "+49-40-5551234",
    street: "Wiesenstieg",
    houseNumber: "8",
    postalCode: "22041",
    city: "Hamburg",
    notes: "Demo customer for local development"
  }
];

const seedBookings = [
  {
    id: seedIds.bookingId,
    tenantId: seedTenant.id,
    customerId: seedIds.customerId,
    bookingNumber: "B-2026-0001",
    startDate: bookingStartDate,
    endDate: bookingEndDate,
    status: "confirmed" as const,
    subtotalAmount: "250.00",
    depositAmount: "50.00",
    totalAmount: "300.00",
    notes: "Seed booking for coherent demo relations",
    createdByUserId: seedIds.ownerUserId
  }
];

const seedBookingItems = [
  {
    id: seedIds.bookingItemId,
    tenantId: seedTenant.id,
    bookingId: seedIds.bookingId,
    equipmentId: seedIds.equipmentId,
    quantity: 1,
    unitPrice: "250.00",
    lineTotal: "250.00"
  }
];

const seedUnavailability = [
  {
    id: seedIds.unavailabilityId,
    tenantId: seedTenant.id,
    equipmentId: seedIds.equipmentId,
    startDate: unavailabilityStartDate,
    endDate: unavailabilityEndDate,
    reason: "Seed maintenance window"
  }
];

const resetSeedTenant = async (tx: Prisma.TransactionClient) => {
  const existingTenant = await tx.tenant.findUnique({
    where: {
      slug: seedTenant.slug
    },
    select: {
      id: true
    }
  });

  if (existingTenant) {
    await tx.tenant.delete({
      where: {
        id: existingTenant.id
      }
    });
  }
};

try {
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await resetSeedTenant(tx);

    await tx.tenant.create({
      data: seedTenant
    });

    await tx.user.createMany({
      data: seedUsers
    });

    await tx.location.createMany({
      data: seedLocations
    });

    await tx.equipmentCategory.createMany({
      data: seedCategories
    });

    await tx.equipment.createMany({
      data: seedEquipment
    });

    await tx.customer.createMany({
      data: seedCustomers
    });

    await tx.booking.createMany({
      data: seedBookings
    });

    await tx.bookingItem.createMany({
      data: seedBookingItems
    });

    await tx.equipmentUnavailability.createMany({
      data: seedUnavailability
    });
  });

  console.log("Seed completed for tenant slug:", seedTenant.slug);
} catch (error) {
  console.error("Seed failed.");
  console.error(error);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
