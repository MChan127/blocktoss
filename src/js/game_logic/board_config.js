define([], function() {
	var BOARD_CONFIG = {
		tilesAcross: 13, // number of blocks that span the width of the screen
        tilesDown: 12, // number of tiles from top to bottom
        fieldWidth: 520, // width of the playing field in pixels
        fieldHeight: 480, // height of the playing field in pixels
        minCombo: 3, // minimum number of matching color blocks to create a combo
        gameSpeed: 1100 // speed at which new blocks are added to the field
	}

	return BOARD_CONFIG;
});