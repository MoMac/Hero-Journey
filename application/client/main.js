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
 	 heroSummaryContainer = new createjs.Container(),
 	 contentContainer = new createjs.Container(),
 	 manifest = new Array();
this.layoutContainer = new createjs.Container();
this.uiElements = {};


 function init() {

	stage = new createjs.Stage("demoCanvas");
	stage.enableMouseOver(10);

	initContent();

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
	var contentBg = utils.getEl("contentBgBg");

	bg.scaleX = $(window).width() / bg.getBounds().width;
	bg.scaleY = $(window).width() / bg.getBounds().width;

	if (bg.getTransformedBounds().height < $(window).height() - bg.getTransformedBounds().y) {
		bg.scaleX = $(window).height() / bg.getBounds().height;
		bg.scaleY = $(window).height() / bg.getBounds().height;
	}

	utils.getEl("headerBar").scaleX = $(window).width() / utils.getEl("headerBar").getBounds().width;

	contentBg.y = 75;
	contentBg.scaleX = ($(window).height() - contentBg.getTransformedBounds().y) / contentBg.getBounds().height;
	contentBg.scaleY = ($(window).height() - contentBg.getTransformedBounds().y) / contentBg.getBounds().height;
	contentBg.x = ($(window).width() - contentBg.getTransformedBounds().width) / 2;

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

function initContent() {

	manifest = [
		{
			id: "background",
			src: "content-widestbackground-00.png"
		},
		{
			id: "contentBg",
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
		},
		{
			id: "journeyButtonHover",
			src: "ui-general-headerbutton-01-glow.png",
			cache: true
		},
		{
			id: "heroesButtonHover",
			src: "ui-general-headerbutton-02-glow.png",
			cache: true
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


	if (event.item.id.indexOf("journeyButton") >= 0) {
		var el = utils.getEl(event.item.id);
		el.x = $(window).width() / 2 - el.getBounds().width;
		utils.setCursor(el);
		utils.setHover(event.item);
	}
	else if (event.item.id.indexOf("heroesButton") >= 0) {
		var el = utils.getEl(event.item.id);
		el.x = $(window).width() / 2;
		utils.setCursor(el);
		utils.setHover(event.item);
	}
	else if (event.item.id == "contentBg") {
		loadedItem.alpha = 0.85;
	}

	layoutContainer.addChild(loadedItem);

	if (event.item.cache)
		utils.getEl(event.item.id).visible = false;
}

function backgroundInitialized () {

	stage.addChild(layoutContainer);

	resizeLayout();

	utils.getEl("heroesButtonHover").on("click", function () {
		renderHeroSummary();
	});

	var contentBounds = utils.getEl("contentBg").getTransformedBounds();
	contentContainer.setBounds(contentBounds.x + (contentBounds.width - (contentBounds.width *  0.025)) ,
							   contentBounds.y + (contentBounds.height - (contentBounds.height * 0.0210526315789474)), 
							   contentBounds.width - (contentBounds.width * 0.05),
							   contentBounds.height - (contentBounds.height * 0.0421052631578947));
	contentContainer.addChild(utils.getEl("contentBg"));


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
		heroSummaryContainer.x = ($(window).width() - heroSummaryContainer.getBounds().width) / 2;
		heroSummaryContainer.y = 150;

		stage.addChild(heroSummaryContainer);
	});
}