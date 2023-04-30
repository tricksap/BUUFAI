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
-- Table structure for table `files`
--

DROP TABLE IF EXISTS `files`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `files` (
  `file_id` int NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) NOT NULL,
  `file_url` varchar(255) NOT NULL,
  `uploaded_by` int NOT NULL,
  `title` varchar(45) DEFAULT NULL,
  `content` text,
  `filescol` varchar(45) DEFAULT NULL,
  `date` datetime NOT NULL,
  PRIMARY KEY (`file_id`),
  UNIQUE KEY `file_id` (`file_id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `files_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `admin` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `files`
--

LOCK TABLES `files` WRITE;
/*!40000 ALTER TABLE `files` DISABLE KEYS */;
INSERT INTO `files` VALUES (60,'downloaded-book.pdf','1676596618812.pdf',1,'Title 1 ','Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam vitae dictum justo. Vivamus id tincidunt nisi. Donec malesuada justo eget erat faucibus ornare. Nullam nec tincidunt libero. Aenean sit amet blandit erat, vel posuere dui. Quisque ut egestas ipsum. Maecenas at tempus mi. Curabitur cursus eros eu viverra pharetra. Curabitur id auctor urna. Quisque in quam elementum, commodo risus at, vulputate odio. Sed iaculis metus sit amet felis suscipit tincidunt. Donec sit amet lectus quis ipsum gravida rutrum eget eu purus. Morbi odio ipsum, semper non nisi in, maximus dapibus velit. Vivamus sed tempor mi.\r\n\r\nSed at nisl posuere, finibus lectus suscipit, pellentesque diam. Suspendisse potenti. Duis consequat neque sit amet purus pellentesque euismod a dictum ante. Aliquam nec tincidunt lorem, vitae tincidunt dui. Vivamus venenatis rutrum blandit. Vivamus leo nulla, iaculis at fermentum sed, volutpat a erat. Maecenas at massa mauris. Donec viverra mi sed libero tincidunt, a tincidunt ante commodo. In fringilla eleifend mattis. Cras sed consequat nunc. Sed nec arcu eu ipsum tempus ultricies. Integer accumsan arcu nulla, ut gravida nisl pretium vel. Curabitur cursus nulla at efficitur efficitur.',NULL,'0000-00-00 00:00:00'),(61,'asd','asd',1,'dfsf','dsfds',NULL,'0000-00-00 00:00:00'),(62,'','',1,'fffff','gffff',NULL,'0000-00-00 00:00:00'),(63,'','',1,'title 2 ','qwqee',NULL,'0000-00-00 00:00:00'),(64,'Memberships (6).pdf','1678950649348.pdf',1,'sample with date','sadadadsadasd',NULL,'2023-03-16 15:10:49');
/*!40000 ALTER TABLE `files` ENABLE KEYS */;
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
