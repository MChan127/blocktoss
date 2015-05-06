<?php
require('../lib/player.php');
require('../lib/getfilenames.php');

// NOTE: each request for a php file traverses the entirety of its code 
// from top to bottom
// effectively then, routes are distinguished using program flow (conditionals, 
// which depend on the state of the query or REST command and params, and etc.)

// start session at the beginning of each page hit for this php file
// so that we may gain access to the session variables
session_start();

// log the player into the game, by appending their name or finding it in the db
// then stores the resulting player object in the session
if (isset($_POST['action'])) {

	if ($_POST['action'] == 'login') {
		// check that user is not already logged in
		if ($_SESSION != null) {
			header('Location: game.php');
			die();
		} else {
			$_SESSION['player'] = new Player($_POST['playerName']);
			echo 'success';
		}

	} else if ($_POST['action'] == 'fetchassets') {
		$imglist = fetchAssets('../src/assets/graphics/');
		$soundlist = fetchAssets('../src/assets/audio/');
		$filenames = array('images' => $imglist, 'sounds' => $soundlist);
		echo json_encode($filenames);
	}

// else if no special request, just render the home page
} else {
	include('index.php');
}
