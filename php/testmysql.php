<?php 
	include 'connect.php';
	include 'send_json.php';
	mysql_select_db('test2',$link) or die('Could not connect');
	$json = array();
	$result = mysql_query("select winner, COUNT(winner) as count from series where name LIKE '%World Cup%' GROUP BY winner", $link) or die('Wrong query');
	send_json($result);
?> 