var ui = (function() {
	var image = new Image();
	var buttons = [];

	function init() {
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	function update() {

	}

	function render() {
		ctx.font = 'bold 30px Helvetica';
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.fillText("Size: ", 140, 150);

	}

	return {
		update: update,
		render: render,
		init: init
	}
})();
