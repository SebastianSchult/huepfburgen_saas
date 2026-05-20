-- Create missing MVP tables if they were not materialized in prior migration branches.
CREATE TABLE IF NOT EXISTS "booking_items" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "unit_price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "line_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "booking_items_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "equipment_unavailability" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "reason" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "equipment_unavailability_pkey" PRIMARY KEY ("id")
);

-- Composite uniqueness to support tenant-safe foreign keys.
CREATE UNIQUE INDEX IF NOT EXISTS "users_tenant_id_id_key" ON "users"("tenant_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "locations_tenant_id_id_key" ON "locations"("tenant_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "equipment_categories_tenant_id_id_key" ON "equipment_categories"("tenant_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "equipment_tenant_id_id_key" ON "equipment"("tenant_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "customers_tenant_id_id_key" ON "customers"("tenant_id", "id");
CREATE UNIQUE INDEX IF NOT EXISTS "bookings_tenant_id_id_key" ON "bookings"("tenant_id", "id");

-- Query-path indexes for tenant/date/status-heavy access patterns.
CREATE INDEX IF NOT EXISTS "equipment_tenant_id_category_id_idx" ON "equipment"("tenant_id", "category_id");
CREATE INDEX IF NOT EXISTS "equipment_tenant_id_location_id_idx" ON "equipment"("tenant_id", "location_id");
CREATE INDEX IF NOT EXISTS "bookings_tenant_id_customer_id_idx" ON "bookings"("tenant_id", "customer_id");
CREATE INDEX IF NOT EXISTS "bookings_tenant_id_created_by_user_id_idx" ON "bookings"("tenant_id", "created_by_user_id");
CREATE INDEX IF NOT EXISTS "booking_items_tenant_id_idx" ON "booking_items"("tenant_id");
CREATE INDEX IF NOT EXISTS "booking_items_tenant_id_booking_id_idx" ON "booking_items"("tenant_id", "booking_id");
CREATE INDEX IF NOT EXISTS "booking_items_tenant_id_equipment_id_idx" ON "booking_items"("tenant_id", "equipment_id");
CREATE INDEX IF NOT EXISTS "equipment_unavailability_tenant_id_idx" ON "equipment_unavailability"("tenant_id");
CREATE INDEX IF NOT EXISTS "equipment_unavailability_tenant_id_start_date_end_date_idx" ON "equipment_unavailability"("tenant_id", "start_date", "end_date");
CREATE INDEX IF NOT EXISTS "equipment_unavailability_tenant_id_equipment_id_start_date__idx" ON "equipment_unavailability"("tenant_id", "equipment_id", "start_date", "end_date");
CREATE INDEX IF NOT EXISTS "equipment_unavailability_equipment_id_start_date_end_date_idx" ON "equipment_unavailability"("equipment_id", "start_date", "end_date");

-- Tenant-safe booking/customer relation.
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_customer_id_fkey";
ALTER TABLE "bookings" DROP CONSTRAINT IF EXISTS "bookings_tenant_id_customer_id_fkey";
ALTER TABLE "bookings"
  ADD CONSTRAINT "bookings_tenant_id_customer_id_fkey"
  FOREIGN KEY ("tenant_id", "customer_id")
  REFERENCES "customers"("tenant_id", "id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Ensure booking_items has all required FKs (handles fresh and existing DB states).
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_tenant_id_fkey";
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_booking_id_fkey";
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_equipment_id_fkey";
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_tenant_id_booking_id_fkey";
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_tenant_id_equipment_id_fkey";

ALTER TABLE "booking_items"
  ADD CONSTRAINT "booking_items_tenant_id_fkey"
  FOREIGN KEY ("tenant_id")
  REFERENCES "tenants"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "booking_items"
  ADD CONSTRAINT "booking_items_tenant_id_booking_id_fkey"
  FOREIGN KEY ("tenant_id", "booking_id")
  REFERENCES "bookings"("tenant_id", "id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "booking_items"
  ADD CONSTRAINT "booking_items_tenant_id_equipment_id_fkey"
  FOREIGN KEY ("tenant_id", "equipment_id")
  REFERENCES "equipment"("tenant_id", "id")
  ON DELETE RESTRICT
  ON UPDATE CASCADE;

-- Domain invariants for booking items.
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_quantity_positive_chk";
ALTER TABLE "booking_items" DROP CONSTRAINT IF EXISTS "booking_items_amounts_non_negative_chk";
ALTER TABLE "booking_items"
  ADD CONSTRAINT "booking_items_quantity_positive_chk"
  CHECK ("quantity" > 0);
ALTER TABLE "booking_items"
  ADD CONSTRAINT "booking_items_amounts_non_negative_chk"
  CHECK ("unit_price" >= 0 AND "line_total" >= 0);

-- Ensure equipment_unavailability has tenant-safe FK and date constraint.
ALTER TABLE "equipment_unavailability" DROP CONSTRAINT IF EXISTS "equipment_unavailability_tenant_id_fkey";
ALTER TABLE "equipment_unavailability" DROP CONSTRAINT IF EXISTS "equipment_unavailability_equipment_id_fkey";
ALTER TABLE "equipment_unavailability" DROP CONSTRAINT IF EXISTS "equipment_unavailability_tenant_id_equipment_id_fkey";

ALTER TABLE "equipment_unavailability"
  ADD CONSTRAINT "equipment_unavailability_tenant_id_fkey"
  FOREIGN KEY ("tenant_id")
  REFERENCES "tenants"("id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "equipment_unavailability"
  ADD CONSTRAINT "equipment_unavailability_tenant_id_equipment_id_fkey"
  FOREIGN KEY ("tenant_id", "equipment_id")
  REFERENCES "equipment"("tenant_id", "id")
  ON DELETE CASCADE
  ON UPDATE CASCADE;

ALTER TABLE "equipment_unavailability" DROP CONSTRAINT IF EXISTS "equipment_unavailability_date_range_chk";
ALTER TABLE "equipment_unavailability"
  ADD CONSTRAINT "equipment_unavailability_date_range_chk"
  CHECK ("end_date" >= "start_date");
