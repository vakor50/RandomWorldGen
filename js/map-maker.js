
// Select HTML and attack D3
var canvas = d3.select("canvas").attr("width", 960).attr("height", 500).node(),
    context = canvas.getContext("2d"),
    width = canvas.width,
    height = canvas.height;


///////////////////////////////////////////////////////////////////////////////

/*
 * Get random points on the map and make sure they don't occur really close to the border
 */
function randomPointsAndCutBorders(numPoints) {
    var fracNumerator = 19;
    var fracDenominator = 21;
    var temp = d3.range(numPoints)
        .map(function() { return [Math.random() * width, Math.random() * height]; })
        .filter(function(d) { 
            return width/fracDenominator <= d[0] 
                && d[0] <= fracNumerator*width/fracDenominator 
                && height/fracDenominator <= d[1] 
                && d[1] <= fracNumerator*height/fracDenominator; 
        });
    return temp;
}

var n = 1500; // Number of polygons
var threshold = (Math.random() * (0.600 - 0.300) + 0.300); 
var noiseScale = (Math.random() * (0.006 - 0.004) + 0.004);

// The input is significantly larger than the number than the number of poi we need 
// to account for filtering points too close to the border
var poi = randomPointsAndCutBorders(n);

var sites = d3.range(n)
    .map(function(d) { return [Math.random() * width, Math.random() * height]; });

var voronoi = d3.voronoi()
    .extent([[-1, -1], [width + 1, height + 1]]);



///////////////////////////////////////////////////////////////////////////////


// get random points
function randomPoints(num) {
    var temp = d3.range(num)
        .map(function() { return [Math.random() * width, Math.random() * height]; });
    return temp;
}

function Tile () {
    // set of adjacent polygons
    this.neighbors = []
    // set of bordering edges
    this.borders = []
    // set of polygon corners
    this.corners = []
    // coordinates
    this.coord = []
    // type
    this.elevation = 0
    this.weather = 0
}

function Edge () {
    // polygons connected by the Delaunay edge crossing this edge
    this.d0 = null
    this.d1 = null
    // corners connected by this edge
    this.v0 = null
    this.v1 = null
    // coordinates
    this.x1 = 0
    this.y1 = 0
    this.x2 = 0
    this.y2 = 0
}

function Corner () {
    // set of polygons touching this corner
    this.touches = []
    // set of edges touching this corner
    this.protrudes = []
    // set of corners connected to this one
    this.adjacent = []
    // coordinates
    this.x = 0
    this.y = 0
}

// is Point inside list of Points
function inside(point, vs) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

// shift input from low range into high range (lowR1, highR1) -> (lowR2, highR2)
function rescale(lowR1, highR1, lowR2, highR2, inputR1) {
    return (inputR1 - lowR1) * ((highR2 - lowR2) / (highR1 - lowR1)) + lowR2

    // R2 is output
    percent = (inputR1 - lowR1) / (highR1 - lowR1);
    output = percent * (highR2 - lowR2) + lowR2;
    return output;
}

function getCenterIndexByPoint(cArr, pt) {
    for (var i = 0; i < cArr.length; i++) {
        if (cArr[i].coord == pt) {
            return i;
        }
    }
}

function clearScreen() {
    context.clearRect(0, 0, width, height);
}


function generateTiles(polygons, links, width, height) {
    var tiles = [];
    for (var i = 0; i < polygons.length; i++) {
        var t = new Tile();
        t.coord = polygons[i].data;
        // Set the corners of the polygon
        for (var j = 0; j < polygons[i].length; j++) {
            t.corners.push(polygons[i][j])
        }
        // links are { source: [x,y], target: [x,y]}
        // Assign neighbors the (x,y) coordinates of each adjacent polygon's center
        // Should I assign neighbors in a different for loop so neighbors can be type Center??
        for (var k = 0; k < links.length; k++) {
            if (links[k].source == t.coord) {
                t.neighbors.push(links[k].target)
            }
            if (links[k].target == t.coord) {
                t.neighbors.push(links[k].source)
            }
        }

        var m = t.coord
        var nx = m[0]/width - 0.5;
        var ny = m[1]/height - 0.5;
        var w = 0
          // + 0.5 *    noise.simplex2(1 * nx, 1 * ny)
          // + 1.5 *  noise.simplex2(2 * nx, 2 * ny)
          + 0.5 * noise.simplex2(4 * nx, 2 * ny)
          + 2 * noise.simplex2(8 * nx, 4 * ny)
          // + 1 * noise.simplex2(16 * nx, 8 * ny)
        t.weather = w;
        t.elevation = 0;
        tiles.push(t)
    }
    return tiles;
}

function getTilesRescaledForWeather(tiles) {
    var max_weather  = Math.max.apply(Math,tiles.map(function(o){return o.weather;}))
    var min_weather = Math.min.apply(Math,tiles.map(function(o){return o.weather;}))

    // Tile weather gets scaled to be between 0 and 1 always
    for (var i = 0; i < tiles.length; i++) {
        var r = rescale(min_weather, max_weather, 0, 1, tiles[i].weather);
        tiles[i].weather = r;
    }
    return tiles;
}

/*
 * Generate points of interest on land
 * If the point is not on land, make the tile have higher elevation
 */ 
function updateTileElevationForPointsOfInterest(tiles, poi) {

    // Generate noise based on coordinates of each point
    for (var i = 0; i < poi.length; i++) {
        // get noise
        var nx = poi[i][0]/width - 0.5;
        var ny = poi[i][1]/height - 0.5;
        var w = 0
            // + ((Math.random() * 10) - 5) * noise.perlin2(1 * nx, 1 * ny)
            // + ((Math.random() * 10) - 5) * noise.perlin2(2 * nx, 1 * ny)
            + ((Math.random() * 10) - 5) * noise.perlin2(4 * nx, 2 * ny)
            + ((Math.random() * 10) - 5) * noise.perlin2(8 * nx, 4 * ny)
            + ((Math.random() * 10) - 5) * noise.perlin2(16 * nx, 8 * ny)
        

        if (w >= threshold) {
            for (var j = 0; j < tiles.length; j++) {
                // if point is within a polygon, mark polygon
                if (inside(poi[i], tiles[j].corners) && tiles[j].elevation < w) {
                    tiles[j].elevation = w
                    break;
                }
            }
        }
    }
    return tiles;
}

function getTilesCorrectedForIslandsBug(tiles) {
    // Convert water completely surrounded by land into land
    // Without this section we end up with a ton of islands
    for (var i = 0; i < tiles.length; i++) {
        // if this point is water
        if (tiles[i].elevation < threshold) {
            var numWaterNeighbor = 0;
            var avgNeighborElevation = 0;
            for (var j = 0; j < tiles[i].neighbors.length; j++) {
                var index = getCenterIndexByPoint(tiles, tiles[i].neighbors[j])
                if (tiles[ index ].elevation < threshold) {
                    numWaterNeighbor += 1;
                } else {
                    avgNeighborElevation += tiles[ index ].elevation;
                }
            }
            if (numWaterNeighbor <= 5) {
                tiles[i].elevation = avgNeighborElevation / tiles[i].neighbors.length;
            }
        }
    }

    return tiles;
}

function drawTile(tile, r, g, b, opacity = 1) {
    context.beginPath();
    drawCell(tile.corners);
    context.fillStyle = "rgba(".concat(r,",",g,",",b,",",opacity,")")
    context.fill();
}

function showTilesByElevationAndMoisture(tiles, threshold, pointsOfInterest, showNames = true) {
    var high  = Math.max.apply(Math,tiles.map(function(o){return o.elevation;}))
    var low = Math.min.apply(Math,tiles.map(function(o){return o.elevation;}))

    var showDetail = true;

    // Draw polygons
    for (var i = 0; i < tiles.length; i++) {
        var elevation_opacity = rescale(threshold, high, threshold, 1, tiles[i].elevation)
        if (showDetail) {
            if (tiles[i].elevation >= threshold) {
                var elevation = rescale(threshold, 1, 0, 1, elevation_opacity)
                var moisture = tiles[i].weather

                if (elevation > (3/4) && moisture > (1/2)) {                // Snow                             #f8f8f8
                    drawTile(tiles[i],163,107,67,elevation_opacity);
                } else if (elevation > (3/4) && moisture > (1/3)) {         // Tundra                           #ddddbb
                    drawTile(tiles[i],221,221,187);
                } else if (elevation > (3/4) && moisture > (1/6)) {         // Bare                             #bbbbbb
                    drawTile(tiles[i],187,187,187);
                } else if (elevation > (3/4) && moisture >= 0) {            // Scorched                         #999999
                    drawTile(tiles[i],153,153,153);
                } else if (elevation > (1/2) && moisture >= (2/3)) {        // Taiga                            #ccd4bb
                    drawTile(tiles[i],204,212,187);
                } else if (elevation > (1/2) && moisture >= (1/3)) {        // Shrubland                        #c4ccbb
                    drawTile(tiles[i],196,204,187);
                } else if (elevation > (1/2) && moisture >= 0) {            // Temperate Desert                 #e4e8ca
                    drawTile(tiles[i],228,232,202);
                } else if (elevation > (1/4) && moisture >= (5/6)) {        // Temperate Rain Forest            #a4c4a8
                    drawTile(tiles[i],228,232,202);
                } else if (elevation > (1/4) && moisture >= (1/2)) {        // Temperate Deciduous Forest       #b4c9a9
                    drawTile(tiles[i],228,232,202);
                } else if (elevation > (1/4) && moisture >= (1/6)) {        // Grassland                        #c4d4aa
                    drawTile(tiles[i],228,232,202);
                } else if (elevation > (1/4) && moisture >= 0) {            // Temperate Desert                 #e4e8ca
                    drawTile(tiles[i],228,232,202);
                } else if (elevation > 0 && moisture >= (2/3)) {            // Tropical Rain Forest             #9cbba9
                    drawTile(tiles[i],156,187,169);
                } else if (elevation > 0 && moisture >= (1/3)) {            // Tropical Seasonal Forest         #a9cca4
                    drawTile(tiles[i],169,204,164);
                } else if (elevation > 0 && moisture >= (1/6)) {            // Grassland                        #c4d4aa
                    drawTile(tiles[i],196,212,170);
                } else if (elevation > 0 && moisture >= 0) {                // Subtropical Desert               #e9ddc7
                    drawTile(tiles[i],233,221,199);
                } else {
                    // This should never be shown
                    drawTile(tiles[i],163,107,67);                          // 
                }
            } else {
                drawTile(tiles[i],0,0,100,0.59);                            // Black                             #000064
            }
        } else {
            drawTile(tiles[i],100,100,100,1);
        }

    }


    // Print out nation and city information
    if (showNames) {
        for (var i = 0; i < continents.length; i++) {
            for (var j = 0; j < continents[i].nations.length; j++) {
                for (var k = 0; k < continents[i].nations[j].settlements.length; k++) {

                    var city = pointsOfInterest[ continents[i].nations[j].settlements[k].index ];

                    context.beginPath();
                    drawSite(city);
                    context.fillStyle = "rgba(0,0,0,1)";
                    context.fill();
                    context.strokeStyle = "#fff";
                    context.stroke();

                    // display nation race text
                    var settlementName = continents[i].nations[j].settlements[k].name;
                    var nationRace =  continents[i].nations[j].race;
                    var displayName = settlementName.slice(0, 10) + ' - ' + nationRace;

                    context.fillText(displayName, city[0], city[1]);
                }
            }
        }
    }
}


function redraw(showNames = true) {

    var diagram = voronoi(sites)
        links = diagram.links(), // array of line objects: [ {source: [x,y], target: [x,y]}, ... ]
        polygons = diagram.polygons(); // array of shapes per tile with coordinates of corners: [ [[x,y],[x,y],...], ... ]

    // data are the centroids of the polygons created by sites
    var data = []
    for (var i = polygons.length - 1; i >= 0; i--) {
        data.push(d3.polygonCentroid(polygons[i]));
    }

    diagram = voronoi(data);
    links = diagram.links();
    polygons = diagram.polygons();


    clearScreen();

    // For each polygon, create the Tile object
    var tiles = generateTiles(polygons, links, width, height);

    tiles = getTilesRescaledForWeather(tiles);

    tiles = updateTileElevationForPointsOfInterest(tiles, poi);

    tiles = getTilesCorrectedForIslandsBug(tiles);

    showTilesByElevationAndMoisture(tiles, threshold, poi, showNames);
}



function drawSite(site) {
  context.moveTo(site[0] + 2.5, site[1]);
  context.arc(site[0], site[1], 2.5, 0, 2 * Math.PI, false);
}

function drawLink(link) {
  context.moveTo(link.source[0], link.source[1]);
  context.lineTo(link.target[0], link.target[1]);
}

function drawCell(cell) {
  if (!cell) return false;
  context.moveTo(cell[0][0], cell[0][1]);
  for (var j = 1, m = cell.length; j < m; ++j) {
    context.lineTo(cell[j][0], cell[j][1]);
  }
  context.closePath();
  return true;
}

$(document).ready(function() {
    redraw();
})

$('#toggle-names').click(function() {
    var button = $('#toggle-names');
    if (button.val() == "0") {
        button.html('Show names');
        button.val("1");
        redraw(true);
    } else {
        button.html('Hide names');
        button.val("0");
        redraw(false);
    }
    
});