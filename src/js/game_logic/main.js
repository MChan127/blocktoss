// defines logic for different phases of the game
// -- title, gameplay, game over, and viewing/submission of high scores

// need to access the renderer and audio modules in the meantime, for displaying
// graphics and playing sound
// also needs to access drawing.js objects which represent the individual 
// sprites/graphics to be drawn and updated on the canvas

define(['game_logic/renderer', 'game_logic/audio', 'game_logic/drawing', 'game_logic/game_phases/initGame', 'game_logic/game_phases/getTitle', 'game_logic/game_phases/getNewGame', 'game_logic/game_phases/gameRunning'], 
	function(Renderer, audio, Drawing, initGame, getTitle, getNewGame, gameRunning) {

	var main = {
		// receive the contexts and create the renderer object
		// and set the speed of updating the canvases ('delay')
		// also loads all the necessary files from the assets folder, such as graphics and audio
		initGame: initGame,

		// display the title
		getTitle: getTitle,
		
		// start a new game
		getNewGame: getNewGame,

		// during the game running (take user input, start normal game loop, etc.)
		gameRunning: gameRunning,

		// end the current game
		getEndGame: function() {

		},

		// fetch/submit high scores
		getHighScores: function() {

		}
	};

	return main;
});