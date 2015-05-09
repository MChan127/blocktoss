define(['game_logic/drawing', 'game_logic/generateBoard'], function(Drawing, generateBoard) {
	var getNewGame = function() { 
		this.board = null;
		this.loading = setInterval(function() {
			//console.log("loading...");
		}, 1000);

		function initBoard(scope) {
			generateBoard(scope).done(function(newBoard) {
				clearInterval(scope.loading);
				scope.board = newBoard;
			});
		}
		initBoard(this);
	}

	return getNewGame;
});