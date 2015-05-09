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
	// uses callback to indicate found or not found, but also returns the number of matching tiles
	// (so as to notify the Board object how large of a combo the player has made, etc.)
	board.prototype.findMatchingBlocks = function(x, y, color, callback) {
		var matches = 0;

		// console.log("x: " + x + ",   y: " + y);
		// check northern block
		var nextTile = this.gameTiles[x][y-1];
		if (nextTile != 0 && nextTile != undefined) {
			if (nextTile.color == color) {
				matches++;
				checkSecondLayer(x, y-1, 'north');
			}
		}
		// check eastern block
		if (x != BOARD_CONFIG.tilesAcross-1) {

			var nextTile = this.gameTiles[x+1][y];
			if (nextTile != 0 && nextTile != undefined) {
				if (nextTile.color == color) {
					matches++;
					checkSecondLayer(x+1, y, 'north');
				}
			}

		}
		// check southern block
		var nextTile = this.gameTiles[x][y+1];
		if (nextTile != 0 && nextTile != undefined) {
			if (nextTile.color == color) {
				matches++;
				checkSecondLayer(x, y+1, 'north');
			}
		}
		// check western block
		if (x != 0) {

			var nextTile = this.gameTiles[x-1][y];
			if (nextTile != 0 && nextTile != undefined) {
				if (nextTile.color == color) {
					matches++;
					checkSecondLayer(x-1, y, 'north');
				}
			}

		}

		// if more than two matching colored blocks, means we have at least a combo of 3
		if (matches > 2) {
			callback(true);
			return matches;
		}

		// given a block adjacent to the original, check two more blocks
		// 1) one block continuing in the original direction
		// 2) another block going 90-degrees clockwise from this direction (so if originally
		//		headed north, check the tile east of this one)
		function checkSecondLayer(x, y, direction) {
			if (direction == 'north') {
				var nextTile1 = this.gameTiles[x][y-1];
				var nextTile2 = this.gameTiles[x+1][y];

				if (nextTile1 != undefined && nextTile1 != 0) {
					matches = (nextTile1.color == color) ? matches+1 : matches;
				}
				if (nextTile2 != undefined && nextTile2 != 0) {
					matches = (nextTile2.color == color) ? matches+1 : matches;
				}
			} else if (direction == 'east') {
				var nextTile1 = this.gameTiles[x+1][y];
				var nextTile2 = this.gameTiles[x][y+1];
				
				if (nextTile1 != undefined && nextTile1 != 0) {
					matches = (nextTile1.color == color) ? matches+1 : matches;
				}
				if (nextTile2 != undefined && nextTile2 != 0) {
					matches = (nextTile2.color == color) ? matches+1 : matches;
				}
			} else if (direction == 'south') {
				var nextTile1 = this.gameTiles[x][y+1];
				var nextTile2 = this.gameTiles[x-1][y];
				
				if (nextTile1 != undefined && nextTile1 != 0) {
					matches = (nextTile1.color == color) ? matches+1 : matches;
				}
				if (nextTile2 != undefined && nextTile2 != 0) {
					matches = (nextTile2.color == color) ? matches+1 : matches;
				}
			} else if (direction == 'west') {
				var nextTile1 = this.gameTiles[x-1][y];
				var nextTile2 = this.gameTiles[x][y-1];
				
				if (nextTile1 != undefined && nextTile1 != 0) {
					matches = (nextTile1.color == color) ? matches+1 : matches;
				}
				if (nextTile2 != undefined && nextTile2 != 0) {
					matches = (nextTile2.color == color) ? matches+1 : matches;
				}
			}
		}
	}

	return board;
});