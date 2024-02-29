-- CreateTable
CREATE TABLE "api_access" (
    "microservice" VARCHAR(32) NOT NULL,
    "api_name" VARCHAR(32) NOT NULL,

    CONSTRAINT "api_access_pkey" PRIMARY KEY ("api_name")
);

-- CreateTable
CREATE TABLE "role" (
    "role" VARCHAR(32) NOT NULL,
    "role_display" VARCHAR(32) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("role")
);

-- CreateTable
CREATE TABLE "api_access_role" (
    "api_access_name" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,

    CONSTRAINT "api_access_role_pkey" PRIMARY KEY ("api_access_name","role_id")
);

-- CreateTable
CREATE TABLE "product_inventory" (
    "product_id" VARCHAR(14) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "category" VARCHAR(256) NOT NULL,

    CONSTRAINT "product_inventory_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "product_quantity" (
    "product_id" VARCHAR(14) NOT NULL,
    "quantity" BIGINT NOT NULL,

    CONSTRAINT "product_quantity_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "serial_number" (
    "product_id" VARCHAR(14) NOT NULL,
    "serial_number" VARCHAR(64) NOT NULL,
    "status" VARCHAR(16),

    CONSTRAINT "serial_number_pkey" PRIMARY KEY ("product_id","serial_number")
);

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_api_access_name_fkey" FOREIGN KEY ("api_access_name") REFERENCES "api_access"("api_name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_access_role" ADD CONSTRAINT "api_access_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("role") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_quantity" ADD CONSTRAINT "product_quantity_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_inventory"("product_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "serial_number" ADD CONSTRAINT "serial_number_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_inventory"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
