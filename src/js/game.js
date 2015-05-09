$(document).ready(function() {
	// bring the game container (which contains all the canvases) to the 
	// (near) vertical center of the document
	var docHeight = $(document).height();
	$('#game-container').css({
		'position': 'relative',
		'top': (docHeight / 2 - 275) + 'px'
	});

	// scroll the game canvas into view from the right
	var deferred = $.Deferred();
	$('#game-container').css('transform', 'translate(-100%, 0)').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
		deferred.resolve();
	});

	// create contexts for the canvases here
	// each canvas represents a different layer of graphics in the game
	// eventually they are passed onto the game logic modules so that the render may use them
	// background--stars, title screen, menu options, etc.
	var bg_canvas = document.getElementById("game-background");
    var ctx_bg = bg_canvas.getContext("2d");
    // foreground--the blocks in the game
    var fg_canvas = document.getElementById("game-foreground");
    var ctx_fg = fg_canvas.getContext("2d");
    // player--the cursor which the player controls
    var player_canvas = document.getElementById("game-player");
    var ctx_player = fg_canvas.getContext("2d");

    // represents the speed at which the canvases are redrawn
	var delay = 10;

	// initialize the game logic
    deferred.done(function() {
    	require(['game_logic/main'], function(main) {
    		// order of contexts in the array matters, because
    		// contexts are updated in order from left to right
    		main.initGame([ctx_bg, ctx_fg], delay);
    	});
    });
});