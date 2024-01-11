/*
  Warnings:

  - You are about to drop the column `roleDisplay` on the `role` table. All the data in the column will be lost.
  - Added the required column `role_display` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "role" DROP COLUMN "roleDisplay",
ADD COLUMN     "role_display" VARCHAR(32) NOT NULL;
