<?php 
	include 'connect.php';
	include 'send_json.php';
	$json = array();
	$result = mysql_query("SELECT id,name FROM teams", $link) or die('Wrong query');
	send_json($result);
?>
