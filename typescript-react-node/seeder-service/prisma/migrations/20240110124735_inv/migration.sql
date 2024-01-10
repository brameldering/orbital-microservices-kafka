/*
  Warnings:

  - You are about to drop the column `role_display` on the `role` table. All the data in the column will be lost.
  - Added the required column `roleDisplay` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "role" DROP COLUMN "role_display",
ADD COLUMN     "roleDisplay" VARCHAR(32) NOT NULL;
