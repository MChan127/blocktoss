// defines logic for different phases of the game
// -- title, gameplay, game over, and viewing/submission of high scores

// need to access the render and audio modules in the meantime, for displaying
// graphics and playing sound

define(['game_logic/render', 'game_logic/audio'], 
	function(render, audio) {
	var phases = {
		// display the title
		getTitle: function() {
			// make the title and menu options here
			// start playing the music
			// ^ call other modules for this

			// listen for user input

			console.log("display the title");
		},
		
		// start a new game
		getNewGame: function() {
			
		},

		// end the current game
		getEndGame: function() {

		},

		// fetch/submit high scores
		getHighScores: function() {

		}
	};

	return phases;
});