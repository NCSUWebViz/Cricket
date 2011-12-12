var options;
var VIS = VIS || {};

VIS.SeriesPerf = function ($container, teamClickCallback)
{
    var countryCode = null;
    var countryName = null;
    var matchType = null;

    function load()
    {
    }

    function unload()
    {
        $('#container').html('');
    }

    function getData()
    {
        console.log("getData()", countryCode, matchType);
        if (countryCode && matchType)
        {
            args = "?id=" + countryCode;
            if (matchType != "All Types")
            {
                args = args + "&type=" + matchType;
            }

            //--------------------Declare options-----------------
            options = {
                chart: {
                    renderTo: 'container',
                    defaultSeriesType: 'spline',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    plotBackgroundColor: 'rgba(0,0,0,0.8)',
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
                        text: 'Number of Series'
                    }
                },
                tooltip: {
                    formatter: function ()
                    {
                        var tooltip = '<b>Year:</b>' + this.x + '<br /><b>' +
					    this.series.name + ':</b> ' + this.y + '<br/>';
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

            console.log("Calling service: php/getSeriesData.php" + args);
            $.getJSON('php/getSeriesData.php' + args, function (data)
            {
                var won_series = { data: [] }; var lost_series = { data: [] }; var draw_series = { data: [] };
                won_series.name = "Series Won"; lost_series.name = "Series Lost"; draw_series.name = "Series Drawn";
                var i = 0;
                if (data.data.length == 0)
                {
                    options.title.text = "No Data Found for " + countryName + "-" + matchType;
                    var chart = new Highcharts.Chart(options);
                } else
                {
                    while (i < data.data[0].length)
                    {
                        won_series.data.push(data.data[0][i].wins);
                        lost_series.data.push(data.data[0][i].total - data.data[0][i].draws - data.data[0][i].wins);
                        draw_series.data.push(data.data[0][i].draws);
                        options.xAxis.categories.push(data.data[0][i].year);
                        i++;
                    }
                    options.series.push(won_series);
                    options.series.push(lost_series);
                    options.series.push(draw_series);
                    var chart = new Highcharts.Chart(options);
                }
            });
        }
    }

    function teamSelected($teamElement)
    {
        countryCode = $teamElement.attr('id');
        countryName = $teamElement.text();
        console.log("Changing selected team", $teamElement, countryCode,
                countryName);
        getData();
    }

    function matchTypeSelected($mtElement)
    {
        matchType = $mtElement.attr('id');
        console.log("Changing selected match type", $mtElement, matchType);
        if (enoughValues())
        {
            getData();
        }
    }

    function enoughValues()
    {
        return matchType && countryCode;
    }

    this.load = getData;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.matchTypeSelected = matchTypeSelected;
    this.requiredMenus = {
        'teamClick': teamSelected,
        'matchTypeClick': matchTypeSelected
    };
};
