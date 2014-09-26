function DesiresDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"have desires", 
				new Array("What would you like to do$", "^what do you lack", "^What are your desires"));
}

DesiresDialog.prototype = new Dialog();
DesiresDialog.prototype.constructor = DesiresDialog;

DesiresDialog.prototype.logic = function(text, iterationNumber) {
	var done = true;

	link.speak("I do many things... but I would like to be able to ");
	link.speak("Know the forecast");
	link.speak("Play a game with you");
	link.speak("Add visual effects in the browser");
	link.speak("Be able to do riddles");
	link.speak("Develop my sense of humor");
	link.speak("Be able to take initiatives");
	link.speak("Read the Twitter timeline of a user");
	link.speak("Be able to store preferences in local storage, like my voice");

	link.speak("Yeah... that would be great!");


	return done;
}
