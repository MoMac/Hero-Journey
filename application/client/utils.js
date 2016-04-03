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

	getEl: function (id) {
		return uiElements[id].element;
	},

	getElVal: function (id) {
		return uiElements[id].value;
	}

};