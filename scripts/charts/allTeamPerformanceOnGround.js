var options;
var VIS = VIS || {};

VIS.AllTeamPerfGround = function ($container, teamClickCallback)
{
    var venueId = null;
    var groundName = null;

    function load() {
    }

    function unload() {
        $('#container').html('');
    }

    function getData() {
        console.log("getData()", venueId);
        if (venueId == null)
            return;

        //alert('called');
        /*
        * Get the Country Drop Down properties
        */
        //var e = document.getElementById("countrySelect");
        //var countryCode = e.options[e.selectedIndex].value;
        //var countryName = e.options[e.selectedIndex].text;
        /*
        * Get the Match Type Drop Down properties
        */
        //var e = document.getElementById("matchTypeSelect");
        //var matchType = e.options[e.selectedIndex].value;

        var args="";
        args = "?id="+venueId;   
        //--------------------Declare options-----------------
        options = {
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
                formatter: function ()
                {
                    var groundSplit = options.title.text.split(",");
                    var percentQuantity = Math.round(parseInt(this.y)/parseInt(this.point.stackTotal)*100);
                    if (groundSplit[2] == this.x)
                    {
                        return '<b>Country:</b>' + this.x + '<br /><b>' +
            								this.series.name + ':</b> ' + this.y + '<br/>' +
            								"<b>Total Matches Played: </b>" + this.point.stackTotal + '<br />' +
                                            "<b>Percentage: </b>" + percentQuantity.toString() + '%<br />' +
											"<b>This is the Home Ground for " + this.x + "</b>";
                    }
                    else
                    {
                        return '<b>Country:</b>' + this.x + '<br /><b>' +
            								this.series.name + ':</b> ' + this.y + '<br/>' +
            								"<b>Total Matches Played: </b>" + this.point.stackTotal + '<br />'+
                                            "<b>Percentage: </b>" + percentQuantity.toString() + '%<br />';
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
        $.getJSON('php/getGroundperformanceAll.php' + args, function (data)
        {
            var series = {
                data: []
            };
            //alert(data.country);
            series.name = "Matches Won";
            options.title.text =  groundName + "," + data.city + "," + data.country;
            var i = 0;
            while (i < data.data[0].length)
            {
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
            while (i < data.data[0].length)
            {
                series.data.push(data.data[0][i].draws);
                options.xAxis.categories.push(data.data[0][i].countryName);
                i++;
            }
            options.series.push(series);

            series = {
                data: []
            };
            i = 0;
            series.name = "Matches Lost";
            while (i < data.data[0].length)
            {
                series.data.push(data.data[0][i].total - data.data[0][i].wins - data.data[0][i].draws);
                options.xAxis.categories.push(data.data[0][i].countryName);
                i++;
            }
            options.series.push(series);

            var chart = new Highcharts.Chart(options);
        });
    }

    function venueSelected($vtElement) {
        venueId = $vtElement.attr('id');
        groundName = $vtElement.text();
        console.log("Changing selected venue", $vtElement, venueId);
        getData();
    }

    this.load = load;
    this.unload = unload;
    this.venueSelected = venueSelected;
    this.requiredMenus = {
        'venueClick': venueSelected,
    };
};
