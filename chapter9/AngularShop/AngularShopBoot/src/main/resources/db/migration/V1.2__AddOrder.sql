-- 테이블 OrderStatuses
CREATE TABLE IF NOT EXISTS `OrderStatuses` (
  `id` int NOT NULL,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 Orders
CREATE TABLE IF NOT EXISTS `Orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `toName` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address1` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address2` varchar(512) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `totalPrice` decimal(65,30) NOT NULL,
  `userId` bigint NOT NULL,
  `createdDate` datetime(6) DEFAULT NULL,
  `modifiedDate` datetime(6) DEFAULT NULL,
  `orderStatusId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_Orders_UserId` (`userId`),
  KEY `IX_Orders_OrderStatusId` (`orderStatusId`),
  CONSTRAINT `FK_Orders_OrderStatuses_OrderStatusId` FOREIGN KEY (`orderStatusId`) REFERENCES `OrderStatuses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Orders_Users_UserId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 테이블 OrderItems
CREATE TABLE IF NOT EXISTS `OrderItems` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `qty` int NOT NULL,
  `price` decimal(65,30) NOT NULL,
  `productId` bigint NOT NULL,
  `orderId` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IX_OrderItems_OrderId` (`orderId`),
  KEY `IX_OrderItems_ProductId` (`productId`),
  CONSTRAINT `FK_OrderItems_Orders_OrderId` FOREIGN KEY (`orderId`) REFERENCES `Orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_OrderItems_Products_ProductId` FOREIGN KEY (`productId`) REFERENCES `Products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;