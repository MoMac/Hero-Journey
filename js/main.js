 window.addEventListener('resize', resize, false);
 var stage,
 	 preload,
 	 manifest;

 function init() {

	stage = new createjs.Stage("demoCanvas");

	preload = new createjs.LoadQueue(false, 'images/');
	preload.on('fileload', handleFileLoad);
	preload.on('error', handleFileError);

	preload.setMaxConnections(5);

	createBackground();

	createjs.Ticker.addEventListener("tick", tick);
	resize();
}

function tick() {
	stage.update();
}	


function resize() {	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;

	
	

}

function createBackground() {
		bg = new createjs.Bitmap(img);
		stage.addChild(bg);

	manifest.push({
		id: "background",
		src: "images/test-bg.jpg"
	});

}
