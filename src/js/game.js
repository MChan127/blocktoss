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

	var bg_canvas = document.getElementById("game-background");
    var bg_ctx = bg_canvas.getContext("2d");
    var fg_canvas = document.getElementById("game-foreground");
    var fg_ctx = fg_canvas.getContext("2d");

    var img = new Image();
    img.src = "../img/game_graphics/space_bg.png";
    bg_ctx.drawImage(img, 0, 0);

    deferred.done(function() {
    	require(['game_logic/phases'], function(phases) {
    		phases.getTitle();
    	});
    });
});