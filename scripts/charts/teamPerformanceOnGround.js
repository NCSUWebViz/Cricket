var options;
var VIS = VIS || {};

VIS.TeamPerfOnGround = function ($container, teamClickCallback)
{
    var venueId = null;
    var groundName = null;

    function load()
    {
    }

    function unload()
    {
        $('#container').html('');
    }

    function getData()
    {
        console.log("getData()", venueId, teamId);

        var args = "";
        args = "?venueId=" + venueId + "&teamId=" + teamId;
        //--------------------Declare options-----------------
						options =  {
						    chart: {
						        renderTo: 'container',
						        defaultSeriesType: 'column',
						        backgroundColor: 'rgba(0,0,0,0.8)',
						        plotBackgroundColor: 'rgba(0,0,0,0.8)',
						        zoomType: 'y'
						    },
						    title: {
						        text: null,
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
						$.getJSON('php/getTeamPerformanceOnGround.php'+args,function(data){
						var series= new Array()
						series[0] = {
					  			data: []
					  		};
						
						series[0].name = "Matches Won";
						options.title.text = "Performance of "+ teamName + " On " + groundName + "," + data.groundCity + "," + data.groundCountry;
						var i = 0;
						while( i < data.data[0].length){
							series[0].data.push(data.data[0][i].wins);
							options.xAxis.categories.push(data.data[0][i].year);
							i++;
						}
						
						options.series.push(series[0]);

						series[1] = {
					  			data: []
					  		};
						series[1].name = "Matches Drawn";
						var i = 0;
						while( i < data.data[0].length){
							series[1].data.push(data.data[0][i].draws);
							options.xAxis.categories.push(data.data[0][i].year);
							i++;
						}
						options.series.push(series[1]);

						series[2] = {
					  			data: []
					  		};
					  	i=0;
					  	series[2].name = "Matches Lost";	
						while( i < data.data[0].length){
							series[2].data.push(data.data[0][i].total-data.data[0][i].wins-data.data[0][i].draws);
							options.xAxis.categories.push(data.data[0][i].year);
							i++;	
						}
						options.series.push(series[2]);
						var chart = new Highcharts.Chart(options);	
				});				
    }

    function venueSelected($vtElement)
    {
        venueId = $vtElement.attr('id');
        groundName = $vtElement.text();
        console.log("Changing selected venue", $vtElement, venueId);
        if (enoughValues())
        {
            getData();
        }
    }

    function teamSelected($tcElement)
    {
        teamId = $tcElement.attr('id');
        teamName = $tcElement.text();
        console.log("Changing selected venue", $tcElement, teamId);
        if (enoughValues())
        {
            getData();
        }
    }

    function enoughValues()
    {
        return venueId && teamId;
    }

    this.load = load;
    this.unload = unload;
    this.venueSelected = venueSelected;
    this.teamSelected = teamSelected;
    this.requiredMenus = {
        'venueClick': venueSelected,
        'teamClick': teamSelected
    };
};
