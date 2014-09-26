var link = null;
var linkVoice = null;
var linkVoices = null;
var linkDialogs = [];

var speechSynthesisSupport = ('speechSynthesis' in window);
var speechRecognitionSupport = ('webkitSpeechRecognition' in window);

$( document ).ready(function() {

	document.getElementById("manual-input").onkeyup = function (event) {
		if (event.which == 13) {
			link.analyze(document.getElementById("manual-input").value, true);
			document.getElementById("manual-input").value = "";
		}
	}
	
	if (speechSynthesisSupport) {
		link = new Link(linkVoice);

		document.getElementById("canvas").width = document.body.offsetWidth;
		document.getElementById("canvas").height = document.body.offsetHeight;	
		
		tick();
	}
	else {
		document.body.innerHTML = "You do not have enough speech support on your browser. Please use the latest version of Chrome";
	}
});

function tick() {
	var ctx = document.getElementById("canvas").getContext("2d");
	ctx.clearRect(0, 0, document.getElementById("canvas").offsetWidth, 
						document.getElementById("canvas").offsetHeight);
	link.tick(ctx);
	setTimeout(tick, 50);
}

function showManualInput() {
	$('#manual-input-link').fadeOut();
	$('#manual-input-section').fadeIn()
}

// ============================================================
// The following needs to be set here
// ------------------------------------------------------------
if (speechRecognitionSupport) {

	var recognition = new webkitSpeechRecognition();
	recognition.continuous = false;
	recognition.interimResults = false;
	recognition.onresult = function(event) { 
		if (link != null) {
			link.listen(event);
		}
	}
	
	recognition.onend = function (event) {
		recognition.start();
		/*recognition.stop();
		setTimeout(function() {
			recognition.start();
		}, 30);*/
	};

	recognition.start();
}
else {
	$( document ).ready(function() {
		showManualInput();
	});
}

if (speechSynthesisSupport) {
	window.speechSynthesis.onvoiceschanged = function() {
		linkVoices = window.speechSynthesis.getVoices();
		linkVoice = linkVoices[0];		

		if (link != null) {
			link.voice = linkVoice;
		}
	}
}