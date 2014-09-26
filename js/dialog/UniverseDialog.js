
function UniverseDialog() {
	Dialog.call(this, 
				"Simon Nguyen",
				"can give answer to universe",
				new Array("what is the answer to life"));

	this.timeOutId = null;
}

UniverseDialog.prototype = new Dialog();
UniverseDialog.prototype.constructor = UniverseDialog;

UniverseDialog.prototype.logic = function(text, iteration) {
	this.answer(1);
	return false;
}

UniverseDialog.prototype.tearDown = function() {
	if (this.timeOutId != null) {
		clearTimeout(this.timeOutId);
		this.timeOutId = null;
	}
}

UniverseDialog.prototype.answer = function (iter){
	var tmp = this;

	if(iter==1){
		link.speak("The answer to the ultimate question of life...");

		this.timeOutId = setTimeout(function () {
			tmp.answer(2)
		}, 2000);
	}

	else if(iter==2){
		link.speak("the universe...");
		this.timeOutId = setTimeout(function () {
			tmp.answer(3)
		}, 2000);
	}
	else if(iter==3){
		link.speak("and everything...");
		this.timeOutId = setTimeout(function () {
			tmp.answer(4)
		}, 2000);
	}
	else if(iter==4){
		link.speak("is...");
		this.timeOutId = setTimeout(function () {
			tmp.answer(5)
		}, 5000);
	}
	else if(iter==5){
		link.speak("42");
		link.doneWithDialog();
	}
}