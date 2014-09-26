<?php 

	class NewsDialog {

		private function stripSpecialChars($text) {
			$text = nl2br($text);
			$text = strip_tags($text);
			$text = trim($text);
			return $text;
		}

		public function execute() {
			//$result = file_get_contents("http://rss.canada.com/get/?F297");
			$xml = new SimpleXMLElement("http://rss.cbc.ca/lineup/topstories.xml", NULL, TRUE);
			
			$result = array();
			
			foreach ($xml->channel->item as $item) {
				$result[] = array(
					"title" => "" . $this->stripSpecialChars($item->title),
					"description" => "" . $this->stripSpecialChars($item->description),
					"link" => "" . $item->link);
			}
			
			return $result;
		}	
	}

