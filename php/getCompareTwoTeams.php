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
	
	if($type == ""){
		$super_query = mysql_query("select distinct year from matches where (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') order by year ASC");
	}else{
		$super_query = mysql_query("select distinct year from matches where (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and type LIKE '".$type."' order by year ASC");	
	}

	$i=0;
	$super = array();
	while($row = mysql_fetch_assoc($super_query)){
			$super[$i] = $row['year'];	
			$i++;	
	}

		$i=0;
		while($i < sizeof($teams)){
			$teams[$i] =  intval($teams[$i]);
			$i++;
		}	
		$getCountryName = mysql_query("select name from teams where id = '".$teams[0]."' or id = '".$teams[1]."' ");
		$countryName = mysql_fetch_assoc($getCountryName);
		$json = array();

		if($type != ""){
			$total_query = "select year, count(*) as total from matches where (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and type LIKE '".$type."' group by year";
			$sub_query = "select year, count(*) as country1 from matches where  (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and winner_id = '".$teams[0]."' and type LIKE '".$type."' group by year";
			$draw_query = "select year, count(*) as country2 from matches where   (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and winner_id = '".$teams[1]."' and type LIKE '".$type."' group by year";
		}else{
			$total_query = "select year, count(*) as total from matches where (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') group by year";
			$sub_query = "select year, count(*) as country1 from matches where  (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and winner_id = '".$teams[0]."' group by year";
			$draw_query = "select year, count(*) as country2 from matches where  (team1 = '".$teams[0]."' or team2 = '".$teams[0]."') and (team1 = '".$teams[1]."' or team2 = '".$teams[1]."') and winner_id = '".$teams[1]."' group by year";	
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
				$res[$row['year']] =  $row['country1'];			
			}

			while($row = mysql_fetch_assoc($draw_result)){
				$draw[$row['year']] =  $row['country2'];			
			}
			$i = 0;
			while($i < sizeof($total)){
				if((mysql_num_rows($result) > 0) && array_key_exists($total[$i]['year'], $res) && array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'country1' => intval($res[$total[$i]['year']]), 'country2' => intval($draw[$total[$i]['year']]));		
				}else if(!array_key_exists($total[$i]['year'], $res) && array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'country1' => 0, 'country2' => intval($draw[$total[$i]['year']]));
				}else if(array_key_exists($total[$i]['year'], $res) && !array_key_exists($total[$i]['year'], $draw) ){
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'country1' => intval($res[$total[$i]['year']]), 'country2' => 0);
				}
				else{
					$json[] = array('year' => intval($total[$i]['year']), 'total' => intval($total[$i]['total']), 'country1' => 0, 'country2' => 0);			
				}
				$i = $i + 1;
			}
			
		}else{
			
		}

	
	echo "{\"data\":[".json_encode($json)."]}";

?>