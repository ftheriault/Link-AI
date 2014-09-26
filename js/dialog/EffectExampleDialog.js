function EffectExampleDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"can do a simple effect", 
				new Array("Can you do a simple visual effect"));

	this.count = 0;
}

EffectExampleDialog.prototype = new Dialog();
EffectExampleDialog.prototype.constructor = EffectExampleDialog;

EffectExampleDialog.prototype.logic = function(text, iterationNumber) {
	var done = false;
	this.count = 0;

	link.speak("I'd be happy to! Look at that");

	return done;
}

EffectExampleDialog.prototype.tick = function(ctx) {

	if (this.count == 200) {
		link.speak("Here you go, I hope you liked it.");
		link.doneWithDialog();
	}
	else {
		var size = 2;
		var opacity = 0;

		if (this.count < 100) {
			size = this.count * 2;
			opacity = this.count/100.0;
		}
		else {
			size = 400 - this.count * 2;
			opacity = (200 - this.count)/100.0;
		}

		ctx.save();
		ctx.fillStyle = "rgba(0, 0, 255, " + opacity + ")";
		ctx.translate(document.body.offsetWidth/2, document.body.offsetHeight/2);
		ctx.rotate(Math.pow(this.count, 2) * Math.PI/180);
		ctx.fillRect(-size/2, -size/2, 
					 size, size);
		ctx.restore();
	}

	this.count++;
}