function BaconDialog() {
	Dialog.call(this,
				"Sarah Lev",
				"can give bacon",
				new Array("Can you .* bacon .*", "^Can you .* bacon$"));

	this.id = null;
}

BaconDialog.prototype = new Dialog();
BaconDialog.prototype.constructor = BaconDialog;

BaconDialog.prototype.logic = function(text,iteration) {
	var done = false;

	if(iteration == 0){
		link.speak("Here, let me show you. Just say 'I am done' when you want to close it.");	
		this.id = (new Date()).getTime();
		$(document.body).append('<iframe class="insideframe" id="' + this.id + '" src="https://baconipsum.com/?paras=5&type=all-meat&start-with-lorem=1"></iframe>');
	}
	else if ( text.match("^i am d" ) != null || text.match("^im d") !=null){
		link.speak("Ok, I hope you're full now.");
		done = true;
	}

	return done;
}

BaconDialog.prototype.tearDown = function() {
	$("#" + this.id).remove();
}
