ALTER TABLE "orderProduct" DROP CONSTRAINT "orderProduct_orderID_orders_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "orderProduct" ADD CONSTRAINT "orderProduct_orderID_products_id_fk" FOREIGN KEY ("orderID") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "orders" DROP COLUMN IF EXISTS "paymentIntentID";