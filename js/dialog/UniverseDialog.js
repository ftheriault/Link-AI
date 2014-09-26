
function UniverseDialog() {
	Dialog.call(this, 
				"Simon Nguyen",
				"can give answer to universe",
				new Array("what is the answer to life"));
}

UniverseDialog.prototype = new Dialog();
UniverseDialog.prototype.constructor = UniverseDialog;

UniverseDialog.prototype.logic = function(text, iteration) {
	var done = true;

	this.answer(1);
	return done;

}

UniverseDialog.prototype.answer = function (iter){
	var tmp = this;

	if(iter==1){
		link.speak("The answer to the ultimate question of life...");

		setTimeout(function () {
			tmp.answer(2)
		}, 2000);
	}

	else if(iter==2){
		link.speak("the universe...");
		setTimeout(function () {
			tmp.answer(3)
		}, 2000);
	}
	else if(iter==3){
		link.speak("and everything...");
		setTimeout(function () {
			tmp.answer(4)
		}, 2000);
	}
	else if(iter==4){
		link.speak("is...");
		setTimeout(function () {
			tmp.answer(5)
		}, 5000);
	}
	else if(iter==5){
		link.speak("42");
	}
}