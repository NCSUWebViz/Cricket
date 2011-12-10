<?php
//function getTeamPeformance($country, $match_type){
function getPlayerBattingStat(){
	include 'connect.php';
	include 'send_json.php';	
	//mysql_selectdb('Cricket',$link) or die('Error connecting to DB');
	
	$id = $_GET['id'];
	$type = $_GET['type'];
	$x = $_GET['x'];
	$y = $_GET['y'];
	$ystring;
	
	if($y == 'scored_runs')
		$ystring = "sum(scored_runs)";
	else if($y == 'average')
		$ystring = "sum(scored_runs)/sum(NOT(not_out))";
	else if($y == 'strike_rate')
		$ystring = "sum(scored_runs)/sum(balls_faced)*100";
	else 
		$ystring = "count(*)";
	
	$sql = "select ".$x.", ".$ystring." as total from batting_stats where type like '%".$type."%' and player_id =".$id." and dismissed not like '%DNB%'";
	
	if($y == 'centuries')
		$sql = $sql." and scored_runs >= 100 ";
	
	if (isset($_GET['filtertype'])) {
		$filtertype = $_GET['filtertype'];
		$filterval =  $_GET['filterval'];
		if($filtertype == 'year')
			$sql = $sql." and ".$filtertype."=".$filterval;
		else
			$sql = $sql." and ".$filtertype." LIKE '%".$filterval."%'";
	}
	$sql = $sql." group by ".$x;
	
	$result = mysql_query($sql) ;
	if($result){
		$i = 0;
		while($row = mysql_fetch_assoc($result)){
			//echo intval($row[$x])." , ".intval($row['total']).'<BR>';
			$json[] = array('x' => $row[$x], 'total' => intval($row['total']));
			$i++;
		}

		echo "{\"data\": ".json_encode($json)." }";
	}else{
		echo "{\"data\":[]}";
	}
}
getPlayerBattingStat();
?>