

function Tile (x, y, type) {
	this.coord = [x, y]
	this.elevation = type
	this.continent = 0
	this.visited = false
}

var size = 100;
var board = new Array(size)

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
				+ 0 * noise.perlin2(16 * nx, 8 * ny)
			board[i][j] = new Tile (i, j, w)
		}	
	}
}

function printBoard() {
	var str = ""
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			str += (board[i][j].elevation == 0) ? "." : "#";
		}
		str += "\n"
	}

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


