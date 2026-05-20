-- CreateTable
CREATE TABLE "booking_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "booking_items_quantity_positive_chk" CHECK ("quantity" > 0),
    CONSTRAINT "booking_items_unit_price_non_negative_chk" CHECK ("unit_price" >= 0),
    CONSTRAINT "booking_items_line_total_non_negative_chk" CHECK ("line_total" >= 0)
);

-- CreateIndex
CREATE INDEX "booking_items_tenant_id_idx" ON "booking_items"("tenant_id");

-- CreateIndex
CREATE INDEX "booking_items_booking_id_idx" ON "booking_items"("booking_id");

-- CreateIndex
CREATE INDEX "booking_items_equipment_id_idx" ON "booking_items"("equipment_id");

-- AddForeignKey
ALTER TABLE "booking_items"
ADD CONSTRAINT "booking_items_tenant_id_fkey"
FOREIGN KEY ("tenant_id")
REFERENCES "tenants"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items"
ADD CONSTRAINT "booking_items_booking_id_fkey"
FOREIGN KEY ("booking_id")
REFERENCES "bookings"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_items"
ADD CONSTRAINT "booking_items_equipment_id_fkey"
FOREIGN KEY ("equipment_id")
REFERENCES "equipment"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;
