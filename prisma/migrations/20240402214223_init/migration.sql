-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('DRIVER', 'PASSENGER') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `surname` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `idCard` VARCHAR(191) NULL,
    `driverInfoId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_phoneNumber_key`(`phoneNumber`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_idCard_key`(`idCard`),
    UNIQUE INDEX `User_driverInfoId_key`(`driverInfoId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DriverInfo` (
    `id` VARCHAR(191) NOT NULL,
    `profilePic` LONGBLOB NOT NULL,
    `licenseNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `DriverInfo_licenseNumber_key`(`licenseNumber`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Vehicle` (
    `licensePlate` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `maxPass` INTEGER NOT NULL,
    `driverInfoId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`licensePlate`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `License` (
    `number` VARCHAR(191) NOT NULL,
    `expiration` DATETIME(3) NOT NULL,

    PRIMARY KEY (`number`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Trip` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `depCity` VARCHAR(191) NOT NULL,
    `arrCity` VARCHAR(191) NOT NULL,
    `depTime` VARCHAR(191) NOT NULL,
    `estArrTime` VARCHAR(191) NOT NULL,
    `cost` DECIMAL(65, 30) NOT NULL,
    `finished` BOOLEAN NOT NULL DEFAULT false,
    `note` TEXT NULL,
    `driverInfoId` VARCHAR(191) NOT NULL,
    `vehicleLicensePlate` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(191) NOT NULL,
    `star` INTEGER NOT NULL,
    `desc` TEXT NOT NULL,
    `FromUserId` VARCHAR(191) NOT NULL,
    `ToUserId` VARCHAR(191) NOT NULL,
    `tripId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_trips` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_trips_AB_unique`(`A`, `B`),
    INDEX `_trips_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_usersToAccept` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_usersToAccept_AB_unique`(`A`, `B`),
    INDEX `_usersToAccept_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_driverInfoId_fkey` FOREIGN KEY (`driverInfoId`) REFERENCES `DriverInfo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DriverInfo` ADD CONSTRAINT `DriverInfo_licenseNumber_fkey` FOREIGN KEY (`licenseNumber`) REFERENCES `License`(`number`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Vehicle` ADD CONSTRAINT `Vehicle_driverInfoId_fkey` FOREIGN KEY (`driverInfoId`) REFERENCES `DriverInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_vehicleLicensePlate_fkey` FOREIGN KEY (`vehicleLicensePlate`) REFERENCES `Vehicle`(`licensePlate`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Trip` ADD CONSTRAINT `Trip_driverInfoId_fkey` FOREIGN KEY (`driverInfoId`) REFERENCES `DriverInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_FromUserId_fkey` FOREIGN KEY (`FromUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_ToUserId_fkey` FOREIGN KEY (`ToUserId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_tripId_fkey` FOREIGN KEY (`tripId`) REFERENCES `Trip`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_trips` ADD CONSTRAINT `_trips_A_fkey` FOREIGN KEY (`A`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_trips` ADD CONSTRAINT `_trips_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_usersToAccept` ADD CONSTRAINT `_usersToAccept_A_fkey` FOREIGN KEY (`A`) REFERENCES `Trip`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_usersToAccept` ADD CONSTRAINT `_usersToAccept_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
