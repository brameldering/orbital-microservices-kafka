-- CreateTable
CREATE TABLE "api_access" (
    "microservice" VARCHAR(32) NOT NULL,
    "apiName" VARCHAR(32) NOT NULL,

    CONSTRAINT "api_access_pkey" PRIMARY KEY ("apiName")
);

-- CreateTable
CREATE TABLE "role" (
    "role" VARCHAR(32) NOT NULL,
    "roleDisplay" VARCHAR(32) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "_ApiAccessRoles" (
    "A" VARCHAR(32) NOT NULL,
    "B" VARCHAR(32) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ApiAccessRoles_AB_unique" ON "_ApiAccessRoles"("A", "B");

-- CreateIndex
CREATE INDEX "_ApiAccessRoles_B_index" ON "_ApiAccessRoles"("B");

-- AddForeignKey
ALTER TABLE "_ApiAccessRoles" ADD CONSTRAINT "_ApiAccessRoles_A_fkey" FOREIGN KEY ("A") REFERENCES "api_access"("apiName") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ApiAccessRoles" ADD CONSTRAINT "_ApiAccessRoles_B_fkey" FOREIGN KEY ("B") REFERENCES "role"("role") ON DELETE CASCADE ON UPDATE CASCADE;
