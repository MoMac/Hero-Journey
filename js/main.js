$(window).resize(function () {
	resizeLayout();
});

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

	// uiElements.headerButton1.x = 150;
	// uiElements.headerButton2.x = 300;
	// uiElements.headerButton3.x = 445;
}

function createBackground() {

	preload = new createjs.LoadQueue(false, 'images/');
	preload.on('fileload', backgroundFileLoaded);
	preload.on('complete', backgroundLoaded);

	manifest = [
		{
			id: "background",
			src: "test-bg.jpg"
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

	preload.loadManifest(manifest);

}

function backgroundFileLoaded (event) {

	var result = preload.getResult(event.item.id);
	loadedItem = new createjs.Bitmap(result);
	
	if (event.item.id == "headerButton") {

		var buttonHome = createTextButton(loadedItem, "Home");
		var shape = new createjs.Shape();
		shape.graphics.drawRect(0,0,145,55);
		buttonHome.hitArea = shape;
		buttonHome.cursor = "pointer";
		buttonHome.x = 150;
		var buttonHeroes = createTextButton(loadedItem, "Heroes");
		buttonHeroes.x = 300;
		var buttonJourney = createTextButton(loadedItem, "Journey");
		buttonJourney.x = 445;
		
		layoutContainer.addChild(buttonHome, buttonHeroes, buttonJourney);

	}
	else {
		uiElements[event.item.id] = loadedItem;
		layoutContainer.addChild(loadedItem);
	}
}

function backgroundLoaded () {
	stage.addChild(layoutContainer);
	resizeLayout();
}

function createTextButton (buttonObject, text) {

	var buttonContainer = new createjs.Container();
	var btnText = new createjs.Text();
	btnText.text = text;
	btnText.font = "18px Slabo 27px";
	btnText.color = "white";
	btnText.x = (buttonObject.getBounds().width - btnText.getBounds().width) / 2;
	btnText.y = (buttonObject.getBounds().height - btnText.getBounds().height) / 2;

	buttonContainer.addChild(buttonObject, btnText);
	buttonContainer.cache(0,0,150,60);

	return buttonContainer;
}