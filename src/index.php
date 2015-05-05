<?php
require('../lib/login.php');

// NOTE: each request for a php file traverses the entirety of its code 
// from top to bottom
// effectively then, routes are distinguished using program flow (conditionals, 
// which depend on the state of the query or REST command and params, and etc.)

// log the player into the game, by appending their name or finding it in the db
if (isset($_POST['action'])) {
	if ($_POST['action'] == 'login') {
		$loggedIn = new loggedInPlayer($_POST['playerName']);
		print_r(array('playerName' => $loggedIn->getName(), 'playerId' => $loggedIn->getId()));
	}

// else if no special request, just render the home page
} else {
	include('home.php');
}
