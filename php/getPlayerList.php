<?php
function getPlayerList(){
	include 'connect.php';
	include 'send_json.php';
	$team = $_GET['team'];
	$sql = "select distinct p.id, p.name from players p, batting_stats b where p.team_id like '%".$team."%' and b.player_id = p.id order by p.name ASC";
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