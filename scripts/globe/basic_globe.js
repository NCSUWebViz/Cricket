
var VIS = VIS || {};

VIS.BasicGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    var teamHighlightMeshes = new Array();
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
                addTeam(val.latitude, val.longitude);
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
                .css('z-index','1000')
                .appendTo($container);
            var $ul = $('<ul/>', {
                'class': 'yearList',
            }).appendTo($radialContainer);

            $.each(data, function(key, val) {
                var $year = $('<li class="yearItem" id="' + val.code + '">')
                    .appendTo($ul)
                    .append('<div class="yearItemText" id="'+
                        val.code + '">' + key + '</div>');
            });
            console.log('Height, width', $container.css('height'),
                $container.css('width'), $(window).height(), $(window).width());

            var radius = $(window).height()/2 - 50;

            var width = $(window).width()/4;
            var height = $(window).height()/2;

            $radialContainer.radmenu({
                listClass: 'yearList',
                itemClass: 'yearItem',
                radius: radius,
                animSpeed: 100,
                centerX: width - width/20,
                centerY: height - height/6,
                selectEvent: "click",
                onSelect: function($selected){
                    $selected.siblings().removeClass('active');
                    $selected.addClass('active');
                    var $teamElement = $($selected.children()[0]);
                    var code = $teamElement.attr('id');
                    $teamElement.data('lat', teamCache[code].lat);
                    $teamElement.data('lng', teamCache[code].lng);
                    teamSelected($teamElement);
                },
                angleOffset: 0
            });
            $radialContainer.radmenu("show");
        }
        dataLoaded({
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
        });
        //$.getJSON('php/getWorldCupData.php', function(data) {
        //});
    }

    function addTeam(lat, lng, code) {
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
