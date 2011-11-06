<?php 
include 'connect.php';
mysql_selectdb('test2',$link) or die('Error connecting to DB');
//$matches_result = mysql_query("select * from matches",$link);
//$venue_result = mysql_query("select * from venue", $link);t
$result = mysql_query("select m.id as mid, s.id as sid, m.series_id, s.winner, s.name, m.team1, m.team2, s.type from matches m, series s where s.name = m.series_id and s.type = m.type");
//$result = mysql_query("select * from series where type = 'ODI' ");

while($row = mysql_fetch_assoc($result)){
	//echo "Match : ".$row['team1']." vs ".$row['team2']." on ".$row['date']."  Type: ".$row['type']."<br />";
	echo "Match - ".$row['mid']." -> ".$row['sid']."   ::   ".$row['name']." -> ".$row['series_id']." Type: ".$row['type']." ------ Winner : ".$row['winner']."<br />";
	//$replace = str_replace("vs", "v", $row['name']);
	//$query = "UPDATE series SET `name` = '".$replace."' where `id` = ".$row['id']."  ";
	//mysql_query($query);
}
echo "Total Matches played : ".mysql_num_rows($result);
	//echo "Venue: ".$venue_row['ground_name']."<br />";


?>