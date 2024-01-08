-- CreateTable
CREATE TABLE "product_quantity" (
    "product_id" VARCHAR(14) NOT NULL,
    "name" VARCHAR(256) NOT NULL,
    "brand" VARCHAR(256) NOT NULL,
    "category" VARCHAR(256) NOT NULL,
    "quantity" BIGINT NOT NULL,

    CONSTRAINT "product_quantity_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "serial_number" (
    "product_id" VARCHAR(14) NOT NULL,
    "serial_number" VARCHAR(64) NOT NULL,

    CONSTRAINT "serial_number_pkey" PRIMARY KEY ("product_id","serial_number")
);

-- AddForeignKey
ALTER TABLE "serial_number" ADD CONSTRAINT "serial_number_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_quantity"("product_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
