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
			function getData(){
						//alert('called');
						/*
						 * Get the Country Drop Down properties
						 */
						var e = document.getElementById("countrySelect");
						var countryCode = e.options[e.selectedIndex].value;
						var countryName = e.options[e.selectedIndex].text;
						/*
						 * Get the Match Type Drop Down properties
						 */
						var e = document.getElementById("matchTypeSelect");
						var matchType = e.options[e.selectedIndex].value;

						var args="";
						if(countryCode){
							args = "?id="+countryCode;
							if(matchType != "All Match Types"){
								args = args + "&type=" + matchType;
							}
							//alert(args);
						}
						else{
							document.getElementById('container').innerHTML = "Select A Country!";
						}

						//--------------------Declare options-----------------
						options =  {
						    chart: {
						        renderTo: 'container',
						        defaultSeriesType: 'spline',
						        zoomType: 'x'
						    },
						    title: {
						        text: countryName + "-" + matchType
						    },
						    xAxis: {
						        categories: [],
						         labels: {
							            rotation: -45,
							            align: 'right',
							            step: 2,
							            style: {
							                font: 'normal 12px Verdana, sans-serif'
							            }
							         }
						    },
						    yAxis: {
						        title: {
						            text: 'Number of Matches'
						        }
						    },
						    tooltip: {
         						formatter: function() {
            						var tooltip = '<b>Year:</b>'+ this.x + '<br /><b>' + 
            						this.series.name +':</b> '+ this.y +'<br/>';
            						return tooltip;
         						}
      						},
						    plotOptions: {
         						column: {
            						stacking: 'normal'
            					}
            				},	
						    series: []
						};	
						//----------------------------------------------------
						//alert("calling json function");
						$.getJSON('php/getTeamPerformance.php'+args,function(data){
						var won_series = {data: []}; var total_series = {data: []}; var draw_series = {data: []};
						won_series.name = "Matches Won"; total_series.name = "Matches Lost";	draw_series.name = "Matches Drawn";	
						var i = 0;
						//alert(data.data[0][0].__count__);
						if(data.data.length == 0){
							options.title.text = "No Data Found for "+countryName + "-" + matchType;
							var chart = new Highcharts.Chart(options);
						}else{
							while( i < data.data[0].length){
								won_series.data.push(data.data[0][i].wins);
								total_series.data.push(data.data[0][i].total-data.data[0][i].draws-data.data[0][i].wins);
								draw_series.data.push(data.data[0][i].draws);
								options.xAxis.categories.push(data.data[0][i].year);
								i++;
							}
							options.series.push(won_series);
							options.series.push(total_series);
							options.series.push(draw_series);
							//series = {
						  	//		data: []
						  	//	};
						  	//i=0;
						  	
							//while( i < data.data[0].length){
							//	series.data.push(data.data[0][i].total);
							//	options.xAxis.categories.push(data.data[0][i].year);
							//	i++;	
							//}
							//options.series.push(series);
							var chart = new Highcharts.Chart(options);	
						}
				});
			}
			
			$(document).ready(function() {
				getData();	
			});
				
		</script>
		
	</head>
	<body>
		
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 600px; margin: 0 auto"></div>
		<div>Select Team : <?php 
			include 'php/getTeamList.php';
			?></div>
		<div>Select Match Type: <?php 
			include 'php/getMatchType.php';
			?></div>		
	</body>
</html>
