
var VIS = VIS || {};
VIS.Data = {};

VIS.optsMenu = null;
VIS.teamDataList = null;
VIS.vizEnum = {
    vizBasicGlobe: 1,
    vizCartGlobe: 2,
    vizTeamPerf: 3,
    vizBatStats: 4,
    vizTeamGroundPerf: 5,
    vizAllTeamGroundPerf: 6
}

VIS.vizMenuEnum = {
    teamClick: 1,
    teamHover: 2,
    teamMulti: 3,
    matchTypeClick: 4,
    groundsClick: 5,
    playersClick: 6,
    playersMulti: 7,
    yearVenueOpponent: 8,
    venueClick:9
}

VIS.currentViz = null;
VIS.currentVizId = null;

$(document).ready(function() {
    setupVizMenu();
    setupOptionsMenu();
    loadBasicGlobe();
    //setupOptionsMenu();
    //loadTeams();
});

function setupVizMenu() {
    $('#vizList li').on('click', function(event) {
        console.log("Viz change attempted:", $(document));
        var vizId = VIS.vizEnum[$(this).attr('id')];
        if (vizId == VIS.currentVizId)
            return;

        hideCurrentViz();
        switch(vizId) {
            case VIS.vizEnum.vizBasicGlobe:
                loadBasicGlobe();
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
            case VIS.vizEnum.vizAllTeamGroundPerf:
                loadAllTeamPerfGround();
                break;
        }
    });
}

function setupOptionsMenu() {
    VIS.optsMenu = new VIS.Menu('#optionsMenu');
}

function hideCurrentViz() {
    if (VIS.currentViz) {
        VIS.currentViz.unload();
        delete VIS.currentViz;
    }
}

function loadBasicGlobe() {
    console.log("loading basic globe");
    VIS.currentViz = new VIS.BasicGlobe();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
    VIS.currentVizId = VIS.vizEnum.vizBasicGlobe;
}

function loadCartogramGlobe() {
    VIS.currentViz = new VIS.CartogramGlobe();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
    VIS.currentVizId = VIS.vizEnum.vizCartGlobe;
}

function loadTeamPerfGraph() {
    VIS.currentViz = new VIS.TeamPerfGraph();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
    VIS.currentVizId = VIS.vizEnum.vizTeamPerf;
}

function loadAllTeamPerfGround()
{
    VIS.currentViz = new VIS.AllTeamPerfGround();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
    VIS.currentVizId = VIS.vizEnum.vizAllTeamGroundPerf;
}