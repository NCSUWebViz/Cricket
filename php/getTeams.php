<?php 
	include 'connect.php';
	include 'send_json.php';
	mysql_select_db('test2',$link) or die('Could not connect');
	$json = array();
	$result = mysql_query("select id,name,code from teams order by name", $link) or die('Wrong query');
	send_json($result);
?> 
