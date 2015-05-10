define([], function() {
	var gameRunning = function() {
		this.board.startAddingNewBlocks(this.board, this.images, this.contexts);

		initPauseButton(this);
		function initPauseButton(scope) {
			$('#pause').bind('click', function() {
				scope.board.stopAddingBlocks();
			});
		}
	}

	return gameRunning;
});