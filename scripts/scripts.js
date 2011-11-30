
var VIS = VIS || {};

VIS.teamDataList = null;
VIS.vizEnum = {
    vizBasicGlobe: 1,
    vizCartGlobe: 2,
    vizTeamPerf: 3,
    vizBatStats:4,
    vizTeamGroundPerf:4
}

VIS.vizMenuEnum = {
    teamClick: 1,
    teamHover: 2,
    teamMulti: 3,
    matchTypeClick: 4,
    groundsClick: 5,
    playersClick: 6,
    playersMulti: 7,
}

var currentViz = null;
var currentVizId = null;

$(document).ready(function() {
    setupVizMenu();
    loadBasicGlobe();
    //loadTeams();
});

function setupVizMenu() {
    $('#vizList li').on('click', function(event) {
        var vizId = VIS.vizEnum[$(this).attr('id')];
        if (vizId == currentVizId)
            return;

        hideCurrentViz();
        switch(vizId) {
            case VIS.vizEnum.vizBasicGlobe:
                break;
            case VIS.vizEnum.vizCartGlobe:
                loadCartogramGlobe();
                break;
            case VIS.vizEnum.vizTeamPerf:
                loadTeamPerfGraph();
                break;
            case VIS.vizEnum.vizBatStats:
                break;
            case VIS.vizEnum.vizTeamGroundPerf:
                break;
        }
    });
}

function loadTeamHoverMenu() {
    console.log("Load teams called");
    $.getJSON('php/getTeams.php', function(data) {
        VIS.teamDataList = data;
        var $ul = $('<ul/>', {
            'class': 'teamList',
        });
        $.each(data, function(key, val) {
            var $team = $('<li id="' + val.code + '">' + val.name + '</li>')
                .appendTo($ul);
            $team.addClass('team');
            $team.data('lat', val.latitude);
            $team.data('lng', val.longitude);
            //addTeam(val.latitude, val.longitude);
            $team.hover(function() {
                var $this = $(this);
                currentViz.selectedTeamChanged($this);
            });
        });
        $ul.appendTo('body');
        console.log("load Teams attempted");
        if (currentViz != null) {
            currentViz.menuLoaded(VIS.vizMenuEnum.teamHover);
        }
        //finishSceneLoad();
    });
}

/*function finishSceneLoad() {
    loadBasicGlobe();
}*/

function hideCurrentViz() {
    if (currentViz)
        currentViz.unload();
}

function loadBasicGlobe() {
    currentViz = new VIS.BasicGlobe();
    currentViz.load();
    currentVizId = VIS.vizEnum.vizBasicGlobe;
}

function loadCartogramGlobe() {
    currentViz = new VIS.CartogramGlobe();
    currentViz.load();
    currentVizId = VIS.vizEnum.vizCartGlobe;
}

function loadTeamPerfGraph() {
    currentViz = new VIS.TeamPerfGraph();
    currentViz.load();
    currentVizId = VIS.vizEnum.vizTeamPerf;
}

