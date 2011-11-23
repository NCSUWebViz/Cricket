<?php
//function getTeamPeformance($country, $match_type){
function getTeamPerformance(){
	include 'connect.php';
	include 'send_json.php';	
	mysql_selectdb('Cricket',$link) or die('Error connecting to DB');
	
	$super_set = mysql_query("select year, count(*) as total from matches where team1 LIKE 'IND' or team2 LIKE 'IND' group by year") ;
	//$super_set = mysql_query("select year, count(*) as total from matches where team1 LIKE '".$country."' or team2 LIKE '".$country."' group by year") ;
	$result = mysql_query("select year, count(*) as wins from matches where winner_id LIKE 'India' group by year") ;
	//$result = mysql_query("select year, count(*) as wins from matches where winner_id LIKE 'India' group by year") ;
	
	if($super_set && $result){
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
			if(array_key_exists($super[$i]['year'], $res)){
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
		die("Wrong query");
	}
}
getTeamPerformance();
?>