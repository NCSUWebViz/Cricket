<?php
//function getTeamPeformance($country, $match_type){
function getTeamPerformance(){
	include 'connect.php';
	include 'send_json.php';	
	
	$team_id = intval($_GET['id']);
	$getCountryName = mysql_query("select name from teams where id = '".$team_id."' ");
	$countryName = mysql_fetch_assoc($getCountryName);
	
	if(isset($_GET['type'])){
		$type = $_GET['type'];
	}else{
		$type = "";
	}
	
	if($type != ""){
		$super_query = "select year, count(*) as total from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and type LIKE '".$type."' group by year";
		$sub_query = "select year, count(*) as wins from matches where winner_id LIKE '".$countryName['name']."' and type LIKE '".$type."' group by year";
	}else{
		$super_query = "select year, count(*) as total from matches where team1 = '".$team_id."' or team2 = '".$team_id."' group by year";
		$sub_query = "select year, count(*) as wins from matches where winner_id LIKE '".$countryName['name']."' group by year";
	}
	
	$super_set = mysql_query($super_query) ;
	$result = mysql_query($sub_query) ;
	
	if($super_set && $result && (mysql_num_rows($super_set) > 0)){
		$i = 0;
		while($row = mysql_fetch_assoc($super_set)){
			$super[$i] = array('year'=> $row['year'], 'total' => $row['total']);
			$i++;			
		}
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			$res[$row['year']] =  $row['wins'];			
			$i++;
		}
		$i = 0;
		while($i < sizeof($super)){
			if((mysql_num_rows($result) > 0) && array_key_exists($super[$i]['year'], $res)){
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => intval($res[$super[$i]['year']]));		
			}
			else{
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => 0);			
			}
			$i = $i + 1;
		}
		//return "{data:{".json_encode($json)."} }";
		echo "{\"data\":[".json_encode($json)."]}";
	}else{
		echo "{\"data\":[]}";
	}
}
getTeamPerformance();
?>