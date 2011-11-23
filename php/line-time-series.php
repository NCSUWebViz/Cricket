<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/js/highcharts.js"></script>
		<script type="text/javascript" src="scripts/js/jquery.js"></script>
		<!-- 1a) Optional: add a theme file -->
		<!--
			<script type="text/javascript" src="../js/themes/gray.js"></script>
		-->
		
		<!-- 1b) Optional: the exporting module -->
		<script type="text/javascript" src="scripts/js/modules/exporting.js"></script>
		
		
		<!-- 2. Add the JavaScript to initialize the chart on document ready -->
		<script type="text/javascript">
   			var options;	
			function getData(code){
						var args="";
						if(code){
							args = "?code="+code;
						}
						else{
							args="";
						}
						//--------------------Declare options-----------------
						options =  {
						    chart: {
						        renderTo: 'container',
						        defaultSeriesType: 'column',
						        zoomType: 'x'
						    },
						    title: {
						        text: code
						    },
						    xAxis: {
						        categories: []
						    },
						    yAxis: {
						        title: {
						            text: 'Units'
						        }
						    },
						    tooltip: {
         						formatter: function() {
            						return '<b>Year:</b>'+ this.x + '<br /><b>' + 
            						this.series.name +':</b> '+ this.y +'<br/>'+
            						"<b>Total Matches Played: </b>"+ this.point.stackTotal + '<br />';
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
						$.getJSON('php/getTeamPerformance.php'+args,function(data){
						var series = {
					  			data: []
					  		};
						series.name = "Matches Won";
						var i = 0;
						while( i < data.data[0].length){
							series.data.push(data.data[0][i].wins);
							options.xAxis.categories.push(data.data[0][i].year);
							i++;
						}
						options.series.push(series);
						series = {
					  			data: []
					  		};
					  	i=0;
					  	series.name = "Matches Lost";	
						while( i < data.data[0].length){
							series.data.push(data.data[0][i].total-data.data[0][i].wins);
							options.xAxis.categories.push(data.data[0][i].year);
							i++;	
						}
						options.series.push(series);
						var chart = new Highcharts.Chart(options);	
				});
			}
			
			$(document).ready(function() {
				getData();	
			});
				
		</script>
		
	</head>
	<body>
		
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 400px; margin: 0 auto"></div>
		<div><?php 
			include 'getTeamList.php';
			?></div>
				
	</body>
</html>
