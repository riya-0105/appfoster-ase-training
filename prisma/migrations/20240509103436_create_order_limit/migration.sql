-- CreateTable
CREATE TABLE "OrderLimit" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "limit_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "type_id" TEXT,
    "limit_quantity" TEXT,
    "limit_status" TEXT NOT NULL
);
