-- CreateTable
CREATE TABLE "equipment_categories" (
    "id" UUID NOT NULL,
    "tenant_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "equipment_categories_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "equipment_categories_tenant_id_name_key" ON "equipment_categories"("tenant_id", "name");

-- CreateIndex
CREATE INDEX "equipment_categories_tenant_id_idx" ON "equipment_categories"("tenant_id");

-- AddForeignKey
ALTER TABLE "equipment_categories"
ADD CONSTRAINT "equipment_categories_tenant_id_fkey"
FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
