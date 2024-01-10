/*
  Warnings:

  - The primary key for the `api_access` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `apiName` on the `api_access` table. All the data in the column will be lost.
  - You are about to drop the column `roleDisplay` on the `role` table. All the data in the column will be lost.
  - You are about to drop the `_ApiAccessRoles` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `api_name` to the `api_access` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_display` to the `role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ApiAccessRoles" DROP CONSTRAINT "_ApiAccessRoles_A_fkey";

-- DropForeignKey
ALTER TABLE "_ApiAccessRoles" DROP CONSTRAINT "_ApiAccessRoles_B_fkey";

-- AlterTable
ALTER TABLE "api_access" DROP CONSTRAINT "api_access_pkey",
DROP COLUMN "apiName",
ADD COLUMN     "api_name" VARCHAR(32) NOT NULL,
ADD CONSTRAINT "api_access_pkey" PRIMARY KEY ("api_name");

-- AlterTable
ALTER TABLE "role" DROP COLUMN "roleDisplay",
ADD COLUMN     "role_display" VARCHAR(32) NOT NULL;

-- DropTable
DROP TABLE "_ApiAccessRoles";

-- CreateTable
CREATE TABLE "_api_access_roles" (
    "A" VARCHAR(32) NOT NULL,
    "B" VARCHAR(32) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_api_access_roles_AB_unique" ON "_api_access_roles"("A", "B");

-- CreateIndex
CREATE INDEX "_api_access_roles_B_index" ON "_api_access_roles"("B");

-- AddForeignKey
ALTER TABLE "_api_access_roles" ADD CONSTRAINT "_api_access_roles_A_fkey" FOREIGN KEY ("A") REFERENCES "api_access"("api_name") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_api_access_roles" ADD CONSTRAINT "_api_access_roles_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("role") ON DELETE CASCADE ON UPDATE CASCADE;
