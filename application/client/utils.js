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
				stage.update();
			});
			el.on("mouseout", function () {
				el.visible = true;
				utils.getEl(item.id + "Hover").visible = false;
				stage.update();
			});
		}
		else {
			el.on("mouseover", function () {
				el.visible = true;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = false;
				stage.update();
			});
			el.on("mouseout", function () {
				el.visible = false;
				utils.getEl(item.id.slice(0, item.id.indexOf("Hover"))).visible = true;
				stage.update();
			})
		}
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
		var label = new createjs.Text();
		label.text = text;
		
		label.font = options && options.size ? options.size + "px 'Slabo 27px'" : "18px 'Slabo 27px'";
		label.color = options && options.color ? options.color : "black";
		label.x = options && options.centerX ? ((container.getBounds().width - label.getMeasuredWidth()) / 2) : 10;
		label.y = options && options.centerY ? ((container.getBounds().height - label.getMeasuredHeight()) / 2) : 10;

		container.addChild(label);
	},

	createContainer: function (x, y, width, height) {
		var c = new createjs.Container();
		c.setBounds(0, 0, width, height);
		c.x = x;
		c.y = y;
		return c;
	}

};