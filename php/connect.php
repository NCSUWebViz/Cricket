<?php
$link = mysql_connect('127.0.0.1','root',''); 

if (!$link) { 
	die('Could not connect to MySQL: ' . mysql_error()); 
} 
mysql_selectdb('Cricket', $link) or die('Error connecting to Database');
?>
