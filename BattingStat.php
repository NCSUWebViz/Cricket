<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Player Batting Stats</title>
		
		
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
		<script type="text/javascript" src="scripts/battingStat.js"></script>
		
	</head>
	<body>
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 600px; margin: 0 auto"></div>
		<div>Select Team : <?php 
			include 'php/getTeamList.php';
		?>
		<div>
				Select Player : 
				<select id='PlayerSelect' onchange='getPlayerDatabyYear()'>
				<option value='' selected='true'></option>;
		</div>
		
	</body>
</html>
