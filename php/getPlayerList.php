<?php
function getPlayerList(){
	include 'connect.php';
	include 'send_json.php';
	$team = $_GET['team'];
	$sql = "select id, name from players where team_id like '%".$team."%'";
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
}
getPlayerList();
?>