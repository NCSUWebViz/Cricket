<?php
function getTeamPerformance()
{
	include 'connect.php';
	include 'send_json.php';
    	
	  $venueId = intval($_GET['venueId']);
    $teamId = intval($_GET['teamId']);
    
    //$venueId = 2;
    //$teamId = 15;
	
    $groundDetailsResult = mysql_query("Select city, country from venue where id = '".$venueId."'");
    $groundDetails =  mysql_fetch_assoc($groundDetailsResult);
    $groundCity = $groundDetails['city'];
    $groundCountry = $groundDetails['country'];
       
    //Get the matches 
    $matchesPlayed = mysql_query("SELECT YEAR, COUNT( * ) as total FROM matches WHERE venue_id = '".$venueId."' AND ( team1 = '".$teamId."' OR team2 = '".$teamId."') GROUP BY YEAR ORDER BY YEAR");
    $num_rows = mysql_num_rows($matchesPlayed);
    
   if($num_rows != 0)
   {
     $matchesWon = mysql_query("SELECT YEAR, COUNT( * ) as won FROM matches WHERE venue_id = '".$venueId."' AND ( team1 = '".$teamId."' OR team2 = '".$teamId."') AND winner_id = '".$teamId."' GROUP BY YEAR ORDER BY YEAR");
    
      $matchesDrawn = mysql_query("SELECT YEAR, COUNT( * ) as drawn FROM matches WHERE venue_id = '".$venueId."' AND ( team1 = '".$teamId."' OR team2 = '".$teamId."') AND winner_id = -1 GROUP BY YEAR ORDER BY YEAR");
         
      $wonArrayLength = 0;
      while($totalWon = mysql_fetch_array($matchesWon))
      {
        $wonArray[$wonArrayLength++] = array("year" => $totalWon['YEAR'], "won" => $totalWon['won']);
      }
 
      $drawnArrayLength = 0;
      while($totalDrawn = mysql_fetch_array($matchesDrawn))
      {
        $drawnArray[$drawnArrayLength++] = array("year" => $totalDrawn['YEAR'], "drawn" => $totalDrawn['drawn']);
      }
    
 
      $wonIndex = 0;
      $drawnIndex = 0;
      //echo $wonArrayLength;
      while($totalPlayed = mysql_fetch_assoc($matchesPlayed))
      {
        $playedYear = $totalPlayed['YEAR'];
        $playedCount = $totalPlayed['total'];
        $wonCount = 0;
        $drawnCount = 0;
      
        if($wonArrayLength != 0 && $wonIndex < $wonArrayLength && !(strcmp ($wonArray[$wonIndex]["year"] , $playedYear)))
        {
          $wonCount = $wonArray[$wonIndex]["won"];
          $wonIndex++;
        }
      
        if($drawnArrayLength != 0 && $drawnIndex < $drawnArrayLength && !(strcmp ($drawnArray[$drawnIndex]["year"] , $playedYear)))
        {
          $drawnCount = $drawnArray[$drawnIndex]["drawn"];
          $drawnIndex++;
        }
      
        $json[] = array('year' => $playedYear, 'total' => intval($playedCount), 'wins' => intval($wonCount), 'draws' => intval($drawnCount));
      }
  
     echo "{\"groundCountry\":\"$groundCountry\", \"groundCity\":\"$groundCity\", \"data\":[".json_encode($json)."]}";
    }
    else
    {
      $json = "";
      echo "{\"groundCountry\":\"$groundCountry\", \"groundCity\":\"$groundCity\", \"data\":[".json_encode($json)."]}";
    }
}
getTeamPerformance();
?>