function WebProjectCodeInspectorDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can check your web project for convention errors",
				new Array("Can you analyze my web project"));

	this.serverLocation = 'localhost:8081';
	this.rootDir = "";

	if (localStorage["DocumentRootDir"] != null) {
		this.rootDir = localStorage["DocumentRootDir"];
	}
}

WebProjectCodeInspectorDialog.prototype = new Dialog();
WebProjectCodeInspectorDialog.prototype.constructor = WebProjectCodeInspectorDialog;

WebProjectCodeInspectorDialog.prototype.connect = function() {
	this.ws = new WebSocket('ws://' + this.serverLocation);
	var tmp = this;
	this.wasOpen = false;

	this.ws.onopen = function(){
		tmp.wasOpen = true;
		tmp.askDirectory();
	}

	this.ws.onmessage = function(e){
		e = JSON.parse(e.data);

		if (e.type == "result") {
			var files = e.files;			
			tmp.analyzeFiles(files);
		}
	}

	this.ws.onclose = function(){
		if (!tmp.wasOpen) {
			tmp.cannotConnect();	
		}
		else {
			link.doneWithDialog();
		}
	}

	this.ws.onerror = function(error){
		console.log('Error detected: ' + error);
		link.updateColorLevel(255, null, 30);

		if (tmp.wasOpen) {
			link.doneWithDialog();
		}
	}
};

WebProjectCodeInspectorDialog.prototype.analyzeFiles = function(files) {
	var depth = 5;
	
	for (var i = 0; i < files.length; i++) {
		if (files[i].scanDepth < depth) {
			depth = files[i].scanDepth;
		}
	}

	var errors = [];
	// checking for echo dao in DAO files
	for (var i = 0; i < files.length; i++) {
		if (files[i].fileName.toLowerCase().indexOf("dao") >= 0) {
			if (files[i].content.indexOf("echo") != -1 ||
				files[i].content.indexOf("var_dump") != -1) {
				errors.push("Presence of <strong>echos</strong> or <strong>var_dump</strong> commands in the DAO classes.");
				break;
			}
		}
	};

	// checking for echo in action files
	for (var i = 0; i < files.length; i++) {
		if (files[i].fileName.toLowerCase().indexOf("action") >= 0 ||
			files[i].fileName.toLowerCase().indexOf("ctrl") >= 0 ||
			files[i].fileName.toLowerCase().indexOf("controller") >= 0) {
			if (files[i].content.indexOf("echo") != -1 ||
				files[i].content.indexOf("var_dump") != -1) {
				errors.push("Presence of <strong>echos</strong> or <strong>var_dump</strong> commands in the action/controller classes.");
				break;
			}
		}
	};

	// checking that CommonAction is super class in action files
	for (var i = 0; i < files.length; i++) {
		if (files[i].fileName.toLowerCase().indexOf("action") >= 0 ||
			files[i].fileName.toLowerCase().indexOf("ctrl") >= 0 ||
			files[i].fileName.toLowerCase().indexOf("controller") >= 0) {
			if ((files[i].fileName.toLowerCase().indexOf("commonaction") == -1 && files[i].fileName.toLowerCase().indexOf("commonctrl") == -1 && files[i].fileName.toLowerCase().indexOf("commoncontroller") == -1) &&
				files[i].content.indexOf("extends") == -1) {
				errors.push("Some action/controller classes are not children of CommonAction.");
				break;
			}
		}
	};

	// checking the absence of calls and references to the DAOs in view files
	for (var i = 0; i < files.length; i++) {
		if (files[i].scanDepth == depth) {
			if (files[i].content.toLowerCase().indexOf("dao") != -1) {
				errors.push("There should be no call to DAOs in the view php files.");
				break;
			}
		}
	};

	// checking the absence of "style attributes" in HTML files
	for (var i = 0; i < files.length; i++) {
		if (files[i].scanDepth == depth) {
			if (files[i].content.toLowerCase().indexOf("style=") != -1) {
				errors.push("Using of styles attributes in HTML should be done as less as possible.");
				break;
			}
		}
	};

	if (errors.length == 0) {
		link.speak("I did not see anything wrong with your project, good job.");
	}
	else {
		var errorsStr = "";
		for (var i = 0; i < errors.length; i++) {
			errorsStr += "<li>" + errors[i] + "</li>";
		};

		link.speak("Humm... I found errors in your code, here they are.", null, function() {
			link.prompt("<h2>Web Projet Warnings</h2>"+
						"<ul>" +
						errorsStr + 
						"</ul>", true);	
		});	
	}

	link.doneWithDialog();
};

WebProjectCodeInspectorDialog.prototype.tearDown = function(ctx) {
	if (this.ws != null) {
		this.ws.close();
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
	var tmp = this;

	link.speak("Ok, now I need to know where is your root directory", null, function () {
		var rootPath = prompt("Enter your root directory", tmp.rootDir);

		if (rootPath == null) {
			link.speak("Oh... nevermind then");
			link.doneWithDialog();
		}
		else {
			localStorage["DocumentRootDir"] = rootPath;
			tmp.rootDir = rootPath;
			link.speak("Excellent, let me take a look");
			link.updateColorLevel(30, 255, 30);
			tmp.ws.send(JSON.stringify({
				type : "read",
				dir : rootPath,
				validExtensions : [".php"]
			}));
		}
	});
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
						"<li>In a terminal on your computer, run the file accessor program : <strong>node server/main.js</strong></li>" +
						"</ol>", false);		
	});
}
