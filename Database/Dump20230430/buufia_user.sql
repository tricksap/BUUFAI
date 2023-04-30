CREATE DATABASE  IF NOT EXISTS `buufia` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `buufia`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: buufia
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(45) NOT NULL,
  `Firstname` varchar(45) NOT NULL,
  `Middlename` varchar(45) DEFAULT NULL,
  `Lastname` varchar(45) NOT NULL,
  `College` varchar(45) DEFAULT NULL,
  `Password` varchar(45) NOT NULL,
  `Verified` tinyint DEFAULT '0',
  `Gender` varchar(45) DEFAULT NULL,
  `Birthday` date DEFAULT NULL,
  `PhoneNumber` varchar(45) DEFAULT NULL,
  `Address` varchar(45) DEFAULT NULL,
  `Education` varchar(45) DEFAULT NULL,
  `Position` varchar(45) DEFAULT NULL,
  `Role` varchar(45) DEFAULT NULL,
  `Designation` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (6,'aa@gmail.com','q','a','s','CENG','x',1,'Male','1999-12-21','0909090909',NULL,NULL,NULL,'User',NULL),(7,'A@gmail.com','p','a','t','CS','a',1,'Male','1900-11-11','0101',NULL,NULL,NULL,NULL,NULL),(11,'qq@gmail.com','q','q','q','CENG','qq',1,'Male','1999-02-12','12345678',NULL,NULL,NULL,NULL,NULL),(12,'kk@gmail.com','kk','kkk','kk','CS','kk',1,'Male','1999-12-21','9191919191',NULL,NULL,NULL,NULL,NULL),(13,'user@gmail.com','user','user','user','CENG','user',0,'Male','1999-12-12','121212',NULL,NULL,NULL,'User',NULL),(14,'zz@gmail.com','zz','zz','zz','CN','zz',1,'Male','1999-02-21','09090909',NULL,NULL,NULL,'User',NULL),(15,'ll@gmail.com','ll','ll','ll','CIT','ll',1,'Male','1999-12-12','090909',NULL,NULL,NULL,'User',NULL),(16,'de@gmail.com','de','de','de','CENG','de',0,'Male','1999-02-12','12345',NULL,NULL,NULL,'User','de'),(17,'oo@gmail.com','oo','oo','oo','CIT','oo',1,'Male','1999-12-12','1210101',NULL,NULL,'oo','User','oo'),(18,'sad@gmail','sdasdas','asd','asd','CENG','qwe',0,NULL,NULL,NULL,NULL,NULL,'sad','User',NULL),(19,'sad@gmail','sdasdas','asd','asd','CENG','qwe',0,NULL,NULL,NULL,NULL,NULL,'sad','User',NULL),(20,'1@gmail.com','11111111','1111111','1111111111','CENG','11111111',0,NULL,NULL,NULL,NULL,NULL,'111','User',NULL),(21,'a@gmail.com','asd','sd','asd','CENG','asd',0,NULL,NULL,NULL,NULL,NULL,'asddsa','Admin',NULL),(22,'a@gmail.com','asd','sd','asd','CENG','asd',0,NULL,NULL,NULL,NULL,NULL,'asddsa','Admin',NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-04-30 18:04:53
