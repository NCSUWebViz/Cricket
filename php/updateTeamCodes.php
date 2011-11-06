<?php 
include 'connect.php';
mysql_selectdb('test2',$link) or die('Error connecting to DB');
//$matches_result = mysql_query("select * from matches",$link);
//$venue_result = mysql_query("select * from venue", $link);t
$result = mysql_query("select * from matches m where (m.team1='ENG' or m.team2='ENG') and m.type='ODI' ");
echo "No. of matches: ".mysql_num_rows($result)."<br />";
$result = mysql_query("select t.id as id, t.code as code from matches m, teams t where t.code = m.team2");

while($row = mysql_fetch_assoc($result)){
	//echo "Match : ".$row['team1']." vs ".$row['team2']." on ".$row['date']."  Type: ".$row['type']."<br />";
	echo "Match - ".$row['id']." -> ".$row['code']."<br />";
}
echo "Total Matches played : ".mysql_num_rows($result);
	//echo "Venue: ".$venue_row['ground_name']."<br />";


?>