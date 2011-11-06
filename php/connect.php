<?php
$link = mysql_connect('localhost','root',''); 

if (!$link) { 
	die('Could not connect to MySQL: ' . mysql_error()); 
} 

?>