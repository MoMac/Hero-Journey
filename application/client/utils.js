var utils = {

	setCursor: function (element) {
		var shape = new createjs.Shape ();
		shape.graphics.rect(element.x, element.y, element.getBounds().width, element.buttonHome.getBounds().height);
		shape.cursor = "pointer";
	}

};