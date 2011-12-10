var VIS = VIS || {};

VIS.CartogramGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    var svgCanvas;
    var svgTexture;
    var clickableMeshes = [];
    var teamHighlightMeshes = {};
    var $yearSlider = $("<div id='yearSlider'>");
    var cartogramSvgChart = document.getElementById('cartogramSvgChart');
    var svgCanvas = document.getElementById('svgCanvas');
    var ctx = svgCanvas.getContext('2d');
    var renderNow = true;

    var matchType = null;

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        // Serialize the SVG DOM as XML
        //var svg_xml = (new XMLSerializer())
            //.serializeToString(svg);

        //var img = new Image();
        // Base64-encode the XML as data URL
        //img.src = "data:image/svg+xml;base64," + btoa(svg);
        // Draw the SVG-in-img into Canvas
        //img.onload = function() {
            //ctx.drawImage(img,0,0);
        //}

        //ctx.drawSvg(svg); // NOTE: this also works pretty well.
        //svgTexture.needsUpdate = true;
        //updateSvgCanvas();
        globe.render();
    }

    function updateSvgCanvas() {
        if (!renderNow)
            return;

        renderNow = false;
        var svg = cartogramSvgChart.innerHTML;
        //console.log("SVG:", svg);
        canvg(svgCanvas, svg, {
            renderCallback: function() {
                //console.log("Update svg canvas called");
                svgTexture.needsUpdate = true;
                renderNow = true;
            }
        });
    }

    function load() {
        $container = $container || $('#container');
        $container.click(globeClicked);
        projector = new THREE.Projector();
        loadUI();
        loadSvgCanvasGlobe();

        // NOTE: Either use this, or call updateSvgCanvas from render()
        setInterval(updateSvgCanvas, 100);
    }

    function unload() {
        $container.unbind('click', globeClicked);
        $container.html('');
        delete teamHighLightMeshes;
        delete globe;
        delete projector;
        $(svgCanvas).html('');
    }

    function loadUI() {
        $container.append($yearSlider);
    }

    function getData() {
        console.log("getData()", matchType);
        //if (matchType == null)
            //return;

        var args="";
        if(matchType != "All Match Types" && matchType != "All Types"){
                args = args + "&type=" + matchType;
        }

        $.getJSON('php/AccumulatedWins.php'+args, function(data) {
            console.log("AccumulateWins returned", data);
            var years = [];
            for(var key in data) {
                if(data.hasOwnProperty(key)) {
                    years.push(parseInt(key));
                }
            }
            //years.sort();
            console.log("Accumulated wins", years);

            $yearSlider.slider({
                min: years[0],
                max: years[1],
                value: years[0],
                slide: function(e, ui) {
                    year = ui.value;
                    updateYear();
                    //vis.render();
                }
            });
            console.log("Year slider:", $yearSlider);
        });
    }

    function updateYear() {
    }

    function loadSvgCanvasGlobe() {
        var chart = document.getElementById('cartogramSvgChart');
        var svg = chart.innerHTML;
        svg = $.trim(svg);
        //svgCanvas = document.getElementById('svgCanvas');
        //canvg(svgCanvas, svg, { ignoreAnimations: false,
                //forceRedraw: function() { return false; }});

        svgTexture = new THREE.Texture(svgCanvas);
        svgTexture.minFilter = THREE.LinearFilter;
        svgTexture.magFilter = THREE.LinearFilter;
        console.log("Canvas (svg?):", svgCanvas);
        console.log("CanvasTexture:", svgTexture);
        svgTexture.needsUpdate = true;

        globe = new DAT.Globe(container, null, null, false,
                    svgTexture);
        renderer = globe.renderer;
        animate();
        loadTeams();
    }

    function loadTeams() {
        $.getJSON('php/getTeams.php', function(data) {
            var teamItems = [];
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(data, function(key, val) {
                addTeam(val.latitude, val.longitude, val.code);
            });
        });
    }

    function addTeam(lat, lng, code) {
        var flagMesh = globe.addFlag(lat, lng, 'images/flags/'+code+'.gif');
        teamHighlightMeshes[code] = flagMesh;
        clickableMeshes.push(flagMesh);
    }

    function globeClicked(event) {
        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );
        projector.unprojectVector( vector, globe.camera );
        var ray = new THREE.Ray( globe.camera.position,
                vector.subSelf( globe.camera.position ).normalize() );
        var hits = ray.intersectObjects(clickableMeshes);
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

    function matchTypeSelected($mtElement) {
        matchType = $mtElement.attr('id');
        console.log("Changing selected match type");
        getData();
    }

    this.load = load;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.matchTypeSelected = matchTypeSelected;
    this.requiredMenus = [
        VIS.vizMenuEnum.teamClick,
        VIS.vizMenuEnum.matchTypeClick
    ];
}
