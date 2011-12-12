var VIS = VIS || {};

VIS.CartogramGlobe = function($container, teamClickCallback) {

    var globe;
    var projector;
    var svgCanvas;
    var svgTexture;
    var matchType = null;
    var clickableMeshes = [];
    var teamHighlightMeshes = {};
    var $yearSlider;
    var $playButton;
    var $toggleSvgHidden;
    var $year
    var cartogramSvgChart = document.getElementById('cartogramSvgChart');
    $(cartogramSvgChart).hide();
    var svgCanvas = document.getElementById('svgCanvas');
    var ctx = svgCanvas.getContext('2d');
    var timer = undefined;
    var dataYears = [];
    var winsData;
    var nodes;
    var renderNow = true;
    var curYear = 0;
    var unloaded = false;
    var svgWidth = 1890;
    var svgHeight = 945;
    var groundPlaneMesh;
    var svg;

    // Ratio of Obese (BMI >= 30) in U.S. Adults, CDC 2008
    var data = [
  , .187, .198, , .133, .175, .151, , .1, .125, .171, , .172, .133, , .108,
  .142, .167, .201, .175, .159, .169, .177, .141, .163, .117, .182, .153, .195,
  .189, .134, .163, .133, .151, .145, .13, .139, .169, .164, .175, .135, .152,
  .169, , .132, .167, .139, .184, .159, .14, .146, .157, , .139, .183, .16, .143
    ];
    var color = function() {};

    var countryCoords = {
        'AFG': [1320, 290],
        'AUS': [1738, 684],
        'BAN': [1420, 351],
        'BER': [674, 296],
        'CAN': [544, 238],
        'EAF': [1132, 511],
        'ENG': [942, 200],
        'HOK': [1541, 352],
        'IND': [1352, 330],
        'IRE': [906, 194],
        'KEN': [1138, 482],
        'NAM': [1034, 594],
        'NED': [973, 196],
        'NZL': [1859, 691],
        'PAK': [1328, 298],
        'SCO': [928, 172],
        'SAF': [1079, 631],
        'SRL': [1366, 436],
        'UAE': [1230, 346],
        'USA': [538, 270],
        'WIN': [540, 378],
        'ZIM': [1108, 568]
    };

    function animate() {
        // NOTE: Probably should not have to make this check, but it
        // seems to help.
        if (unloaded)
            return;
        requestAnimationFrame(animate);
        render();
    }

    function render() {
        globe.render();
        //if (groundPlaneMesh)
            //groundPlaneMesh.lookAt(globe.camera.position);
    }

    function updateSvgCanvas() {
        if (!renderNow)
            return;

        renderNow = false;
        var svgString = cartogramSvgChart.innerHTML;
        canvg(svgCanvas, svgString, {
            renderCallback: function() {
                svgTexture.needsUpdate = true;
                renderNow = true;
            }
        });
    }

    function load() {
        $container = $container || $('#container');
        $container.click(globeClicked);
        $(cartogramSvgChart).appendTo($container);
        projector = new THREE.Projector();
        loadUI();
        //loadCartogram();
        loadSvgCanvasGlobe();
        // NOTE: Either use this, or call updateSvgCanvas from render()
        setInterval(updateSvgCanvas, 100);
    }

    function unload() {
        unloaded = true;
        $container.unbind('click', globeClicked);
        $container.html('');
        delete teamHighLightMeshes;
        delete globe;
        delete projector;
        $(svgCanvas).html('');
    }

    function loadUI() {
        var $uiElements = $("<div id='cartogramUi'>");
        $uiElements.appendTo($container);
        $yearSlider = $("<div id='yearSlider'>");
        $yearSlider.appendTo($uiElements);
        $playButton = $("<div id='playButton'>");
        $playButton.appendTo($uiElements);
        $year = $("<div id='curYearText'>").appendTo($container);

        $playButton.button();
        $playButton.text('Play');
        $playButton.click(function(e) {
            if (timer) {
                stop();
            } else {
                curYear = $yearSlider.slider('option', 'value');
                $year.text(curYear);
                if (curYear == dataYears[dataYears.length - 1] || curYear == 0)
                    curYear = dataYears[0];
                $yearSlider.slider('value', curYear);
                updateYear(curYear);
                timer = setInterval(function() {
                    curYear++;
                    if (curYear >= dataYears[dataYears.length - 1])
                        stop();

                    $yearSlider.slider('value', curYear);
                }, 400);
                $playButton.text("Stop");
            }
        });

        $toggleSvgHidden = $("<div id='svgButton'>");
        $toggleSvgHidden.appendTo($container);
        $toggleSvgHidden.button();
        $toggleSvgHidden.text('Flat Cartogram');
        $toggleSvgHidden.click(function(e) {
            var svgVis = $(cartogramSvgChart).is(':visible');
            var gpVis =  groundPlaneMesh.visible;
            if (!svgVis && !gpVis) {
                $(this).text('Back plane');
                $(cartogramSvgChart).toggle();
            } else if (svgVis  && !gpVis) {
                $(cartogramSvgChart).toggle();
                groundPlaneMesh.visible = groundPlaneMesh.visible == true ? false : true;
                $(this).text('Globe Cartogram');
            } else if (!svgVis && gpVis) {
                groundPlaneMesh.visible = groundPlaneMesh.visible == true ? false : true;
                $(this).text('Flat Cartogram');
            }
        });
    }

    function stop() {
        clearInterval(timer);
        timer = undefined;
        $playButton.text("Play");
    }


    function getData() {
        var args="";
        if(matchType != "All Match Types" && matchType != "All Types"){
                args = args + "&type=" + matchType;
        }

        $.getJSON('php/AccumulatedWins.php'+args, function(data) {
            dataYears = [];
            for(var key in data) {
                if(data.hasOwnProperty(key)) {
                    dataYears.push(parseInt(key));
                }
            }
            //years.sort();

            var max = 0;
            $.each(data, function(key, teamWins) {
                $.each(teamWins, function(team, wins) {
                    if (wins > max)
                        max = wins;
                });
            });

            color = d3.scale.linear()
                .domain([0, max])
                .range(["green", "red"]);

            $year.text(dataYears[0]);

            $yearSlider.slider({
                //animate:true,
                min: dataYears[0],
                max: dataYears[dataYears.length -1],
                value: dataYears[0],
                create: function(e, ui) {
                    curYear = ui.value;
                },
                slide: function(e, ui) {
                    var year = ui.value;
                    curYear = year;
                    $year.text(year)
                    updateYear(year);
                },
                change: function(e, ui) {
                    var year = ui.value;
                    curYear = year;
                    $year.text(year)
                    updateYear(year);
                }
            });
            winsData = data;
        });
    }

    function resetCartogram() {
        svg.selectAll("circle")
            .style("fill", function(d) {
                var c = color(d.value || 0);
                return color(d.value || 0);
            })
            .attr("cx", function(d) { return countryCoords[d.code][0]; })
            .attr("cy", function(d) { return countryCoords[d.code][1]; })
            .attr("r", function(d, i) { return 0; });
    }

    function updateYear(year) {
        if (winsData[year] == undefined)
            return;

        var wins = winsData[year];
        nodes.forEach(function(n) {
            n.value = wins[n.code] || 0;
            n.r = wins[n.code] || 0;
        });
        svg.selectAll("circle")
            .style("fill", function(d) {
                //var c = color(d.value || 0);
                return color(d.value || 0);
            })
            //.attr("cx", function(d) { return d.x; })
            //.attr("cy", function(d) { return d.y; })
            .attr("cx", function(d) { return countryCoords[d.code][0]; })
            .attr("cy", function(d) { return countryCoords[d.code][1]; })
            .attr("r", function(d, i) { return d.r/2 || 0; });
    }

    function loadSvgCanvasGlobe() {
        svgTexture = new THREE.Texture(svgCanvas);
        svgTexture.minFilter = THREE.LinearFilter;
        svgTexture.magFilter = THREE.LinearFilter;
        svgTexture.needsUpdate = true;

        globe = new DAT.Globe(container, null, null, false,
                    svgTexture, null, 1600);
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
            loadCartogram(data);
        });
    }

    function addTeam(lat, lng, code) {
        var flagMesh = globe.addFlag(lat, lng, 'images/flags/'+code+'.gif');
        teamHighlightMeshes[code] = flagMesh;
        clickableMeshes.push(flagMesh);
    }

    function loadCartogram(teams) {


        var force = d3.layout.force()
            .charge(0)
            .gravity(0)
            .size([svgWidth, svgHeight]);

        svg = d3.select("#cartogramSvgChart").append("svg:svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight);

        svg.append("svg:image")
            .attr("id", "image")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .attr("xlink:href","images/globeTexture.jpg");

        svg.append("svg:g")
            .attr("transform", "translate(50,50)");

        idToNode = {},
        links = [],
        nodes = teams.map(function(d) {
            return idToNode[d.id] = {
                code: d.code,
                x: countryCoords[d.code][0],
                y: countryCoords[d.code][1],
                gravity: {
                    x:countryCoords[d.code][0],
                    y:countryCoords[d.code][1]
                },
                //r: Math.sqrt(data[+d.id] * 5000),
                r: 0,
                //value: data[+d.id]
                value: 0
            };
        });

        //var count = 0;
        //var count2 = 0;
        force
            .nodes(nodes)
            .links(links)
            .start()
            .on("tick", function(e) {
                var k = e.alpha,
                kg = k * .02;
                nodes.forEach(function(a, i) {
                // Apply gravity forces.
                    a.x += (a.gravity.x - a.x) * kg;
                    a.y += (a.gravity.y - a.y) * kg;
                    nodes.slice(i + 1).forEach(function(b) {
                        // Check for collisions.
                        var dx = a.x - b.x,
                            dy = a.y - b.y,
                            l = Math.sqrt(dx * dx + dy * dy),
                            d = a.r + b.r;
                        if (l < d) {
                            l = (l - d) / l * k;
                            dx *= l;
                            dy *= l;
                            a.x -= dx;
                            a.y -= dy;
                            b.x += dx;
                            b.y += dy;
                        }
                        // Jitter...
                        /*if (count > 5) {
                            a.y += 1;
                            count2 += 1;
                            if (count2 > 5) {
                                count = 0;
                                count2 = 0;
                            }
                        } else {
                            a.y -= 1;
                            count += 1;
                        }*/
                    });
                });

            svg.selectAll("circle")
                .attr("cx", function(d) { return d.x; })
                .attr("cy", function(d) { return d.y; });
        });

        // NOTE: This actually updates the circles, finally,
        // outside of the "force".
        svg.selectAll("circle")
            .data(nodes)
            .enter().append("svg:circle")
            .style("fill", function(d) { return color(d.value); })
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; })
            .attr("r", function(d, i) { return d.r || 0; });
        loadFlyAround();
    }

    function loadFlyAround() {
        var svgMaterial = new THREE.MeshBasicMaterial({
            map: svgTexture,
            depthTest: true,
        });
        var geometry = new THREE.PlaneGeometry(svgWidth, svgHeight);
        groundPlaneMesh = new THREE.Mesh( geometry, svgMaterial);
        groundPlaneMesh.doubleSided = true;
        groundPlaneMesh.lookAt(globe.camera.position);
        globe.scene.add(groundPlaneMesh);
        groundPlaneMesh.visible = false;
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
        getData();
    }

    this.load = load;
    this.unload = unload;
    this.teamSelected = teamSelected;
    this.matchTypeSelected = matchTypeSelected;
    this.requiredMenus = {
        'teamClick': teamSelected,
        'matchTypeClick': matchTypeSelected,
    };
}
