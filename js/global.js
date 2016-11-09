var link = null;
var linkVoice = null;
var linkVoices = null;
var linkDialogs = [];

var pageWidth = 0;
var pageHeight = 0;

var speechSynthesisSupport = ('speechSynthesis' in window);
var speechRecognitionSupport = location.protocol === 'https:' && ('webkitSpeechRecognition' in window);

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
	pageWidth = document.getElementById("canvas").offsetWidth;
	pageHeight = document.getElementById("canvas").offsetHeight;
	ctx.clearRect(0, 0, pageWidth, pageHeight);
	link.tick(ctx);

	window.requestAnimationFrame(tick);
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
		linkVoice = linkVoices[2];		

		if (link != null) {
			console.log(linkVoice)
			link.voice = linkVoice;
		}
	}
}