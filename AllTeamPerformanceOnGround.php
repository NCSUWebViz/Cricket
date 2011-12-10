<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Performance of All teams On Ground</title>
		
		
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
						var e = document.getElementById("groundSelect");
						var groundName = e.options[e.selectedIndex].text;
						var args="";
						if(e.options[e.selectedIndex].value){
							args = "?id="+e.options[e.selectedIndex].value;
						}
						else{
							args="";
						}
						//--------------------Declare options-----------------
						options =  {
						    chart: {
						        renderTo: 'container',
						        defaultSeriesType: 'column',
						        zoomType: 'y'
						    },
						    title: {
						        text: null
						    },
						    xAxis: {
						        categories: [],
								 labels: {
									rotation: -45,
									align: 'right',
									style: {
							                font: 'normal 12px Verdana, sans-serif'
							            }
								}
						    },
						    yAxis: {
						        title: {
						            text: 'Units'
						        }
						    },
						    tooltip: {
         						formatter: function() {
										var groundSplit = options.title.text.split(",");
										if(groundSplit[2] == this.x)
										{
											return '<b>Country:</b>'+ this.x + '<br /><b>' + 
            								this.series.name +':</b> '+ this.y +'<br/>'+
            								"<b>Total Matches Played: </b>"+ this.point.stackTotal + '<br />' +
											"<b>This is the Home Ground for "+this.x+"</b>";
										}
										else
										{
            								return '<b>Country:</b>'+ this.x + '<br /><b>' + 
            								this.series.name +':</b> '+ this.y +'<br/>'+
            								"<b>Total Matches Played: </b>"+ this.point.stackTotal + '<br />';
										}
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
						$.getJSON('php/getGroundperformanceAll.php'+args,function(data){
						var series = {
					  			data: []
					  		};
						//alert(data.country);
						series.name = "Matches Won";
						options.title.text = groundName + "," + data.city + "," + data.country;
						var i = 0;
						while( i < data.data[0].length){
							series.data.push(data.data[0][i].wins);
							options.xAxis.categories.push(data.data[0][i].countryName);
							i++;
						}
						options.series.push(series);

						var series = {
					  			data: []
					  		};
						series.name = "Matches Drawn";
						var i = 0;
						while( i < data.data[0].length){
							series.data.push(data.data[0][i].draws);
							options.xAxis.categories.push(data.data[0][i].countryName);
							i++;
						}
						options.series.push(series);

						series = {
					  			data: []
					  		};
					  	i=0;
					  	series.name = "Matches Lost";	
						while( i < data.data[0].length){
							series.data.push(data.data[0][i].total-data.data[0][i].wins-data.data[0][i].draws);
							options.xAxis.categories.push(data.data[0][i].countryName);
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
		<h1>Cricket</h1>
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 400px; margin: 0 auto"></div>
		<div><?php 
			include 'php/getGroundList.php';
			?></div>
				
	</body>
</html>
