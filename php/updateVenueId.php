<?php 
include 'connect.php';
mysql_selectdb('test2',$link) or die('Error connecting to DB');
$matches_result = mysql_query("select * from matches",$link);
$venue_result = mysql_query("select * from venue", $link);

$i = 0;

while($venue_row = mysql_fetch_assoc($venue_result)){
	while($matches_row = mysql_fetch_assoc($matches_result)){
		//echo $venue_row['ground_name']."->".$matches_row['venue_id']." :: ";
		if((strcmp($venue_row['ground_name'], $matches_row['venue_id']) == 0) || (strcmp($matches_row['venue_id'], $venue_row['ground_name']) == 0)){
			$venue_id = addslashes($matches_row['venue_id']);	
			$query = "UPDATE `matches` SET `venue_id` = '".$venue_row['id']."' WHERE `venue_id` = '".$venue_id."'";	
			//echo $query."<br />";
			//echo $venue_row['ground_name']."->".$matches_row['venue_id']." :: match!<br />";
				$result = mysql_query($query,$link);
				if(! $result){
					echo "<br>Error: ".mysql_error();
				}else{
					echo "<br> Executed Query: ".$query;
				}
			$i = $i + 1;
		}
	}
	mysql_data_seek($matches_result, 0);
	//echo "Venue: ".$venue_row['ground_name']."<br />";
}
echo "Total Matches : ".mysql_num_rows($matches_result)."<br />";
echo "Total Matched : ".$i;
?>