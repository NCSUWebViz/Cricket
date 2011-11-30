<?php 
	include 'connect.php';
	include 'send_json.php';
	mysql_select_db('Cricket',$link) or die('Could not connect');
	$json = array();
	$result = mysql_query("SELECT id,name,code,latitude,longitude FROM teams WHERE code != 'ACC' AND code != 'ICC' and code != 'ACA' ORDER BY name", $link) or die('Wrong query');
	send_json($result);
?> 
