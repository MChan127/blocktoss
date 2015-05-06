define(['game_logic/drawing'], function(Drawing) {
	var getTitle = function() {
			this.press_start = null; // for use later, since it flashes for a few seconds
									 // upon user selection before the game starts

			listenUserInput(this);

			// make the title and menu options here
			// start playing the music
			// ^ call other modules for this

			var ctx_bg = this.contexts[0]; // background
			var ctx_fg = this.contexts[1]; // foreground
			// draw the background
    		var main_bg = new Drawing('space_bg', this.images['space_bg.png']);
    		main_bg.init(this.renderer, ctx_bg, 0, 0);
    		main_bg.addAnimation(this.renderer, 
    			[
    				this.images['space_bg.png'],
    				this.images['space_bg2.png'],
    				this.images['space_bg3.png'],
    				this.images['space_bg4.png'],
    			], 500);

    		// create the title text and menu options
    		var title = new Drawing('title', this.images['title.png']);
    		title.init(this.renderer, ctx_fg, 
    			(ctx_fg.canvas.width/2) - (this.images['title.png'].width/2),
    			75);
    		this.press_start = new Drawing('press_start', this.images['press_start.png']);
    		this.press_start.init(this.renderer, ctx_fg, 
    			(ctx_fg.canvas.width/2) - (this.images['press_start.png'].width/2-20),
    			350);

    		// funny arrow next to press start
    		var start_arrow = new Drawing('start_arrow', this.images['start_arrow.png']);

    		// set arrow position and size based on other fetched properties
    		var arrow_pos = this.press_start.getPosition().x - 65;
    		var arrow_size = start_arrow.getSize();
    		var new_arrow_width = arrow_size.width * 0.8;
    		var new_arrow_height = arrow_size.height * 0.8;

    		start_arrow.init(this.renderer, ctx_fg,
    			arrow_pos, 349, new_arrow_width, new_arrow_height);

    		start_arrow.addAnimation(this.renderer,
    			[
    				this.images['start_arrow.png'],
    				this.images['start_arrow2.png'],
    				this.images['start_arrow3.png'],
    				this.images['start_arrow4.png'],
    				this.images['start_arrow5.png'],
    				this.images['start_arrow6.png'],
    				this.images['start_arrow7.png'],
    				this.images['start_arrow8.png'],
    				this.images['start_arrow9.png'],
    				this.images['start_arrow10.png'],
    				this.images['start_arrow9.png'],
    				this.images['start_arrow8.png'],
    				this.images['start_arrow7.png'],
    				this.images['start_arrow6.png'],
    				this.images['start_arrow5.png'],
    				this.images['start_arrow4.png'],
    				this.images['start_arrow3.png'],
    				this.images['start_arrow2.png'],
    			], 30);

			// listen for user input
			function listenUserInput(scope) {
				$(window).bind('keypress', function(e) {
					if (e.which == 32) {
						$(this).unbind(e);

						setTimeout(function() {
							clearScreen(flashing);
						}, 2000);

						var flashing = setInterval(function() {
							scope.press_start.toggleHide(scope.renderer);
						}, 120);
					}
				});

				function clearScreen(interval) {
					clearInterval(interval);

					scope.renderer.clearContexts([scope.contexts[1]]);
				}
			}
		}

	return getTitle;
});