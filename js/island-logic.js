/*
 * This file goes through an approach to determine and group islands in a table based on elevation
 * This function doesn't work properly because the input noise function isn't noisy enough (I think)
 * The noise function used doesn't have any randomness
 */



/*
 * Create a tile with an x-y coordinate and elevation
 * The continent the tile is part of is 0 by default
 */
function Tile (x, y, type) {
    this.coord = [x, y]
    this.elevation = type
    this.continent = 0
    this.visited = false
}

var size = 100;
var board = new Array(size)

/*
 * Create a 100x100 board
 * Depending on a noise function based on the coordinates and size of the canvas, 
 * a 3rd point elevation is created
 */
function initializeBoard() {
    for (var i = 0; i < size; i++) {
        board[i] = new Array(size)
        for (var j = 0; j < size; j++) {
            var nx = i/960 - 0.5;
            var ny = j/500 - 0.5;
            var w = 0
                + 4 * noise.perlin2(1 * nx, 1 * ny)
                + 2 * noise.perlin2(2 * nx, 1 * ny)
                + 1 * noise.perlin2(4 * nx, 2 * ny)
                + 1 * noise.perlin2(8 * nx, 4 * ny)
                + 0 * noise.perlin2(16 * nx, 8 * ny); // only does slightest variations
            board[i][j] = new Tile (i, j, w);
        }   
    }
}

/*
 * Convert the board to string representation
 * Show a different character based on the elevation
 */
function printBoard() {
    var str = ""
    var max_elev = board[0][0].elevation;
    var min_elev = board[0][0].elevation;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cellChar = ' ';
            var elevation = board[i][j].elevation;
            if (elevation < -0.6) {
                cellChar = '6';
            } else if (elevation < -0.5) {
                cellChar = '5';
            } else if (elevation < -0.4) {
                cellChar = '4';
            } else if (elevation < -0.3) {
                cellChar = '3';
            } else if (elevation < -0.2) {
                cellChar = '2';
            } else if (elevation < -0.1) {
                cellChar = '1';
            } else if (elevation == 0) {
                cellChar = '0';
            } else if (elevation < 0.1) {
                cellChar = 'A';
            } else if (elevation < 0.2) {
                cellChar = 'B';
            } else if (elevation < 0.3) {
                cellChar = 'C';
            } else if (elevation < 0.4) {
                cellChar = 'D';
            } else if (elevation < 0.5) {
                cellChar = 'E';
            } else if (elevation < 0.6) {
                cellChar = 'F';
            } else {
                cellChar = 'G';
            }

            str += cellChar;

            if (elevation > max_elev) {
                max_elev = elevation;
            }
            if (elevation < min_elev) {
                min_elev = elevation;
            }
        }
        str += "\n"
    }

    console.log('max: ' + max_elev);
    console.log('min: ' + min_elev);

    return str;
}

var islands = 0

function floodFillFrom (x, y, islandNum) {
    var queue = []

    if (board[x][y].visited) {
        return;
    } else {
        board[x][y].visited = true
    }

    // var rowNum = [-1,  0,  1, -1,  1, -1,  0,  1]
    // var colNum = [-1, -1, -1,  0,  0,  1,  1,  1]
    // var simpleRowNum = [-1, 1,  0, 0]
    // var simpleColNum = [ 0, 0, -1, 1]

    for (var i = -1; i <= 1; i += 2) {
        if (x + i >= 0 && x + i < board.length && !board[x+i][y].visited && board[x+i][y].elevation > 0) {
            // [x-1][y], [x+1][y]
            queue.push([x+i, y])
        }

        if (y + i >= 0 && y + i < board[0].length && !board[x][y+i].visited && board[x][y+i].elevation > 0) {
            // [x][y-1], [x][y+1]
            queue.push([x, y+i])
        }
    }

    for (var k = 0; k < queue.length; k++) {
        floodFillFrom(queue[k][0], queue[k][1])
    }
}

function floodFill() {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].visited && board[i][j].elevation > 0) {
                islands++;
                floodFillFrom(i, j, islands)
            }
        }
    }
}

function displayBoard() {
    var worldMap = d3.select('#canvas').append("svg")
    .attr("width", 960)
    .attr("height", 500);

    var tileWidth = (960/board.length)
    var tileHeight = (500/board[0].length)
    var screen = new Array()
    for (var i = 0; i < board.length; i++) {
        screen.push(new Array)
        for (var j = 0; j < board[0].length; j++) {
            screen[i].push({
                x: i * tileWidth,
                y: j * tileHeight,
                width: tileWidth,
                height: tileHeight,
                elevation: board[i][j].elevation
            })
        }
    }

    var row = worldMap.selectAll(".row")
        .data(screen)
        .enter().append("g")
            .attr("class", "row");

    var column = row.selectAll(".square")
        .data(function(d) { return d; })
        .enter().append("rect")
            .attr("class", "square")
            .attr("x", function (d) { return d.x; })
            .attr("y", function (d) { return d.y; })
            .attr("width", function (d) { return d.width; })
            .attr("height", function (d) { return d.height; })
            .style("fill", function (d) { 
                if (d.elevation > 0) {
                    return "rgba(163,107,67," + d.elevation + ")";
                } else {
                    return "rgba(0,0,100,0.59)";
                }
            })
            // .style("stroke", "#222");
}

$(document).ready(function () {
    initializeBoard()

    console.log(printBoard())

    // floodFill()
    // console.log(islands)

    // displayBoard()
})

