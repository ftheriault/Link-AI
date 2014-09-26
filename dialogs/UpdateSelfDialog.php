<?php 

	class UpdateSelfDialog {

		public function execute() {
			shell_exec("git pull origin master");
			
			return "done";
		}	
	}

