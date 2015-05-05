<!DOCTYPE html>
<html>
<head>

<meta name="robots" content="follow, index">
<meta name="description" content="A simple puzzle game akin to Tetris but upside-down. The player moves a cursor left and right at the bottom and throws tiles/blocks at the generating blocks above. Three attached tiles of identical color (doesn't have to be a straight line, just touching) will cause the tiles to erase.">

<script src="components/jquery/dist/jquery.min.js"></script>
<link href="components/bootstrap/dist/css/bootstrap.min.css" rel="stylesheet">
<script src="components/handlebars/handlebars.min.js"></script>
<script src="components/bootstrap/dist/js/bootstrap.min.js"></script>

<link href="css/style.css" rel="stylesheet">

<script src="js/index.js"></script>

<title>Block Toss - Created by Matthew Chan</title>

</head>

<body>
	<?php
		// if user is already logged in, redirect them to the game page
		session_start();
		if ($_SESSION != null) {
			header('Location: game.php');
			die();
		}
	?>

	<div id="wrapper"> <!-- ultimate wrapper dictating the font family, size, background color, etc. -->

	<div id="playerNameInput">
		<div class="form-group col-xs-8 col-xs-offset-2">
			Enter a Player Name >>&nbsp;&nbsp;
			<input id="playerName" type="text">&nbsp;&nbsp;
			<button id="submitPlayerName" type="button" class="btn btn-default">OK!</button>
		</div>
	</div>

	</div>
</body>
</html>