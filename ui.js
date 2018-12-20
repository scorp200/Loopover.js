var ui = (function() {
	var tbutton = new Image();
	tbutton.width = tbutton.height = 10;

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
		ctx.drawImage(tbutton, 150, 200, 1000, 1000);
	}

	return {
		update: update,
		render: render,
		init: init
	}
})();
