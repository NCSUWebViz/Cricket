var options;
var CountryName;
var CountryCode;
var xval;
var filterflag;
var filterval;
var filtertype;
	
function getData(){
		//alert('called');
		/*
		 * Get the Country Drop Down properties
		 */
		var e = document.getElementById("countrySelect");
		countryCode = e.options[e.selectedIndex].value;
		countryName = e.options[e.selectedIndex].text;
		e = document.getElementById("PlayerSelect");
		e.options.length = 0;
		//alert('php/getPlayerList.php?team='+countryName);
		$.getJSON('php/getPlayerList.php?team='+countryName,function populateList(data){
			var e = document.getElementById("PlayerSelect");
			var o;
			var i =0;
			
			
			while( i < data.data.length){
				o = document.createElement("option");
				o.text = data.data[i].name;
				o.value = data.data[i].id;
				i++;
				e.add(o, null);
			}
    		
            
    	});
		filterflag = 0;
		//alert(xval);
    	getPlayerData();
}

function resetfilter()
{
	filterflag = 0;
	getPlayerData();
}

function getPlayerDatabyYear()
{
	xval = 'year';
	getPlayerData();
}

function getPlayerData()
{
			/*
		 * Get the Match Type Drop Down properties
		 */
		//alert('here');
		var args = '';
		var e = document.getElementById("PlayerSelect");
		var playerName = e.options[e.selectedIndex].text;
		var playerId = e.options[e.selectedIndex].value;
		e = document.getElementById("SelectX");
		xval = e.options[e.selectedIndex].value;
		//alert('ikde');
		/*var args="";
		if(countryCode){
			args = "?id="+countryCode;
			if(matchType != "All Match Types"){
				args = args + "&type=" + matchType;
			}*/
			//alert(args);
		/*--remove comment later --}
		else{
			document.getElementById('container').innerHTML = "Select A Country!";
		}--remove comment later --*/

		//--------------------Declare options-----------------
		options =  {
		    chart: {
		        renderTo: 'container',
		        defaultSeriesType: 'spline',
		        zoomType: 'x',
		        type: 'column'
		    },
		    title: {
		        text: 'Batting Stats of ' + playerName 
		    },
		    xAxis: {
		        categories: [],
		         labels: {
			            rotation: -45,
			            align: 'right',
			            step: 1,
			            style: {
			                font: 'normal 12px Verdana, sans-serif'
			            }
			         }
		    },
		    yAxis: {
		        title: {
		            text: 'Number of Runs'
		        }
		    },
		    point: {
		    	
		    },
		    tooltip: {
				formatter: function() {
					var tooltip = '<b>Year:</b>'+ this.x + '<br /><b>'; /*+ 
					this.series.name +':</b> '+ this.y +'<br/>';*/
					return tooltip;
				}
			},
		    plotOptions: {
				column: {
					stacking: 'normal'
				},
				series: {
					cursor: 'pointer',
					point: {
						events: {
							click: function() {
								filterflag = 1;
								filtertype = xval;
								filterval = this.category;
								//document.write("<BR>Filtered by " + filtertype + " and value " + filterval + "<BR>");
								getPlayerData();
							}
						}	
					}
				}
			},	
		    series: []
		};	
		//----------------------------------------------------
		//alert("calling json function");
		var args = 'id='+playerId+'&type=ODI&x='+xval+'&y=scored_runs';
		if(filterflag == 1) {
			args = args + '&filtertype=' + filtertype + '&filterval=' + filterval;
		}
		
		//alert(args);
		$.getJSON('php/getPlayerBattingStat.php?'+args,function(data)
		{
			//alert(data.data.length);
			var total_runs = {data: []};
			total_runs.name = "Runs scored"; 	
			var i = 0;
			//alert(data.data[0][0].__count__);
			//alert(data.data.length);
			if(data.data.length == 0){
				options.title.text = "No Data Found";
				var chart = new Highcharts.Chart(options);
			}else{
				while( i < data.data.length){
				
					total_runs.data.push(data.data[i].total);
					options.xAxis.categories.push(data.data[i].x);
					i++;
				}
				options.series.push(total_runs);
				var chart = new Highcharts.Chart(options);	
			}
	});
}



