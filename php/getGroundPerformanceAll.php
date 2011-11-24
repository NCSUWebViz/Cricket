<?php
function getTeamPerformance()
{
	include 'connect.php';
	include 'send_json.php';
    	
	  $venueId = intval($_GET['id']);
	
    $groundDetailsResult = mysql_query("Select city, country from venue where id = '".$venueId."'");
    $groundDetails =  mysql_fetch_assoc($groundDetailsResult);
    $groundCity = $groundDetails['city'];
    $groundCountry = $groundDetails['country'];
    
    $countryIdQueryRes = mysql_query("select id from teams");
    
    while($countryId = mysql_fetch_assoc($countryIdQueryRes))
    {            
         $countryNameResult = mysql_query("select name from teams where id = '".$countryId['id']."'");
         $countryName = mysql_fetch_assoc($countryNameResult);

         $matchesPlayed = mysql_query("select count(*) as total from matches where (team1 = '".$countryId['id']."' or team2 = '".$countryId['id']."') and venue_id = '".$venueId."'") ;
         $totalPlayed = mysql_fetch_assoc($matchesPlayed);

         $matchesDrawn = mysql_query("select count(*) as draw from matches where (team1 = '".$countryId['id']."' or team2 = '".$countryId['id']."') and venue_id = '".$venueId."' and winner_id = '-1'") ;

          $drawn = mysql_fetch_assoc($matchesDrawn);

         $matchesWonResult =  mysql_query("SELECT COUNT( * ) AS wins FROM matches WHERE venue_id ='".$venueId."' AND winner_id = '".$countryId['id']."'");
         $wins = mysql_fetch_assoc($matchesWonResult);
         
         $json[] = array('countryName' => ($countryName['name']), 'total' => intval($totalPlayed['total']), 'wins' => intval($wins['wins']), 'draws' => intval($drawn['draw']));
    }

    echo "{\"country\":\"$groundCountry\", \"city\":\"$groundCity\", \"data\":[".json_encode($json)."]}";
}
getTeamPerformance();
?>