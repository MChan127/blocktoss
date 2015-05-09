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
		this.matches = 0;

		console.log("first layer--   x: " + x + ",   y: " + y);
		// check northern block
		if (y > 0) {

			var nextTile = this.gameTiles[x][y-1];
			if (nextTile != 0) {
				if (nextTile.color == color) {
					this.matches++;
					checkSecondLayer(this, x, y-1, 'north');
				}
			}

		}
		// check eastern block
		if (x != BOARD_CONFIG.tilesAcross-1) {

			var nextTile = this.gameTiles[x+1][y];
			if (nextTile != 0) {
				if (nextTile.color == color) {
					this.matches++;
					checkSecondLayer(this, x+1, y, 'north');
				}
			}

		}
		// check southern block
		if (y != BOARD_CONFIG.tilesDown-1) {

			var nextTile = this.gameTiles[x][y+1];
			if (nextTile != 0) {
				if (nextTile.color == color) {
					this.matches++;
					checkSecondLayer(this, x, y+1, 'north');
				}
			}

		}
		// check western block
		if (x > 0) {

			var nextTile = this.gameTiles[x-1][y];
			if (nextTile != 0) {
				if (nextTile.color == color) {
					this.matches++;
					checkSecondLayer(this, x-1, y, 'north');
				}
			}

		}

		console.log("matches: " + this.matches);

		// if more than two matching colored blocks, means we have at least a combo of 3
		if (this.matches >= 2) {
			callback(true);
			return this.matches;
		} else {
			callback(false);
			return 0;
		}

		// given a block adjacent to the original, check three more blocks relative to this new block
		// 1) one block continuing in the original direction
		// 2) another block going 90-degrees clockwise from this direction (so if originally
		//		headed north, check the tile east of this one)
		// 3) a final block, opposite of 2)
		function checkSecondLayer(scope, x, y, direction) {
			console.log("second layer--   x: " + x + ",   y: " + y);
			if (direction == 'north') {
				var nextColor1 = (y > 0) ? scope.gameTiles[x][y-1].color : -1;
				var nextColor2 = (x != BOARD_CONFIG.tilesAcross-1) ? scope.gameTiles[x+1][y].color : -1;
				var nextColor3 = (x > 0) ? scope.gameTiles[x-1][y].color : -1;

				if (nextColor1 != 0) {
					scope.matches = (nextColor1 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor2 != 0) {
					scope.matches = (nextColor2 == color) ? scope.matches+1 : scope.matches;
				}  
				if (nextColor3 != 0) {
					scope.matches = (nextColor3 == color) ? scope.matches+1 : scope.matches;
				}
			} else if (direction == 'east') {
				var nextColor1 = (x != BOARD_CONFIG.tilesAcross-1) ? scope.gameTiles[x+1][y].color : -1;
				var nextColor2 = (y != BOARD_CONFIG.tilesDown-1) ? scope.gameTiles[x][y+1].color : -1;
				var nextColor3 = (y > 0) ? scope.gameTiles[x][y-1].color : -1;
				
				if (nextColor1 != 0) {
					scope.matches = (nextColor1 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor2 != 0) {
					scope.matches = (nextColor2 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor3 != 0) {
					scope.matches = (nextColor3 == color) ? scope.matches+1 : scope.matches;
				}
			} else if (direction == 'south') {
				var nextColor1 = (y != BOARD_CONFIG.tilesDown-1) ? scope.gameTiles[x][y+1].color : -1;
				var nextColor2 = (x > 0) ? scope.gameTiles[x-1][y].color : -1;
				var nextColor3 = (x != BOARD_CONFIG.tilesAcross-1) ? scope.gameTiles[x+1][y].color : -1;
				
				if (nextColor1 != 0) {
					scope.matches = (nextColor1 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor2 != 0) {
					scope.matches = (nextColor2 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor3 != 0) {
					scope.matches = (nextColor3 == color) ? scope.matches+1 : scope.matches;
				}
			} else if (direction == 'west') {
				var nextColor1 = (x > 0) ? scope.gameTiles[x-1][y].color : -1;
				var nextColor2 = (y > 0) ? scope.gameTiles[x][y-1].color : -1;
				var nextColor3 = (y != BOARD_CONFIG.tilesDown-1) ? scope.gameTiles[x][y+1].color : -1;
				
				if (nextColor1 != 0) {
					scope.matches = (nextColor1 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor2 != 0) {
					scope.matches = (nextColor2 == color) ? scope.matches+1 : scope.matches;
				}
				if (nextColor3 != 0) {
					scope.matches = (nextColor3 == color) ? scope.matches+1 : scope.matches;
				}
			}
		}
	}

	return board;
});