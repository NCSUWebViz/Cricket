<?php
//function getTeamPeformance($country, $match_type){
function getPlayerBattingStat(){
	include 'connect.php';
	include 'send_json.php';	
	mysql_selectdb('Cricket',$link) or die('Error connecting to DB');
	
	$name = $_GET['name'];
	$type = $_GET['type'];
	$x = $_GET['x'];
	$y = $_GET['y'];
	$sql = "select ".$x.", sum(".$y.") as total from batting_stats where type like '%".$type."%' and player_id = (select id from players where name like '%".$name."%') group by ".$x;
	//echo $sql;
	//$super_set = mysql_query("select year, count(*) as total from matches where team1 LIKE 'IND' or team2 LIKE 'IND' group by year") ;
	//$super_set = mysql_query("select year, count(*) as total from matches where team1 LIKE '".$country."' or team2 LIKE '".$country."' group by year") ;
	$result = mysql_query($sql) ;
	//$result = mysql_query("select year, count(*) as wins from matches where winner_id LIKE 'India' group by year") ;
	//echo $result;	
	if($result){
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			//echo intval($row[$x])." , ".intval($row['total']).'<BR>';
			$json[] = array($x => $row[$x], 'total' => intval($row['total']));
			$i++;			
		}
		/*$i = 0;
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
		}*/
		//return "{data:{".json_encode($json)."} }";
		echo "{\"data\": ".json_encode($json)." }";
	}else{
		echo "{\"data\":[]}";
	}
}
getPlayerBattingStat();
?>