function BoredDialog() {
	Dialog.call(this, 
				"Catherine Labrosse",
				"am bored",
				new Array("I am bored", "I am so bored", "I'm bored", "I'm so bored"));
}

BoredDialog.prototype = new Dialog();
BoredDialog.prototype.constructor = BoredDialog;

BoredDialog.prototype.logic = function(text, iteration) {
	var done = true;

	link.speak("How come? Why don't you play badminton?");
	link.speak("And you are probably a programmer. You could take your bicycle out for a ride.");

	return done;
}