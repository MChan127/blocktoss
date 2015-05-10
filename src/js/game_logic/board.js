define(['game_logic/block', 'game_logic/board_config'], function(Block, BOARD_CONFIG) {
	var board = function(mainScope) {
		this.MIN_COMBO = BOARD_CONFIG.minCombo;

		this.addingNewBlocks; // interval object for adding new blocks to the field
		this.newBlockIndex = 0; // x coordinate where a new block is to be added
								// constantly incremented during the interval function

		// renderer object used throughout this entire game session
		// this Board object needs the renderer in order to add/delete/manipulate Block objects
		this.renderer = mainScope.renderer;
		// object containing all images used for the game
		this.images = mainScope.images;

		// create the 2D array containing all Blocks in the game
		this.gameTiles = new Array();
		// 2D array used during search for matching colored blocks
		this.emptyMatchRef = [[]];

		// populate the array with zeroes (representing empty tiles--no Blocks)
		// columns (x-coordinates)
		var i = 0;
		while (i < BOARD_CONFIG.tilesAcross) {
			this.gameTiles[i] = [];
			this.emptyMatchRef[i] = [];

			// rows (y-coordinates)
			var j = 0;
			while (j < BOARD_CONFIG.tilesDown) {
				this.gameTiles[i][j] = 0;
				this.emptyMatchRef[i][j] = 0;
				j++;
			}
			i++;
		}
	}

	// at a regular interval, add blocks to the field from underneath each column
	board.prototype.startAddingNewBlocks = function(scope, images, contexts) {
		scope.addingNewBlocks = setInterval(function() {
			var allPositions = []; // array containing positions of all blocks being moved

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

			allPositions.push({x: currentX, y: 0, color: null});

			// get the height of this column
			var columnHeight = scope.getColumnHeight(currentX)-1;
			// from top to bottom, move the blocks down the field
			var i = columnHeight;
			while (i >= 0) {
				var blockObj = scope.gameTiles[currentX][i];
				blockObj.moveBy(0, 1, scope.renderer, scope.gameTiles);
				blockTilePos = blockObj.getTileCoordinates();
				allPositions.push({x: blockTilePos.x, y: blockTilePos.y, color: blockObj.color});
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

			allPositions[0].color = newColor;

			scope.calculateChain(allPositions, scope);
		}, BOARD_CONFIG.gameSpeed);
	}

	board.prototype.stopAddingBlocks = function() {
		clearInterval(this.addingNewBlocks);
	}

	// whenever a new block appears or player tosses a block (and it collides with the stack),
	// check if any combos/chains ensue
	// recursively calls eraseMoveScan() if chains continue to occur, until no more matches are found
	// then calculateChain() returns a promise
	// @param blocks: array of blocks represented in {x, y, color}
	board.prototype.calculateChain = function(blocks, board) {
		var deferred = $.Deferred();

		// object keeping track of all chains+combos
		var chain = [];

		this.findMatchingBlocks(blocks, board, chain)
		// if matches are found, erase these blocks (but keep the chain obj)
		.done(function(newChain) {
			eraseMoveScan(deferred, newChain);
		})
		// if no more matches are found, there is no chain so resolve the promise
		.fail(function() {
			deferred.resolve(chain);
		});

		// scope object contains the Board functions eraseMatchingBlocks() and fallBlocks()
		function eraseMoveScan(deferred, chain) {
			board.eraseMatchingBlocks(chain)

			// after erasing, drop the floating blocks that are in the air
			// pass in chain obj because findMatchingBlocks() will be performed on each of the 
			// fallen blocks, and we can continue to append to the chain in each case
			.done(function(fallRanges) {
				board.fallBlocks(fallRanges);
			})

			// after falling all the blocks and scanning them, 
			// if the scans have found more matching blocks, recursively call eraseMoveScan()
			.done(function(newChain) {
				//eraseMoveScan(deferred, newChain);
				deferred.resolve(chain);
				return;
			})

			// if no more matches are found, the chain ends here
			.fail(function(chain) {
				// add chain to score
				// show congratulation message based on length of chain/size of combo
				deferred.resolve(chain);
				return;
			});
		}

		return deferred.promise();
	}

	// for each block in 'positions' array, runs the checkFirstDegreeTile() and checkSecondDegreeTile()
	// functions to count all the adjacent blocks with matching color that it's in contact with
	// This function recursively calls findNextMatchingBlocks() until it's found no more matching blocks
	// connected to the given set
	// @param positions: array of objects, each representing a block and containing an x coordinate,
	//					 y coordinate, and the block's color
	// @param chain: object that's continually passed throughout the callbacks
	//		  		 and keeps track of all the chains up to this point, and the size of combo for each 
	board.prototype.findMatchingBlocks = function(positions, board, chain) {
		chain = (typeof(chain) == 'undefined') ? [] : chain;

		var deferred = $.Deferred();

		var matchRef = JSON.parse(JSON.stringify(this.emptyMatchRef));

		findNextMatchingBlocks(0, deferred, matchRef);

		// @param matchRef: 2D array keeping track of all matching blocks we've found so far
		//					This array isn't returned, but used as a convenient/inexpensive way to check if
		//					we've already included certain blocks in our count (to save time/prevent redundant 
		//					operations)
		// @param matches: array of all positions for matching blocks we've found. At the end, 
		//				   it's pushed to the 'chain' object
		// @param index: the current index in 'positions' (the current block) that we're working on
		function findNextMatchingBlocks(index, deferred, matchRef, matches) {
			matches = (typeof(matches) == 'undefined') ? [] : matches;
			
			// scan for this block located at positions[index]
			board.checkFirstDegreeTile(positions[index].x, positions[index].y, positions[index].color, matchRef, matches)

			// if matches found, call this function again for the next block
			.done(function(newMatchRef, newMatches) {
				index++;

				// base case: no more blocks left to scan for
				if (index == positions.length) {
					// if three or more matching color blocks found (for any
					// of the blocks in the set), means we have at least a combo of 3
					if (newMatches.length >= board.MIN_COMBO) {
						// found matches
						// add our newly found matches to the chain
						chain.push(newMatches);
						deferred.resolve(chain);

					// did not find matches
					} else {
						deferred.reject(chain);
					}
				} else {
					findNextMatchingBlocks(index, deferred, newMatchRef, newMatches);
				}
			});
		}

		return deferred.promise();
	}

	// scan surrounding blocks to determine if there are at least two
	// other blocks in contact that have the same color
	// in total, we will have checked twelve tiles branching out from the original in the center
	board.prototype.checkFirstDegreeTile = function(x, y, color, matchRef, matches) {
		var deferred = $.Deferred();

		// if this block is already included in our matches, then skip
		// (because it means a previously scanned block would've already included the matches for this one)
		// else continue scanning for it
		if (matchRef[x][y] == 1) {
			deferred.resolve(matchRef, matches);
			return deferred.promise();
		}

		var localMatches = [];
		var matchRefCopy = JSON.parse(JSON.stringify(matchRef));

		// include the original block
		localMatches.push({x: x, y: y});
		matchRefCopy[x][y] = 1;

		//console.log("first degree--   x: " + x + ",   y: " + y);
		// check northern block
		if (y > 0) {
			if (this.checkTileColor(x, y-1, color) != 0) { 
				localMatches.push({x: x, y: y-1});
				matchRefCopy[x][y-1] = 1;
				matchObjs = this.checkSecondDegreeTile(x, y-1, 'north', color, localMatches, matchRefCopy);

				localMatches = matchObjs.localMatches;
				matchRefCopy = matchObjs.matchRefCopy;
			}

		}
		// check eastern block
		if (x != BOARD_CONFIG.tilesAcross-1) {
			if (this.checkTileColor(x+1, y, color) != 0) {
				localMatches.push({x: x+1, y: y});
				matchRefCopy[x+1][y] = 1;
				matchObjs = this.checkSecondDegreeTile(x+1, y, 'east', color, localMatches, matchRefCopy);

				localMatches = matchObjs.localMatches;
				matchRefCopy = matchObjs.matchRefCopy;
			}

		}
		// check southern block
		if (y != BOARD_CONFIG.tilesDown-1) {
			if (this.checkTileColor(x, y+1, color) != 0) {
				localMatches.push({x: x, y: y+1});
				matchRefCopy[x][y+1] = 1;
				matchObjs = this.checkSecondDegreeTile(x, y+1, 'south', color, localMatches, matchRefCopy);

				localMatches = matchObjs.localMatches;
				matchRefCopy = matchObjs.matchRefCopy;
			}

		}
		// check western block
		if (x > 0) {
			if (this.checkTileColor(x-1, y, color) != 0) {
				localMatches.push({x: x-1, y: y});
				matchRefCopy[x-1][y] = 1;
				matchObjs = this.checkSecondDegreeTile(x-1, y, 'west', color, localMatches, matchRefCopy);

				localMatches = matchObjs.localMatches;
				matchRefCopy = matchObjs.matchRefCopy;
			}

		}

		// if three or more matching color blocks found, means we have at least a combo of 3
		// for this block
		// if so, append/copy the new results and return them
		if (localMatches.length >= this.MIN_COMBO) {
			matches = matches.concat(localMatches);
			matchRef = JSON.parse(JSON.stringify(matchRefCopy));
		}
		// otherwise the contents of 'matches' and 'matchRef' have not changed

		deferred.resolve(matchRef, matches);

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
	board.prototype.checkSecondDegreeTile = function(x, y, direction, color, matches, matchRef) {
		//console.log("second degree--   x: " + x + ",   y: " + y + ",   direction: " + direction);
		if (direction == 'north') {
			var nextTile1 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile2 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile3 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
				matchRef[x][y-1] = 1;
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
				matchRef[x+1][y] = 1;
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
				matchRef[x-1][y] = 1;
			}
		} else if (direction == 'east') {
			var nextTile1 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;
			var nextTile2 = (y != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile3 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
				matchRef[x+1][y] = 1;
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
				matchRef[x][y+1] = 1;
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
				matchRef[x][y-1] = 1;
			}
		} else if (direction == 'south') {
			var nextTile1 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;
			var nextTile2 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesAcross-1) ? this.checkTileColor(x+1, y, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
				matchRef[x][y+1] = 1;
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
				matchRef[x-1][y] = 1;
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
				matchRef[x+1][y] = 1;
			}
		} else if (direction == 'west') {
			var nextTile1 = (x > 0) ? this.checkTileColor(x-1, y, color) : 0;
			var nextTile2 = (y > 0) ? this.checkTileColor(x, y-1, color) : 0;
			var nextTile3 = (x != BOARD_CONFIG.tilesDown-1) ? this.checkTileColor(x, y+1, color) : 0;

			if (nextTile1 != 0) {
				matches.push(nextTile1);
				matchRef[x-1][y] = 1;
			}
			if (nextTile2 != 0) {
				matches.push(nextTile2);
				matchRef[x][y-1] = 1;
			}  
			if (nextTile3 != 0) {
				matches.push(nextTile3);
				matchRef[x][y+1] = 1;
			}
		}

		return {localMatches: matches, matchRefCopy: matchRef};
	}

	// erase the latest set of matching color blocks from the field
	board.prototype.eraseMatchingBlocks = function(chain) {
		var deferred = $.Deferred();
		var blocksErased = 0;

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
			
			eraseBlock(blockObj, this.images, currentX, currentY, this.renderer);
		}

		function eraseBlock(blockObj, images, currentX, currentY, renderer) {7
			blockObj.addAnimation(renderer,
			[
				images['erase_block1.png'],
				images['erase_block2.png'],
				images['erase_block3.png'],
				images['erase_block4.png'],
				images['erase_block5.png'],
				images['erase_block6.png'],
				images['erase_block7.png'],
				images['erase_block8.png'],
				images['erase_block9.png'],
				images['erase_block10.png'],
				images['erase_block11.png'],
				images['erase_block12.png']
			], 15, true, removeBlock);

			function removeBlock() {
				// remove it from the field
				blockObj.remove(renderer);

				// update minimum and maximum y coordinates of erased blocks for every column
				if (fallRanges[currentX] == null) {
					fallRanges[currentX] = {min: currentY, max: currentY};
				} else {
					fallRanges[currentX].min = (currentY < fallRanges[currentX].min) ? 
						currentY : fallRanges[currentX].min;

					fallRanges[currentX].max = (currentY > fallRanges[currentX].max) ? 
						currentY : fallRanges[currentX].max;
				}

				if (++blocksErased == matches.length) {
					deferred.resolve(fallRanges);
				}
			}
		}

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