ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_orderID_products_id_fk";
--> statement-breakpoint
ALTER TABLE "orderProduct" DROP COLUMN IF EXISTS "orderID";