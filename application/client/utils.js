utils = {

	setCursor: function (element) {
		if (typeof shape === "undefined")
			shape = new createjs.Shape ();
		else 
			shape = shape.clone();
		shape.graphics.beginFill("#000").drawRect(0, 0, element.getBounds().width, element.getBounds().height);
		element.hitArea = shape;
		element.cursor = "pointer";
	},

	setHover: function (item) {
		var el = utils.getEl(item.id);
		
		if (item.id.indexOf("Hover") == -1) {
			el.on("mouseover", function () {
				el.visible = false;
				utils.getEl(item.id + "Hover").visible = true;
				// layoutContainer.updateCache();
			});
			el.on("mouseout", function () {
				el.visible = true;
				utils.getEl(item.id + "Hover").visible = false;
				// layoutContainer.updateCache();
			});
		}
		else {
			el.on("mouseover", function () {
				el.visible = true;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = false;
				// layoutContainer.updateCache();
			});
			el.on("mouseout", function () {
				el.visible = false;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = true;
				// layoutContainer.updateCache();
			})
		}
	},

	getEl: function (id) {
		return uiElements[id].element;
	},

	getElVal: function (id) {
		return uiElements[id].value;
	}

};

//Text Button
// function createTextButton (buttonObject, text) {

// 	var buttonContainer = new createjs.Container();
// 	var btnText = new createjs.Text();
// 	btnText.text = text;
// 	btnText.font = "18px 'Slabo 27px'";
// 	btnText.color = "white";
// 	btnText.x = (buttonObject.getBounds().width - btnText.getBounds().width) / 2;
// 	btnText.y = (buttonObject.getBounds().height - btnText.getBounds().height) / 2;
// 
// 	buttonContainer.addChild(buttonObject, btnText);
// 	buttonContainer.mouseChildren = false;

// 	var shape = new createjs.Shape ();
// 	shape.graphics.beginFill("#000000").drawRect(0,0,buttonContainer.getBounds().width, buttonContainer.getBounds().height);
// 	buttonContainer.hitArea = shape;
// 	buttonContainer.cursor = "pointer";
// 	buttonContainer.cache(0,0,150,60);

// 	return buttonContainer;
// }