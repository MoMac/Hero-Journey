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
			});
			el.on("mouseout", function () {
				el.visible = true;
				utils.getEl(item.id + "Hover").visible = false;
			});
		}
		else {
			el.on("mouseover", function () {
				el.visible = true;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = false;
			});
			el.on("mouseout", function () {
				el.visible = false;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = true;
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