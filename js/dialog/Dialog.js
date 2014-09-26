function Dialog(author, description, textArray) {
	this.author = author;
	this.description = description;
	this.textArray = textArray;

	if (this.author === "") {
		this.author = null;
	}
}

Dialog.prototype.isAffirmativeText = function(text) {
	text = this.getStandardText(text);
	var result = false;

	if (text.indexOf("yes") >= 0 ||
		text == "yep" ||
		text == "perfect" ||
		text == "excellent" ||
		text == "affirmative" ||
		text == "yeah") {
		result = true;
	}

	return result;
}

Dialog.prototype.isNegativeText = function(text) {
	text = this.getStandardText(text);
	var result = false;
	
	if (text == "no" ||
		text == "nope" ||
		text == "negative" ||
		text == "i don't like it") {
		result = true;
	}

	return result;
}


Dialog.prototype.isSameText = function(text) {
	var same = false;

	for (var i = 0; i < this.textArray.length; i++) {
		same = this.getStandardText(this.textArray[i]) == this.getStandardText(text) ||
			   ((this.textArray[i].indexOf("^") >= 0 || this.textArray[i].indexOf("$") >= 0) && this.getStandardText(text).match(this.getStandardText(this.textArray[i])) !=  null);

		if (same) {
			break;
		}
	}

	return same;
}

Dialog.prototype.getStandardText = function(text) {
	return text.toLowerCase().trim();
}

Dialog.prototype.tick = function(ctx) {}
Dialog.prototype.setUp = function(ctx) {}
Dialog.prototype.tearDown = function(ctx) {}