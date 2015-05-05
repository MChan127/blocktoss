$(document).ready(function() {

	// bring the input form to the (near) vertical center of the document
	var docHeight = $(document).height();
	$('#playerNameInput').css({
		'position': 'relative',
		'top': (docHeight / 2 - 150) + 'px'
	});

	$('#submitPlayerName').bind('click', function() {
		loginPlayer($('#playerName').val());
	});
});

function loginPlayer(name) {
	$.ajax({
		url: "index.php",
		type: 'post',
		data: {
			action: 'login',
			playerName: name
		},
		success: function(data) {
			console.log('return value: ' + data);
		}
	});
}