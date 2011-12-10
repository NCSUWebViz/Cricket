
var VIS = VIS || {};
VIS.Data = {};

VIS.optsMenu = null;
VIS.teamDataList = null;

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

VIS.vizLoadFuncs = {
    vizBasicGlobe: loadBasicGlobe,
    vizCartGlobe: loadCartogramGlobe,
    vizTeamPerf: loadTeamPerfGraph,
    vizBatStats: function(){},
    vizTeamGroundPerf: function(){},
    vizAllTeamGroundPerf: loadAllTeamPerfGround,
}

VIS.currentViz = null;
VIS.currentVizId = null;

$(document).ready(function() {
    setupVizMenu();
    setupOptionsMenu();
    loadBasicGlobe();
});

function setupVizMenu() {
    $('#vizList li').on('click', function(event) {
        console.log("Viz change attempted!!!!");
        var vizId = $(this).attr('id');
        if (vizId == VIS.currentVizId)
            return;

        console.log("Changing viz......");
        hideCurrentViz();
        VIS.vizLoadFuncs[vizId]();
        VIS.currentVizId = vizId;
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
    VIS.currentViz = new VIS.BasicGlobe();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadCartogramGlobe() {
    VIS.currentViz = new VIS.CartogramGlobe();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadTeamPerfGraph() {
    VIS.currentViz = new VIS.TeamPerfGraph();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadAllTeamPerfGround() {
    VIS.currentViz = new VIS.AllTeamPerfGround();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}
