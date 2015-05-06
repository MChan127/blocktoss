define(['game_logic/renderer', 'game_logic/drawing'], function(Renderer, Drawing) {
	var initGame = function(contexts, delay) {
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
	}

	return initGame;
});