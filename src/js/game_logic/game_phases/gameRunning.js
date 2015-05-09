define([], function() {
	var gameRunning = function() {
		this.board.startAddingNewBlocks(this.board, this.images, this.contexts);
	}

	return gameRunning;
});