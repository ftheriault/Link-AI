function CreatorsDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"know my creators", 
				new Array("^Who are your creator", "^Who are your developer", "^Who developed you", "Who created you"));
}

CreatorsDialog.prototype = new Dialog();
CreatorsDialog.prototype.constructor = CreatorsDialog;

CreatorsDialog.prototype.logic = function(text, iterationNumber) {
	var done = true;

	link.speak("You want to know who programmed me? ");
	link.speak("Well, the main developer is Frederic Theriault.");

	var cited = new Array();
	cited.push("Frederic Theriault");
	var collaborators = "";

	for (var i = 0; i < linkDialogs.length; i++) {
		if (linkDialogs[i].author != null && cited.indexOf(linkDialogs[i].author) == -1) {
			cited.push(linkDialogs[i].author);
			collaborators += linkDialogs[i].author + ", ";
		}
	}

	if (collaborators.lastIndexOf(", ") == collaborators.length - 2) {
		collaborators = collaborators.substr(0, collaborators.length - 2);
	}

	if (collaborators.length > 0) {
		link.speak("Though other people collaborated in my conception. They are");
		link.speak(collaborators);
	}

	return done;
}
