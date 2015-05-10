// returns a drawing object
// we can call on its functions to modify its current position,
// size, and affect other properties
// and every time we do so, certain variables is set so that the 
// rendering engine (which runs constantly) knows to clear 
// and redraw the canvas
define([], function() {
	// the drawing is instantiated with x,y coordinates of zero
	// and the image's original dimensions
	// use the methods below to modify these properties

	// name: name of this drawing
	// img: preloaded image object used for this drawing
	var drawing = function(name, img) {
		this.name = name;
		this.img = img;
		this.x = 0;
		this.y = 0;
		this.width = img.width;
		this.height = img.height;

		this.context = null; // canvas context (or layer) this object belongs to
		this.hide = false; // if true, is invisible on the canvas

		// variables pertaining to animation
		this.images = null; // array of images which makes up the animation
		this.delay = null; // speed at which the drawing animates
		this.animation = null; // set to the interval object
		this.frame = 0; // used and incremented (and looped back to zero) during animation
	}

	// must call this method to place the drawing on the canvas
	drawing.prototype.init = function(renderer, context, x, y, width, height) {
		this.x = x;
		this.y = y;
		if (width != undefined && height != undefined) {
			this.width = width;
			this.height = height;
		}
		this.context = context;

		// add the drawing to the renderer array on this context (canvas layer)
		renderer.newDrawing(this);

		// set redraw since we have a new drawing
		// only redraws for the relevant context
		renderer.setRedraw(this.context, true);
	}

	/** START | special functions for animating the drawing **/
	// an animation can be added or removed at any time
	// user can specify a rate of 'frame' traversal in the form of
	// the 'delay' parameter
	// this function can also be used to replace the current image with another, still image
	// @param finite: if true, animation runs once then runs a callback
	drawing.prototype.addAnimation = function(renderer, images, delay, finite, callback) {
		this.images = images;
		this.delay = delay;
		this.frame = 0;

		if (!finite) {
			this.animate(this, renderer);
		} else {
			this.animateOnce(this, renderer, callback);
		}
	}
	drawing.prototype.animate = function(scope, renderer) {
		scope.animation = setInterval(function() {
			scope.img = scope.images[scope.frame++];
			renderer.setRedraw(scope.context, true);
			if (scope.frame >= scope.images.length) {
				scope.frame = 0;
			}
		}, scope.delay);
	}
	drawing.prototype.animateOnce = function(scope, renderer, callback) {
		scope.animation = setInterval(function() {
			scope.img = scope.images[scope.frame++];
			renderer.setRedraw(scope.context, true);
			if (scope.frame >= scope.images.length) {
				scope.removeAnimation(renderer, null, callback);
			}
		}, scope.delay);
	}
	drawing.prototype.removeAnimation = function(renderer, newImg, callback) {
		clearInterval(this.animation);
		// optionally, assign this drawing to a new image
		// after stopping the animation
		// else it will be assigned to the original
		if (newImg) {
			this.img = newImg;
		}

		// if callback specified, run it
		if (callback != null && callback != undefined) {
			callback();
		}

		renderer.setRedraw(this.context, true);
	}
	/** END | special functions for animating the drawing **/

	// shows/hides the drawing from the canvas
	drawing.prototype.toggleHide = function(renderer) {
		if (this.hide == false) {
			this.hide = true;
		} else {
			this.hide = false;
		}

		// set redraw
		renderer.setRedraw(this.context, true);
	}

	// removes the drawing from the canvas
	drawing.prototype.remove = function(renderer) {
		renderer.removeDrawing(this);
		renderer.setRedraw(this.context, true);
	}

	// move the drawing
	drawing.prototype.moveTo = function(x, y, renderer) {
		this.x = x;
		this.y = y;

		// tell renderer that it needs to clear
		// and redraw the canvas
		renderer.setRedraw(this.context, true);
	}

	// move the drawing relative to its current position
	drawing.prototype.moveBy = function(x, y, renderer) {
		this.x += x;
		this.y += y;

		renderer.setRedraw(this.context, true);
	}

	// scale the drawing
	drawing.prototype.resizeTo = function(width, height, renderer) {
		this.width = width;
		this.height = height;

		renderer.setRedraw(this.context, true);
	}

	// scale the drawing by a ratio
	drawing.prototype.resizeBy = function(width, height, renderer) {
		this.width *= width;
		this.height *= height;

		renderer.setRedraw(this.context, true);
	}

	return drawing;
});