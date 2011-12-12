var options;
var teamsSelectSlots = new Array();


VIS.CompareTeams = function($container) {
    var MAX_TEAMS = 5;
    var matchType;
    var teamsList = {};

    function getData(){
        var teamId = new Array();
        var teamNames = new Array();
        var args = "";
        args += '?teams=';
        $.each(teamsList, function(idx, team) {
            if (idx != 1)
                args += ',';
            args += team.id;
            teamNames.push(team.name);
        });


        if(matchType != 'All Types' ) {
            args += '&type=';
            args += matchType;
        }
        //alert(args);
        //--------------------Declare options-----------------
        options =  {
            chart: {
                renderTo: 'container',
                defaultSeriesType: 'spline',
                zoomType: 'x',
                backgroundColor: 'rgba(0,0,0,0.8)',
                plotBackgroundColor: 'rgba(0,0,0,0.8)'
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
        console.log("Calling getCompareTeams:", args);
        $.getJSON('php/getCompareTeams.php'+args,function(data){
            console.log("getCompareTeams rtn:", data);
            var series = new Array();
            var num = getNumberOfTeams();
            var j = 0;
            while(j < num){
                series[j] = {data: []};
                series[j].name = teamNames[j];

                if(data.data[0][j][teamNames[j]].length > 40){
                    options.xAxis.labels.step = 2;
                }else{
                    options.xAxis.labels.step = 1;
                }
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

            options.title.text = options.title.text + " - " + matchType;
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

    function getNumberOfTeams() {
        var i = 0;
        $.each(teamsList, function(key, val){
            i++;
        });
        return i;
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

    function teamSelected(idx) {
        return function($teamElement) {
            var newTeam = {
                id: $teamElement.attr('id'),
                code: $teamElement.attr('code'),
                name: $teamElement.text()
            };
            //if (teamsList.length >= 5)
                //teamsList.shift();

            //teamsList.push(newTeam);
            teamsList[idx] = newTeam;
            if (enoughData())
                getData();

            //console.log("Setting new menu...");
            //this.requiredMenus.teamClick_2 = teamSelected;
            //VIS.optsMenu.setupMenus();
        }
    }

    function matchTypeSelected($mtElement) {
        matchType = $mtElement.attr('id');
        console.log("Changing selected match type");
        if (enoughData())
            getData();
    }

    function enoughData() {
        return teamsList && matchType;
    }

    this.load = function() {};
    this.unload = function() {};
    this.requiredMenus = {
        'teamClick': teamSelected(1),
        'teamClick_2': teamSelected(2),
        'teamClick_3': teamSelected(3),
        'teamClick_4': teamSelected(4),
        'teamClick_5': teamSelected(5),
        'matchTypeClick': matchTypeSelected,
    };
}
