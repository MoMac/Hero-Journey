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
 	 journeyScreenContainer = new createjs.Container(),
 	 contentWrapper = new createjs.Container(),
 	 contentContainer = new createjs.Container(),
 	 manifest = new Array();
this.layoutContainer = new createjs.Container();
this.uiElements = {};


 function init() {

	stage = new createjs.Stage("demoCanvas");
	stage.enableMouseOver(10);

	initContent();

	//Should be disabled, due to performance reasons
	//keeping it for debugging reasons
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

	bg.scaleX = $(window).width() / bg.getBounds().width;
	bg.scaleY = $(window).width() / bg.getBounds().width;

	if (bg.getTransformedBounds().height < $(window).height() - bg.getTransformedBounds().y) {
		bg.scaleX = $(window).height() / bg.getBounds().height;
		bg.scaleY = $(window).height() / bg.getBounds().height;
	}

	// utils.getEl("headerBar").scaleX = $(window).width() / utils.getEl("headerBar").getBounds().width;

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
		// {
		// 	id: "headerBar",
		// 	src: "ui-general-headerbg.png",
		// },
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
	contentContainer.setBounds(0, 0, contentBounds.width - (contentBounds.width * 0.266), contentBounds.height - (contentBounds.height * 0.306));
	contentContainer.x = contentBounds.x + contentBounds.width *  0.133;
	contentContainer.y = contentBounds.y + contentBounds.height * 0.153;

	
	contentWrapper.addChild(contentContainer);
	stage.addChild(contentWrapper);

	resizeLayout();

	utils.getEl("heroesButtonHover").on("click", function () {
		renderHeroSummary();
	});

	utils.getEl("journeyButtonHover").on("click", function () {
		renderJourneyOverview();
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
			src: "ui-general-herosumxpbar.png"
		},
		{
			id: "detBg",
			src: "ui-general-herosumbg.png"
		},
		{
			id: "statIcon1",
			src: "content-iconmed-attack.png",
			value: "Attack"
		},
		{
			id: "statIcon2",
			src: "content-iconmed-def.png",
			value: "Defense"
		},
		{
			id: "statIcon3",
			src: "content-iconmed-health.png",
			value: "Health"
		},
		{
			id: "statIcon4",
			src: "content-iconmed-magic.png",
			value: "Magic"
		},
		{
			id: "statIcon5",
			src: "content-iconmed-magic.png",
			value: "Magic"
		},
		{
			id: "statIcon6",
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
	}, makeHeroSummaryScreen);
}

function makeHeroSummaryScreen () {

	contentContainer.removeAllChildren();

	if (heroSummaryContainer.children.length > 0) {

		//@TODO: Implement mechanism for updating hero stats when available
		contentContainer.addChild(heroSummaryContainer);
		stage.update();
		return;
	}

	var bg = utils.getScaledEl("detBg", contentContainer);
	bg.y = contentContainer.getBounds().height * 3/5;
	heroSummaryContainer.addChild (bg);

	for (var i = 1; i <= 3; i++) {
		var heroContainer = new createjs.Container();
		var details = new createjs.Container();

		heroContainer.setBounds (0,	0, contentContainer.getBounds().width / 3, contentContainer.getBounds().height);
		heroContainer.x = contentContainer.getBounds().width / 3 * (i-1);

		var avatar = utils.getScaledEl("hero" + i, heroContainer);

		details.setBounds(0, 0, heroContainer.getBounds().width, heroContainer.getBounds().height * 0.3);
		details.y = heroContainer.getBounds().height * 0.7;

		for (var k = 0; k < 3; k++) {
			var row = new createjs.Container();
			var rowHeight = details.getBounds().height * 1/3;
			row.setBounds(0, 0, details.getBounds().width, rowHeight);
			row.y = rowHeight * k;

			var col1 = utils.createContainer(0, 0, row.getBounds().width / 2, row.getBounds().height);
			var iconCol1 = utils.getScaledEl("statIcon" + (k + 1), col1, true);
			var descCol1 = utils.createContainer(iconCol1.getBounds().width, 0, row.getBounds().width - iconCol1.getBounds().width, row.getBounds().height);
			//@TODO: Temporary
			utils.addText(descCol1, Math.floor(Math.random() * 1000), {
				centerY: true
			});
			col1.addChild(iconCol1.clone(), descCol1);

			var col2 = utils.createContainer(row.getBounds().width / 2, 0, row.getBounds().width / 2, row.getBounds().height);
			var iconCol2 = utils.getScaledEl("statIcon" + (k + 4), col2, true);
			var descCol2 = utils.createContainer(iconCol2.getBounds().width, 0, row.getBounds().width - iconCol1.getBounds().width, row.getBounds().height);
			//@TODO: Temporary
			utils.addText(descCol2, Math.floor(Math.random() * 1000), {
				centerY: true
			});
			col2.addChild(iconCol2.clone(), descCol2);1

			row.addChild(col1, col2);
			details.addChild(row);
		}

		uiElements["heroContainer" + i] = {
			element: heroContainer
		};

		heroContainer.addChild(avatar, details);
		heroSummaryContainer.addChild(heroContainer);
	}

	var xpBar = utils.getScaledEl("xpBar", contentContainer);
	xpBar.y = contentContainer.getBounds().height * 0.6;

	heroSummaryContainer.addChild(xpBar);

	contentContainer.addChild(heroSummaryContainer);

	stage.update();
}

function renderJourneyOverview () {
	var manifest = [
		{
			id: "questIcon",
			src: "content-iconmed-quest.png"
		},
		{
			id: "questBg",
			src: "ui-general-questbg.png"
		},
		{
			id: "actionBg",
			src: "ui-general-actionbg.png"
		},
		{
			id: "journeyMap",
			src: "content-journeymap.png"
		},
		{
			id: "journeyDescBg",
			src: "ui-general-journeydescbg.png"
		}
	];

	preloadAssets(manifest, function (event) {
		var result = preload.getResult(event.item.id);
		loadedItem = new createjs.Bitmap(result);
		uiElements[event.item.id] = {
			element: loadedItem
		};
	}, makeJourneyScreen);
}

function makeJourneyScreen () {
	contentContainer.removeAllChildren();

	var journeyActionContainer = utils.createContainer(0, 0, contentContainer.getBounds().width / 3, contentContainer.getBounds().height);

	var questBg = utils.getScaledEl("questBg", journeyActionContainer, true);
	var actionBg = utils.getScaledEl("actionBg", journeyActionContainer, true);

	var questButton = utils.createContainer(0, 0, questBg.getTransformedBounds().width / 2, questBg.getTransformedBounds().height / 10);
	utils.addText(questButton, "Quests", {
		size: 24,
		color: "white",
		centerX: true,
		centerY: true
	});
	utils.setCursor(questButton);

	var actionButton = utils.createContainer(questBg.getTransformedBounds().width / 2, 0, questBg.getTransformedBounds().width / 2, questBg.getTransformedBounds().height / 10);
	utils.addText(actionButton, "Aktionen", {
		size: 24,
		color: "white",
		centerX: true,
		centerY: true
	});
	utils.setCursor(actionButton);

	
	actionButton.on("click", function () {
		var bgIndex = journeyActionContainer.getChildIndex(questBg);
		journeyActionContainer.removeChildAt(bgIndex);
		journeyActionContainer.addChildAt(actionBg, bgIndex);
		stage.update();
	});

	questButton.on("click", function () {
		var bgIndex = journeyActionContainer.getChildIndex(actionBg);
		journeyActionContainer.removeChildAt(bgIndex);
		journeyActionContainer.addChildAt(questBg, bgIndex);
		stage.update();
	});


	var journeyMap = utils.getScaledEl("journeyMap", contentContainer, true);
	journeyMap.x = contentContainer.getBounds().width / 3;

	//@TODO: Move to onClick of tabs
	// var journeyDescBg = utils.getScaledEl("journeyDescBg", contentContainer, false, contentContainer.getBounds().width * 2/3);
	// journeyDescBg.x = contentContainer.getBounds().width / 3;
	// journeyDescBg.y = contentContainer.getBounds().height * 7/10;

	journeyActionContainer.addChild(questBg, questButton, actionButton);

	contentContainer.addChild(journeyActionContainer, journeyMap);

	stage.update();
}