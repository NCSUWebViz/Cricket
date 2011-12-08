// Ratio of Obese (BMI >= 30) in U.S. Adults, CDC 2008
var data = [
  , .187, .198, , .133, .175, .151, , .1, .125, .171, , .172, .133, , .108,
  .142, .167, .201, .175, .159, .169, .177, .141, .163, .117, .182, .153, .195,
  .189, .134, .163, .133, .151, .145, .13, .139, .169, .164, .175, .135, .152,
  .169, , .132, .167, .139, .184, .159, .14, .146, .157, , .139, .183, .16, .143
];

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

var color = d3.scale.linear()
    .domain([d3.min(data), d3.max(data)])
    .range(["#aad", "#556"]); 

var svgWidth = 1890;
var svgHeight = 945;

var force = d3.layout.force()
    .charge(0)
    .gravity(0)
    .size([svgWidth, svgHeight]);

var svg = d3.select("#cartogramSvgChart").append("svg:svg")
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

// NOTE: This service call isn't needed, but since all this code should
// be moved to the cartogram globe file anyway, I'm leaving it for the
// moment.
d3.json("php/getTeams.php", function(states) {
  var project = d3.geo.mercator(),
      idToNode = {},
      links = [],
      nodes = states.map(function(d) {
        var xy = project([d.latitude, d.longitude]);
        //console.log("Projection:", d.name, d.latitude, d.longitude, xy);
        return idToNode[d.id] = {
            x: countryCoords[d.code][0],
            y: countryCoords[d.code][1],
            gravity: {x:countryCoords[d.code][0], y:countryCoords[d.code][1]},
            r: Math.sqrt(data[+d.id] * 5000),
            value: data[+d.id]
        };
       });

  var count = 0;
  var count2 = 0;
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
                if (count > 5) {
                    a.y += 1;
                    count2 += 1;
                    if (count2 > 5) {
                        count = 0;
                        count2 = 0;
                    }
                } else {
                    a.y -= 1;
                    count += 1;
                }
            });
        });

        svg.selectAll("circle")
            .attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });
    });

    svg.selectAll("circle")
        .data(nodes)
        .enter().append("svg:circle")
        .style("fill", function(d) { return color(d.value); })
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", function(d, i) { return d.r || 0; });
});
