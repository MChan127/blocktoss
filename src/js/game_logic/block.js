define(['game_logic/drawing', 'game_logic/board_config'], function(Drawing, BOARD_CONFIG) {
	var block = function(name, img, color) {
		Drawing.call(this, name, img);
		this.color = color;
	}

	// inherit from Drawing, since a Block is also a draw-able object on the canvas
	// the Block object's functions also require the Board object being passed in, because
	// we have to update the Board 2D array as well as the Canvas
	block.prototype = Object.create(Drawing.prototype);

	// same as Drawing object init(), except the passed-in x,y coordinates are
	// indexes for the two-dimensional array (the Board)
	// this function converts those indexes to proper pixel coordinates for the renderer
	// to use for drawing on the canvas
	// the width and height are based on a constant size for all blocks (taken from BOARD_CONFIG)
	block.prototype.init = function(renderer, gameTiles, context, x, y) {
		this.width = Math.floor(BOARD_CONFIG.fieldWidth / BOARD_CONFIG.tilesAcross);
		this.height = Math.floor(BOARD_CONFIG.fieldHeight / BOARD_CONFIG.tilesDown);
		this.x = x * this.width;
		this.y = y * this.height;
		this.context = context;

		// add the drawing to the renderer array on this context (canvas layer)
		renderer.newDrawing(this);

		// set redraw since we have a new drawing
		// only redraws for the relevant context
		renderer.setRedraw(this.context, true);

		// add to the Board's two-dimensional array
		gameTiles[x][y] = this;
	}

	// move the drawing
	block.prototype.moveTo = function(x, y, renderer, gameTiles) {
		// update the board
		// remove from previous location and add into the new index
		var oldX = Math.floor(this.x / this.width);
		var oldY = Math.floor(this.y / this.height);
		gameTiles[oldX][oldY] = 0;
		gameTiles[x][y] = this;

		this.x = x * this.width;
		this.y = y * this.height;

		// tell renderer that it needs to clear
		// and redraw the canvas
		renderer.setRedraw(this.context, true);
	}

	// move the drawing relative to its current position
	block.prototype.moveBy = function(x, y, renderer, gameTiles) {
		// update the board
		// remove from previous location and add into the new index
		var oldX = Math.floor(this.x / this.width);
		var oldY = Math.floor(this.y / this.height);

		gameTiles[oldX][oldY] = 0;
		gameTiles[oldX+x][oldY+y] = this;

		this.x += x * this.width;
		this.y += y * this.height;

		renderer.setRedraw(this.context, true);
	}

	return block;
});