var options;
var VIS = VIS || {};

VIS.HeadToHead = function($container, teamClickCallback) {
    var countryCode = null;
    var countryName = null;
    var countryName1 = null;
    var matchType = null;
    var countryCode1 = null;
    var teamId = new Array();
	var teamNames = new Array();

    function load() {
    }

    function unload() {
        $('#container').html('');
    }

    function getData() {
        console.log("getData()", countryCode, countryCode1, matchType);
        
        if(countryCode && countryCode1)
        {
            teamId[0] = countryCode;
            teamId[1] = countryCode1;
            teamNames[0] = countryName;
            teamNames[1] = countryName1;
            var args="";
            args = "?teams="+countryCode+","+countryCode1;
            if(matchType != "All Types"){
                args = args + "&type=" + matchType;
            }

           //--------------------Declare options-----------------
					    options =  {
					        chart: {
					            renderTo: 'container',
					            defaultSeriesType: 'column',
					            zoomType: 'x',
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                plotBackgroundColor: 'rgba(0,0,0,0.8)'
					        },
					        title: {
					            text: 'Head to Head Performance Comparison of ',
				                style:
				                    {
					                    color: 'white',
					                    fontSize: '16px'
				                    }
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
     							    if(this.point.name != 'Drawn' && this.point.name){
     								    tooltip = "<b>Win rate for "+this.point.name+":</b> "+Math.round(this.percentage)+"%";
     							    }else if(this.point.name == 'Drawn'){
     								    tooltip = "<b>Matches with No Result or "+this.point.name+":</b> "+Math.round(this.percentage)+"%";
     							    }else if(this.series.name == 'Drawn'){
     								    tooltip = "<b>Matches with No Result or "+this.series.name +':</b> '+ this.y +'<br/>'+
        							    '<b>Playing Year:</b>'+ this.x + '<br /><b>' ;
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
					    var num = 2;
					    var countryData = new Array();
					    var i = 0;
					    while(i < (num+1)){
						    series[i] = {data: []}; 
						    series[i].name = teamNames[i];
						    countryData[i] = {};
						    if(i == num){
							    series[i].name = countryData[i].name = "Drawn";
							    //series[i].name = "Drawn";
						    }else{
							    countryData[i].name = teamNames[i];
						    }
						    countryData[i].y = 0;
						    i++;
					    }
					    series[3] = { center: [100, 80],
									    size: 150,
									    showInLegend: false,
									    dataLabels: {
											    enabled: true,
											    color: 'white'
									    },
									    data:[]
							    }		
					    series[3].type = 'pie';
					
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
							    series[2].data.push(data.data[0][i].draws);
							    countryData[2].y += data.data[0][i].draws;
							    options.xAxis.categories.push(data.data[0][i].year);
							    i++;
						    }
						
						    i=0;
						    while(i<3){
							    series[3].data.push(countryData[i]);
							    i++;
						    }
						    options.title.text = options.title.text + teamNames[0] + " and " + teamNames[1] + " in " + matchType;
						    options.series.push(series[0]);
						    options.series.push(series[1]);
						    options.series.push(series[2]);
						    options.series.push(series[3]);
					    }
					
					
					    var chart = new Highcharts.Chart(options);
				    });
                }
    }

    function teamSelected($teamElement) {
        countryCode = $teamElement.attr('id');
        countryName = $teamElement.text();
        console.log("Changing selected team", $teamElement, countryCode,
                countryName);
        if(validateData())
        {
            getData();
        }
    }

     function teamSelected1($teamElement1) {
        countryCode1 = $teamElement1.attr('id');
        countryName1 = $teamElement1.text();
        console.log("Changing selected team", $teamElement1, countryCode1,
                countryName1);
        if(validateData())
        {
            getData();
        }
    }

    function matchTypeSelected($mtElement)
    {
        matchType = $mtElement.attr('id');
        //matchTypeName = $mtElement.value();
        console.log("Changing selected match type", $mtElement, matchType);
        if(validateData())
        {
            getData();
        }
    }

    function validateData()
    {
        if(countryCode && countryCode1)
        {
            if(countryCode == countryCode1)
            {
                document.getElementById('container').innerHTML = "Select Two different Countries for comparison!";
            }
        }
        return matchType && countryCode1 && countryCode && (countryCode != countryCode1);
    }

    this.load = getData;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.matchTypeSelected = matchTypeSelected;
    this.requiredMenus = {
        'teamClick': teamSelected,
        'teamClick_2': teamSelected1,
        'matchTypeClick': matchTypeSelected
    };
};
