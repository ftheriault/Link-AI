function ChangeVoiceDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can change my voice", 
				new Array("Change your voice$"));
}

ChangeVoiceDialog.prototype = new Dialog();
ChangeVoiceDialog.prototype.constructor = ChangeVoiceDialog;

ChangeVoiceDialog.prototype.logic = function(text, iterationNumber) {
	var done = false;

	if (iterationNumber != 0 && this.isAffirmativeText(text)) {
		link.speak("Voice saved. I'm glad you like it.");
		done = true;
	}

	if (!done) {
		link.voice = linkVoices[(iterationNumber + 1) % 4];
		link.speak("Like that?");
	}

	return done;
}
