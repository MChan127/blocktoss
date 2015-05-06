// defines logic for different phases of the game
// -- title, gameplay, game over, and viewing/submission of high scores

// need to access the renderer and audio modules in the meantime, for displaying
// graphics and playing sound
// also needs to access drawing.js objects which represent the individual 
// sprites/graphics to be drawn and updated on the canvas

define(['game_logic/renderer', 'game_logic/audio', 'game_logic/drawing'], 
	function(Renderer, audio, Drawing) {

	var main = {
		renderer: null,
		contexts: null,
		delay: null,

		// receive the contexts and create the renderer object
		// and set the speed of updating the canvases ('delay')
		// also loads all the necessary files from the assets folder, such as graphics and audio
		initGame: function(contexts, delay) {
			// index 0: background context
			// index 1: foreground context
			this.contexts = contexts;
			this.renderer = new Renderer(contexts, delay);
			this.delay = delay;
			this.images = {
				count: 0,
				objects: {}
			}; // object that contains image objects to be used for rendering
			this.audio = {
				count: 0,
				objects: {}
			}; // object that contains audio objects

			loadAssets(this);

			// fetch and load all assets (images, sounds, etc.)
			// then once everything has loaded, proceed to the next phase
			function loadAssets(mainScope) {
				// counts of files fetched from the directories
				var imgCount;
				var soundCount;
				// promises to be chained together so that we may
				// load all the necessary types of files
				var imgDeferred = $.Deferred();
				var soundDeferred = $.Deferred();

				$.ajax({
					url: 'routes.php',
					type: 'post',
					data: {action: 'fetchassets'},
				}).done(function(data) {
					console.log("Data: " + data);

					var filenames = JSON.parse(data);

					var imgFilenames = filenames.images;
					imgCount = imgFilenames.length-2;
					var soundFilenames = filenames.sounds;
					soundCount = soundFilenames.length-2;

					// indexes begins at 2 to exclude '.' and '..' in the array
					// create the image objects
					for (var i = 2; i < imgFilenames.length; i++) {
						var tempImg = new Image();
						tempImg.src = "assets/graphics/" + imgFilenames[i];
						// load the image and store it in the array once finished
						loadImg(mainScope, tempImg, imgFilenames[i]);
					}

					// create the sound objects
					for (var i = 2; i < imgFilenames.length; i++) {
						//****************
						// code this later 
						//****************
						loadSound(mainScope);
					}
				});

				// continually check if all image files have been loaded
				// by comparing the lengths of the store-in array and the original
				function loadImg(mainScope, image, filename) {
					image.onload = function() {
						mainScope.images.count++;
						mainScope.images.objects[filename] = image;

						if (mainScope.images.count == imgCount) {
							mainScope.images = mainScope.images.objects;
							imgDeferred.resolve();
						}
					}
				}

				// same as the image function, but for sounds
				function loadSound(mainScope) {
					// for now, just resolve promise
					soundDeferred.resolve();
				}

				$.when(imgDeferred, soundDeferred).done(function() {
					mainScope.getTitle();
				})
			}
		},

		// display the title
		getTitle: function() {
			// make the title and menu options here
			// start playing the music
			// ^ call other modules for this

			/*function localRender(context) {
				var img = document.createElement("img");
	    		img.src = "../img/game_graphics/space_bg.png";
	    		img.onload = function() {
	    			context.drawImage(img, 0, 0);
	    		}
    		}

    		localRender(this.contexts[0]);*/

    		var main_bg = new Drawing('space_bg', this.images['space_bg.png']);
    		main_bg.init(this.renderer, this.contexts[0], 0, 0);

			// listen for user input
		},
		
		// start a new game
		getNewGame: function() {
			
		},

		// end the current game
		getEndGame: function() {

		},

		// fetch/submit high scores
		getHighScores: function() {

		}
	};

	return main;
});