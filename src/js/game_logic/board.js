define(['game_logic/block', 'game_logic/board_config'], function(Block, BOARD_CONFIG) {
	var board = function() {
		// create the 2D array containing all Blocks in the game
		this.gameTiles = new Array();

		// populate the array with zeroes (representing empty tiles--no Blocks)
		// columns (x-coordinates)
		var i = 0;
		while (i < BOARD_CONFIG.tilesAcross) {
			this.gameTiles[i] = [];

			// rows (y-coordinates)
			var j = 0;
			while (j < BOARD_CONFIG.tilesDown) {
				this.gameTiles[i][j++] = 0;
			}
			i++;
		}
	}

	// scan surrounding blocks to determine if there are at least two
	// other blocks in contact that have the same color
	// in total, we will have checked twelve tiles branching out from the original in the center
	// uses callback to indicate found or not found, but also returns the positions of matching tiles
	// (so as to notify the Board object how large of a combo the player has made, etc.)
	board.prototype.findMatchingBlocks = function(x, y, color, callback) {
		this.matches = [];

		console.log("first degree--   x: " + x + ",   y: " + y);
		// check northern block
		if (y > 0) {

			if (this.checkTileColor(x, y-1, color) != 0) { 
				this.matches.push({x: x, y: y-1});
				this.checkSecondDegreeTile(x, y-1, 'north', color);
			}

		}
		// check eastern block
		if (x != BOARD_CONFIG.tilesAcross-1) {

			if (this.checkTileColor(x+1, y, color) != 0) {
				this.matches.push({x: x+1, y: y});
				this.checkSecondDegreeTile(x+1, y, 'east', color);
			}

		}
		// check southern block
		if (y != BOARD_CONFIG.tilesDown-1) {

			if (this.checkTileColor(x, y+1, color) != 0) {
				this.matches.push({x: x, y: y+1});
				this.checkSecondDegreeTile(x, y+1, 'south', color);
			}

		}
		// check western block
		if (x > 0) {

			if (this.checkTileColor(x-1, y, color) != 0) {
				this.matches.push({x: x-1, y: y});
				this.checkSecondDegreeTile(x-1, y, 'west', color);
			}

		}

		console.log("matches: " + JSON.stringify(this.matches));

		// if more than two matching colored blocks, means we have at least a combo of 3
		if (this.matches.length >= 2) {
			callback(true);
			return this.matches;
		} else {
			callback(false);
			return 0;
		}
	}

	// checks if there's a tile at this position
	// and if so, if it has a matching color
	// returns the position of this tile if true, and 0 if false
	board.prototype.checkTileColor = function(x, y, color) {
		if (this.gameTiles[x][y] == 0) {
			return 0;
		} else {

			if (this.gameTiles[x][y].color != color) {
				return 0;
			} else {
				return {x: x, y: y};
			}

		}
	}

	// given a block adjacent to the original, check three more blocks relative to this new block
	// 1) one block continuing in the original direction
	// 2) another block going 90-degrees clockwise from this direction (so if originally
	//		headed north, check the tile east of this one)
	// 3) a final block, opposite of 2)
	board.prototype.checkSecondDegreeTile = function(x, y, direction, color) {
		console.log("second degree--   x: " + x + ",   y: " + y + ",   direction: " + direction);
		if (direction == 'north') {
			var nextTile1 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile2 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile3 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;

			if (nextTile1 != 0) {
				this.matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				this.matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				this.matches.push(nextTile3);
			}
		} else if (direction == 'east') {
			var nextTile1 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile2 = (y != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile3 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;

			if (nextTile1 != 0) {
				this.matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				this.matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				this.matches.push(nextTile3);
			}
		} else if (direction == 'south') {
			var nextTile1 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile2 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;

			if (nextTile1 != 0) {
				this.matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				this.matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				this.matches.push(nextTile3);
			}
		} else if (direction == 'west') {
			var nextTile1 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile1 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;

			if (nextTile1 != 0) {
				this.matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				this.matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				this.matches.push(nextTile3);
			}
		}
	}

	return board;
});