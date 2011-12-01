<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/js/highcharts.js"></script>
		<script type="text/javascript" src="scripts/js/themes/gray.js"></script>
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
   			var teamsSelectSlots = new Array();

			
   			function loadTeams(){
   				var num = getNumberOfTeams();
   				var j = 0;
   				teamsSelectSlots = new Array();
				//-------------------------
				var l = 0;
				for(l=0; l<num; l++){
   					teamsSelectSlots[l] = 0;
				}
				//-------------------------
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
					    to_field.onchange = function(){teamValidate(this.id,this.value);};
					    o = document.createElement("option");
						o.text = "";
						o.value = 0;
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
					    id++;
			    	});
			    	j++;
   				}
   				e = document.getElementById("teams");
   				var submitButton = document.createElement('input');
   				submitButton.setAttribute('value','Compare!');
   				submitButton.setAttribute('type','button');
   				submitButton.onclick = getData;
   				e.appendChild(submitButton);
   			}
   			
   			
   			
			function getData(){
				var teamId = new Array();
				var teamNames = new Array();
				var args = "";
				if(document.getElementById('numOfTeams') != null){
					var num = getNumberOfTeams();
					//alert("Selected: "+num);
					var i = 0;
					if( document.getElementById(i.toString()) == null ){
						alert("null");
					}
					//alert("Selected: "+num);
					while(i < num){
						var select = document.getElementById(i.toString());
						teamId[i] = select.options[select.selectedIndex].value;	
						teamNames[i] = select.options[select.selectedIndex].text;
						//alert("Team Name: "+teamName);
						i++;
					}
				}	
				
				i=0;
				args += '?teams=';
				while(i < num){
					args += teamId[i];
					if(i != (num-1)){
						args += ',';
					}
					i++;
				}
				
				var type = document.getElementById('matchTypeSelect');
				var typeText = type.options[type.selectedIndex].value;
				if(typeText != 'All Match Types' ){
					args += '&type=';
					args += typeText;
				}
				//alert(args);
				//--------------------Declare options-----------------
					options =  {
					    chart: {
					        renderTo: 'container',
					        defaultSeriesType: 'spline',
					        zoomType: 'x'
					    },
					    title: {
					        text: 'Performance Comparison of '
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
        						var tooltip = "<b>Matches won by "+this.series.name +':</b> '+ this.y +'<br/>'+
        						'<b>Playing Year:</b>'+ this.x + '<br /><b>' ;
        						return tooltip;
     						},
     						style: {
								color: 'white',
								fontSize: '11pt',
								padding: '5px'
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
				$.getJSON('php/getCompareTeams.php'+args,function(data){
					var series = new Array();
					var num = getNumberOfTeams();
					var j = 0;
					while(j < num){
						series[j] = {data: []}; 
						series[j].name = teamNames[j];
						if(data.data.length == 0){
							alert('No Data found for '+teamNames[j]);
						}else{
							i = 0;
							while( i < data.data[0][j][teamNames[j]].length){
								series[j].data.push(data.data[0][j][teamNames[j]][i].wins);
								options.xAxis.categories.push(data.data[0][j][teamNames[j]][i].year);
								i++;
							}
							options.title.text += teamNames[j];
							if(j == (num-1)){
								options.title.text += ".";
							}else{
								options.title.text += " vs ";
							}
							options.series.push(series[j]);
						}
						j++;
					}	
					
					options.title.text = options.title.text + " - " + typeText;
					var chart = new Highcharts.Chart(options);
				});
			}
			
			function teamValidate(id,value){
				var num = teamsSelectSlots.length;
				//alert(num+" "+id+" "+value);
				var i = 0;
				var duplicate = 0;
				for(i = 0; i < num; i++){
					//alert("Teamslot:"+i+" = "+teamsSelectSlots[i]);
					if(teamsSelectSlots[i] == value){
						if(value != 0){
							alert('Country already selected!');
						}
						var e = document.getElementById(id.toString());
						e.selectedIndex = 0;	
						teamsSelectSlots[id] = 0;
						duplicate = 1;			
					}
				}
				if(duplicate != 1){
					//alert('Set!');
					teamsSelectSlots[id] = value;
				}
			}
	
			function getNumberOfTeams(){
				if(document.getElementById('numOfTeams') != null){
						var e = document.getElementById('numOfTeams');
   						var num = e.options[e.selectedIndex].value;
   						return num;
   				}		
			}
			

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
			<option value=4>4</option>
			<option value=5>5</option>
		</select></div>		
		<div id='teams'></div>
		<div>Select Match Type: <select id='matchTypeSelect'><option value='All Match Types' selected='true'>All Types</option>

			<option value='Test'>Test</option>

			<option value='ODI'>ODI</option>

			<option value='T20'>T20</option></select>

		</div>
		<div id='submit'></div>
	</body>
</html>
