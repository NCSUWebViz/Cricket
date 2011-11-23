<?php
include 'connect.php';

$result = mysql_query("select name from series_types");
if($result){
	echo "<select id='matchTypeSelect' onchange='getData()'>";
	echo "<option value='All Match Types' selected='true'>All Types</option>";
	while($row = mysql_fetch_assoc($result)){
		echo "<option value='".$row['name']."'>".$row['name']."</option>";
	}
	echo "</select>";
}

?>