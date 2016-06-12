$(function ($) {

	'use strict'

	$(window).resize(function () {
		App.resizeLayout();
	});

	try {
		WebFont.load({
		    google: {
		        families: ['Slabo 27px']
		    },
		    inactive: function() {
		        console.log("Could not load Google Font, using default.");
		    }
		});
	}
	catch (e) {
		console.log("Error initializing WebFont: " + e);
	}

	//Init
	 var stage,
	 	 loadedItem,
	 	 heroSummaryContainer = new createjs.Container(),
	 	 journeyScreenContainer = new createjs.Container(),
	 	 pageWrapper = new createjs.Container(),
	 	 contentWrapper = new createjs.Container(),
	 	 contentContainer = new createjs.Container(),
	 	 manifest = new Array(),
	 	 layoutContainer = new createjs.Container(),
	 	 uiElements = {};

	var IO = {
    
        /**
        * IO.init() is called after page load connecting the Socket.IO client to the Socket.IO server
        */
        init : function() {
            IO.socket = io.connect();
            IO.bindEvents();
        },

        bindEvents: function () {

        	IO.socket.on('renderHeroSummary', App.renderHeroSummary);
        	IO.socket.on('renderJourneyOverview', App.renderJourneyOverview);
        	IO.socket.on('questsFound', App.renderQuests);
        }

    };


	var App = {

		queue: undefined,

		init: function() {

			stage = new createjs.Stage("demoCanvas");
			stage.enableMouseOver(10);

			App.initContent();

			//Should be disabled, due to performance reasons
			//keeping it for debugging reasons
			createjs.Ticker.on("tick", function () {
				stage.update();
			});

			createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
			createjs.Ticker.setFPS(30);
			
			//Initialize canvas size
			stage.canvas.width = window.innerWidth;
			stage.canvas.height = window.innerHeight;

			// stage.update();
		},

		resizeLayout: function () {	
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

			//@TODO: Conditionally scale with width if site is in portrait mode
			contentWrapper.scaleX = ($(window).height() - contentWrapper.getTransformedBounds().y) / contentWrapper.getBounds().height;
			contentWrapper.scaleY = ($(window).height() - contentWrapper.getTransformedBounds().y) / contentWrapper.getBounds().height;
			contentWrapper.x = ($(window).width() - contentWrapper.getTransformedBounds().width) / 2;

			// stage.update();

		},

		preloadAssets: function (manifest, fileloadCallback, completeCallback) {

			App.queue = new createjs.LoadQueue(false, 'images/');

			if (fileloadCallback) {
				App.queue.on('fileload', fileloadCallback);
			}
			if (completeCallback) {
				App.queue.on('complete', completeCallback);
			}

			App.queue.loadManifest(manifest);
		},

		initContent: function () {

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

			App.preloadAssets(manifest, App.backgroundImageLoaded, App.backgroundInitialized);

		},

		backgroundImageLoaded: function (event) {

			var result = App.queue.getResult(event.item.id);
			loadedItem = new createjs.Bitmap(result);

			utils.addEl(loadedItem, event.item.id)


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
		},

		backgroundInitialized: function () {

			stage.addChild(layoutContainer);


			var contentBounds = contentWrapper.getTransformedBounds();

			//Set Bounds for Content Area
			contentContainer.setBounds(0, 0, contentBounds.width - (contentBounds.width * 0.266), contentBounds.height - (contentBounds.height * 0.306));
			contentContainer.x = contentBounds.x + contentBounds.width *  0.133;
			contentContainer.y = contentBounds.y + contentBounds.height * 0.153;

			
			contentWrapper.addChild(contentContainer);
			stage.addChild(contentWrapper);

			App.resizeLayout();

			utils.getEl("heroesButtonHover").on("click", function () {
				IO.socket.emit('showHeroSummary');
			});

			utils.getEl("journeyButtonHover").on("click", function () {
				IO.socket.emit("showJourneyOverview");
			});

			// stage.update();
		},

		renderHeroSummary: function () {
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

			App.preloadAssets(manifest, function (event) {
				var result = App.queue.getResult(event.item.id);
				loadedItem = new createjs.Bitmap(result);
				utils.addEl(loadedItem, event.item.id, event.item.value);
			}, App.makeHeroSummaryScreen);
		},

		makeHeroSummaryScreen: function () {

			contentContainer.removeAllChildren();

			if (heroSummaryContainer.children.length > 0) {

				//@TODO: Implement mechanism for updating hero stats when available
				contentContainer.addChild(heroSummaryContainer);
				// stage.update();
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
						paddingX: 10,
						centerY: true
					});
					col1.addChild(iconCol1.clone(), descCol1);

					var col2 = utils.createContainer(row.getBounds().width / 2, 0, row.getBounds().width / 2, row.getBounds().height);
					var iconCol2 = utils.getScaledEl("statIcon" + (k + 4), col2, true);
					var descCol2 = utils.createContainer(iconCol2.getBounds().width, 0, row.getBounds().width - iconCol1.getBounds().width, row.getBounds().height);
					//@TODO: Temporary
					utils.addText(descCol2, Math.floor(Math.random() * 1000), {
						paddingX: 10,
						centerY: true
					});
					col2.addChild(iconCol2.clone(), descCol2);1

					row.addChild(col1, col2);
					details.addChild(row);
				}

				utils.addEl(heroContainer, "heroContainer" + i);

				heroContainer.addChild(avatar, details);
				heroSummaryContainer.addChild(heroContainer);
			}

			var xpBar = utils.getScaledEl("xpBar", contentContainer);
			xpBar.y = contentContainer.getBounds().height * 0.6;

			heroSummaryContainer.addChild(xpBar);

			contentContainer.addChild(heroSummaryContainer);

			// stage.update();
		},

		renderJourneyOverview: function () {
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

			App.preloadAssets(manifest, function (event) {
				var result = App.queue.getResult(event.item.id);
				loadedItem = new createjs.Bitmap(result);
				utils.addEl(loadedItem, event.item.id);
			}, App.makeJourneyScreen);
		},

		makeJourneyScreen: function () {
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

			//Request Quests from server/DB
			IO.socket.emit('getQuests');
			
			actionButton.on("click", function () {
				var bgIndex = journeyActionContainer.getChildIndex(questBg);
				journeyActionContainer.removeChildAt(bgIndex);
				journeyActionContainer.addChildAt(actionBg, bgIndex);
				// stage.update();
			});

			questButton.on("click", function () {
				var bgIndex = journeyActionContainer.getChildIndex(actionBg);
				journeyActionContainer.removeChildAt(bgIndex);
				journeyActionContainer.addChildAt(questBg, bgIndex);
				// stage.update();
			});

			var journeyMap = utils.getScaledEl("journeyMap", contentContainer, true);
			journeyMap.x = contentContainer.getBounds().width / 3;

			journeyActionContainer.addChild(questBg, questButton, actionButton);

			utils.addEl(journeyActionContainer, "journeyActionContainer");

			contentContainer.addChild(journeyMap, journeyActionContainer);

			// stage.update();
		},
		renderQuests: function (questData) {

			if (!questData) {
				console.log("Error rendering quests: no data");
				return;
			}

			var cont = utils.getEl("journeyActionContainer");
			var questContainer = utils.createContainer(0, cont.getBounds().height / 10, cont.getBounds().width, cont.getBounds().height * 9/10);

			for (var i = 0; i < questData.length; i++) {
				var quest = utils.createContainer(0, (cont.getBounds().height / 10) * i, cont.getBounds().width, cont.getBounds().height / 10);

				var questDesc = questData[i].description;
				var questTitle = questData[i].title;

				var titleLabel = utils.addText(quest, questTitle, {
					paddingX: 20,
					paddingY: 25,
					color: "white",
					size: 20
				});
				utils.addText(quest, questData[i].subtitle, {
					paddingX: 35,
					paddingY: titleLabel.getMeasuredHeight() + 30,
					color: "#888"
				});
				utils.setCursor(quest);
				questContainer.addChild(quest);

				quest.on("click", function () {
					
					var journeyDescBg = utils.getScaledEl("journeyDescBg", contentContainer, false, 2/3);

					var journeyDetailsCont = utils.createContainer(0, 0, journeyDescBg.getTransformedBounds().width, journeyDescBg.getTransformedBounds().height);
					journeyDetailsCont.x = - journeyDescBg.getBounds().width;
					journeyDetailsCont.y = contentContainer.getBounds().height * 7/10;

					var questDescCont = utils.createContainer(0, 0, journeyDetailsCont.getBounds().width / 2, journeyDetailsCont.getBounds().height);

					var detTitleLabel = utils.addText(questDescCont, questTitle, {
						paddingX: 40,
						paddingY: 25,
						size: 20,
						color: "white"
					});
					utils.addText(questDescCont, questDesc, {
						paddingX: 40,
						paddingY: detTitleLabel.getMeasuredHeight() + 30,
						color: "#888",
						size: 16
					}).lineWidth = questDescCont.getBounds().width;

					journeyDetailsCont.addChild(journeyDescBg, questDescCont);

					var shape = new createjs.Shape();
					shape.x = 0;
					shape.graphics.beginFill("#fff").drawRect(0, contentContainer.getBounds().height * 7/10, contentContainer.getBounds().width, journeyDescBg.getBounds().height);
					journeyDetailsCont.mask = shape;
					contentContainer.addChildAt(journeyDetailsCont, contentContainer.getChildIndex(cont));

					createjs.Tween.get(journeyDetailsCont).to({x:contentContainer.getBounds().width / 3}, 300);
				});
			}

			cont.addChild(questContainer);			
			// stage.update();
		}
	};

	/*****************************
		 CREATEJS UTILITY CODE
     *****************************/
	var utils = {

		hitBox: new createjs.Shape(),

		setCursor: function (element) {
			var area = utils.hitBox.clone();
			area.graphics.beginFill("#000").drawRect(0, 0, element.getTransformedBounds().width, element.getTransformedBounds().height);
			area.setBounds(0, 0, element.getTransformedBounds().width, element.getTransformedBounds().height);
			element.hitArea = area;
			element.cursor = "pointer";
		},

		setHover: function (item) {
			var el = utils.getEl(item.id);
			
			if (item.id.indexOf("Hover") == -1) {
				el.on("mouseover", function () {
					el.visible = false;
					utils.getEl(item.id + "Hover").visible = true;
					// stage.update();
				});
				el.on("mouseout", function () {
					el.visible = true;
					utils.getEl(item.id + "Hover").visible = false;
					// stage.update();
				});
			}
			else {
				el.on("mouseover", function () {
					el.visible = true;
					utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = false;
					// stage.update();
				});
				el.on("mouseout", function () {
					el.visible = false;
					utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = true;
					// stage.update();
				})
			}
		},

		addEl: function (el, id, val) {
			uiElements[id] = {
				element: el,
				value: val ? val : undefined
			};
		},

		getEl: function (id) {
			return uiElements[id].element;
		}, 

		getElVal: function (id) {
			return uiElements[id].value;
		},

		getScaledEl: function (id, tarEl, scaleHeight, pct) {
			var el = utils.getEl(id);
			utils.setScale(el, tarEl, pct ? pct : 1, scaleHeight);
			return el;
		},

		setScale: function (el, tarEl, pct, scaleHeight) {
			var scaleFactor = 0;

			if (scaleHeight)
				scaleFactor = tarEl.getBounds().height * pct / el.getBounds().height;
			else 
				scaleFactor = tarEl.getBounds().width * pct / el.getBounds().width;

			el.scaleX = scaleFactor;
			el.scaleY = scaleFactor;
		},

		addText: function (container, text, options) {
			try {
				var label = new createjs.Text();
				label.text = text;
				
				label.font = options && options.size ? options.size + "px 'Slabo 27px'" : "18px 'Slabo 27px'";
				label.color = options && options.color ? options.color : "black";
				label.x = options && options.centerX ? ((container.getBounds().width - label.getMeasuredWidth()) / 2) : options.paddingX;
				label.y = options && options.centerY ? ((container.getBounds().height - label.getMeasuredHeight()) / 2) : options.paddingY;

				container.addChild(label);

				return label;
			}
			catch (e) {
				console.log("Error adding text: " + e);
			}
		},

		createContainer: function (x, y, width, height) {
			var c = new createjs.Container();
			c.setBounds(0, 0, width ? width : 0, height ? height : 0);
			c.x = x ? x : 0;
			c.y = y ? y : 0;
			return c;
		}


	// Mousewheel scroll functionality WIP
	// 		$(window).on("mousewheel", function () {
	// 	var objects = stage.getObjectsUnderPoint();

	// 	for (var i = 0; i < objects.length; i++) {
	// 		console.log(objects[i].id);
	// 		if (objects[i] == utils.getEl("journeyActionContainer")) {
	// 			console.log("found container!!!");
	// 			break;
	// 		}
	// 	}
	// });

	};


	App.init();
	IO.init();

});