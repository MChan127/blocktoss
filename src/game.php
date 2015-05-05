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

<script src="js/game.js"></script>

<title>Block Toss - Created by Matthew Chan</title>

</head>

<body>
	<?php
		// if user isn't logged in, redirect them back to the index page
		session_start();
		if ($_SESSION == null) {
			header('Location: /');
			die();
		}
	?>

	<div id="wrapper" class="game-wrapper"> <!-- ultimate wrapper dictating the font family, size, background color, etc. -->

	<div id="game" class="col-xs-6 col-xs-offset-3">
		<canvas height="540"></canvas>
	</div>

	<div id="logout">
		<a href="logout.php">Log Out</a>
	</div>

	</div>
</body>
</html>