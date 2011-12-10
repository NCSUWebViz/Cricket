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
		<script type="text/javascript" src="scripts/seriesCharts.js">
		</script>
		
	</head>
	<body onload="loadData()">
		
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
