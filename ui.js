var ui = (function() {
	var scale = 140;
	var buttonImage = new Image();
	var buttons;
	var buttonHeight = scale * 0.3;
	var buttonX;
	var buttonY = 200;
	var buttonFactor;

	function init() {
		buttonX = (loopover.translateX / 2) - (scale / 2);

		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
		buttons = [{
				text: 'shuffle',
				onClick: function() {
					loopover.shuffle(500);
				}
			}, {
				text: 'Size',
				onClick: function() {},
				noColor: true
			},
			{
				text: 'Up',
				onClick: function() {
					loopover.init(++loopover.size);
				}
			},
			{
				text: 'Down',
				onClick: function() {
					loopover.init(--loopover.size);
				}
			}
		];
		buttonFactor = buttonHeight * buttons.length;

		buttonImage.width = scale;
		buttonImage.height = buttonFactor;

		buttons.forEach(function(btn, i) {
			btn.y = buttonY + i * buttonHeight;
			var r = i / buttons.length;
			ctx.beginPath();
			if (btn.noColor)
				ctx.fillStyle = 'rgba(0,0,0,0)';
			else
				ctx.fillStyle = getRGB(255 - r * 255, 150, r * 255);
			ctx.fillRect(0, i * scale * 0.3, scale, buttonHeight);
			ctx.font = 'bold ' + buttonHeight * ratio + "px Helvetica";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillStyle = getHSL(0, 100, 100);
			ctx.fillText(btn.text, scale / 2, i * buttonHeight + buttonHeight * 0.55);
		});
		buttonImage.src = Canvas.toDataURL('image/png');
		ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	}

	function update() {
		if (Mouse.click && Mouse.x > buttonX && Mouse.x < buttonX + scale && Mouse.y > buttonY && Mouse.y < buttonY + buttonFactor) {
			var index = Math.floor((Mouse.y - buttonY) / buttonHeight);
			buttons[index].onClick();
		}
	}

	function render() {
		ctx.textAlign = 'center';
		ctx.textBaseline = 'top';
		ctx.font = 'bold 20px Helvetica';
		ctx.fillText("By ai Doge aidoge.net", buttonX + scale / 2, 10);
		ctx.font = 'bold 30px Helvetica';
		ctx.fillText("Fun Stuff", buttonX + scale / 2, 150);
		buttons.forEach(function(btn, i) {
			ctx.drawImage(buttonImage, 0, i * buttonHeight, scale, buttonHeight, buttonX, btn.y, scale, buttonHeight)
		});
	}

	return {
		update: update,
		render: render,
		init: init
	}
})();
