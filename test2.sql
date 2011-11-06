-- phpMyAdmin SQL Dump
-- version 3.4.5
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Oct 19, 2011 at 07:43 PM
-- Server version: 5.1.58
-- PHP Version: 5.3.8

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `test2`
--

-- --------------------------------------------------------

--
-- Table structure for table `testmatches`
--

CREATE TABLE IF NOT EXISTS `testmatches` (
  `series` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `venue` varchar(255) NOT NULL,
  `match` varchar(255) NOT NULL,
  `result` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `testmatches`
--

INSERT INTO `testmatches` (`series`, `date`, `venue`, `match`, `result`) VALUES
('1982-1983 IND v SRL ', '09-17-1982', 'Chidambaram Stadium ', 'IND v SRL ', 'Match Drawn '),
('1982-1983 PAK v IND ', '10-24-1984', 'Gaddafi Stadium ', 'PAK v IND ', 'Match Drawn '),
('1982-1983 PAK v IND ', '10-24-1984', 'National Stadium ', 'PAK v IND ', 'Pakistan '),
('1982-1983 PAK v IND ', '10-24-1984', 'Iqbal Stadium ', 'PAK v IND ', 'Pakistan '),
('1982-1983 PAK v IND ', '10-24-1984', 'Niaz Stadium ', 'PAK v IND ', 'Pakistan '),
('1982-1983 PAK v IND ', '10-24-1984', 'Gaddafi Stadium ', 'PAK v IND ', 'Match Drawn '),
('1982-1983 PAK v IND ', '10-24-1984', 'National Stadium ', 'PAK v IND ', 'Match Drawn '),
('1982-1983 WIN v IND ', '04-28-1983', 'Sabina Park ', 'WIN v IND ', 'West Indies '),
('1982-1983 WIN v IND ', '04-28-1983', 'Queen''s Park ', 'WIN v IND ', 'Match Drawn '),
('1982-1983 WIN v IND ', '04-28-1983', 'Bourda ', 'WIN v IND ', 'Match Drawn '),
('1982-1983 WIN v IND ', '04-28-1983', 'Kensington Oval ', 'WIN v IND ', 'West Indies '),
('1982-1983 WIN v IND ', '04-28-1983', 'Antigua Rec Ground ', 'WIN v IND ', 'Match Drawn '),
('1983-1984 IND v PAK ', '10-05-1983', 'Chinnaswamy Stadium ', 'IND v PAK ', 'Match Drawn '),
('1983-1984 IND v PAK ', '10-05-1983', 'Gandhi Stadium ', 'IND v PAK ', 'Match Drawn '),
('1983-1984 IND v PAK ', '10-05-1983', 'Vidarbha Cricket Gr ', 'IND v PAK ', 'Match Drawn '),
('1983-1984 IND v WIN ', '11-28-1984', 'Green Park ', 'IND v WIN ', 'West Indies '),
('1983-1984 IND v WIN ', '11-28-1984', 'Feroz Shah Kotla ', 'IND v WIN ', 'Match Drawn '),
('1983-1984 IND v WIN ', '11-28-1984', 'Sardar Patel Stadium ', 'IND v WIN ', 'West Indies '),
('1983-1984 IND v WIN ', '11-28-1984', 'Wankhede Stadium ', 'IND v WIN ', 'Match Drawn '),
('1983-1984 IND v WIN ', '11-28-1984', 'Eden Gardens ', 'IND v WIN ', 'West Indies '),
('1983-1984 IND v WIN ', '11-28-1984', 'Chidambaram Stadium ', 'IND v WIN ', 'Match Drawn '),
('1984-1985 PAK v IND ', '10-24-1984', 'Gaddafi Stadium ', 'PAK v IND ', 'Match Drawn '),
('1984-1985 PAK v IND ', '10-24-1984', 'Iqbal Stadium ', 'PAK v IND ', 'Match Drawn '),
('1984-1985 IND v ENG ', '11-28-1984', 'Wankhede Stadium ', 'IND v WIN ', 'India ');

-- --------------------------------------------------------

--
-- Table structure for table `venue`
--

CREATE TABLE IF NOT EXISTS `venue` (
  `id` int(20) NOT NULL AUTO_INCREMENT,
  `ground_name` varchar(255) NOT NULL,
  `city` varchar(255) NOT NULL,
  `country` varchar(255) NOT NULL,
  `num_of_tests` int(20) DEFAULT NULL,
  `num_of_odis` int(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=196 ;

--
-- Dumping data for table `venue`
--

INSERT INTO `venue` (`id`, `ground_name`, `city`, `country`, `num_of_tests`, `num_of_odis`) VALUES
(1, 'AC-VDCA Stadium', ' Visakhapatnam', ' India', 0, 3),
(2, 'Adelaide Oval', ' Adelaide', ' Australia', 69, 71),
(3, 'Aga Khan Club Ground', ' Nairobi', ' Kenya', 0, 4),
(4, 'Albion Sports Complex', ' Albion, Berbice, Guyana', ' West Indies', 0, 5),
(5, 'AMI Stadium', ' Christchurch', ' New Zealand', 40, 48),
(6, 'Antigua Recreation Ground', ' St. John''s, Antigua', ' West Indies', 22, 11),
(7, 'Arbab Niaz Stadium', ' Peshawar', ' Pakistan', 6, 15),
(8, 'Arnos Vale Ground', ' Kingstown, St. Vincent', ' West Indies', 2, 20),
(9, 'Asgiriya Stadium', ' Kandy', ' Sri Lanka', 21, 6),
(10, 'Ayub National Stadium', ' Quetta', ' Pakistan', 0, 2),
(11, 'Bagh-e-Jinnah', ' Lahore', ' Pakistan', 3, 0),
(12, 'Bahawal Stadium', ' Bahawalpur', ' Pakistan', 1, 0),
(13, 'Bangabandhu National Stadium', ' Dhaka (Dacca)', ' Bangladesh', 17, 58),
(14, 'Barabati Stadium', ' Cuttack', ' India', 2, 15),
(15, 'Barkatullah Khan Stadium', ' Jodhpur', ' India', 0, 2),
(16, 'Basin Reserve', ' Wellington', ' New Zealand', 52, 26),
(17, 'Beausejour Cricket Ground', ' Gros Islet, St Lucia', ' West Indies', 3, 21),
(18, 'Bellerive Oval', ' Hobart', ' Australia', 9, 28),
(19, 'Berri Oval', ' Berri', ' Australia', 0, 1),
(20, 'Boland Bank Park', ' Paarl', ' South Africa', 0, 8),
(21, 'Bourda', ' Georgetown, Guyana', ' West Indies', 30, 11),
(22, 'Brabourne Stadium', ' Mumbai (Bombay)', ' India', 18, 8),
(23, 'Bramall Lane', ' Sheffield', ' England', 1, 0),
(24, 'Brisbane Cricket Ground', ' Brisbane', ' Australia', 53, 67),
(25, 'Buffalo Park', ' East London', ' South Africa', 1, 19),
(26, 'Bughti Stadium', ' Quetta', ' Pakistan', 0, 1),
(27, 'Bulawayo Athletic Club', ' Bulawayo', ' Zimbabwe', 1, 1),
(28, 'Cambusdoon New Ground', ' Ayr', ' Scotland', 0, 6),
(29, 'Captain Roop Singh Stadium', ' Gwalior', ' India', 0, 12),
(30, 'Carisbrook', ' Dunedin', ' New Zealand', 10, 21),
(31, 'Cazaly''s Stadium', ' Cairns', ' Australia', 2, 2),
(32, 'Central Broward Regional Park', ' Lauderhill, Florida', ' United States', 0, 0),
(33, 'Chelmsford County Ground', ' Chelmsford', ' England', 0, 3),
(34, 'City Oval', ' Pietermaritzburg', ' South Africa', 0, 2),
(35, 'Civil Service Cricket Club', ' Belfast', ' Ireland', 0, 16),
(36, 'Clontarf Cricket Club Ground', ' Dublin', ' Ireland', 0, 16),
(37, 'Colombo Cricket Club Ground', ' Colombo', ' Sri Lanka', 3, 0),
(38, 'Cricket, Skating & Curling Club', ' Toronto', ' Canada', 0, 30),
(39, 'De Beers Diamond Oval', ' Kimberley', ' South Africa', 0, 10),
(40, 'Defence Housing Authority Stadium', ' Karachi', ' Pakistan', 1, 0),
(41, 'Derby County Ground', ' Derby', ' England', 0, 2),
(42, 'Devonport Oval', ' Devonport', ' Australia', 0, 1),
(43, 'Dr D Y Patil Sports Academy', ' Mumbai', ' India', 0, 0),
(44, 'Dubai International Cricket Stadium', ' Dubai', ' United Arab Emirates', 0, 5),
(45, 'Eastern Oval', ' Ballarat', ' Australia', 0, 1),
(46, 'Eden Gardens', ' Kolkata', ' India', 36, 25),
(47, 'Eden Park', ' Auckland', ' New Zealand', 47, 63),
(48, 'Edgbaston', ' Birmingham', ' England', 46, 43),
(49, 'Ellis Park', ' Johannesburg', ' South Africa', 6, 0),
(50, 'Exhibition Ground', ' Brisbane', ' Australia', 2, 0),
(51, 'Feroz Shah Kotla', ' Delhi', ' India', 30, 20),
(52, 'Gaddafi Stadium', ' Lahore', ' Pakistan', 40, 58),
(53, 'Galle International Stadium', ' Galle', ' Sri Lanka', 18, 4),
(54, 'Gandhi Sports Complex Ground', ' Amritsar', ' India', 0, 2),
(55, 'Gandhi Stadium', ' Jalandhar (Jullundur)', ' India', 1, 3),
(56, 'Grace Road', ' Leicester', ' England', 0, 3),
(57, 'Grange Cricket Club', ' Edinburgh', ' Scotland', 0, 8),
(58, 'Green Park', ' Kanpur', ' India', 21, 12),
(59, 'Gymkhana Club Ground', ' Nairobi', ' Kenya', 0, 63),
(60, 'Gymkhana Ground', ' Mumbai (Bombay)', ' India', 1, 0),
(61, 'Harare Sports Club', ' Harare', ' Zimbabwe', 27, 100),
(62, 'Harrup Park', ' Mackay', ' Australia', 0, 1),
(63, 'Hazelaarweg', ' Rotterdam', ' Netherlands', 0, 10),
(64, 'Headingley', ' Leeds', ' England', 70, 35),
(65, 'Hove County Ground', ' Hove', ' England', 0, 1),
(66, 'Ibn-e-Qasim Bagh Stadium', ' Multan', ' Pakistan', 1, 6),
(67, 'Indira Gandhi Stadium', ' Vijayawada', ' India', 0, 1),
(68, 'Indira Priyadarshini Stadium', ' Visakhapatnam', ' India', 0, 5),
(69, 'Iqbal Stadium', ' Faisalabad (Lyallpur)', ' Pakistan', 24, 16),
(70, 'Jaffrey Sports Club Ground', ' Nairobi', ' Kenya', 0, 5),
(71, 'Jawaharlal Nehru Stadium (Delhi)', ' New Delhi, Delhi', ' India', 0, 2),
(72, 'Jinnah Stadium (Gujwranwala)', ' Gujwranwala', ' Pakistan', 1, 11),
(73, 'Jinnah Stadium (Sialkot)', ' Sialkot', ' Pakistan', 4, 9),
(74, 'Kallang Ground', ' Singapore', ' Singapore', 0, 9),
(75, 'Keenan Stadium', ' Jamshedpur', ' India', 0, 10),
(76, 'Kensington Oval', ' Bridgetown, Barbados', ' West Indies', 47, 30),
(77, 'Khan Shaheb Osman Ali Stadium', ' Fatullah', ' Bangladesh', 1, 4),
(78, 'Kingsmead', ' Durban', ' South Africa', 38, 36),
(79, 'Kinrara Academy Oval', ' Kuala Lumpur', ' Malaysia', 0, 7),
(80, 'Kwekwe Sports Club', ' Kwekwe', ' Zimbabwe', 0, 1),
(81, 'Lal Bahadur Shastri Stadium', ' Hyderabad (Deccan)', ' India', 3, 14),
(82, 'Lavington Sports Oval', ' Albury', ' Australia', 0, 1),
(83, 'Lord''s', ' London', ' England', 123, 52),
(84, 'Lord''s (SAF)', ' Durban', ' South Africa', 4, 0),
(85, 'M A Aziz Stadium', ' Chittagong', ' Bangladesh', 8, 10),
(86, 'M.A. Chidambaram Stadium', ' Chennai (Madras)', ' India', 30, 17),
(87, 'M.Chinnaswamy Stadium', ' Bengaluru, Bangalore', ' India', 19, 23),
(88, 'Madhavrao Scindia Cricket Ground', ' Rajkot', ' India', 0, 12),
(89, 'Maharani Ausharaje Trust Cricket Grd', ' Indore', ' India', 0, 2),
(90, 'Mahinda Rajapaksha International', ' Hambantota', ' Sri Lanka', 0, 4),
(91, 'Mannofield Park', ' Aberdeen', ' Scotland', 0, 8),
(92, 'Manuka Oval', ' Canberra', ' Australia', 0, 2),
(93, 'Maple Leaf North - West Ground', ' King City, Ontario', ' Canada', 0, 10),
(94, 'Marrara Cricket Ground', ' Darwin', ' Australia', 2, 4),
(95, 'McLean Park', ' Napier', ' New Zealand', 9, 34),
(96, 'Melbourne Cricket Ground', ' Melbourne', ' Australia', 103, 132),
(97, 'Mindoo Philip Park', ' Castries, St. Lucia', ' West Indies', 0, 2),
(98, 'Moin-ul Haq Stadium', ' Patna', ' India', 0, 3),
(99, 'Molana Azad Stadium', ' Jammu', ' India', 0, 0),
(100, 'Mombasa Sports Ground', ' Mombasa', ' Kenya', 0, 11),
(101, 'Moses Mabhida Stadium', ' Durban', ' South Africa', 0, 0),
(102, 'Moti Bagh Stadium', ' Vadodara (Baroda)', ' India', 0, 3),
(103, 'Multan Cricket Stadium', ' Multan', ' Pakistan', 5, 7),
(104, 'Nahar Singh (Mayur) Stadium', ' Faridabad', ' India', 0, 8),
(105, 'Nairobi Club Ground', ' Nairobi', ' Kenya', 0, 1),
(106, 'National Cricket Stadium', ' St. George''s, Grenada', ' West Indies', 2, 16),
(107, 'National Cricket Stadium', ' Tangier', ' Morocco', 0, 7),
(108, 'National Stadium', ' Karachi', ' Pakistan', 41, 46),
(109, 'Nehru Stadium (Chennai)', ' Chennai (Madras)', ' India', 9, 0),
(110, 'Nehru Stadium (Guwahati)', ' Guwahati (Gauhati)', ' India', 0, 14),
(111, 'Nehru Stadium (Indore)', ' Indore', ' India', 0, 9),
(112, 'Nehru Stadium (Kochi)', ' Kochi', ' India', 0, 6),
(113, 'Nehru Stadium (Margao)', ' Margao', ' India', 0, 7),
(114, 'Nehru Stadium (Poona)', ' Poona (Pune)', ' India', 0, 11),
(115, 'Nevill Ground', ' Tunbridge Wells', ' England', 0, 1),
(116, 'New Road', ' Worcester', ' England', 0, 3),
(117, 'Newlands', ' Cape Town', ' South Africa', 46, 35),
(118, 'Niaz Stadium', ' Hyderabad (Sind)', ' Pakistan', 5, 7),
(119, 'North Marine Road Ground', ' Scarborough', ' England', 0, 2),
(120, 'North Tasmania CA Ground', ' Launceston', ' Australia', 0, 1),
(121, 'Northampton County Ground', ' Northampton', ' England', 0, 2),
(122, 'Old Trafford', ' Manchester', ' England', 74, 39),
(123, 'Old Wanderers', ' Johannesburg', ' South Africa', 22, 0),
(124, 'OUTsurance Oval', ' Bloemfontein', ' South Africa', 4, 25),
(125, 'Owen Delaney Park', ' Taupo', ' New Zealand', 0, 3),
(126, 'P Sara Oval', ' Colombo', ' Sri Lanka', 15, 12),
(127, 'Padang Cricket Ground', ' Singapore', ' Singapore', 0, 5),
(128, 'Pallekele International Stadium', ' Pallekele, Kandy', ' Sri Lanka', 2, 4),
(129, 'Peshawar Club Ground', ' Peshwar', ' Pakistan', 1, 0),
(130, 'Pindi Club Ground', ' Rawalpindi', ' Pakistan', 1, 2),
(131, 'Providence Stadium', ' Providence, Guyana', ' West Indies', 2, 11),
(132, 'Pukekura Park', ' New Plymouth', ' New Zealand', 0, 1),
(133, 'Punjab Cricket Association Stadium', ' Mohali, Chandigarh', ' India', 10, 19),
(134, 'Queen''s Park (Old)', ' St. George''s, Grenada', ' West Indies', 0, 1),
(135, 'Queen''s Park Oval', ' Port-Of-Spain, Trinidad', ' West Indies', 57, 62),
(136, 'Queens Sports Club', ' Bulawayo', ' Zimbabwe', 18, 48),
(137, 'Queenstown Events Centre', ' Queenstown', ' New Zealand', 0, 8),
(138, 'R. Premadasa Stadium', ' Colombo', ' Sri Lanka', 7, 105),
(139, 'Rajiv Gandhi International Stadium', ' Hyderabad', ' India', 1, 4),
(140, 'Rangiri Dambulla International Stad.', ' Dambulla', ' Sri Lanka', 0, 43),
(141, 'Rawalpindi Cricket Stadium', ' Rawalpindi', ' Pakistan', 8, 21),
(142, 'Reliance Stadium', ' Vadodara', ' India', 0, 10),
(143, 'Riverside Ground', ' Chester-Le-Street', ' England', 4, 12),
(144, 'Royal & Sun Alliance County Ground', ' Bristol', ' England', 0, 13),
(145, 'Ruaraka Sports Club Ground', ' Nairobi', ' Kenya', 0, 5),
(146, 'Sabina Park', ' Kingston, Jamaica', ' West Indies', 45, 30),
(147, 'Sardar Patel Stadium', ' Ahmedabad', ' India', 11, 21),
(148, 'Sardar Vallabhai Patel Stadium', ' Ahmedabad', ' India', 0, 1),
(149, 'Sawai Mansingh Stadium', ' Jaipur', ' India', 1, 18),
(150, 'Sector 16 Stadium', ' Chandigarh', ' India', 1, 5),
(151, 'Seddon Park', ' Hamilton', ' New Zealand', 18, 17),
(152, 'Senwes Park', ' Potchefstroom', ' South Africa', 1, 16),
(153, 'Shaheed Chandu Stadium', ' Bogra', ' Bangladesh', 1, 5),
(154, 'Sharjah CA Stadium', ' Sharjah', ' United Arab Emirates', 4, 200),
(155, 'Sheik Zayed Stadium', ' Abu Dhabi', ' United Arab Emirates', 0, 16),
(156, 'Sheikh Abu Naser Stadium', ' Khulna', ' Bangladesh', 0, 2),
(157, 'Sheikhupura Stadium', ' Sheikhupura', ' Pakistan', 2, 2),
(158, 'Shere Bangla National Stadium', ' Mirpur, Dhaka', ' Bangladesh', 6, 53),
(159, 'Sher-I-Kashmir Stadium', ' Srinagar', ' India', 0, 2),
(160, 'Simba Union Ground', ' Nairobi', ' Kenya', 0, 1),
(161, 'Sinhalese Sports Club Ground', ' Colombo', ' Sri Lanka', 35, 59),
(162, 'Sir Vivian Richards Stadium', ' North Sound, Antigua', ' West Indies', 2, 10),
(163, 'Sophia Gardens', ' Cardiff', ' Wales', 2, 9),
(164, 'Southampton County Ground', ' Southampton', ' England', 0, 3),
(165, 'Sportpark Thurlede', ' Schiedam', ' Netherlands', 0, 2),
(166, 'Sportpark Westvliet', ' Voorburg', ' Netherlands', 0, 6),
(167, 'Sports Stadium', ' Sargodha', ' Pakistan', 0, 1),
(168, 'St George''s Park', ' Port Elizabeth', ' South Africa', 23, 33),
(169, 'St. Helen''s', ' Swansea', ' Wales', 0, 2),
(170, 'St. Lawrence Ground', ' Canterbury', ' England', 0, 4),
(171, 'Supersport Park', ' Centurion (Verwoerdburg)', ' South Africa', 16, 41),
(172, 'Sydney Cricket Ground', ' Sydney', ' Australia', 99, 138),
(173, 'Tasmania CA Ground', ' Hobart', ' Australia', 0, 1),
(174, 'Taunton County Ground', ' Taunton', ' England', 0, 3),
(175, 'Telstra Dome', ' Melbourne', ' Australia', 0, 12),
(176, 'The Oval', ' London', ' England', 94, 48),
(177, 'The Rose Bowl', ' Southampton', ' England', 1, 13),
(178, 'The Wanderers Stadium', ' Johannesburg', ' South Africa', 32, 38),
(179, 'Titwood', ' Glasgow', ' Scotland', 0, 2),
(180, 'Trent Bridge', ' Nottingham', ' England', 57, 35),
(181, 'Tyronne Fernando Stadium', ' Moratuwa', ' Sri Lanka', 4, 6),
(182, 'University Ground', ' Lucknow', ' India', 1, 0),
(183, 'University Oval', ' Dunedin', ' New Zealand', 3, 1),
(184, 'University Stadium', ' Thiruvananthapuram', ' India', 0, 2),
(185, 'Vidarbha Cricket Association Ground', ' Nagpur', ' India', 9, 14),
(186, 'Vidarbha Cricket Association Stadium', ' Nagpur', ' India', 3, 6),
(187, 'VRA Ground', ' Amstelveen', ' Netherlands', 0, 16),
(188, 'W.A.C.A. Ground', ' Perth', ' Australia', 38, 66),
(189, 'Wankhede Stadium', ' Mumbai (Bombay)', ' India', 21, 18),
(190, 'Warner Park', ' Basseterre, St Kitts', ' West Indies', 3, 10),
(191, 'Westpac Stadium', ' Wellington', ' New Zealand', 0, 19),
(192, 'Willowmoore Park', ' Benoni', ' South Africa', 0, 18),
(193, 'Windsor Park', ' Roseau, Dominica', ' West Indies', 0, 4),
(194, 'Zafar Ali (Sahiwal) Stadium', ' Sahiwal', ' Pakistan', 0, 2),
(195, 'Zohur Ahmed Chowdhury Stadium', ' Chittagong', ' Bangladesh', 8, 11);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
