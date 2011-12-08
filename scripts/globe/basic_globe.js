
var VIS = VIS || {};

VIS.BasicGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    //var teamHighlightMeshes = new Array();
    var clickableMeshes = new Array();
    var teamHighlightMeshes = {};
    var yearPointers = new Array();
    var teamCache = {};

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
        //loadModels();
        loadTeams();
        animate();
    }

    function unload() {
        $container.unbind('click', globeClicked);
        $container.html('');
        //$('.teamList').html('');
        delete projector;
        delete teamHighLightMeshes;
        delete globe;
    }

    function loadModels() {
        //globe = new DAT.Globe($container[0], null, null, false);
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
            var $radialContainer = $("<div id='radial_container'>")
                .css('z-index','100')
                .appendTo($container);
            var $ul = $('<ul/>', {
                'class': 'yearList',
            }).appendTo($radialContainer);

            var elements = [];
            $.each(data, function(key, val) {
                var $year = $('<li class="yearItem" id="' + val.code + '">')
                    .appendTo($ul)
                    .append('<div class="yearItemText" id="'+
                        val.code + '">' + key + '</div>');
                $year.data('lat', val.latitude);
                $year.data('lng', val.longitude);
                $year.data('mesh', teamHighlightMeshes[val.code]);
                elements.push($year);
            });
            console.log('Height, width', $container.css('height'),
                $container.css('width'), $(window).height(), $(window).width());

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
                //centerX: width - width/20,
                //centerY: height - height/6,
                selectEvent: "click",
                onSelect: function($selected, event){
                    $selected.siblings().removeClass('active');
                    $selected.addClass('active');
                    var $yearElement = $($selected.children()[0]);
                    var code = $yearElement.attr('id');
                    $yearElement.data('lat', teamCache[code].lat);
                    $yearElement.data('lng', teamCache[code].lng);
                    $yearElement.data('code', code);
                    //$yearElement.data('mesh', teamHighlightMeshes[code]);
                    //teamSelected($teamElement);
                    yearSelected($yearElement, event);
                },
                angleOffset: 0
            });
            $radialContainer.radmenu("show");
            //$container.attr('style', '');
            /*var geometry = new THREE.CylinderGeometry( 0, 10, 100, 3 );
            geometry.applyMatrix( new THREE.Matrix4()
                .setRotationFromEuler(new THREE.Vector3(Math.PI/2,Math.PI,0)));
            var material = new THREE.MeshNormalMaterial();
            $.each(elements, function(idx, $el) {
                var mesh = new THREE.Mesh( geometry, material );
                mesh.position.x = Math.random() * 4000 - 2000;
                mesh.position.y = Math.random() * 4000 - 2000;
                mesh.position.z = Math.random() * 4000 - 2000;
                mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;
                console.log("Adding pointer for el", $el,
                    $el.position().left, $el.position().top);
                //mesh.position.x = $el.position().left;
                //mesh.position.y = $el.position().top;
                mesh.lookAt(teamHighlightMeshes[0].position);
                yearPointers.push(mesh);
                globe.scene.add( mesh );
            });*/
        }
        /*dataLoaded({
            '1924': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1925': {'name': 'England', 'code': 'ENG',
                'latitude': 51.5, 'longitude': -0.1},
            '1926': {'name': 'Pakistan', 'code': 'PAK',
                'latitude': 33.6, 'longitude': 73.1},
            '1927': {'name': 'United States', 'code': 'USA',
                'latitude': 38.8, 'longitude': -77.0},
            '1928': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1929': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1930': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1931': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1932': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1933': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1934': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1935': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1936': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1937': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1938': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
            '1939': {'name': 'India', 'code': 'IND',
                'latitude': 28.6, 'longitude': 77.2},
        });*/
        $.getJSON('php/getWorldCupGlobeData.php', function(data) {
            dataLoaded(data);
        });
    }

    function addTeam(lat, lng, code) {
        //var mesh = globe.addHighlight(lat, lng, null);
        var flagMesh = globe.addFlag(lat, lng, 'images/flags/'+code+'.gif');
        //mesh.code = code;
        //mesh.lat = lat;
        //mesh.lng = lng;
        //teamHighlightMeshes.push(mesh);
        //teamHighlightMeshes[code] = mesh;
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
        //console.log("Hit test", teamHighlightMeshes);
        //var hits = ray.intersectObjects(teamHighlightMeshes);
        var hits = ray.intersectObjects(clickableMeshes);
        if (hits.length) {
            console.log("Team Location clicked!", hits);
            var hit = hits[0];
            //globe.curLat = hit.lat;
            //globe.curLong = hit.lng;
            if (teamClickCallback) {
                teamClickCallback(null);
            }
        } else {
            console.log("Click detected, but no target was hit.", hits);
        }
    }

    function yearSelected($yearElement, event) {
        teamSelected($yearElement);
        console.log("Year selected", $yearElement);
        var geometry = new THREE.CylinderGeometry( 0, 10, 100, 3 );
        geometry.applyMatrix( new THREE.Matrix4()
            .setRotationFromEuler(new THREE.Vector3(Math.PI/2,Math.PI,0)));
        var material = new THREE.MeshNormalMaterial();
        //$.each(elements, function(idx, $el) {
        var mesh = new THREE.Mesh( geometry, material );
        //mesh.position.x = Math.random() * 4000 - 2000;
        //mesh.position.y = Math.random() * 4000 - 2000;
        //mesh.position.z = Math.random() * 4000 - 2000;
        //mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 4 + 2;

        var code = $yearElement.data('code');
        var teamMesh = teamHighlightMeshes[code];
        var x = ( event.pageX / window.innerWidth ) * 2 - 1;
        var y = - ( event.pageY / window.innerHeight ) * 2 + 1;
        var vector = new THREE.Vector3( x, y, 0.5 );
        vector.subSelf( globe.camera.position ).normalize();
        projector.unprojectVector( vector, globe.camera );

        console.log("Adding pointer for el", $yearElement.parent(),
            $yearElement.parent().position().left,
            $yearElement.parent().position().top,
            $yearElement.parent().offset().left,
            $yearElement.parent().offset().top,
            x,y, vector, DAT.mesh.position,
            teamMesh);
        //mesh.position.x = $yearElement.parent().position().left;
        //mesh.position.y = $yearElement.parent().position().top;
        mesh.lookAt(teamMesh.position);
        mesh.position.x = teamMesh.position.x;
        mesh.position.y = teamMesh.position.y;
        mesh.position.z = teamMesh.position.z + 100;
        mesh.lookAt(teamMesh.position);
        //mesh.position.x = 200;
        //mesh.position.y = 0;
        //mesh.position.z = 0;
        //mesh.lookAt(teamMesh.position);
        yearPointers.push(mesh);
        globe.scene.add( mesh );
        console.log("pointer added...");
        //});
        /*var canvas = $container.find('canvas')[0];
        var ctx = canvas.getContext('experimental-webgl');
        console.log('Canvas', canvas, ctx);*/
    }

    function teamSelected($teamElement) {
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
        console.log("Changing selected team", $teamElement, lat, lng);
        globe.curLat = lat;
        globe.curLong = lng;
    }

    this.load = load;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.requiredMenus = [
        VIS.vizMenuEnum.teamClick,
        //VIS.vizMenuEnum.matchTypeClick
    ];
};
