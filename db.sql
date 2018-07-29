-- MySQL dump 10.13  Distrib 5.7.20, for osx10.13 (x86_64)
--
-- Host: localhost    Database: blog
-- ------------------------------------------------------
-- Server version	5.7.20

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `article`
--

DROP TABLE IF EXISTS `article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `article` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '文章ID，自增',
  `title` char(50) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '标题',
  `slug` char(100) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '缩略名',
  `description` longtext COLLATE utf8_unicode_ci COMMENT '描述',
  `keywords` text COLLATE utf8_unicode_ci COMMENT '关键词',
  `category_id` varchar(16) COLLATE utf8_unicode_ci DEFAULT '''''' COMMENT '类别ID',
  `content` longtext COLLATE utf8_unicode_ci COMMENT '正文',
  `status` tinyint(1) DEFAULT '0' COMMENT '发布状态 0 草稿 1 已发布',
  `view_count` int(11) DEFAULT '0' COMMENT '访问统计',
  `addtime` int(10) DEFAULT NULL COMMENT '添加时间',
  `modtime` int(10) DEFAULT NULL COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `article`
--

LOCK TABLES `article` WRITE;
/*!40000 ALTER TABLE `article` DISABLE KEYS */;
INSERT INTO `article` VALUES (1,'深入前端 Promise 异步编程','async-programe-with-promise',NULL,'深入浅出, Vue.js, 123m，沙发电视\n',NULL,NULL,0,0,1514739661,1532858740),(2,'canvas绘图从入门到放弃啦啦啦','canvas-painting-course','canvas绘图从入门到放弃啦啦啦canvas绘图从入门到放弃啦啦啦','canvas，course','6','## canvas \n入门到放弃\n### 啦啦啦\n12345\n嘿嘿嘿## canvas \n入门到放弃\n### 啦啦啦\n12345\n嘿嘿嘿## canvas \n入门到放弃\n### 啦啦啦\n12345\n嘿嘿嘿## canvas \n入门到放弃\n### 啦啦啦\n12345\n嘿嘿嘿',1,10,1527786061,1532882774),(3,'Nginx配置与SSL','nginx-config-with-ssl','lallala',NULL,'tag3','lalallafsfsaflalallafsfsaflalallafsfsaflalallafsfsaf',0,111,1532674850,NULL),(4,'new post','new-post','asdfsadfsdf','new ,post, post new ','0','sdfsadfs',0,0,NULL,NULL),(5,'new post','new-post','asdfsadfsdf','new ,post, post new ','0','sdfsadfs',0,0,NULL,NULL),(6,'new post','new-post','asdfsadfsdf','new ,post, post new ','0','sdfsadfs',0,0,NULL,NULL),(7,'new post','new-post','asdfsadfsdf','new ,post, post new ','0','sdfsadfs',0,0,NULL,NULL),(8,'new post','new-post','asdfsadfsdf','new ,post, post new ','0','sdfsadfs',0,0,1532881581,NULL);
/*!40000 ALTER TABLE `article` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` int(16) NOT NULL AUTO_INCREMENT COMMENT '类型ID',
  `name` char(20) COLLATE utf8_unicode_ci DEFAULT NULL COMMENT '类型名',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (0,'JavaScript'),(1,'CSS'),(2,'HTML'),(3,'Node.Js'),(4,'Vue.Js'),(5,'React.Js'),(6,'Git'),(7,'IDE/Editor'),(8,'CI/CD');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` int(16) unsigned NOT NULL AUTO_INCREMENT,
  `email` char(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `username` char(30) COLLATE utf8_unicode_ci DEFAULT '''''',
  `password` char(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `addtime` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (24,'better_li@live.com','Moonless','1234','2018-01-24 11:44:10');
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

-- Dump completed on 2018-07-30  0:56:46
