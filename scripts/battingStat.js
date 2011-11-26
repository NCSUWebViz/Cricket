var options;	
function getData(){
			//alert("ikde!!!");
		//alert('called');
		/*
		 * Get the Country Drop Down properties
		 */
		/*--remove comment later --var e = document.getElementById("countrySelect");
		var countryCode = e.options[e.selectedIndex].value;
		var countryName = e.options[e.selectedIndex].text;--remove comment later --*/
		/*
		 * Get the Match Type Drop Down properties
		 */
		/*--remove comment later --var e = document.getElementById("matchTypeSelect");
		var matchType = e.options[e.selectedIndex].value;--remove comment later --*/

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
		        text: 'Batting Stats of Sachin R Tendulkar'
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
		    tooltip: {
				formatter: function() {
					/*var tooltip = '<b>Year:</b>'+ this.x + '<br /><b>' + 
					this.series.name +':</b> '+ this.y +'<br/>';*/
					return 'tooltip';
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
		var args = '';
		$.getJSON('php/getPlayerBattingStat.php?name=Sachin R Tendulkar&type=ODI&x=year&y=scored_runs'+args,function(data)
		{
			//alert(data.data.length);
			var total_runs = {data: []};
			total_runs.name = "Runs scored"; 	
			var i = 0;
			//alert(data.data[0][0].__count__);
			//alert(data.data[1].total);
			if(data.data.length == 0){
				options.title.text = "No Data Found";
				var chart = new Highcharts.Chart(options);
			}else{
				while( i < data.data.length){
					//alert(data.data[i].total);
					total_runs.data.push(data.data[i].total);
					//total_runs.data.push(0);
					//alert(total_runs.data[i]);
					//alert(data.data[i].year);
					options.xAxis.categories.push(data.data[i].year);
					i++;
				}
				//alert(total_runs.data[4]);
				options.series.push(total_runs);
				//alert(options.series[0].data[4]);
				//options.chart.type = 'column'
				var chart = new Highcharts.Chart(options);	
			}
	});
}

$(document).ready(function() {
	getData();	
});


