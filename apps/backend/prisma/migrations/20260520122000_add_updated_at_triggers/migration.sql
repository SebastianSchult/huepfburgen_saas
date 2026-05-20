-- Keep updated_at in sync at DB level for all mutable MVP tables.
-- This complements Prisma's @updatedAt and also covers non-Prisma updates.
CREATE OR REPLACE FUNCTION set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_updated_at_tenants ON "tenants";
CREATE TRIGGER trg_set_updated_at_tenants
BEFORE UPDATE ON "tenants"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_users ON "users";
CREATE TRIGGER trg_set_updated_at_users
BEFORE UPDATE ON "users"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_locations ON "locations";
CREATE TRIGGER trg_set_updated_at_locations
BEFORE UPDATE ON "locations"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_equipment_categories ON "equipment_categories";
CREATE TRIGGER trg_set_updated_at_equipment_categories
BEFORE UPDATE ON "equipment_categories"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_equipment ON "equipment";
CREATE TRIGGER trg_set_updated_at_equipment
BEFORE UPDATE ON "equipment"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_customers ON "customers";
CREATE TRIGGER trg_set_updated_at_customers
BEFORE UPDATE ON "customers"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_bookings ON "bookings";
CREATE TRIGGER trg_set_updated_at_bookings
BEFORE UPDATE ON "bookings"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_booking_items ON "booking_items";
CREATE TRIGGER trg_set_updated_at_booking_items
BEFORE UPDATE ON "booking_items"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();

DROP TRIGGER IF EXISTS trg_set_updated_at_equipment_unavailability ON "equipment_unavailability";
CREATE TRIGGER trg_set_updated_at_equipment_unavailability
BEFORE UPDATE ON "equipment_unavailability"
FOR EACH ROW
EXECUTE FUNCTION set_updated_at_timestamp();
