<!DOCTYPE html>
	<html>
	<head>
		<title>Link</title>
		<script src="js/jquery-1.11.1.min.js"></script>
		<script src="js/global.js"></script>
		<script src="js/LinkAI.js"></script>
		<script src="js/dialog/Dialog.js"></script>
		<link rel="stylesheet" href="css/global.css">

		<?php 
			$files = scandir("js/dialog");

			foreach($files as $file) {
				if ($file != "." && $file != ".." && $file != "Dialog.js") {
					?>
					<script src="js/dialog/<?= $file ?>"></script>
					<script>
						linkDialogs.push(new <?= str_replace(".js", "", $file) ?>());
					</script>
					<?php
				}
			}
		?>
	</head>
	<body>
		<canvas id="canvas"></canvas>
		<div id="dialogs"></div>
		<div id="manual-options">
			<a href="javascript:void(0)" id="manual-input-link" onclick="showManualInput()">[Show manual input]</a>
			<div style="display:none" id="manual-input-section">
				<textarea id="manual-input"></textarea>
			</div>
		</div>
	</body>
</html>