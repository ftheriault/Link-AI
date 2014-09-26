function TimeDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can give time",
				new Array("What time is it"));
}

TimeDialog.prototype = new Dialog();
TimeDialog.prototype.constructor = TimeDialog;

TimeDialog.prototype.logic = function(text, iteration) {
	var done = true;

	var date = new Date();
	link.speak("It is " + date.getHours() + " hours and " + date.getMinutes() + " minutes");	

	return done;
}
