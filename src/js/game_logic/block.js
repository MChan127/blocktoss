define(['game_logic/drawing', 'game_logic/board_config'], function(Drawing, BOARD_CONFIG) {
	var block = function(name, img, color) {
		Drawing.call(this, name, img);
		this.color = color;
	}

	// inherit from Drawing, since a Block is also a draw-able object on the canvas
	block.prototype = Object.create(Drawing.prototype);

	// same as Drawing object init(), except the passed-in x,y coordinates are
	// indexes for the two-dimensional array (the Board)
	// this function converts those indexes to proper pixel coordinates for the renderer
	// to use for drawing on the canvas
	// the width and height are based on a constant size for all blocks (taken from BOARD_CONFIG)
	block.prototype.init = function(renderer, context, x, y) {
		this.width = BOARD_CONFIG.fieldWidth / BOARD_CONFIG.tilesAcross;
		this.height = BOARD_CONFIG.fieldHeight / BOARD_CONFIG.tilesDown;
		this.x = x * this.width;
		this.y = y * this.height;
		this.context = context;

		// add the drawing to the renderer array on this context (canvas layer)
		renderer.newDrawing(this);

		// set redraw since we have a new drawing
		// only redraws for the relevant context
		renderer.setRedraw(this.context, true);
	}

	// move the drawing
	block.prototype.moveTo = function(x, y, renderer) {
		this.x = x * this.width;
		this.y = y * this.height;

		// tell renderer that it needs to clear
		// and redraw the canvas
		renderer.setRedraw(this.context, true);
	}

	// move the drawing relative to its current position
	block.prototype.moveBy = function(x, y, renderer) {
		this.x += x * this.width;
		this.y += y * this.height;

		renderer.setRedraw(this.context, true);
	}

	return block;
});