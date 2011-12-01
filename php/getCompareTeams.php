<?php

	include 'connect.php';
	include 'send_json.php';	
			

	if(isset($_GET['type'])){
		$type = $_GET['type'];
	}else{
		$type = "";
	}
	
	$teamsParam = $_GET['teams'];
	$teams =  explode(",", $teamsParam);
	$draw_id = -1;
	$parentJson = array();
	$j = 0;
	
	$i=0;
	$query = "";
	$selectClause = "(select distinct `year` from `matches` ";
	$orderbyClause = "order by `year` ASC";
	for($i=0; $i<sizeof($teams); $i++){
		$teamClause = "where (`team1` = ".$teams[$i]." or `team2` = ".$teams[$i].") ";
		if($type == ""){
			$typeClause = ")";
		}else{
			$typeClause = "and `type` LIKE '".$type."' ) ";
		}
		
		if($i != (sizeof($teams)-1)){
			$unionClause = "UNION ";
		}else{
			$unionClause = " ";
		}
		$query = $query.$selectClause.$teamClause.$typeClause.$unionClause;
	}
	$query = $query.$orderbyClause;
	//echo $query."<br /><br />";
	$super_query = mysql_query($query);
	if(!$super_query){
		echo mysql_error();
	}
	/*BACKUP --- DO NOT DELETE
	if($type == ""){
		$super_query = mysql_query("select distinct year from matches order by year ASC");
	}else{
		$super_query = mysql_query("select distinct year from matches where type LIKE '".$type."' order by year ASC");	
	}
	*/
	$i=0;
	while($row = mysql_fetch_assoc($super_query)){
			$super[$i] = $row['year'];	
			$i++;	
	}
	while($j < sizeof($teams)){
		$team_id =  intval($teams[$j]);
		$getCountryName = mysql_query("select name from teams where id = '".$team_id."' ");
		$countryName = mysql_fetch_assoc($getCountryName);
		$json = array();

		if($type != ""){
			$total_query = "select year, count(*) as total from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and type LIKE '".$type."' group by year";
			$sub_query = "select year, count(*) as wins from matches where winner_id LIKE '".$team_id."' and type LIKE '".$type."' group by year";
			$draw_query = "select year, count(*) as drawn from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and winner_id LIKE '".$draw_id."' and type LIKE '".$type."' group by year";
		}else{
			$total_query = "select year, count(*) as total from matches where team1 = '".$team_id."' or team2 = '".$team_id."' group by year";
			$sub_query = "select year, count(*) as wins from matches where winner_id LIKE '".$team_id."' group by year";
			$draw_query = "select year, count(*) as drawn from matches where (team1 = '".$team_id."' or team2 = '".$team_id."') and winner_id = '".$draw_id."' group by year";	
		}
		
		$total_set = mysql_query($total_query) ;
		$result = mysql_query($sub_query) ;
		$draw_result = mysql_query($draw_query);
		$total = array();
		
		if($total_set && $result && (mysql_num_rows($total_set) > 0)){
			$i = 0;
			$draw = array();
			$res = array();

			while($i < sizeof($super)){
				while($row = mysql_fetch_assoc($total_set)){
					if(intval($row['year']) == intval($super[$i])){
						//echo "setting  ".$super[$i]." to ".$row['total']."<br />";
						$total[$i] = array('year'=> intval($super[$i]), 'total' => $row['total']);	
						break;	
					}else{
						//echo "setting  ".$super[$i]." to 0"."<br />";
						$total[$i] = array('year'=> intval($super[$i]), 'total' => 0);
					}
				}	
				$i++;
				mysql_data_seek($total_set, 0);
				//echo "---------------------------<br>";
			}	
				
			while($row = mysql_fetch_assoc($result)){
				$res[$row['year']] =  $row['wins'];			
			}

			while($row = mysql_fetch_assoc($draw_result)){
				$draw[$row['year']] =  $row['drawn'];			
			}
			$i = 0;
			while($i < sizeof($total)){
				if((mysql_num_rows($result) > 0) && array_key_exists($total[$i]['year'], $res) && array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'wins' => intval($res[$total[$i]['year']]), 'draws' => intval($draw[$total[$i]['year']]));		
				}else if(!array_key_exists($total[$i]['year'], $res) && array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'wins' => 0, 'draws' => intval($draw[$total[$i]['year']]));
				}else if(array_key_exists($total[$i]['year'], $res) && !array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'wins' => intval($res[$total[$i]['year']]), 'draws' => 0);
				}
				else{
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'wins' => 0, 'draws' => 0);			
				}
				$i = $i + 1;
			}
			$parentJson[] = array($countryName['name'] => $json);
			
		}else{
			$parentJson[] = array($countryName['name'] => $json);
		}
		$j++;
	}
	echo "{\"data\":[".json_encode($parentJson)."]}";

?>