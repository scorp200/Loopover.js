var loopover = (function() {
	var square = [];
	var scale = scale;
	var size = 1;
	var scaleFactor;
	var translateX, translateY = 70;
	var tiles = [];
	var tileImg;
	var lastColumn;
	var lastRow;
	var lastMouse = { x: 0, y: 0 };
	var queDrag = [];
	var shifted = [];
	var mouseX, mouseY = 0;

	function init(_size) {
		tiles = [];
		size = clamp(_size, 2, 20);
		scale = Math.floor(700 / size);
		scaleFactor = size * scale;
		translateX = Canvas.width / 2 - scaleFactor / 2;
		tileImg = new Image();
		tileImg.width = tileImg.height = scale * size;
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var index = x + y * size;
				var tile = { val: index };
				tile.x = tile.dx = tile.tx = x * scale;
				tile.y = tile.dy = tile.ty = y * scale;
				tiles.push(tile);
				//generate spritesheet
				ctx.beginPath();
				var r = (x / size);
				var g = (y / size);
				ctx.fillStyle = getRGB(255 - r * 255, g * 255, r * 255);
				ctx.fillRect(x * scale, y * scale, scale, scale);
				ctx.beginPath();
				ctx.font = 'bold ' + scale * ratio + "px Helvetica";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = getHSL(0, 100, 100);
				ctx.fillText(index + 1, x * scale + scale / 2, y * scale + scale * 0.55);
			}
		}
		tileImg.src = Canvas.toDataURL('image/png');
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	function update(dt) {
		mouseX = Mouse.x - translateX;
		mouseY = Mouse.y - translateY;
		if (!Mouse.down) {
			lastmouseX = mouseX;
			lastMouse.y = mouseY;
			lastRow = Math.floor(mouseY / scale);
			lastColumn = Math.floor(mouseX / scale);
		} else if (Mouse.down && mouseX >= 0 && mouseX < scaleFactor && mouseY >= 0 && mouseY < scaleFactor) {
			var row = Math.floor(mouseY / scale);
			if (lastRow === undefined)
				lastRow = row;
			var column = Math.floor(mouseX / scale);
			if (lastColumn === undefined)
				lastColumn = column;
			var tile = getTileAt(column, row);
			shifted.length = 0;
			if (lastColumn != column)
				shiftHorizontal(Math.sign(lastmouseX - tile.x), row, column);
			else if (lastRow != row)
				shiftVertical(Math.sign(lastMouse.y - tile.y), row, column);
		}
		var win = true;
		tiles.forEach(function(tile, i) {
			easeTile(tile, 100 * dt);
			if (tile.val != i)
				win = false;
		});
	}

	function render() {
		ctx.save();
		ctx.beginPath();
		ctx.translate(translateX, translateY);
		ctx.rect(0, 0, scaleFactor, scaleFactor);
		ctx.clip();
		tiles.forEach(function(tile) {
			if (tile.tx < 0)
				drawTile(tile.dx, tile.dy, scaleFactor + tile.tx, tile.ty);
			else if (tile.tx > (size - 1) * scale)
				drawTile(tile.dx, tile.dy, tile.tx - scaleFactor, tile.ty);
			if (tile.ty < 0)
				drawTile(tile.dx, tile.dy, tile.tx, scaleFactor + tile.ty);
			else if (tile.ty > (size - 1) * scale)
				drawTile(tile.dx, tile.dy, tile.tx, tile.ty - scaleFactor);
			drawTile(tile.dx, tile.dy, tile.tx, tile.ty);
		});
		ctx.restore();
	}

	function shiftVertical(shift, row, column) {
		for (var y = 0; y < size; y++) {
			var stile = getTileAt(column, y);
			stile.y -= scale * shift;
			shifted.push(stile);
			lastRow = row;
			lastMouse.y = mouseY;
			if (stile.y < 0) {
				var diff = stile.y + scale;
				stile.y = (size - 1) * scale + diff;
				stile.ty = stile.y + (scale - stile.ty);
			} else if (stile.y > (size - 1) * scale) {
				var diff = (size - 1) * scale - stile.y + scale;
				stile.y = -diff;
				stile.ty = stile.y - (scaleFactor - stile.ty);
			}
		}
		setShiftedTiles();
	}

	function shiftHorizontal(shift, row, column) {
		for (var x = 0; x < size; x++) {
			var stile = getTileAt(x, row);
			stile.x -= scale * shift;
			shifted.push(stile);
			lastColumn = column;
			lastmouseX = mouseX;
			if (stile.x < 0) {
				var diff = stile.x + scale;
				stile.x = (size - 1) * scale + diff;
				stile.tx = stile.x + (scale - stile.tx);
			} else if (stile.x > (size - 1) * scale) {
				var diff = (size - 1) * scale - stile.x + scale;
				stile.x = -diff;
				stile.tx = stile.x - (scaleFactor - stile.tx);
			}
		}
		setShiftedTiles();
	}

	function setShiftedTiles() {
		shifted.forEach(function(tile) {
			tiles[Math.round(tile.x) / scale + Math.round(tile.y) / scale * size] = tile;
		});
		shifted.length = 0;
	}

	function shuffle(times) {
		while (times-- > 0) {
			var shift = Math.ceil(Math.random() * (size - 1));
			var row = Math.floor(Math.random() * size);
			var column = Math.floor(Math.random() * size);
			Math.random() > 0.5 ? shiftHorizontal(shift, row, column) : shiftVertical(shift, row, column);
		}
	}

	function drawTile(dx, dy, x, y) {
		ctx.drawImage(tileImg, dx, dy, scale, scale, x, y, scale, scale);
	}

	function getTileAt(x, y) {
		return tiles[x + y * size];
	}

	function easeTile(tile, ease) {
		if (Math.abs(tile.tx - tile.x) < 0.001)
			tile.tx = tile.x;
		else
			tile.tx += (tile.x - tile.tx) / ease;
		if (Math.abs(tile.ty - tile.y) < 0.001)
			tile.ty = tile.y;
		else
			tile.ty += (tile.y - tile.ty) / ease;
	}

	return {
		update: update,
		render: render,
		init: init,
		shuffle: shuffle,
		get scaleFactor() { return scaleFactor },
		get translateX() { return translateX },
		get size() { return size }
	}
})();
