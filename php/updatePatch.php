<?php
include 'connect.php';
mysql_selectdb('Cricket', $link) or die ('Error connecting to DB');

$result = mysql_query("select distinct series_id from matches where series_id < 602 and type LIKE 'Test'");
if($result){
	echo mysql_num_rows($result);
}else{
	echo "Error: ".mysql_error();
}

while($row = mysql_fetch_assoc($result)){
	$query = "select id from series where name LIKE (select name from series where id=".$row['series_id'].") and type LIKE 'Test'";
	//echo $query."<br /> ";
	$id_row = mysql_query($query);
	if(mysql_num_rows($id_row) == 1){
		$id = mysql_fetch_assoc($id_row);
		$subquery = "update matches set series_id = ".$id['id']." where series_id = ".$row['series_id']." and type LIKE 'Test'";
		//echo $subquery."<br>";
		$output = mysql_query($subquery);
		if($output){
			echo "Executed: ".$subquery."<br>";
		}else{
			echo "Error: ".mysql_error();
		}
	}
}


?>