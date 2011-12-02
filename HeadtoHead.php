<!DOCTYPE HTML>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>Highcharts Example</title>
		
		
		<!-- 1. Add these JavaScript inclusions in the head of your page -->
		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
		<script type="text/javascript" src="scripts/js/highcharts.js"></script>
		<!-- <script type="text/javascript" src="scripts/js/themes/gray.js"></script> -->
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
				e = document.getElementById("submit");
				deleteElements(e);
				e = document.getElementById("teams");
				deleteElements(e);
				
				id=0;
   				while(j < num){
					$.getJSON('php/getTeamList2.php',function populateList(data){
						var o;
						var label = document.createElement('h7');
						label.innerHTML = "Team "+(id+1)+": ";
						e.appendChild(label);
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
   				addSubmitButton();
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
					        defaultSeriesType: 'column',
					        zoomType: 'x'
					    },
					    title: {
					        text: 'Head to Head Performance Comparison of '
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
     							var tooltip = "";
     							if(this.point.name){
     								tooltip = "<b>Win rate for "+this.point.name+":</b> "+Math.round(this.percentage)+"%";
     							}else{
        							tooltip = "<b>Matches won by "+this.series.name +':</b> '+ this.y +'<br/>'+
        							'<b>Playing Year:</b>'+ this.x + '<br /><b>' ;
        						}
        						return tooltip;
     						},
     						style: {
								color: 'black',
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
				$.getJSON('php/getCompareTwoTeams.php'+args,function(data){
					var series = new Array();
					var num = getNumberOfTeams();
					var countryData = new Array();
					var i = 0;
					while(i < num){
						series[i] = {data: []}; 
						series[i].name = teamNames[i];
						countryData[i] = {};
						countryData[i].name = teamNames[i];
						countryData[i].y = 0;
						i++;
					}
					series[num] = { center: [100, 80],
									size: 150,
									showInLegend: false,
									dataLabels: {
											enabled: true
									},
									data:[]
							}		
					series[num].type = 'pie';
					
					if(data.data[0].length == 0){
						options.title.text = "Oops! It seems that "+teamNames[0]+ " and "+teamNames[1]+" haven't played each other!";
						var chart = new Highcharts.Chart(options);
					}else{
						if(data.data[0].length > 50){
							options.xAxis.labels.step = 2;
						}else{
							options.xAxis.labels.step = 1;
						}
						i = 0;
						while( i < data.data[0].length){
							series[0].data.push(data.data[0][i].country1);
							countryData[0].y += data.data[0][i].country1;
							series[1].data.push(data.data[0][i].country2);
							countryData[1].y += data.data[0][i].country2;
							options.xAxis.categories.push(data.data[0][i].year);
							i++;
						}
						
						i=0;
						while(i<num){
							series[num].data.push(countryData[i]);
							//series[2].data.push(countryData[1]);
							i++;
						}
						options.title.text = options.title.text + teamNames[0] + " and " + teamNames[1] + " in " + typeText;
						options.series.push(series[0]);
						options.series.push(series[1]);
						options.series.push(series[2]);
					}
					
					
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
   						var num = document.getElementById('numOfTeams').value;
   						return num;
   				}		
			}
			
			function addSubmitButton(){
				var e = document.getElementById("submit");
   				var submitButton = document.createElement('input');
   				submitButton.setAttribute('value','Compare!');
   				submitButton.setAttribute('type','button');
   				submitButton.onclick = getData;
   				e.appendChild(submitButton);
			}

			function deleteElements(e){
				if ( e.hasChildNodes() )
				{
				    while ( e.childNodes.length >= 1 )
				    {
				        e.removeChild( e.firstChild );       
				    } 
				}
			}
			
			$(document).ready(function() {
   				loadTeams();
 			});
		</script>
		
	</head>
	<body>
		
		<!-- 3. Add the container -->
		<div id="container" style="width: 1600px; height: 600px; margin: 0 auto"></div>
		<div><input type='hidden' id='numOfTeams' value=2></div>		
		<div id='teams'></div>
		<div>Select Match Type: <select id='matchTypeSelect'><option value='All Match Types' selected='true'>All Types</option>
			<option value='Test'>Test</option>
			<option value='ODI'>ODI</option>
			<option value='T20'>T20</option></select>
		</div>
		<div id='submit'></div>
	</body>
</html>
