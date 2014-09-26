function WhatIsDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"define things",
				new Array("^What is a", "^What are"));

	this.id = null;
}

WhatIsDialog.prototype = new Dialog();
WhatIsDialog.prototype.constructor = WhatIsDialog;

WhatIsDialog.prototype.logic = function(text, iteration) {
	var done = false;

	if (iteration == 0) {
		link.speak("Here, let me show you. Just say 'I am done' when you want to close it.");	
		this.id = (new Date()).getTime();
		$(document.body).append('<iframe class="insideframe" id="' + this.id + '" src="https://www.bing.com/search?q=' + text + '"></iframe>');
	}
	else if (text.match("^i am d") != null || text.match("^im d") != null) {
		link.speak("Ok, I hope it helped.");
		done = true;
	}

	return done;
}

WhatIsDialog.prototype.tearDown = function() {
	$("#" + this.id).remove();
}
