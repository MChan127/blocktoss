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
			$(this).unbind(e);
		}
	});

	$('#submitPlayerName').bind('click', function() {
		console.log("test");
		loginPlayer($('#playerNameInput'), $('#playerName').val().trim());
		$(this).unbind();
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