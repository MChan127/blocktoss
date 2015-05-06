<?php
// returns filenames of all required assets for the game (from the src/assets/ directory)
// such as graphics, sound, and etc. 

function fetchAssets($dir) {
	$filelist = scandir($dir);

	// array to store filenames in
	$filenames = array();
	foreach ($filelist as $file) {
		array_push($filenames, $file);
	}

	return $filelist;
}
