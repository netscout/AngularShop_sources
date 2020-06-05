-- Users 테이블
CREATE TABLE IF NOT EXISTS `Users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `userName` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `email` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `password` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `photoUrl` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Roles 테이블
CREATE TABLE IF NOT EXISTS `Roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UserRoles테이블
CREATE TABLE IF NOT EXISTS `UserRoles` (
  `userId` bigint NOT NULL,
  `roleId` bigint NOT NULL,
  PRIMARY KEY (`userId`,`roleId`),
  KEY `IX_UserRoles_RoleId` (`roleId`),
  CONSTRAINT `FK_UserRoles_Roles_RoleId` FOREIGN KEY (`roleId`) REFERENCES `Roles` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_UserRoles_Users_UserId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- UserLogins 테이블
CREATE TABLE IF NOT EXISTS `UserLogins` (
  `loginProvider` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `providerKey` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL UNIQUE,
  `userId` bigint NOT NULL,
  PRIMARY KEY (`loginProvider`,`providerKey`),
  KEY `IX_UserLogins_UserId` (`userId`),
  CONSTRAINT `FK_UserLogins_Users_UserId` FOREIGN KEY (`userId`) REFERENCES `Users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 관리자, 사용자 역할 추가
INSERT INTO Roles (NAME) VALUES ('ADMIN');
INSERT INTO Roles (NAME) VALUES ('USER');