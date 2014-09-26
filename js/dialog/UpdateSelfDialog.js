function UpdateSelfDialog() {
	Dialog.call(this, 
				"Frederic Theriault",
				"update myself",
				new Array("Update yourself"));
}

UpdateSelfDialog.prototype = new Dialog();
UpdateSelfDialog.prototype.constructor = UpdateSelfDialog;

UpdateSelfDialog.prototype.logic = function(text, iteration) {
	var done = true;

	$.ajax({
	   type: "POST",
	   url: "ajax.php?type=UpdateSelfDialog",
	   dataType : "json",
	   success: function(msg){
	   		link.speak("Great, I understand life better.");
			link.doneWithDialog();
	   },
	   error: function (msg) {
			link.speak("Something wrong happened, I'll need to be fixed... sorry");
			link.doneWithDialog();
	   }
	 });

	return done;
}
