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
-- Table structure for table `meeting_minutes`
--

DROP TABLE IF EXISTS `meeting_minutes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `meeting_minutes` (
  `meeting_id` int NOT NULL AUTO_INCREMENT,
  `meeting_date` datetime NOT NULL,
  `minutes` text NOT NULL,
  `uploaded_by` int NOT NULL,
  `title` varchar(45) NOT NULL,
  `file_name` varchar(45) DEFAULT NULL,
  `file_url` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`meeting_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `meeting_minutes_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `admin` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `meeting_minutes`
--

LOCK TABLES `meeting_minutes` WRITE;
/*!40000 ALTER TABLE `meeting_minutes` DISABLE KEYS */;
INSERT INTO `meeting_minutes` VALUES (13,'2023-02-22 10:04:00','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras non lectus eu justo eleifend pharetra vitae id felis. Fusce quis arcu vulputate lacus rutrum aliquam. Fusce purus augue, tempor vitae felis ut, semper congue urna. Maecenas accumsan vulputate mattis. Aliquam a leo accumsan, commodo dolor ac, sodales dolor. Sed cursus orci sit amet aliquam fermentum. Nam malesuada enim in neque vestibulum pulvinar eget in nisl. Pellentesque faucibus est eget leo varius mattis. Nam et libero sit amet neque viverra ullamcorper in nec quam. In justo turpis, lacinia vitae hendrerit sed, scelerisque consequat risus. Sed non dui sit amet risus faucibus scelerisque et eu tortor. Nam sollicitudin fringilla semper. Quisque id dolor non urna dictum imperdiet eget vel nulla. Vivamus non feugiat urna, id efficitur ligula. Etiam eu lacinia turpis. Quisque laoreet felis sed nulla ullamcorper bibendum.\r\n\r\nDonec auctor augue quis tortor ornare vehicula. Nulla facilisi. Aliquam feugiat pulvinar vehicula. Vestibulum sollicitudin dapibus velit nec scelerisque. Ut et turpis lacinia, tincidunt turpis sit amet, gravida neque. Phasellus eget velit vel augue posuere dapibus a vel erat. Maecenas vitae nunc viverra, pellentesque sapien in, feugiat felis. Aliquam auctor porta vulputate. Etiam congue pulvinar tempus. Pellentesque mauris orci, volutpat in scelerisque quis, volutpat in odio. Nam semper scelerisque turpis, eget laoreet nibh ornare at. Proin mattis cursus diam vel egestas.\r\n\r\nNullam fringilla lacinia justo, sed aliquet enim porta nec. Ut tincidunt purus a ligula ornare, vitae dictum leo imperdiet. Maecenas ornare ornare ante non consectetur. Donec quis elementum tellus, porttitor tincidunt lorem. Duis imperdiet sodales tellus. Donec vel lacinia ipsum. Phasellus accumsan dui vitae facilisis iaculis. Pellentesque vitae convallis purus, sit amet facilisis risus. Maecenas malesuada mi sed elit condimentum, vitae consequat urna sodales. Fusce volutpat molestie iaculis. Mauris vestibulum scelerisque ex in ultrices. Sed eget felis porttitor quam consectetur venenatis. Sed porttitor lacus ex, a ornare enim maximus non. Vivamus sollicitudin ornare mi non ullamcorper.',1,'Minutes Entry 1 ','downloaded-book.pdf','1677031512852.pdf'),(14,'2023-02-22 11:21:00','asasasdasdasd',1,'sdaad','',''),(15,'2023-02-22 11:21:00','asasasdasdasd',1,'sdaad','','');
/*!40000 ALTER TABLE `meeting_minutes` ENABLE KEYS */;
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
