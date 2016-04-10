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
 	 contentWrapper = new createjs.Container(),
 	 contentContainer = new createjs.Container(),
 	 manifest = new Array();
this.layoutContainer = new createjs.Container();
this.uiElements = {};


 function init() {

	stage = new createjs.Stage("demoCanvas");
	stage.enableMouseOver(10);

	initContent();

	// createjs.Ticker.on("tick", function () {
	// 	stage.update();
	// });
	
	//Initialize canvas size
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;

	stage.update();
}

function resizeLayout() {	
	stage.canvas.width = window.innerWidth;
	stage.canvas.height = window.innerHeight;

	var bg = utils.getEl("background");
	// var contentBg = utils.getEl("contentBg");

	bg.scaleX = $(window).width() / bg.getBounds().width;
	bg.scaleY = $(window).width() / bg.getBounds().width;

	if (bg.getTransformedBounds().height < $(window).height() - bg.getTransformedBounds().y) {
		bg.scaleX = $(window).height() / bg.getBounds().height;
		bg.scaleY = $(window).height() / bg.getBounds().height;
	}

	utils.getEl("headerBar").scaleX = $(window).width() / utils.getEl("headerBar").getBounds().width;

	contentWrapper.y = 55;
	contentWrapper.scaleX = ($(window).height() - contentWrapper.getTransformedBounds().y) / contentWrapper.getBounds().height;
	contentWrapper.scaleY = ($(window).height() - contentWrapper.getTransformedBounds().y) / contentWrapper.getBounds().height;
	contentWrapper.x = ($(window).width() - contentWrapper.getTransformedBounds().width) / 2;

	stage.update();

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
		loadedItem.alpha = 0.8;
		contentWrapper.addChild(loadedItem);
		return;
	}

	layoutContainer.addChild(loadedItem);

	if (event.item.cache)
		utils.getEl(event.item.id).visible = false;
}

function backgroundInitialized () {

	stage.addChild(layoutContainer);


	var contentBounds = contentWrapper.getTransformedBounds();

	//Set Bounds for Content Area
	contentContainer.setBounds(0, 0, contentBounds.width - (contentBounds.width * 0.05), contentBounds.height - (contentBounds.height * 0.0421052631578947));
	contentContainer.x = contentBounds.x + contentBounds.width *  0.025;
	contentContainer.y = contentBounds.y + contentBounds.height * 0.0210526315789474;

	
	contentWrapper.addChild(contentContainer);
	stage.addChild(contentWrapper);

		resizeLayout();

	utils.getEl("heroesButtonHover").on("click", function () {
		renderHeroSummary();
	});

	
	stage.update();
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
			src: "ui-general-xpbarbg.png"
		},
		{
			id: "detBg",
			src: "ui-general-herosumbglow.png"
		},
		{
			id: "statIconAttack",
			src: "content-iconmed-attack.png",
			value: "Attack"
		},
		{
			id: "statIconDef",
			src: "content-iconmed-def.png",
			value: "Defense"
		},
		{
			id: "statIconHealth",
			src: "content-iconmed-health.png",
			value: "Health"
		},
		{
			id: "statIconMagic",
			src: "content-iconmed-magic.png",
			value: "Magic"
		}
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
			var heroContainer = new createjs.Container();
			var details = new createjs.Container();

			heroContainer.setBounds (0,	0, contentContainer.getBounds().width/3, contentContainer.getBounds().height);
			heroContainer.x = contentContainer.getBounds().width/3 * (i-1);

			var avatar = utils.getEl("hero" + i);
			utils.setScale(avatar, heroContainer, 1);

			var bg = utils.getEl("detBg").clone();
			utils.setScale(bg, heroContainer, 1);

			details.setBounds(0, 0, heroContainer.getBounds().width, heroContainer.getBounds().height * 0.3);
			details.y = heroContainer.getBounds().height * 0.7;

			var row1 = new createjs.Container();
			row1.setBounds(0,0, details.getBounds().width, details.getBounds().height * 1/3);
			console.log(row1.getBounds().height);
			utils.addText(row1, "Hero" + i);

			details.addChild(bg, row1);

			uiElements["heroContainer" + i] = {
				element: heroContainer
			};

			heroContainer.addChild(avatar, details);
			heroSummaryContainer.addChild(heroContainer);
		}

		var xpBar = utils.getEl("xpBar");
		utils.setScale(xpBar, contentContainer, 1);
		xpBar.y = contentContainer.getBounds().height * 0.6;
		heroSummaryContainer.addChild(xpBar);

		contentContainer.addChild(heroSummaryContainer);

		stage.update();
	});
}