<?php

function send_json($result){
	if(mysql_num_rows($result)){
		while($object = mysql_fetch_assoc($result)){
			for($i = 0; $i < mysql_num_fields($result); $i=$i+1){
				if(mysql_field_type($result, $i) == 'int'){
					$name = mysql_field_name($result, $i);	
					$object[$name] = intval($object[$name]);
				}	
			}	
			$json[] = $object;
		}
	}
	  header('Content-type: application/json');
	    echo json_encode($json);
}	
	
?>	