$(window).resize(function () {
	resizeLayout();
});

try {
	WebFont.load({
	    google: {
	        families: ['Slabo 27px']
	    },
	    active: function () {
	        window.init();
	    },
	    inactive: function() {
	        console.log("Could not load Google Font, using default.");
	        window.init();
	    }
	});
}
catch (e) {
	console.log("Error initializing WebFont: " + e);
	window.init();
}

//Init
 var stage,
 	 preload,
 	 layoutContainer;
 var manifest = new Array();
 var uiElements = {};

 function init() {

	stage = new createjs.Stage("demoCanvas");
	stage.enableMouseOver();
	layoutContainer = new createjs.Container();

	createBackground();
	createjs.Ticker.on("tick", function () {
		stage.update();
	});
	
	//Initialize canvas size
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;
}

function resizeLayout() {	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;

	var bg = uiElements.background;
	bg.scaleX = $(window).width()/bg.getBounds().width;
	bg.scaleY = $(window).width()/bg.getBounds().width;

	if (bg.getTransformedBounds().height < $(window).height()) {
		bg.scaleX = $(window).height()/bg.getBounds().height;
		bg.scaleY = $(window).height()/bg.getBounds().height;
	}

	uiElements.headerBar.scaleX = $(window).width();
}

function preloadAssets (manifest, fileloadCallback, completeCallback) {

	preload = new createjs.LoadQueue(false, 'images/');

	if (fileloadCallback) {
		preload.on('fileload', fileloadCallback);
	}
	if (completeCallback) {
		preload.on('complete', completeCallback);
	}

	preload.loadManifest(manifest);
}

function createBackground() {

	manifest = [
		{
			id: "background",
			src: "test-bg.jpg"
		},
		{
			id: "contentArea",
			src: "general-content-bg.jpg"
		},
		{
			id: "headerBar",
			src: "header-bg.png",
		},
		{
			id: "headerButton",
			src: "header-button1.png"
		}
	];

	preloadAssets(manifest, backgroundImageLoaded, backgroundInitialized);

}

function backgroundImageLoaded (event) {

	var result = preload.getResult(event.item.id);
	loadedItem = new createjs.Bitmap(result);

	if (event.item.id == "headerButton") {

		uiElements.buttonHome = createTextButton(loadedItem, "Home");
		uiElements.buttonHome.x = 150;
		var shape = new createjs.Shape ();
		shape.graphics.rect(uiElements.buttonHome.x, uiElements.buttonHome.y, uiElements.buttonHome.getBounds().width, uiElements.buttonHome.getBounds().height);
		shape.cursor = "pointer";

		uiElements.buttonHeroes = createTextButton(loadedItem, "Heroes");
		uiElements.buttonHeroes.x = 300;
		uiElements.buttonJourney = createTextButton(loadedItem, "Journey");
		uiElements.buttonJourney.x = 445;
		
		layoutContainer.addChild(uiElements.buttonHome, uiElements.buttonHeroes, uiElements.buttonJourney);
	}
	else if (event.item.id == "contentArea") {
		uiElements[event.item.id] = loadedItem;
		loadedItem.x = ($(window).width() - loadedItem.getBounds().width) / 2;
		loadedItem.y = 150;
		layoutContainer.addChild(loadedItem);
	}
	else {
		uiElements[event.item.id] = loadedItem;
		layoutContainer.addChild(loadedItem);
	}
}

//Text Button
function createTextButton (buttonObject, text) {

	var buttonContainer = new createjs.Container();
	var btnText = new createjs.Text();
	btnText.text = text;
	btnText.font = "18px 'Slabo 27px'";
	btnText.color = "white";
	btnText.x = (buttonObject.getBounds().width - btnText.getBounds().width) / 2;
	btnText.y = (buttonObject.getBounds().height - btnText.getBounds().height) / 2;

	buttonContainer.addChild(buttonObject, btnText);
	buttonContainer.mouseChildren = false;

	var shape = new createjs.Shape ();
	shape.graphics.beginFill("#000000").drawRect(0,0,buttonContainer.getBounds().width, buttonContainer.getBounds().height);
	buttonContainer.hitArea = shape;
	buttonContainer.cursor = "pointer";
	buttonContainer.cache(0,0,150,60);

	return buttonContainer;
}

function backgroundInitialized () {
	stage.addChild(layoutContainer);
	resizeLayout();

	uiElements.buttonHeroes.on("click", function () {
		var manifest = [
			{
				id: "heroSelection",
				src: "heroes-selection-bg.jpg"
			}
		];
		preloadAssets(manifest, function (event) {

			layoutContainer.removeChild(uiElements.contentArea);

			var result = preload.getResult(event.item.id);
			loadedItem = new createjs.Bitmap(result);

			var heroSel1 = loadedItem;
			var heroSel2 = loadedItem.clone();
			heroSel2.x = 350;
			var heroSel3 = loadedItem.clone();
			heroSel3.x = 700;

			var heroContainer = new createjs.Container();
			heroContainer.addChild(heroSel1, heroSel2, heroSel3);
			heroContainer.x = ($(window).width() - heroContainer.getBounds().width) / 2;
			heroContainer.y = 150;

			stage.addChild(heroContainer);
		});
	});
}