function ThankYouDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"am polite",
				new Array("Thank you", "Thanks"));
}

ThankYouDialog.prototype = new Dialog();
ThankYouDialog.prototype.constructor = ThankYouDialog;

ThankYouDialog.prototype.logic = function(text, iteration) {
	var done = true;

	link.speak("No problem, I am just doing my job.");

	return done;
}
