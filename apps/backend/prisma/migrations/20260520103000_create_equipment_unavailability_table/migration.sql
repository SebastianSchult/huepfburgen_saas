-- CreateTable
CREATE TABLE "equipment_unavailability" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_unavailability_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "equipment_unavailability_date_range_chk" CHECK ("end_date" >= "start_date")
);

-- CreateIndex
CREATE INDEX "equipment_unavailability_tenant_id_idx"
ON "equipment_unavailability"("tenant_id");

-- CreateIndex
CREATE INDEX "equipment_unavailability_tenant_id_equipment_id_start_date_end_date_idx"
ON "equipment_unavailability"("tenant_id", "equipment_id", "start_date", "end_date");

-- AddForeignKey
ALTER TABLE "equipment_unavailability"
ADD CONSTRAINT "equipment_unavailability_tenant_id_fkey"
FOREIGN KEY ("tenant_id")
REFERENCES "tenants"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_unavailability"
ADD CONSTRAINT "equipment_unavailability_equipment_id_fkey"
FOREIGN KEY ("equipment_id")
REFERENCES "equipment"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
