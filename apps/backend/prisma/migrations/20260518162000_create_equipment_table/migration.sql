-- CreateEnum
CREATE TYPE "EquipmentStatus" AS ENUM ('available', 'reserved', 'maintenance', 'inactive');

-- CreateTable
CREATE TABLE "equipment" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "category_id" UUID,
    "location_id" UUID,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sku" TEXT,
    "serial_number" TEXT,
    "status" "EquipmentStatus" NOT NULL DEFAULT 'available',
    "image_url" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_tenant_id_sku_key" ON "equipment"("tenant_id", "sku");

-- CreateIndex
CREATE INDEX "equipment_tenant_id_idx" ON "equipment"("tenant_id");

-- CreateIndex
CREATE INDEX "equipment_tenant_id_status_idx" ON "equipment"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "equipment_category_id_idx" ON "equipment"("category_id");

-- CreateIndex
CREATE INDEX "equipment_location_id_idx" ON "equipment"("location_id");

-- AddForeignKey
ALTER TABLE "equipment"
ADD CONSTRAINT "equipment_tenant_id_fkey"
FOREIGN KEY ("tenant_id")
REFERENCES "tenants"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment"
ADD CONSTRAINT "equipment_category_id_fkey"
FOREIGN KEY ("category_id")
REFERENCES "equipment_categories"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment"
ADD CONSTRAINT "equipment_location_id_fkey"
FOREIGN KEY ("location_id")
REFERENCES "locations"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
