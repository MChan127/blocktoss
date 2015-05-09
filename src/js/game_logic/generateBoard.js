// generate the Board object, which contains functions to scan itself
// for matching-colored blocks, erase blocks, move blocks, count chains and 
// combos, add new blocks, etc.
// the Board obj is represented in game as a 2-dimensional array populated by Block objects
define(['game_logic/board', 'game_logic/block', 'game_logic/board_config'], function(Board, Block, BOARD_CONFIG) {
	var generateBoard = function(mainScope) {
		var deferred = $.Deferred();

		// create a new board
		this.board = new Board();

		// set the number of each size of column, from tallest to shortest (simply one block)
		// all values should add up to the value of 'BOARD_CONFIG.tilesAcross', else will result in some empty columns
		var columnCounts = [4, 4, 6, 4];

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
			// populate the column with Block objects
			for (var i = 0; i < size; i++) {
				var newColor = getNewColor(index, i, Math.floor(Math.random() * 7));

				var tempBlock = new Block('block', mainScope.images['block.png'], newColor);

				// add this new Block Drawing to the renderer's queue (and therefore the canvas)
				// use the foreground context
				tempBlock.init(mainScope.renderer, mainScope.contexts[1], index, i);

				// add to the Board's two-dimensional array
				this.board.gameTiles[index][i] = tempBlock;
			}
		}

		// recursive function that returns a new color that doesn't result in existence of 
		// three adjacent same-color blocks (because we don't want to generate combos/chains in our
		// 		starting blocks)
		// keeps calling itself until it finds a safe color for the block
		function getNewColor(x, y, color) {
			this.board.findMatchingBlocks(x, y, color, function(found) {
				// if there are matching blocks with this color
				// switch to the next color, and repeat the function call
				if (found) {
					var nextColor = (color == 6) ? 0 : color+1;
					return getNewColor(x, y, nextColor);

				// else, this is a safe color that doesn't result in matches
				} else {
					return color;
				}
			});
		}
	}

	return generateBoard;
});