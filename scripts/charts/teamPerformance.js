var options;
var VIS = VIS || {};

VIS.TeamPerfGraph = function($container, teamClickCallback) {
    var countryCode = null;
    var countryName = null;
    var matchType = "All Match Types";

    function load() {
    }

    function unload() {
        $('#container').html('');
    }

    function getData() {
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
        if(countryCode){
            args = "?id="+countryCode;
            if(matchType != "All Match Types" && matchType != "All Types"){
                args = args + "&type=" + matchType;
            }
            //alert(args);
        }
        else{
            document.getElementById('container').innerHTML = "Select A Country!";
        }

        //--------------------Declare options-----------------
        options =  {
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'spline',
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
                    text: 'Number of Matches'
                }
            },
            tooltip: {
                formatter: function() {
                    var tooltip = '<b>Year:</b>'+ this.x + '<br /><b>' + 
                    this.series.name +':</b> '+ this.y +'<br/>';
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
        //----------------------------------------------------
        //alert("calling json function");
        console.log("Calling service: php/getTeamPerformance.php"+args);
        $.getJSON('php/getTeamPerformance.php'+args,function(data){
            console.log("Team Performance data:", data);
            var won_series = {data: []};
            var lost_series = {data: []};
            var draw_series = {data: []};
            won_series.name = "Matches Won";
            lost_series.name = "Matches Lost";
            draw_series.name = "Matches Drawn";
            var i = 0;
            //alert(data.data[0][0].__count__);
            if(data.data.length == 0){
                options.title.text = "No Data Found for "+countryName + "-" + matchType;
                var chart = new Highcharts.Chart(options);
            } else{
                while( i < data.data[0].length){
                    won_series.data.push(data.data[0][i].wins);
                    lost_series.data.push(data.data[0][i].total-data.data[0][i].draws-data.data[0][i].wins);
                    draw_series.data.push(data.data[0][i].draws);
                    options.xAxis.categories.push(data.data[0][i].year);
                    i++;
                }
                options.series.push(won_series);
                options.series.push(lost_series);
                options.series.push(draw_series);
                //series = {
                //        data: []
                //    };
                //i=0;

                //while( i < data.data[0].length){
                //    series.data.push(data.data[0][i].total);
                //    options.xAxis.categories.push(data.data[0][i].year);
                //    i++;
                //}
                //options.series.push(series);
                var chart = new Highcharts.Chart(options);
            }
        });
    }

    function teamSelected($teamElement) {
        /*var lat, lng;
        if (!$teamElement.data('lat') || !$teamElement.data('lng')) {
            var code = $teamElement.attr('id');
            if (teamCache[code] == undefined) {
                console.log('Error: Invalid team selected', $teamElement, code);
                return;
            }
            lat = teamCache[code].lat;
            lng = teamCache[code].lng;
        } else {
            lat = $teamElement.data('lat');
            lng = $teamElement.data('lng');
        }
        console.log("Changing selected team", $teamElement, lat, lng);
        globe.curLat = lat;
        globe.curLong = lng;*/
        countryCode = $teamElement.attr('id');
        countryName = $teamElement.text();
        console.log("Changing selected team", $teamElement, countryCode,
                countryName);
        getData();
    }

    function matchTypeSelected($mtElement) {
        matchType = $mtElement.attr('id');
        console.log("Changing selected match type", $mtElement, matchType);
        getData();
    }

    this.load = getData;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.matchTypeSelected = matchTypeSelected;
    this.requiredMenus = [
        VIS.vizMenuEnum.teamClick,
        VIS.vizMenuEnum.matchTypeClick
    ];
};
