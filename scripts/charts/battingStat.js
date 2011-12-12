var VIS = VIS || {};

VIS.BatStats = function($container) {
    var options;
    var countryName;
    var countryCode;
    var playerName;
    var playerId;
    var xval;
    var filterflag;
    var filterval;
    var filtertype;
    var yval;
    var xval;


    // Load function for integration purposes
    function load() {}

    // Unload function for integration purposes
    function unload() {}

    function getData(){
        var e = document.getElementById("countrySelect");
        countryCode = e.options[e.selectedIndex].value;
        countryName = e.options[e.selectedIndex].text;
        e = document.getElementById("PlayerSelect");
        e.options.length = 0;
        $.getJSON('php/getPlayerList.php?team='+countryName,
            function populateList(data){
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
        //getPlayerData();
    }

    function resetfilter() {
        filterflag = 0;
        var div = document.getElementById("filter");
        div.innerHTML = '';
        var temp = document.getElementById("resetFilter");
        temp.style.visibility = "hidden";
        getPlayerData();
    }

    function getSelectedPlayerData() {
        resetfilter();
        //getPlayerData();
    }

    function getPlayerData() {
        var args = '';
        //var e = document.getElementById("PlayerSelect");
        //var playerName = e.options[e.selectedIndex].text;
        //var playerId = e.options[e.selectedIndex].value;
        //e = document.getElementById("SelectX");
        //xobj = e.options[e.selectedIndex];
        //xval = xobj.value;
        //xid = xobj.text;
        //e = document.getElementById("SelectY");
        //yobj = e.options[e.selectedIndex];
        //yval = yobj.value;
        //yid = yobj.text;


        //--------------------Declare options-----------------
        options =  {
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'spline',
                zoomType: 'x',
                type: 'column',
                backgroundColor: 'rgba(0,0,0,0.8)',
                plotBackgroundColor: 'rgba(0,0,0,0.8)'
            },
            title: {
                text: 'ODI Batting Stats of ' + playerName,
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
                        step: 1,
                        style: {
                            font: 'normal 12px Verdana, sans-serif',
	                        color: 'white',
	                        fontSize: '16px'
                        }
                     }
            },
            yAxis: {
                title: {
                    text: 'Number of Runs',
                    style:
                    {
	                    color: 'white',
	                    fontSize: '16px'
                    }
                }
            },
            point: {

            },
            tooltip: {
                formatter: function() {
                    var tooltip = '<b>'+xid+':</b>'+ this.x + '<br />' +
                    '<b>'+yid+':</b>'+ this.y + '<br />' ; /*+
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
                                filtername = xid;
                                //alert(xval);
                                filterval = this.category;
                                e = xid;
                                if(xval == 'year')
                                    xval = 'vsTeam_id';
                                else
                                    xval = 'year';
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
        var args = 'id='+playerId+'&type=ODI&x='+xval+'&y='+yval;
        if(filterflag == 1) {
            args = args + '&filtertype=' + filtertype + '&filterval=' + filterval;
        }

        $.getJSON('php/getPlayerBattingStat.php?'+args,function(data)
        {
            //alert(data.data.length);
            var total_runs = {data: []};
            total_runs.name = yid + " by each " + xid ;
            var i = 0;
            if(data.data.length == 0){
                options.title.text = "No Data Found";
                var chart = new Highcharts.Chart(options);
            }else{
                while( i < data.data.length){

                    total_runs.data.push(data.data[i].total);
                    options.xAxis.categories.push(data.data[i].x);
                    i++;
                }
                options.yAxis.title.text = yid;
                options.series.push(total_runs);
                var chart = new Highcharts.Chart(options);
            }
        });
    }

    function teamSelected($teamElement) {
        countryName = $teamElement.text();
        console.log("Batting stats ts:", $teamElement, countryName);
        //VIS.Menu.update('playerClick', {'countryName': countryName});
        VIS.optsMenu.updatePlayerClick(1, 'playerClick', playerSelected,
                {'countryName': countryName});
        if (enoughValues())
            getPlayerData();
    }

    function playerSelected($playerElement) {
        console.log("Player selected!", $playerElement);
        playerId = $playerElement.attr('id');
        playerName = $playerElement.text();
        if (enoughValues())
        {
            resetfilter();
            getPlayerData();
        }
    }

    function xAxisSelected($xAxisEl){
        console.log("X-Axis changed:", $xAxisEl);
        xval = $xAxisEl.attr('id');
        xid = $xAxisEl.text();
        if (enoughValues())
            getPlayerData();
    }

    function yAxisSelected($yAxisEl){
        console.log("Y-Axis changed:", $yAxisEl);
        yval = $yAxisEl.attr('id');
        yid = $yAxisEl.text();
        if (enoughValues())
            getPlayerData();
    }

    function resetfilter()
    {
	    filterflag = 0;
    }

    function enoughValues() {
        return countryName && playerId && playerName && xid
            && xval && yid && yval;
    }

    this.load = load;
    this.unload = unload;
    this.requiredMenus = {
        'teamClick': teamSelected,
        'playerClick': playerSelected,
        'xAxis': xAxisSelected,
        'yAxis': yAxisSelected,
    }
}

