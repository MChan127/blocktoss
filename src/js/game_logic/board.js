define(['game_logic/block', 'game_logic/board_config'], function(Block, BOARD_CONFIG) {
	var board = function(mainScope) {
		this.addingNewBlocks; // interval object for adding new blocks to the field
		this.newBlockIndex = 0; // x coordinate where a new block is to be added
								// constantly incremented during the interval function

		// renderer object used throughout this entire game session
		// this Board object needs the renderer in order to add/delete/manipulate Block objects
		this.renderer = mainScope.renderer;

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

	// at a regular interval, add blocks to the field from underneath each column
	board.prototype.startAddingNewBlocks = function(scope, images, contexts) {
		scope.addingNewBlocks = setInterval(function() {
			// first, shift all blocks on this column downward
			// we do this first in order to minimize the possibility of conflict for when player
			// tosses a block
			var currentX; // current column
			if (scope.newBlockIndex == scope.gameTiles.length) {
				scope.newBlockIndex = 0;
				currentX = scope.newBlockIndex++;
			} else {
				currentX = scope.newBlockIndex++;
			}

			// get the height of this column
			var columnHeight = scope.getColumnHeight(currentX)-1;
			// from top to bottom, move the blocks down the field
			var i = columnHeight;
			while (i >= 0) {
				var blockObj = scope.gameTiles[currentX][i];
				blockObj.moveBy(0, 1, scope.renderer, scope.gameTiles);
				i--;
			}

			// now add the new block of a random color
			var colorImages = {
				0: images['red_block.png'],
				1: images['orange_block.png'],
				2: images['yellow_block.png'],
				3: images['green_block.png'],
				4: images['blue_block.png'],
				5: images['purple_block.png'],
				6: images['white_block.png']
			}

			var newColor = Math.floor(Math.random() * 7);
			var newBlock = new Block('block', colorImages[newColor], newColor);
			newBlock.init(scope.renderer, scope.gameTiles, contexts[1], currentX, 0);

		}, BOARD_CONFIG.gameSpeed);
	}

	// whenever a new block appears or player tosses a block (and it collides with the stack),
	// check if any combos/chains ensue
	// recursively calls eraseMoveScan() if chains continue to occur, until no more matches are found
	// then calculateChain() returns a promise
	board.prototype.calculateChain = function(x, y, color) {
		var deferred = $.Deferred();

		// object keeping track of all chains+combos
		var chain = [];

		this.findMatchingBlocks(x, y, color, chain)
		// if matches are found, erase these blocks (but keep the chain obj)
		.done(function(newChain) {
			eraseMoveScan(this, deferred, newChain);
		})
		// if no more matches are found, there is no chain so resolve the promise
		.fail(function() {
			deferred.resolve(chain);
		});

		// scope object contains the Board functions eraseMatchingBlocks() and fallBlocks()
		function eraseMoveScan(scope, deferred, chain) {
			scope.eraseMatchingBlocks(chain)

			// after erasing, drop the floating blocks that are in the air
			// pass in chain obj because findMatchingBlocks() will be performed on each of the 
			// fallen blocks, and we can continue to append to the chain in each case
			.done(function(fallRanges) {
				scope.fallBlocks(fallRanges);
			})

			// after falling all the blocks and scanning them, 
			// if the scans have found more matching blocks, recursively call eraseMoveScan()
			.done(function(newChain) {
				eraseMoveScan(scope, deferred, newChain);
			})

			// if no more matches are found, the chain ends here
			.fail(function(chain) {
				// add chain to score
				// show congratulation message based on length of chain/size of combo
				deferred.resolve(chain);
			});
		}

		return deferred.promise();
	}

	// scan surrounding blocks to determine if there are at least two
	// other blocks in contact that have the same color
	// in total, we will have checked twelve tiles branching out from the original in the center
	// uses callback to indicate found or not found, but also returns the positions of matching tiles
	// (so as to notify the Board object how large of a combo the player has made, etc.) 
	// @param chain: object that's continually passed throughout the callbacks
	//		  and keeps track of all the chains up to this point, and the size of combo for each 
	board.prototype.findMatchingBlocks = function(x, y, color, chain) {
		var deferred = $.Deferred();

		var matches = [];

		//console.log("first degree--   x: " + x + ",   y: " + y);
		// check northern block
		if (y > 0) {

			if (this.checkTileColor(x, y-1, color) != 0) { 
				matches.push({x: x, y: y-1});
				matches = this.checkSecondDegreeTile(x, y-1, 'north', color, matches);
			}

		}
		// check eastern block
		if (x != BOARD_CONFIG.tilesAcross-1) {

			if (this.checkTileColor(x+1, y, color) != 0) {
				matches.push({x: x+1, y: y});
				matches = this.checkSecondDegreeTile(x+1, y, 'east', color, matches);
			}

		}
		// check southern block
		if (y != BOARD_CONFIG.tilesDown-1) {

			if (this.checkTileColor(x, y+1, color) != 0) {
				matches.push({x: x, y: y+1});
				matches = this.checkSecondDegreeTile(x, y+1, 'south', color, matches);
			}

		}
		// check western block
		if (x > 0) {

			if (this.checkTileColor(x-1, y, color) != 0) {
				matches.push({x: x-1, y: y});
				matches = this.checkSecondDegreeTile(x-1, y, 'west', color, matches);
			}

		}

		//console.log("min combo: " + BOARD_CONFIG.minCombo);

		// if two or more matching color blocks found, means we have at least a combo of 3
		if (matches.length >= BOARD_CONFIG.minCombo-1) {
			// if chain has not been declared/passed in, instantiate it here as an empty array
			chain = (chain == null) ? [] : chain;
			// add our newly found matches to the chain
			chain.push(matches);

			// found matches
			deferred.resolve(chain);
		} else {
			// did not find matches
			deferred.reject(chain);
		}

		return deferred.promise();
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
	board.prototype.checkSecondDegreeTile = function(x, y, direction, color, matches) {
		//console.log("second degree--   x: " + x + ",   y: " + y + ",   direction: " + direction);
		if (direction == 'north') {
			var nextTile1 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile2 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile3 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
			}
		} else if (direction == 'east') {
			var nextTile1 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile2 = (y != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile3 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
			}
		} else if (direction == 'south') {
			var nextTile1 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile2 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
			}
		} else if (direction == 'west') {
			var nextTile1 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile2 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
			}
		}

		return matches;
	}

	// erase the latest set of matching color blocks from the field
	board.prototype.eraseMatchingBlocks = function(chain) {
		var deferred = $.Deferred();

		// array containing positions of latest matching color blocks
		var matches = chain[chain.length-1];

		// for each x coordinate where we're erasing blocks, record the height of the stack
		// (the range--so just store the positions of the highest and lowest blocks)
		// so that we know how far to drop each of the blocks above them
		var fallRanges = {};

		for (var i = 0; i < matches.length; i++) {
			var currentX = matches[i].x;
			var currentY = matches[i].y;

			// get the Block object
			var blockObj = this.gameTiles[currentX][currentY];
			// remove it from the field
			blockObj.remove(this.renderer);

			// update minimum and maximum y coordinates of erased blocks for every column
			if (fallRanges[currentX].min == null) {
				fallRanges[currentX].min = currentY;
			} else {
				fallRanges[currentX].min = (currentY < fallRanges[currentX].min) ? 
					currentY : fallRanges[currentX].min;
			}

			if (fallRanges[currentX].max == null) {
				fallRanges[currentX].max = currentY;
			} else {
				fallRanges[currentX].max = (currentY > fallRanges[currentX].max) ? 
					currentY : fallRanges[currentX].max;
			}

		}

		deferred.resolve(fallRanges);
		return deferred.promise();
	}

	// "fall" blocks that are floating as a result of having erased matching color blocks
	// typically called immediately after eraseMatchingBlocks()
	board.prototype.fallBlocks = function(fallRanges) {
		var deferred = $.Deferred();

		// for each column, get the "fall" height from the range between max and min erased blocks
		// then move all the blocks above one by one by that amount
		for (var x in fallRanges) {
			// add 1 because we want the number of blocks that were erased, not just the difference
			// so if only one block was erased, it's y - y + 1 = 1 (all above blocks move by 1)
			var fallAmount = fallRanges[x].max - fallRanges[x].min + 1;

			// loop through above blocks until we reach an empty space
			// move each of these blocks
			var indexToFall = fallRanges[x].max + 1;

			while (this.gameTiles[x][indexToFall] != 0) {
				var blockObj = this.gameTiles[x][indexToFall];
				blockObj.moveBy(0, fallAmount*(-1), this.renderer, this.gameTiles);

				indexToFall++;
			}
		}

		deferred.resolve();
		return deferred.promise();
	}

	// helper function to return height of a column
	board.prototype.getColumnHeight = function(x) {
		var count = 0;
		var i = 0;
		while (this.gameTiles[x][i++] != 0) {
			count++;
		}
		return count;
	}

	return board;
});