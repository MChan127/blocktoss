$(document).ready(function() {

	// bring the input form to the (near) vertical center of the document
	var docHeight = $(document).height();
	$('#playerNameInput').css({
		'position': 'relative',
		'top': (docHeight / 2 - 150) + 'px'
	});

	$('#playerNameInput').bind('keypress', function(e) {
		if (e.which == 13) {
			loginPlayer($(this), $('#playerName').val());		
		}
	});

	$('#submitPlayerName').bind('click', function() {
		loginPlayer($('#playerNameInput'), $('#playerName').val());
	});
});

function loginPlayer(obj, name) {
	$.ajax({
		url: "routes.php",
		type: 'post',
		data: {
			action: 'login',
			playerName: name
		},
		success: function(data) {
			console.log("returned: " + data);

			// some special effect after logging in
			// upon finishing the animation, redirect user to the next page
			var deferred = $.Deferred();
			obj.css('transform', 'translate(-100%, 0)').bind("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", function() {
				deferred.resolve();
			});

			// take user to game page
			deferred.done(function() {
				$(location).attr('href', 'game.php');
			});
		}	
	});
}