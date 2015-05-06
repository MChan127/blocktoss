// the rendering engine which runs at an interval
// to check if anything needs to be redrawn
// if any graphics have been updated, then this object
// clears the relevant canvases and redraws everything

// 'contexts' is an array containing the contexts for all 
// the canvases in the game, representing different layers of
// background, foreground, etc.
define([], function() {
	var renderer = function(contexts, delay) {
		this.contexts = {};
		this.drawings = {}; // array of all drawing objects currently in the game
							// organized by contexts
		this.delay = delay; // basically how fast the canvases will be updated

		// store each context along with their redraw states (initially false) in the array
		// and also initialize the drawings array
		for (var i in contexts) {
			// get the id for the canvas DOM object to which this context is associated
			var canvasId = contexts[i].canvas.getAttribute('id');

			this.contexts[canvasId] = {'context': contexts[i], 'redraw': false};

			this.drawings[canvasId] = [];
		}

		// add the new drawing into the array
		// associated with its context
		this.newDrawing = function(drawing) {
			var canvasId = drawing.context.canvas.getAttribute('id');
			this.drawings[canvasId].push(drawing);
		}

		// remove the drawing from the array
		// associated with its context
		this.removeDrawing = function(drawing) {
			var canvasId = drawing.context.canvas.getAttribute('id');
			this.drawings[canvasId].splice(this.drawings[context].indexOf(drawing), 1);
		}

		// toggle a specific context's redrawing status
		this.setRedraw = function(context, status) {
			var canvasId = context.canvas.getAttribute('id');
			this.contexts[canvasId].redraw = status;
		}

		// initialize the loop
		// the canvases are clear and redrawn at the rate specified by the 'delay'
		// variable
		function init(scope) {
			setInterval(function() {
				// check each context if they need redrawing
				// if true, clear and redraw all of the context's drawings 
				// with all their new coordinates/properties
				for (var i in scope.contexts) {
					if (scope.contexts[i].redraw) {
						scope.redraw(scope, i, scope.contexts[i].context);
						scope.setRedraw(scope.contexts[i].context, false);
					}
				}
			}, scope.delay);
		}
		init(this);

		// clear the context and redraw each of its drawings, one by one
		this.redraw = function(scope, id, context) {
			context.clearRect(0, 0, context.canvas.width, context.canvas.height);

			// go through each drawing
			for (var i in scope.drawings[id]) {
				// get the drawing object (for convenience)
				var drawing = scope.drawings[id][i];

				context.save();
				// set alpha to 0 if drawing is set to hidden (invisible)
				// 1 if otherwise
				context.globalAlpha = (drawing.hide) ? 0 : 1;
				context.drawImage(drawing.img, drawing.x, drawing.y, drawing.width, drawing.height);
				context.restore();
			}
		}

		// remove all drawings from one or more contexts, then redraw
		// usually called when transitioning from one game phase to another
		this.clearContexts = function(contexts) {
			for (var i in contexts) {
				var canvasId = contexts[i].canvas.getAttribute('id');

				this.drawings[canvasId].splice(0, this.drawings[canvasId].length);
				this.setRedraw(contexts[i], true);
			}
		}
	};

	return renderer;
});