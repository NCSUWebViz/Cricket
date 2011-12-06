<?php
include 'connect.php';
$result =  mysql_query("select s.year as year, t.name as name, t.code as code, t.latitude as lat, t.longitude as longt from series s, teams t where s.name LIKE '%World Cup' and s.winner = t.id");
echo mysql_error();
$parentJson = array();

while($row = mysql_fetch_assoc($result)){
	$json = array('name' => $row['name'], 'code' => $row['code'], 'latitude' => floatval($row['lat']), 'longitude' => floatval($row['longt']));
	$parentJson[] = array($row['year'] => $json );	
}
echo "{\"data\":[".json_encode($parentJson)."]}";
?>