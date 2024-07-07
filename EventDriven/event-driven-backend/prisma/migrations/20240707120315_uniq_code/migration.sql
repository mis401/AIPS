/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Community` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Community_code_key" ON "Community"("code");
