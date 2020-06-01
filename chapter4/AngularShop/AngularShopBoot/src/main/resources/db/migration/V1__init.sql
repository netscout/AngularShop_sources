-- 테이블 Categories
CREATE TABLE IF NOT EXISTS `Categories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `parentId` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Categories_ParentId` (`parentId`),
  CONSTRAINT `FK_Categories_Categories_ParentId` FOREIGN KEY (`parentId`) REFERENCES `Categories` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 Makers
CREATE TABLE IF NOT EXISTS `Makers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 Products
CREATE TABLE IF NOT EXISTS `Products` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `description` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `makerId` bigint NOT NULL,
  `tags` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `price` decimal(65,30) NOT NULL,
  `discount` int DEFAULT NULL,
  `stockCount` int NOT NULL,
  `isVisible` tinyint(1) NOT NULL,
  `createdDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Products_MakerId` (`makerId`),
  CONSTRAINT `FK_Products_Makers_MakerId` FOREIGN KEY (`makerId`) REFERENCES `Makers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 ProductCategories
CREATE TABLE IF NOT EXISTS `ProductCategories` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `productId` bigint NOT NULL,
  `categoryId` bigint NOT NULL,
  `sortOrder` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ProductCategories_CategoryId` (`categoryId`),
  KEY `IX_ProductCategories_ProductId` (`productId`),
  CONSTRAINT `FK_ProductCategories_Categories_CategoryId` FOREIGN KEY (`categoryId`) REFERENCES `Categories` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ProductCategories_Products_ProductId` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- 테이블 ProductImages
CREATE TABLE IF NOT EXISTS `ProductImages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `photoUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `productId` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_ProductImages_ProductId` (`productId`),
  CONSTRAINT `FK_ProductImages_Products_ProductId` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
