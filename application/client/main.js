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
 	 layoutContainer,
 	 heroSummaryContainer,
 	 manifest = new Array();

this.uiElements = {};


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

	var bg = utils.getEl("background");
	bg.scaleX = $(window).width()/bg.getBounds().width;
	bg.scaleY = $(window).width()/bg.getBounds().width;

	if (bg.getTransformedBounds().height < $(window).height()) {
		bg.scaleX = $(window).height()/bg.getBounds().height;
		bg.scaleY = $(window).height()/bg.getBounds().height;
	}

	utils.getEl("headerBar").scaleX = $(window).width() / utils.getEl("headerBar").getBounds().width;
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
			src: "ui-general-herodetinvbg.png"
		},
		{
			id: "contentArea",
			src: "ui-general-generalbg.png"
		},
		{
			id: "headerBar",
			src: "ui-general-headerbg.png",
		},
		{
			id: "journeyButton",
			src: "ui-general-headerbutton-01.png"
		},
		{
			id: "heroesButton",
			src: "ui-general-headerbutton-02.png"
		}
	];

	preloadAssets(manifest, backgroundImageLoaded, backgroundInitialized);

}

function backgroundImageLoaded (event) {

	var result = preload.getResult(event.item.id);
	loadedItem = new createjs.Bitmap(result);
	uiElements[event.item.id] = {
		element: loadedItem
	};

	if (event.item.id == "journeyButton") {
		utils.getEl(event.item.id).x = $(window).width() / 2 - utils.getEl(event.item.id).getBounds().width;
		layoutContainer.addChild(utils.getEl(event.item.id));
		utils.setCursor(utils.getEl(event.item.id));
	}
	else if (event.item.id == "heroesButton") {
		utils.getEl(event.item.id).x = $(window).width() / 2;
		utils.setCursor(utils.getEl(event.item.id));
		layoutContainer.addChild(utils.getEl(event.item.id));
	}
	else if (event.item.id == "contentArea") {
		loadedItem.x = ($(window).width() - loadedItem.getBounds().width) / 2;
		loadedItem.y = 75;
		layoutContainer.addChild(loadedItem);
	}
	else {
		layoutContainer.addChild(loadedItem);
	}
}

//Text Button
// function createTextButton (buttonObject, text) {

// 	var buttonContainer = new createjs.Container();
// 	var btnText = new createjs.Text();
// 	btnText.text = text;
// 	btnText.font = "18px 'Slabo 27px'";
// 	btnText.color = "white";
// 	btnText.x = (buttonObject.getBounds().width - btnText.getBounds().width) / 2;
// 	btnText.y = (buttonObject.getBounds().height - btnText.getBounds().height) / 2;

// 	buttonContainer.addChild(buttonObject, btnText);
// 	buttonContainer.mouseChildren = false;

// 	var shape = new createjs.Shape ();
// 	shape.graphics.beginFill("#000000").drawRect(0,0,buttonContainer.getBounds().width, buttonContainer.getBounds().height);
// 	buttonContainer.hitArea = shape;
// 	buttonContainer.cursor = "pointer";
// 	buttonContainer.cache(0,0,150,60);

// 	return buttonContainer;
// }

function backgroundInitialized () {
	stage.addChild(layoutContainer);
	resizeLayout();

	utils.getEl("heroesButton").on("click", function () {
		renderHeroSummary();
	});
}

function renderHeroSummary () {
	var manifest = [
		{
			id: "hero1",
			src: "content-herosumavatar-01.png"
		},
		{
			id: "hero2",
			src: "content-herosumavatar-02.png"
		},
		{
			id: "hero3",
			src: "content-herosumavatar-03.png"
		},
		{
			id: "xpBar",
			src: "ui-general-herosumxpbar.png"
		},
		{
			id: "statIconAttack",
			src: "content-iconmed-attack.png",
			value: "Attack"
		},
		{
			id: "statIconDef",
			src: "content-iconmed-def.png",
			value: "Attack"
		},
		{
			id: "statIconHealth",
			src: "content-iconmed-health.png",
			value: "Attack"
		},
		{
			id: "statIconMagic",
			src: "content-iconmed-magic.png",
			value: "Attack"
		},
	];

	heroSummaryContainer = new createjs.Container();

	preloadAssets(manifest, function (event) {
		var result = preload.getResult(event.item.id);
		loadedItem = new createjs.Bitmap(result);
		uiElements[event.item.id] = {
			element: loadedItem
		}

		if (event.item.value)
			uiElements[event.item.id].value = event.item.value;
	}, 

	function () {
		
		for (var i = 1; i <= 3; i++) {
			var heroEl = utils.getEl("hero" + i);
			heroSummaryContainer.addChild(heroEl);

			if (i > 1)
				heroEl.x = heroSummaryContainer.getBounds().width + 15;
		}
		// heroSummaryContainer.addChild();
		heroSummaryContainer.x = ($(window).width() - heroSummaryContainer.getBounds().width) / 2;
		heroSummaryContainer.y = 150;

		stage.addChild(heroSummaryContainer);
	});
}