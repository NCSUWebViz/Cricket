<?php
include 'connect.php';

$result = mysql_query("select id, name, code from teams");
if($result){
	echo "<select id='countrySelect' onchange='getData()'>";
	echo "<option value='' selected='true'></option>";
	while($row = mysql_fetch_assoc($result)){
		echo "<option value='".$row['id']."'>".$row['name']."</option>";
	}
	echo "</select>";
}

?>
