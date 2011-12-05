var VIS = VIS || {};

VIS.CartogramGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    var svgCanvas;
    var svgTexture;
    var teamHighlightMeshes = new Array();

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        svgCanvas = document.getElementById('svgCanvas');
        var worldImage = document.getElementById('cartogramSvgChart');
        var svg = $.trim(worldImage.innerHTML);
        canvg(svgCanvas, svg);
        svgTexture.needsUpdate = true;
        globe.render();
    }

    function load() {
        $container = $container || $('#container');
        $container.click(globeClicked);
        projector = new THREE.Projector();
        loadSvgCanvasGlobe();
    }

    function unload() {
        $container.unbind('click', globeClicked);
        $container.html('');
        delete teamHighLightMeshes;
        delete globe;
        delete projector;
        $(svgCanvas).html('');
    }

    function loadSvgCanvasGlobe() {
        var chart = document.getElementById('cartogramSvgChart');
        var svg = chart.innerHTML;
        svg = $.trim(svg);
        svgCanvas = document.getElementById('svgCanvas');
        canvg(svgCanvas, svg, { ignoreAnimations: false,
                forceRedraw: function() { return false; }});

        svgTexture = new THREE.Texture(svgCanvas);
        console.log("Canvas (svg?):", svgCanvas);
        console.log("CanvasTexture:", svgTexture);
        svgTexture.needsUpdate = true;

        globe = new DAT.Globe(container, null, null, false,
                    svgTexture);
        renderer = globe.renderer;
        animate();
        loadTeams();
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

    function addTeam(lat, lng) {
        var mesh = globe.addHighlight(lat, lng, null);
        teamHighlightMeshes.push(mesh);
    }

    function globeClicked(event) {
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

    function teamSelected($teamElement) {
        globe.curLat = $teamElement.data('lat');
        globe.curLong = $teamElement.data('lng');
    }

    this.load = load;
    this.unload = unload;
    this.teamSelected = teamSelected;
}
