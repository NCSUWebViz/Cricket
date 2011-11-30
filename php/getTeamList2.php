<?php
	include 'connect.php';
	include 'send_json.php';
	$sql = "select id, name from teams";
	//echo $sql;
	$result = mysql_query($sql);
	if($result){
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			//echo intval($row['id'])." , ".$row['name'].'<BR>';
			$json[] = array('id' => intval($row['id']), 'name' => $row['name']);
			$i++;			
		}

		echo "{\"data\": ".json_encode($json)." }";
	}else{
		echo "{\"data\": []}";
	}
?>