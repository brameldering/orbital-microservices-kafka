/*
  Warnings:

  - You are about to drop the column `brand` on the `product_quantity` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `product_quantity` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `product_quantity` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "serial_number" DROP CONSTRAINT "serial_number_product_id_fkey";

-- AlterTable
ALTER TABLE "product_quantity" DROP COLUMN "brand",
DROP COLUMN "category",
DROP COLUMN "name";

-- CreateTable
CREATE TABLE "product" (
    "product_id" VARCHAR(14) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "category" VARCHAR(256) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "product_quantity" ADD CONSTRAINT "product_quantity_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serial_number" ADD CONSTRAINT "serial_number_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
