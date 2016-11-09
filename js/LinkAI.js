function Link(linkVoice) {
	this.voice = linkVoice;
	this.haveAttention = false;
	this.currentDialog = null;

	this.spokenMessages = [];

	this.initialized = false;
	this.dialogIterationNumber = 0;
	this.promptCounter = 0;

	// Link animation
	this.drawCounter = 0;
	this.drawOpacity = 0;
	this.drawWantedOpacity = 0.3;
	this.drawGreenLevel = 30;
	this.drawRedLevel = 30;
	this.drawBlueLevel = 200;
	this.squareSize = 300;
}

Link.prototype.updateColorLevel = function(red, green, blue) {
	if (red != null) {
		this.drawRedLevel = red;
	}

	if (green != null) {
		this.drawGreenLevel = green;	
	}

	if (blue != null) {
		this.drawBlueLevel = blue;	
	}
};

Link.prototype.tick = function(ctx) {
	ctx.save();

	if (this.spokenMessages.length != 0) {
		this.drawWantedOpacity = 0.8;
		this.drawCounter += 0.01;
	}
	else {
		this.drawWantedOpacity = 0.3;
	}

	if (this.drawOpacity < this.drawWantedOpacity) {
		this.drawOpacity += 0.01;
	}
	else if (this.drawOpacity > this.drawWantedOpacity) {
		this.drawOpacity -= 0.01;	
	}

	if (this.drawRedLevel > 30) {
		this.drawRedLevel -= 1;
	}

	if (this.drawGreenLevel > 30) {
		this.drawGreenLevel -= 1;
	}

	if (this.drawBlueLevel < 200) {
		this.drawBlueLevel += 1;
	}

	if (pageWidth != null) {
		ctx.translate(pageWidth/2, pageHeight/2);
	}
	ctx.rotate(this.drawCounter);

	ctx.fillStyle = "rgba(" + this.drawRedLevel + ", " + this.drawGreenLevel + ", " + this.drawBlueLevel + ", " + this.drawOpacity + ")";
	ctx.fillRect(-this.squareSize/2, -this.squareSize/2, this.squareSize, this.squareSize);
	ctx.restore();

	if (!this.initialized) {
		if (this.voice != null) {
			this.initialized = true;	
			$("#dialogs").append("<div class='dialog-item' style='margin-bottom:20px;'><i>First,&nbsp;start&nbsp;by&nbsp;saying&nbsp;'Link'&nbsp;or&nbsp;'wake&nbsp;up'&nbsp;</i></div>");

			for (var i = 0; i < linkDialogs.length; i++) {
				var description = linkDialogs[i].description != null && linkDialogs[i].description.length > 0 ? linkDialogs[i].description : "";
				description = description.replace("'", "\'");

				if (description.length > 0) description =  "I " + description;

				$("#dialogs").append("<div class='dialog-item' title='" + description + "'>" + 
										linkDialogs[i].textArray[0] + 
										(linkDialogs[i].author != null && linkDialogs[i].author.length > 0 ? " <div class='author'>by " + linkDialogs[i].author + " </div>" : "") +
									 "</div>");
			}

			var tmp = this;
			setTimeout(function () {
				tmp.speak("I am initialized, sir");
			}, 2000);
		}
	}

	ctx.font = "24px Verdana";  
	var offset = 0;
	
	if (this.currentDialog != null) {
		this.currentDialog.tick(ctx);
	}

	for (var i = 0; i < this.spokenMessages.length; i++) {
		var message = this.spokenMessages[i];

		if (i == 0) {
			message.time--;
		}

		if (message.done) {
			this.spokenMessages.splice(i, 1);
			i--;
		}
		else {
			ctx.fillStyle = "rgba(255, 255, 255, " + (message.time/message.initialTime) + ")";
			var tmpText = message.text;

			while (tmpText.length > 0) {
				var toPrint = tmpText;

				if (tmpText.length > 80) {
					toPrint = tmpText.substr(0, 80);
					tmpText = tmpText.substr(80);
				}
				else {
					tmpText = 0;
				}

				ctx.fillText(toPrint, 40, 40 + (offset * 40));
				offset++;
			}
		}
	}
}

Link.prototype.listen = function(event) {
	for (var i = event.resultIndex; i < event.results.length; ++i) {
		console.log(event.results[i][0].transcript);
		if (event.results[i].isFinal) {
			this.analyze(event.results[i][0].transcript);
		}
	}
}

Link.prototype.analyze = function(text, forceAttention) {
	if (forceAttention != undefined) {
		this.haveAttention = true;
	}

	text = text.toLowerCase().trim();
	text = text.replace(".", "");
	text = text.replace("!", "");
	text = text.replace("?", "");
	text = text.replace(",", "");
	var dialogDone = false;

	if (((text.indexOf("li") == 0 || text.indexOf("ly") == 0 ||text.indexOf("la") == 0 || text.indexOf("le") == 0) && text.indexOf(" ") == -1) ||
		(text.match("wake up$") != null)) {
		this.speak("Yes sir?");
		this.haveAttention = true;
	}
	else if (this.haveAttention) {
		if (text == "forget it" || text == "nevermind" || text == "stop") {
			this.speak("Oh... ok");
			this.doneWithDialog();
		}
		else if (this.currentDialog == null) {
			var found = false;
			var possibilities = new Array();

			for (var i = 0; i < linkDialogs.length; i++) {
				if (linkDialogs[i].isSameText(text)){	
					possibilities.push(linkDialogs[i]);
				}
			}

			if (possibilities.length > 0) {
				this.currentDialog = possibilities[parseInt(Math.random() * possibilities.length)];
				this.currentDialog.setUp();
				found = true;
			}

			if (!found) {
				this.speak("I did not get that, can you repeat?");			
			}
		}
	}

	if (this.currentDialog != null) {
		var done = this.currentDialog.logic(this.currentDialog.getStandardText(text), 
											this.dialogIterationNumber);
		
		if (!done) {
			this.dialogIterationNumber++;
		}
		else {
			dialogDone = true;
		}

		if (dialogDone) {
			this.doneWithDialog();
		}
	}	
}

Link.prototype.doneWithDialog = function () {
	if (this.currentDialog != null) {
		this.currentDialog.tearDown();
	}

	this.haveAttention = false;
	this.currentDialog = null;
	this.dialogIterationNumber = 0;
}

Link.prototype.prompt = function(msg, mustCloseOnClick) {
	var element = document.createElement("div");
	element.className = "prompt";
	element.id = "prompt-" + this.promptCounter++;

	if (mustCloseOnClick) {
		element.onclick = function () {
			document.body.removeChild(element);
		}

		msg += "<div class='close-desc'><i>Click to close</i></div>"
	}

	element.innerHTML = msg;
	
	document.body.appendChild(element);

	return element.id;
}

Link.prototype.speak = function(text, lang, callback) {	
	if (this.voice != null) {
		var msg = new SpeechSynthesisUtterance();
		msg.voice = this.voice; 
		msg.voiceURI = 'native';
		msg.volume = 1; 	// 0 to 1
		msg.rate = 1;		// 0.1 to 10
		msg.pitch = 0; 		//0 to 2

		if (lang == null) {
			msg.lang = 'en-US';
		}
		else {
			msg.lang = lang;
		}

		msg.text = text;

		var length = (text.length > 30 ? text.length * 4 : 120.0);

		var spokenMsg = {
			text: text, 
			time: length,
			initialTime: length,
			done : false
		}

		msg.onend = function () {
			spokenMsg.done = true;

			if (callback != null) {
				callback();
			}
		}

		this.spokenMessages.push(spokenMsg);

		setTimeout(function () {
			speechSynthesis.speak(msg);
		}, 10)
		
	}
}

