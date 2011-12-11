
var VIS = VIS || {};

VIS.BasicGlobe = function($container) {

    var $topCanvas;
    var topCanvasCtx;
    var globe;
    var projector;
    var clickableMeshes = new Array();
    var teamHighlightMeshes = {};
    var yearPointers = new Array();
    var teamCache = {};
    var worldCupWinYearsPerTeam = {};
    var $radialContainer;

    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        globe.render();
    }

    function load() {
        $container = $container || $('#container');
        $container.height($(window).height());
        $container.width($(window).width());
        $container.click(globeClicked);
        projector = new THREE.Projector();
        globe = new DAT.Globe($container[0], null, null, false);
        loadTopCanvas();
        loadTeams();
        animate();
    }

    function unload() {
        $container.unbind('click', globeClicked);
        $container.html('');
        delete projector;
        delete teamHighLightMeshes;
        delete globe;
    }

    function loadTopCanvas() {
        $topCanvas = $('<canvas>');
        $topCanvas.appendTo($container);
        $topCanvas.css({
            position:'absolute',
            'z-index': '1',
            margin:'0px',
            padding:'0px',
            visiblity:true,
        });
        $topCanvas[0].width = $(window).width();
        $topCanvas[0].height = $(window).height();
        topCanvasCtx = $topCanvas[0].getContext('2d');
        topCanvasCtx.scale(1.0,1.0);
    }

    function loadModels() {
        $.getJSON('testdata/stats.json', function(data) {
            for (i=0;i<data.length;i++) {
                globe.addData(data[i][1], {
                    format: 'magnitude',
                    name: data[i][0],
                    animated: true,
                    models: data[i][2]
                });
            }
            loadTeams();
            animate();
        });
    }

    function loadTeams() {
        $.getJSON('php/getTeams.php', function(data) {
            var teamItems = [];
            var $ul = $('<ul/>', {
                'class': 'teamList',
            });
            $.each(data, function(key, val) {
                addTeam(val.latitude, val.longitude, val.code);
                teamCache[val.code] = {
                    'lat': val.latitude,
                    'lng': val.longitude,
                    'name': val.name,
                };
            });
            loadWorldCupData();
        });
    }

    function loadWorldCupData() {
        function dataLoaded(data) {
            $radialContainer = $("<div id='radial_container'>")
                .css('z-index','100')
                .appendTo($container);
            var $ul = $('<ul/>', {
                'class': 'yearList',
            }).appendTo($radialContainer);

            $.each(data, function(year, val) {
                var $year = $('<li class="yearItem" id="' + val.code + '">')
                    .appendTo($ul)
                    .append('<div class="yearItemText" id="'+
                        val.code + '">' + year + '</div>');
                $year.data('lat', val.latitude);
                $year.data('lng', val.longitude);
                $year.data('code', val.code);
                $year.data('mesh', teamHighlightMeshes[val.code]);
                if (worldCupWinYearsPerTeam[val.code] == undefined)
                    worldCupWinYearsPerTeam[val.code] = [];
                worldCupWinYearsPerTeam[val.code].push($year);
            });
            //console.log('Height, width', $container.css('height'),
                //$container.css('width'), $(window).height(), $(window).width());

            var radius = $(window).height()/2 - 50;

            var width = $(window).width()/2 - 20;
            var height = $(window).height()/2 - 10;

            $radialContainer.radmenu({
                listClass: 'yearList',
                itemClass: 'yearItem',
                radius: radius,
                animSpeed: 100,
                centerX: width,
                centerY: height,
                selectEvent: "click",
                onSelect: function($selected, event){
                    $selected.siblings().removeClass('active');
                    $selected.addClass('active');
                    var $yearElement = $($selected.children()[0]);
                    var code = $yearElement.attr('id');
                    $yearElement.data('lat', teamCache[code].lat);
                    $yearElement.data('lng', teamCache[code].lng);
                    $yearElement.data('code', code);
                    yearSelected($yearElement, event);
                },
                angleOffset: 0
            });
            $radialContainer.radmenu("show");
        }
        $.getJSON('php/getWorldCupGlobeData.php', function(data) {
            dataLoaded(data);
        });
    }

    function addTeam(lat, lng, code) {
        var flagMesh = globe.addFlag(lat, lng, 'images/flags/'+code+'.gif');
        teamHighlightMeshes[code] = flagMesh;
        clickableMeshes.push(flagMesh);
    }

    function clearContext() {
        topCanvasCtx.clearRect(0,0,$topCanvas.width(),$topCanvas.height());
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
            var hit = hits[0];
            //globe.curLat = hit.lat;
            //globe.curLong = hit.lng;
        } else {
            console.log("Click detected, but no target was hit.", hits);
        }
    }

    // NOTE: This method is relatively broken, that's why it's not
    // being used.
    function yearSelected3d($yearElement, event) {
        teamSelected($yearElement);
        var geometry = new THREE.CylinderGeometry( 0, 10, 100, 3 );
        geometry.applyMatrix( new THREE.Matrix4()
            .setRotationFromEuler(new THREE.Vector3(Math.PI/2,Math.PI,0)));
        var material = new THREE.MeshNormalMaterial();
        var mesh = new THREE.Mesh( geometry, material );

        var code = $yearElement.data('code');
        var teamMesh = teamHighlightMeshes[code];

        var x = ( event.clientX / window.innerWidth ) * 2 - 1;
        var y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );
        projector.unprojectVector( vector, globe.camera );
        var ray = new THREE.Ray( globe.camera.position,
                vector.subSelf( globe.camera.position ).normalize() );

        mesh.position.x = vector.x;
        mesh.position.y = vector.y;
        mesh.position.z = vector.z;
        mesh.lookAt(teamMesh.position);
        yearPointers.push(mesh);
        globe.scene.add( mesh );
    }

    function yearSelected($yearElement, event, skipTeamSelection) {
        if (!skipTeamSelection)
            teamSelected($yearElement, true);
        clearContext();
        connectElement($yearElement);
    }

    function connectElement($yearElement) {
        topCanvasCtx.globalAlpha = 0.4;
        topCanvasCtx.fillStyle = '#ff0000';

        var x1 = $yearElement.offset().left;
        var y1 = $yearElement.offset().top;
        var x2 = $topCanvas.width()/2;
        var y2 = $topCanvas.height()/2;
        var h = $yearElement.height();
        var w = $yearElement.width();
        console.log("(X1,Y1) - (X2,Y2), h", x1,y1,x2,y2, h);

        topCanvasCtx.beginPath();
        topCanvasCtx.moveTo(x1 + w/2, y1 + h/2);
        topCanvasCtx.lineTo(x1 - w/2, y1 - h/2);
        topCanvasCtx.lineTo(x2,y2);
        topCanvasCtx.fill();
    }

    function teamSelected($teamElement, skipYearConnection) {
        var lat, lng;
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
        globe.curLat = lat;
        globe.curLong = lng;

        clearContext();
        if (!skipYearConnection)
            connectYearsForTeam($teamElement);
    }

    function connectYearsForTeam($teamElement) {
        var code = $teamElement.attr('code');
        // TODO: Indicate that a team hasn't won.
        var years = worldCupWinYearsPerTeam[code];
        if (years == undefined)
            return;

        $radialContainer.find('.radial_div #'+code).each(
            function(idx, yearOuter) {
                connectElement($(yearOuter));
            }
        );
    }

    this.load = load;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.requiredMenus = [
        VIS.vizMenuEnum.teamClick,
    ];
    //this.requiredMenus = {
        //'teamClick': teamSelected,
    //};
};
