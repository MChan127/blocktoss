define(['game_logic/generateBoard'], function(generateBoard) {
	var getNewGame = function() { 
		this.board = null;
		this.loading = setInterval(function() {
			//console.log("loading...");
		}, 1000);

		function initBoard(scope) {
			generateBoard(scope).done(function(newBoard) {
				clearInterval(scope.loading);
				scope.board = newBoard;

				// start the actual game
				scope.gameRunning();
			});
		}
		initBoard(this);
	}

	return getNewGame;
});