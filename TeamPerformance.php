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
					var won_series = {data: []}; var lost_series = {data: []}; var draw_series = {data: []};
					won_series.name = "Matches Won"; lost_series.name = "Matches Lost";	draw_series.name = "Matches Drawn";	
					var i = 0;
					//alert(data.data[0][0].__count__);
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
			
			function loadTeams(e){
					$.getJSON('php/getTeamList2.php',function populateList(data){
					var o;
					var to_field=document.createElement('select');	
				    to_field.setAttribute('id','countrySelect');
				    to_field.onchange = getData;
				    o = document.createElement("option");
					o.text = "";
					o.value = "";
					o.selected = true;
					to_field.add(o, null);
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
				    getData();
			    });	
			}
			$(document).ready(function() {
				var e = document.getElementById("teams");
				loadTeams(e);
			});
				
		</script>
		
	</head>
	<body>
		
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 600px; margin: 0 auto"></div>
		<div id='teams'>Select Team: </div>
		<div>Select Match Type: <select id='matchTypeSelect' onchange='getData()'><option value='All Match Types' selected='true'>All Types</option>
			<option value='Test'>Test</option>
			<option value='ODI'>ODI</option>
			<option value='T20'>T20</option></select>
		</div>		
	</body>
</html>
