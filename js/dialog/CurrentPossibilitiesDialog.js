function CurrentPossibilitiesDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"know what I can do", 
				new Array("What can you do"));
}

CurrentPossibilitiesDialog.prototype = new Dialog();
CurrentPossibilitiesDialog.prototype.constructor = CurrentPossibilitiesDialog;

CurrentPossibilitiesDialog.prototype.logic = function(text, iterationNumber) {
	var done = true;

	var possibilities = "Here is the list of what I can do. I ";

	for (var i = 0; i < linkDialogs.length; i++) {
		possibilities += linkDialogs[i].description + ", ";
	}

	if (possibilities.lastIndexOf(", ") == possibilities.length - 2) {
		possibilities = possibilities.substr(0, possibilities.length - 2);
	}

	link.speak(possibilities);

	return done;
}
