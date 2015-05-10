// generate the Board object, which contains functions to scan itself
// for matching-colored blocks, erase blocks, move blocks, count chains and 
// combos, add new blocks, etc.
// the Board obj is represented in game as a 2-dimensional array populated by Block objects
define(['game_logic/board', 'game_logic/block', 'game_logic/board_config'], function(Board, Block, BOARD_CONFIG) {
	var generateBoard = function(mainScope) {
		var deferred = $.Deferred();

		// create a new board
		this.board = new Board(mainScope);

		// set the number of each size of column, from tallest to shortest (simply one block)
		// all values should add up to the value of 'BOARD_CONFIG.tilesAcross', else will result in some empty columns
		var columnCounts = [3, 3, 4, 3];

		// create an array representing all the x-coordinates we have to choose from
		// every time we insert a column, that index is removed from the array (so that we don't populate two
		//		same columns)
		var columnIndexes = [];
		for (var i = 0; i < BOARD_CONFIG.tilesAcross; i++) {
			columnIndexes.push(i);
		}

		// for each size of column, randomly select indexes on the field (from 0 to tilesAcross - 1) and 
		// populate with that column, decrementing column counts each time until we've filled the whole 
		// width of the field
		var insertCount = 0; // how many columns we've populated so far
		for (var i = 0; i < columnCounts.length; i++) {
			for (var j = 0; j < columnCounts[i]; j++) {

				// pick a random horizontal index on the field as our column to populate
				var arrayIndex = Math.floor(Math.random() * (BOARD_CONFIG.tilesAcross-insertCount));
				var newColumn = columnIndexes[arrayIndex];

				fillColumn(newColumn, columnCounts.length-i);

				// since we're done with this x coordinate, remove it from the array so that we don't
				// insert twice
				columnIndexes.splice(arrayIndex, 1);
				insertCount++;
			}
		}

		deferred.resolve(this.board);
		return deferred.promise();

		// fill the given column with blocks of random colors
		// index: horizontal location on the field
		// size: height of this column (number of blocks vertically)
		/* colors and their indexes: 
		* 0 = red
		* 1 = orange
		* 2 = yellow
		* 3 = green
		* 4 = blue
		* 5 = purple
		* 6 = white
		*/
		function fillColumn(index, size) {
			var colorImages = {
				0: mainScope.images['red_block.png'],
				1: mainScope.images['orange_block.png'],
				2: mainScope.images['yellow_block.png'],
				3: mainScope.images['green_block.png'],
				4: mainScope.images['blue_block.png'],
				5: mainScope.images['purple_block.png'],
				6: mainScope.images['white_block.png']
			}

			// populate the column with Block objects
			for (var i = 0; i < size; i++) {
				createBlock(this.board, colorImages, index, i);
			}
		}

		function createBlock(board, colorImages, x, y) {
			var deferred = $.Deferred();

			getNewColor(x, y, Math.floor(Math.random() * 7), deferred).done(function(newColor) {
				var tempBlock = new Block('block', colorImages[newColor], newColor);

				// add this new Block Drawing to the renderer's queue (and therefore the canvas)
				// use the foreground context
				tempBlock.init(mainScope.renderer, board.gameTiles, mainScope.contexts[1], x, y);
			});
		}

		// recursive function that returns a new color that doesn't result in existence of 
		// three adjacent same-color blocks (because we don't want to generate combos/chains in our
		// 		starting blocks)
		// keeps calling itself until it finds a safe color for the block
		function getNewColor(x, y, color, deferred) {
			this.board.findMatchingBlocks([{x: x, y: y, color: color}], this.board)
			.done(function() {
				// if there are matching blocks with this color
				// switch to the next color, and repeat the function call
				//console.log("true, disregard: " + color);
				var nextColor = (color == 6) ? 0 : color+1;
				//console.log("try: " + nextColor);
				getNewColor(x, y, nextColor, deferred);
			})
			.fail(function() {
				// else, this is a safe color that doesn't result in matches
				//console.log("false, return: " + color);
				deferred.resolve(color);
			});

			return deferred.promise();
		}
	}

	return generateBoard;
});