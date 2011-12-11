
var VIS = VIS || {};
VIS.Data = {};

VIS.optsMenu = null;
VIS.teamDataList = null;

VIS.vizLoadFuncs = {
    vizBasicGlobe: loadBasicGlobe,
    vizCartGlobe: loadCartogramGlobe,
    vizTeamPerf: loadTeamPerfGraph,
    vizBatStats: loadBatStats,
    vizAllTeamGroundPerf: loadAllTeamPerfGround,
    vizCompareTeams: loadCompareTeams,
    vizHeadToHead: loadHeadToHead,
    vizSeriesPerf: loadSeriesPerf,
    vizTeamPerfOnGround: loadTeamPerfOnGround,
}

VIS.currentViz = null;
VIS.currentVizId = null;

$(document).ready(function() {
    var $container = $container || $('#container');
    $container.height($(window).height());
    $container.width($(window).width());
    setupVizMenu();
    setupOptionsMenu();
    loadBasicGlobe();
});

function setupVizMenu() {
    $('#vizList li').on('click', function(event) {
        var vizId = $(this).attr('id');
        if (vizId == VIS.currentVizId)
            return;

        hideCurrentViz();
        VIS.vizLoadFuncs[vizId]();
        VIS.currentVizId = vizId;
    });
    $('#vizNav').hoverIntent(
        function () {
            $("#vizList").animate({"left":"2em"});
        },
        function () {
            $("#vizList").animate({"left":"-13em"});
        }
    );
}

function setupOptionsMenu() {
    $('#optionsMenu').hoverIntent(
        function () {
            $("#optionsMenu").children().animate({"bottom":"0em"});
        },
        function () {
            $("#optionsMenu").children().animate({"bottom":"-21em"});
        }
    );
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

function loadBatStats() {
    VIS.currentViz = new VIS.BatStats();
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

function loadCompareTeams() {
    VIS.currentViz = new VIS.CompareTeams();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadHeadToHead() {
    VIS.currentViz = new VIS.HeadToHead();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadSeriesPerf() {
    VIS.currentViz = new VIS.SeriesPerf();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

function loadTeamPerfOnGround() {
    VIS.currentViz = new VIS.TeamPerfOnGround();
    VIS.currentViz.load();
    VIS.optsMenu.setupMenus(VIS.currentViz.requiredMenus);
}

