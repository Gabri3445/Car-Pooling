/*
  Warnings:

  - Added the required column `date` to the `Trip` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Trip` DROP FOREIGN KEY `Trip_vehicleLicensePlate_fkey`;

-- AlterTable
ALTER TABLE `Trip` ADD COLUMN `date` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_vehicleLicensePlate_fkey` FOREIGN KEY (`vehicleLicensePlate`) REFERENCES `Vehicle`(`licensePlate`) ON DELETE CASCADE ON UPDATE CASCADE;
