$(document).ready(function() {
	// bring the input form to the (near) vertical center of the document
	var docHeight = $(document).height();
	$('#game').css({
		'position': 'relative',
		'top': (docHeight / 2 - 290) + 'px'
	});

	// scroll the game canvas into view from the right
	$('#game').css('transform', 'translate(-160%, 0)');
});