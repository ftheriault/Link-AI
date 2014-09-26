function NewsDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can give the latest news", 
				new Array("^What.*news$"));
	this.lang = null;
	this.currentItem = null;
}

NewsDialog.prototype = new Dialog();
NewsDialog.prototype.constructor = NewsDialog;

NewsDialog.prototype.nextItem = function() {
	var done = false;

	if (this.news.length > 0) {
		this.currentItem = this.news.shift();
		link.speak(this.currentItem.title);
		link.speak("Read next news or this item content?");
	}
	else {
		done = true;
	}

	return done;
}

NewsDialog.prototype.logic = function(text, iteration) {
	var done = false;

	if (iteration == 0) {
		var tmp = this;
		link.speak("Ok, give me a sec.");
		this.news = null;
		this.currentItem = null;

		$.ajax({
		   type: "POST",
		   url: "ajax.php?type=NewsDialog",
		   dataType : "json",
		   success: function(msg){
		   		try {
		   			tmp.news = msg;
		   			link.speak("I have your news, sir. Shall I read them to you?");
				}
				catch (e) {
					link.speak("I do not understand the result... I am sorry");
					link.doneWithDialog();
				}
		   },
		   error: function (msg) {
				link.speak("Something wrong happened, I'll need to be fixed... sorry");
				link.doneWithDialog();
		   }
		 });		
	}
	else if (this.news != null) {
		if (this.currentItem != null) {
			if (text.match("next") != null || text.match("nick")) {
				done = this.nextItem();
			}
			else {
				link.speak(this.currentItem.description);	
				link.speak("Do you want me to repeat, or to go to next item?");
			}
		}
		else if (this.currentItem == null && this.isAffirmativeText(text)) {
			done = this.nextItem();
		}
		else {
			done = true;
			link.speak("Ok");
		}
		   			
	}

	return done;
}
