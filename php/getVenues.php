<?php 
	include 'connect.php';
	include 'send_json.php';
	$json = array();
    $result = mysql_query("SELECT id,ground_name FROM venue");
	send_json($result);
?>
