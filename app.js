var Canvas = document.getElementById("c");
var ctx = Canvas.getContext("2d", { alpha: false });
ctx.imageSmoothingEnabled = true;
var scaleMultiplayer = 1;
var ratio = 80 / 140;
var gameSize = 5;
var Mouse = { x: 0, y: 0, vx: 0, vy: 0, down: false, click: false };
window.addEventListener("mousemove", function(e) {
	var rect = Canvas.getBoundingClientRect();
	Mouse.x = (e.clientX - rect.left) / scaleMultiplayer;
	Mouse.y = (e.clientY - rect.top) / scaleMultiplayer;
	Mouse.vx = (Mouse.x - Canvas.width / 2);
	Mouse.vy = (Mouse.y - Canvas.height / 2);
}, false);
window.addEventListener("mousedown", function(e) {
	if (!Mouse.down)
		Mouse.click = true;
	Mouse.down = true;
}, false);
window.addEventListener("mouseup", function(e) {
	Mouse.down = false;
}, false);
window.addEventListener("contextmenu", function(e) {
	//e.preventDefault();
}, false);
resize();
window.addEventListener("resize", resize, false);

function resize() {
	Canvas.width = window.innerWidth;
	Canvas.height = window.innerHeight;
	//scaleMultiplayer = Math.round(Canvas.height * 0.8 / 980);
	//ctx.scale(scaleMultiplayer, scaleMultiplayer);
	ctx.clearRect(0, 0, Canvas.width, Canvas.height);
};

var tickInterval = 1000 / 64;
var lastTick;
window.onload = function() {
	loopover.init(gameSize);
	ui.init();
	lastTick = performance.now();
	tick(lastTick);
}

function tick(now) {
	requestAnimationFrame(tick);
	var dt = now - lastTick;
	if (dt > tickInterval) {
		update(dt);
		render();
		lastTick = now;
	}
}

function update(dt) {
	dt = dt / 1000;
	loopover.update(dt);
	ui.update(dt);
	Mouse.click = false;
}

function render() {
	ctx.clearRect(0, 0, Canvas.width, Canvas.height);
	loopover.render();
	ctx.translate(0, 0);
	ui.render();
}

function getHSL(h, s, l) {
	return 'hsl(' +
		(h < 0 ? Math.random() * 360 : h) + ',' +
		(s < 0 ? Math.random() * 100 : s) + '%,' +
		(l < 0 ? Math.random() * 100 : l) + '%)';
}

function getRGB(h, s, l) {
	return 'rgb(' +
		(h < 0 ? Math.random() * 255 : h) + ',' +
		(s < 0 ? Math.random() * 255 : s) + ',' +
		(l < 0 ? Math.random() * 255 : l) + ')';
}

function pointInBox(px, py, bx, by, bw, bh) {
	return px > bx && px < bx + bw && py > by && py < by + bh;
}

function ease(value, target, ease, precision) {
	if (Math.abs(value - target) < precision)
		return 0;
	return (target - value) / ease;
}

function clamp(value, min, max) {
	return value > max ? max : value < min ? min : value;
}
