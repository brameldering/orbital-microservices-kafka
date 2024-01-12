/*
  Warnings:

  - You are about to drop the `_api_access_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_api_access_roles" DROP CONSTRAINT "_api_access_roles_A_fkey";

-- DropForeignKey
ALTER TABLE "_api_access_roles" DROP CONSTRAINT "_api_access_roles_B_fkey";

-- DropTable
DROP TABLE "_api_access_roles";

-- CreateTable
CREATE TABLE "api_access_role" (
    "api_name" TEXT NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "api_access_role_pkey" PRIMARY KEY ("api_name","role")
);

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_api_name_fkey" FOREIGN KEY ("api_name") REFERENCES "api_access"("api_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_role_fkey" FOREIGN KEY ("role") REFERENCES "role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;
