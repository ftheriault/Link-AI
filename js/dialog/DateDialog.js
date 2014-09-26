function DateDialog() {
	Dialog.call(this, 
				"Philippe Cuerrier",
				"can give date",
				new Array("What date is it"));
}

DateDialog.prototype = new Dialog();
DateDialog.prototype.constructor = DateDialog;

DateDialog.prototype.logic = function(text, iteration) {
	var done = true;
	var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var monthName = ["January", "February", "Mars", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var date = new Date();
	link.speak("It is " + weekday[date.getDay()] + ", " + monthName[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear());	

	return done;
}