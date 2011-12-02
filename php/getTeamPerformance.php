<?php
//function getTeamPeformance($country, $match_type){
function getTeamPerformance(){
	include 'connect.php';
	include 'send_json.php';	
	
	$team_id = intval($_GET['id']);
	$draw_id = -1;
	//$getCountryName = mysql_query("select name from teams where id = '".$team_id."' ");
	//$countryName = mysql_fetch_assoc($getCountryName);
	
	if(isset($_GET['type'])){
		$type = $_GET['type'];
	}else{
		$type = "";
	}
	if($type != ""){
		$super_query = "select year, count(*) as total from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and type LIKE '".$type."' group by year";
		$sub_query = "select year, count(*) as wins from matches where winner_id = '".$team_id."' and type LIKE '".$type."' group by year";
		$draw_query = "select year, count(*) as drawn from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and winner_id LIKE '".$draw_id."' and type LIKE '".$type."' group by year";
		/*
		$sub_query = "select year, count(*) as wins from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and type LIKE '".$type."' ";
		if($type=='Test'){
			$sub_query = $sub_query." and (winner_id LIKE '".$countryName['name']."' or winner_id LIKE 'Draw') group by year ";
		}else{
			$sub_query = $sub_query." and winner_id LIKE '".$countryName['name']."' group by year ";
		} 
		*/
	}else{
		$super_query = "select year, count(*) as total from matches where team1 = '".$team_id."' or team2 = '".$team_id."' group by year";
		$sub_query = "select year, count(*) as wins from matches where winner_id = '".$team_id."' group by year";
		$draw_query = "select year, count(*) as drawn from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and winner_id = '".$draw_id."' group by year";	
	}
	
	$super_set = mysql_query($super_query) ;
	$result = mysql_query($sub_query) ;
	$draw_result = mysql_query($draw_query);
	
	if($super_set && $result && (mysql_num_rows($super_set) > 0)){
		$i = 0;
		if(mysql_num_rows($result) == 0){
			$res = array();
		}
		if(mysql_num_rows($draw_result) == 0){
			$draw = array();
		}
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
		while($row = mysql_fetch_assoc($draw_result)){
			$draw[$row['year']] =  $row['drawn'];			
			$i++;
		}
		$i = 0;
		while($i < sizeof($super)){
			if((mysql_num_rows($result) > 0) && array_key_exists($super[$i]['year'], $res) && array_key_exists($super[$i]['year'], $draw) ){
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => intval($res[$super[$i]['year']]), 'draws' => intval($draw[$super[$i]['year']]));		
			}else if(!array_key_exists($super[$i]['year'], $res) && array_key_exists($super[$i]['year'], $draw) ){
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => 0, 'draws' => intval($draw[$super[$i]['year']]));
			}else if(array_key_exists($super[$i]['year'], $res) && !array_key_exists($super[$i]['year'], $draw) ){
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => intval($res[$super[$i]['year']]), 'draws' => 0);
			}
			else{
				$json[] = array('year' => intval($super[$i]['year']), 'total' => intval($super[$i]['total']), 'wins' => 0, 'draws' => 0);			
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