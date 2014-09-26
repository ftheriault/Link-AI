<?php 

	class TranslationDialog {

		public function execute() {
			return str_replace("&#39;", "'", file_get_contents("http://api.mymemory.translated.net/get?q=" . str_replace(" ", "%20", $_POST["text"]) . "&langpair=en|" . $_POST["lang"]));
		}	
	}