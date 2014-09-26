<?php 

	if (!empty($_GET["type"])) {
		$files = scandir("dialogs");

		foreach($files as $file) {
			if ($file != "." && $file != ".." && $file == $_GET["type"] . ".php") {

				require_once("dialogs/" . $file);
				$dialog = new $_GET["type"]();
				$result = $dialog->execute();
				echo json_encode($result);
				break;
			}
		}
	}