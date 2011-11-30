
var VIS = VIS || {};

VIS.BasicGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    var teamHighlightMeshes = new Array();

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        globe.render();
    }

    function load() {
        $container = $container || $('#container');
        $container.click(globeClicked);
        projector = new THREE.Projector();
        loadModels();
    }

    function unload() {
        $container.html('');
        //$('.teamList').html('');
        delete projector;
        delete teamHighLightMeshes;
        delete globe;
    }

    function loadModels() {
        globe = new DAT.Globe(container, null, null, false);
        $.getJSON('testdata/stats.json', function(data) {
            for (i=0;i<data.length;i++) {
                globe.addData(data[i][1], {
                    format: 'magnitude',
                    name: data[i][0],
                    animated: true,
                    models: data[i][2]
                });
            }
            console.log("loaded!");
            loadTeams();
            animate();
        });
    }

    /*function loadTeams() {
        console.log("Load teams called");
        $.getJSON('php/getTeams.php', function(data) {
            var teamItems = [];
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(data, function(key, val) {
                var $team = $('<li id="' + val.code + '">' + val.name + '</li>')
                    .appendTo($ul);
                $team.addClass('team');
                $team.data('lat', val.latitude);
                $team.data('lng', val.longitude);
                addTeam(val.latitude, val.longitude);
                $team.hover(function() {
                    var $this = $(this);
                    globe.curLat = $this.data('lat');
                    globe.curLong = $this.data('lng');
                });
            });
            $ul.appendTo('body');
            console.log("load Teams attempted");
        });
    }*/

    function loadTeams() {
        if (VIS.teamDataList == null)
            return;

        $.each(VIS.teamDataList, function(key, val) {
            addTeam(val.latitude, val.longitude, val.code);
        });
    }

    function addTeam(lat, lng, code) {
        var mesh = globe.addHighlight(lat, lng, null);
        teamHighlightMeshes.push(mesh);
    }

    function globeClicked(event) {
        console.log("Globe clicked");
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );
        projector.unprojectVector( vector, globe.camera );
        var ray = new THREE.Ray( globe.camera.position,
                vector.subSelf( globe.camera.position ).normalize() );
        var hits = ray.intersectObjects(teamHighlightMeshes);
        if (hits.length) {
            console.log("Team Location clicked!", hits);
            if (teamClickCallback) {
                teamClickCallback(null);
            }
        } else {
            console.log("Click detected, but no target was hit.");
        }
    }

    function selectedTeamChanged($teamElement) {
        globe.curLat = $teamElement.data('lat');
        globe.curLong = $teamElement.data('lng');
    }

    this.load = load;
    this.unload = unload;
    this.selectedTeamChanged = selectedTeamChanged;
};
