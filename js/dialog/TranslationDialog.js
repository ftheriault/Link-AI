function TranslationDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can translate to french or spanish",
				new Array("Can you translate something for me"));
	this.lang = null;
	this.mayStop = false;
}

TranslationDialog.prototype = new Dialog();
TranslationDialog.prototype.constructor = TranslationDialog;

TranslationDialog.prototype.logic = function(text, iteration) {
	var done = false;

	if (iteration == 0) {
		link.speak("Sure, in which language?");
	}
	else if (this.lang == null) {
		if (text.indexOf("french") >= 0) {
			this.lang = "fr";
			this.language = "french";
			this.locale = "fr-FR";
			link.speak("Ok, what needs to be translated?");
		}
		else if (text.indexOf("spanish") >= 0) {
			this.lang = "es";
			this.language = "spanish";
			this.locale = "es-MX";
			link.speak("Ok, I'm ready");
		}
		else {
			link.speak("Can you repeat it, please?");
		}
	}
	else if (this.mayStop) {
		this.mayStop = false;

		if (this.isAffirmativeText(text)) {
			link.speak("Ok, I'm listening.");
		}
		else {
			this.lang = null;
			this.locale = null;
			done = true;
			this.mayStop = false;
			link.speak("Ok, excellent.");
		}
	}
	else {
		var tmp = this;

		$.ajax({
		   type: "POST",
		   url: "ajax.php?type=TranslationDialog",
		   dataType : "json",
		   data: {
		   	lang : this.lang,
		   	text : text
		   },
		   success: function(msg){
		   		try {
			   		msg = JSON.parse(msg);

			   		if (msg !== false) {
						link.speak("The translation is ");
						link.speak(msg.responseData.translatedText);
						link.speak("Anything else to translate in " + tmp.language + "?");
					}
					else {
						link.speak("This may not exists, or I got it wrong... Shall we try again?");	
					}

					tmp.mayStop = true;
				}
				catch (e) {
					link.speak("I do not understand the result... I am sorry");
				}
		   },
		   error: function (msg) {
				link.speak("Something wrong occured while translating... sorry");
		   }
		 });

	}

	return done;
}
