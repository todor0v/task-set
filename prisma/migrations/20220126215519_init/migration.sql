-- CreateTable
CREATE TABLE "Todo" (
    "completed" BOOLEAN NOT NULL,
    "description" TEXT NOT NULL,
    "id" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "user" TEXT NOT NULL,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);
