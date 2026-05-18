-- CreateEnum
CREATE TYPE "CustomerType" AS ENUM ('private', 'business');

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "type" "CustomerType" NOT NULL DEFAULT 'private',
    "company_name" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "house_number" TEXT,
    "postal_code" TEXT,
    "city" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "customers_private_name_required_chk"
      CHECK (
        "type" <> 'private'
        OR (
          "first_name" IS NOT NULL
          AND BTRIM("first_name") <> ''
          AND "last_name" IS NOT NULL
          AND BTRIM("last_name") <> ''
        )
      ),
    CONSTRAINT "customers_business_company_name_required_chk"
      CHECK (
        "type" <> 'business'
        OR (
          "company_name" IS NOT NULL
          AND BTRIM("company_name") <> ''
        )
      )
);

-- CreateIndex
CREATE INDEX "customers_tenant_id_idx" ON "customers"("tenant_id");

-- CreateIndex
CREATE INDEX "customers_tenant_id_type_idx" ON "customers"("tenant_id", "type");

-- CreateIndex
CREATE INDEX "customers_tenant_id_last_name_first_name_idx" ON "customers"("tenant_id", "last_name", "first_name");

-- CreateIndex
CREATE INDEX "customers_tenant_id_company_name_idx" ON "customers"("tenant_id", "company_name");

-- CreateIndex
CREATE INDEX "customers_tenant_id_email_idx" ON "customers"("tenant_id", "email");

-- AddForeignKey
ALTER TABLE "customers"
ADD CONSTRAINT "customers_tenant_id_fkey"
FOREIGN KEY ("tenant_id")
REFERENCES "tenants"("id")
ON DELETE CASCADE
ON UPDATE CASCADE;
