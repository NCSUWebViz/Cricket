<?php
include 'connect.php';

$result = mysql_query("SELECT id,ground_name,city,country FROM venue");
if($result){
	echo "<select id='groundSelect' onchange='getData(this.value)'>";
	echo "<option value='' selected='true'></option>";
	while($row = mysql_fetch_assoc($result)){
		echo "<option value='".$row['id']."'>".$row['ground_name']."</option>";
	}
	echo "</select>";
}

?>
