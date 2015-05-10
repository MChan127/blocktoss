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

<link href='http://fonts.googleapis.com/css?family=Press+Start+2P' rel='stylesheet' type='text/css'>

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

	<div id="wrapper" class="game-page"> <!-- ultimate wrapper dictating the font family, size, background color, etc. -->

	<div id="game-container">
		<div id="canvas-wrapper">
			<canvas id="game-background" width="520" height="540">Sorry, this web browser doesn't support HTML5 canvases.</canvas>
			<canvas id="game-foreground" width="520" height="540"></canvas>
		</div>
	</div>

	<div id="logout">
		<a href="logout.php">Log Out</a>
	</div>

	<div id="logout" style="position: relative; top: -80px;">
		<a id="pause" href="#">Pause/Go</a>
	</div>

	</div>

	<!-- used to modularize the javascript files -->
	<script data-main="js/game.js" src="js/vendor/require.js"></script>
</body>
</html>