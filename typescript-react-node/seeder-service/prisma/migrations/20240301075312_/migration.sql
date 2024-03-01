/*
  Warnings:

  - The primary key for the `api_access_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `api_name` on the `api_access_role` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `api_access_role` table. All the data in the column will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `api_access_name` to the `api_access_role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `api_access_role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "api_access_role" DROP CONSTRAINT "api_access_role_api_name_fkey";

-- DropForeignKey
ALTER TABLE "api_access_role" DROP CONSTRAINT "api_access_role_role_fkey";

-- DropForeignKey
ALTER TABLE "product_quantity" DROP CONSTRAINT "product_quantity_product_id_fkey";

-- DropForeignKey
ALTER TABLE "serial_number" DROP CONSTRAINT "serial_number_product_id_fkey";

-- AlterTable
ALTER TABLE "api_access_role" DROP CONSTRAINT "api_access_role_pkey",
DROP COLUMN "api_name",
DROP COLUMN "role",
ADD COLUMN     "api_access_name" TEXT NOT NULL,
ADD COLUMN     "role_id" TEXT NOT NULL,
ADD CONSTRAINT "api_access_role_pkey" PRIMARY KEY ("api_access_name", "role_id");

-- DropTable
DROP TABLE "product";

-- CreateTable
CREATE TABLE "product_inventory" (
    "product_id" VARCHAR(14) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "category" VARCHAR(256) NOT NULL,

    CONSTRAINT "product_inventory_pkey" PRIMARY KEY ("product_id")
);

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_api_access_name_fkey" FOREIGN KEY ("api_access_name") REFERENCES "api_access"("api_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_quantity" ADD CONSTRAINT "product_quantity_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_inventory"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serial_number" ADD CONSTRAINT "serial_number_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_inventory"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
