var loopover = (function() {
	var square = [];
	var scale = scale;
	var size = 1;
	var scaleFactor;
	var tiles = [];
	var tileImg;
	var lastColumn;
	var lastRow;
	var lastMouse = { x: 0, y: 0 };
	var queDrag = [];
	var ratio = 80 / 140;

	function init(_size) {
		size = _size;
		scale = Math.floor(700 / size);
		scaleFactor = size * scale;
		tileImg = new Image();
		tileImg.width = tileImg.height = scale * size;
		for (var y = 0; y < size; y++) {
			for (var x = 0; x < size; x++) {
				var index = x + y * size;
				var tile = { val: index };
				tile.x = tile.tx = x * scale;
				tile.y = tile.ty = y * scale;
				tile.dx = scale * x;
				tile.dy = scale * y;
				tiles.push(tile);
				//generate spritesheet
				ctx.beginPath();
				var r = (x / size);
				var g = (y / size);
				ctx.fillStyle = getRGB(255 - r * 255, g * 255, r * 255);
				//ctx.fillStyle = getHSL(index / (size * size) * 200, 95, 47);
				ctx.fillRect(x * scale, y * scale, scale, scale);
				ctx.beginPath();
				ctx.font = 'bold ' + scale * ratio + "px Helvetica";
				ctx.textAlign = "center";
				ctx.textBaseline = "middle";
				ctx.fillStyle = getHSL(0, 100, 100);
				ctx.fillText(index + 1, x * scale + scale / 2, y * scale + scale * 0.55);
			}
		}
		tileImg.src = c.toDataURL('image/png');
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	function update(dt) {
		if (!Mouse.down) {
			lastMouse.x = Mouse.x;
			lastMouse.y = Mouse.y;
			lastRow = Math.floor(Mouse.y / scale);
			lastColumn = Math.floor(Mouse.x / scale);
		} else if (Mouse.down && Mouse.x >= 0 && Mouse.x < scaleFactor && Mouse.y >= 0 && Mouse.y < scaleFactor) {
			var row = Math.floor(Mouse.y / scale);
			if (lastRow === undefined)
				lastRow = row;
			var column = Math.floor(Mouse.x / scale);
			if (lastColumn === undefined)
				lastColumn = column;
			var tile = getTileAt(column, row);
			var shifted = [];
			if (lastColumn != column) {
				var shift = scale * Math.sign(lastMouse.x - tile.x);
				for (var x = 0; x < size; x++) {
					var stile = getTileAt(x, row);
					stile.x -= shift;
					shifted.push(stile);
					lastColumn = column;
					lastMouse.x = Mouse.x;
					if (stile.x < 0) {
						stile.x = (size - 1) * scale;
						stile.tx = stile.x + (scale - stile.tx);
					} else if (stile.x > (size - 1) * scale) {
						stile.x = 0;
						stile.tx = stile.x - (scaleFactor - stile.tx);
					}
				}
			} else if (lastRow != row) {
				var shift = scale * Math.sign(lastMouse.y - tile.y);
				for (var y = 0; y < size; y++) {
					var stile = getTileAt(column, y);
					stile.y -= shift;
					shifted.push(stile);
					lastRow = row;
					lastMouse.y = Mouse.y;
					if (stile.y < 0) {
						stile.y = (size - 1) * scale;
						stile.ty = stile.y + (scale - stile.ty);
					} else if (stile.y > (size - 1) * scale) {
						stile.y = 0;
						stile.ty = stile.y - (scaleFactor - stile.ty);
					}
				}
			}
			shifted.forEach(function(tile) {
				tiles[Math.round(tile.x) / scale + Math.round(tile.y) / scale * size] = tile;
			});
			shifted.length = 0;
		}
	}

	function render() {
		tiles.forEach(function(tile) {
			easeTile(tile);
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
	}

	function drawTile(dx, dy, x, y) {
		ctx.drawImage(tileImg, dx, dy, scale, scale, x, y, scale, scale);
	}

	function getTileAt(x, y) {
		return tiles[x + y * size];
	}

	function easeTile(tile) {
		if (Math.abs(tile.tx - tile.x) < 0.001)
			tile.tx = tile.x;
		else
			tile.tx += (tile.x - tile.tx) / 2;
		if (Math.abs(tile.ty - tile.y) < 0.001)
			tile.ty = tile.y;
		else
			tile.ty += (tile.y - tile.ty) / 2;
	}

	return {
		update: update,
		render: render,
		init: init
	}
})();
