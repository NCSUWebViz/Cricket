<?php 
include 'connect.php';
mysql_selectdb('test2',$link) or die('Error connecting to DB');
$master_result = mysql_query("select * from series",$link);

while($row = mysql_fetch_assoc($master_result)){
	if(strstr($row['date'], "/")){
		$date = new DateTime(str_replace("/", ".", $row['date']));
		$formatted_date = $date->format('m-d-Y');
		//echo "Formatted date to :".$formatted_date;
		$query = "UPDATE `series` SET `date`='".$formatted_date."' WHERE `id`='".$row['id']."'";	
	
		$result = mysql_query($query,$link);
		if(! $result){
			echo "<br>Error: ".mysql_error();
		}else{
			echo "<br> Executed Query: ".$query;
		}
	}
}
?>