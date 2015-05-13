function WebProjectCodeInspectorDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can check your code",
				new Array("Can you check my code"));

	this.serverLocation = 'localhost:8081';
	this.wasOpen = false;
}

WebProjectCodeInspectorDialog.prototype = new Dialog();
WebProjectCodeInspectorDialog.prototype.constructor = WebProjectCodeInspectorDialog;

WebProjectCodeInspectorDialog.prototype.connect = function() {
	this.ws = new WebSocket('ws://' + this.serverLocation);
	var tmp = this;

	this.ws.onopen = function(){
		this.wasOpen = true;
		tmp.askDirectory();
	}

	this.ws.onmessage = function(e){
		var serverMessage = e.data;
		link.digestMessage(serverMessage);
	}

	this.ws.onclose = function(){
		if (!this.wasOpen) {
			tmp.cannotConnect();	
		}
		else {
			link.speak("Sir, it seems like you are finished with the server.");
			link.updateColorLevel(255, null, 30);
		}
	}

	this.ws.onerror = function(error){
		console.log('Error detected: ' + error);
		link.updateColorLevel(255, null, 30);

		if (this.wasOpen) {
			link.doneWithDialog();
		}
	}
};

WebProjectCodeInspectorDialog.prototype.tearDown = function(ctx) {
	if (this.ws != null) {
		this.ws.close();
		this.wasOpen = false;
		$("#" + this.promptId).remove();
	}
}

WebProjectCodeInspectorDialog.prototype.logic = function(text, iteration) {
	var done = false;

	if (iteration == 0) {
		link.speak("Ok, let me check if I can access your files");
		this.connect();		
	}
	else if (text.match("ready") != null) {
		$("#" + this.promptId).remove();
		this.connect();
	}

	return done;
}

WebProjectCodeInspectorDialog.prototype.askDirectory = function() {
	
};

WebProjectCodeInspectorDialog.prototype.cannotConnect = function() {
	var tmp = this;
	
	link.speak("Unfortunately, it seems like I can't see them.");
	link.speak("You will need to start the following program by doing the instructions below.");
	link.speak("When you are done, say \"I am ready\"", null, function () {
		tmp.promptId = link.prompt("<h1>File accessor program</h1>"+
						"<p>To start the program, you must : </p>" + 
						"<ol>" +
						"<li>Intall node</li>" +
						"<li>Using git, clone the <a href='https://github.com/ftheriault/LinkFileAccessor' target='_blank'>file accessor program</a>.</li>" +
						"<li>Run the file accessor program : node server/main.js</li>" +
						"</ol>", false);		
	});
}
