<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/js/highcharts.js"></script>
		<script type="text/javascript" src="scripts/jquery.js"></script>
		<!-- 1a) Optional: add a theme file -->
		<!--
			<script type="text/javascript" src="../js/themes/gray.js"></script>
		-->
		
		<!-- 1b) Optional: the exporting module -->
		<script type="text/javascript" src="scripts/js/modules/exporting.js"></script>
		
		
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
		<script type="text/javascript">
   			var options;	
   			function loadTeams(){
   				var e = document.getElementById('numOfTeams');
   				var num = e.options[e.selectedIndex].value;
   				//alert(num);
   				var j = 0;
				e = document.getElementById("teams");
				if ( e.hasChildNodes() )
				{
				    while ( e.childNodes.length >= 1 )
				    {
				        e.removeChild( e.firstChild );       
				    } 
				}
				id=0;
   				while(j < num){
					$.getJSON('php/getTeamList2.php',function populateList(data){
						var o;
						var to_field=document.createElement('select');	
					    to_field.setAttribute('id',id.toString());
					    to_field.onchange = teamValidate;
					    var i = 0;
					    while( i < data.data.length){
							o = document.createElement("option");
							o.text = data.data[i].name;
							o.value = data.data[i].id;
							i++;
							to_field.add(o, null);
						}
					    e.appendChild(to_field);
					    var br_field=document.createElement('br');
					    e.appendChild(br_field);  
					    id++;
			    	});
			    	j++;
   				}
   				var submitButton = document.createElement('input');
   				submitButton.setAttribute('value','Compare!');
   				submitButton.setAttribute('type','button');
   				submitButton.onclick = getData;
   				e.appendChild(submitButton);
   			}
   			
   			
   			
			function getData(){
					if(document.getElementById('numOfTeams') != null){
						var e = document.getElementById('numOfTeams');
   						var num = e.options[e.selectedIndex].value;
   						alert("Selected: "+num);
   						var i = 0;
   						if( document.getElementById(i.toString()) == null ){
   							alert("null");
   						}
   						alert("Selected: "+num);
   						while(i < num){
   							var select = document.getElementById(i.toString());
   							var teamName = select.options[select.selectedIndex].text;	
   							alert("Team Name: "+teamName);
   							i++;
   						}
   					}	
						//----------------------------------------------------
						//alert("calling json function");
						$.getJSON('php/getCompareTeams.php'+'?teams=1,2',function(data){
						var name = 'Australia';
						//alert(data.data[0][1][name][0].total);
						/*
						if(data.data.length == 0){
							options.title.text = "No Data Found for "+countryName + "-" + matchType;
							var chart = new Highcharts.Chart(options);
						}else{
							while( i < data.data[0].length){
								won_series.data.push(data.data[0][i].wins);
								lost_series.data.push(data.data[0][i].total-data.data[0][i].draws-data.data[0][i].wins);
								draw_series.data.push(data.data[0][i].draws);
								options.xAxis.categories.push(data.data[0][i].year);
								i++;
							}
							options.series.push(won_series);
							options.series.push(lost_series);
							options.series.push(draw_series);
							var chart = new Highcharts.Chart(options);	
						}
						*/
				});
			}
			
			function teamValidate(){
				
			}
			//$(document).ready(function() {
				//getData();	
			//});
				
		</script>
		
	</head>
	<body>
		
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 600px; margin: 0 auto"></div>
		<div>Select Number of Teams: <select id='numOfTeams' onchange='loadTeams()'>
			<option></option>
			<option value=1>1</option>
			<option value=2>2</option>
			<option value=3>3</option>
		</select></div>		
		<div id='teams'></div>
	</body>
</html>
