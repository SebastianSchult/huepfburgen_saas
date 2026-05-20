-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('draft', 'requested', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- CreateTable
CREATE TABLE "bookings" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "customer_id" UUID NOT NULL,
    "booking_number" TEXT NOT NULL,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'draft',
    "subtotal_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "deposit_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "notes" TEXT,
    "created_by_user_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "bookings_date_range_chk" CHECK ("end_date" >= "start_date"),
    CONSTRAINT "bookings_subtotal_amount_non_negative_chk" CHECK ("subtotal_amount" >= 0),
    CONSTRAINT "bookings_deposit_amount_non_negative_chk" CHECK ("deposit_amount" >= 0),
    CONSTRAINT "bookings_total_amount_non_negative_chk" CHECK ("total_amount" >= 0)
);

-- CreateIndex
CREATE UNIQUE INDEX "bookings_tenant_id_booking_number_key" ON "bookings"("tenant_id", "booking_number");

-- CreateIndex
CREATE INDEX "bookings_tenant_id_idx" ON "bookings"("tenant_id");

-- CreateIndex
CREATE INDEX "bookings_tenant_id_status_idx" ON "bookings"("tenant_id", "status");

-- CreateIndex
CREATE INDEX "bookings_tenant_id_start_date_end_date_idx" ON "bookings"("tenant_id", "start_date", "end_date");

-- AddForeignKey
ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_tenant_id_fkey"
FOREIGN KEY ("tenant_id")
REFERENCES "tenants"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_customer_id_fkey"
FOREIGN KEY ("customer_id")
REFERENCES "customers"("id")
ON DELETE RESTRICT
ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings"
ADD CONSTRAINT "bookings_created_by_user_id_fkey"
FOREIGN KEY ("created_by_user_id")
REFERENCES "users"("id")
ON DELETE SET NULL
ON UPDATE CASCADE;
