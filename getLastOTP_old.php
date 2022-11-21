<?php
	
	$totalMessages = $nextuid;
	$showMessages = 1;
	$firstMessageToShow = $nextuid;
	// fetch message information for message 2
	// and messages 4 to 6
	$OTP = 0;
	
	$info =array_reverse(imap_fetch_overview($imap,$nextuid,FT_UID));
	$i=0;
	foreach ($info as $msg) {
		$i++;
		//echo $i;
		if(mime_header_decode($msg->subject) == "Κωδικός Ψηφιακής Υπογραφής μιας χρήσης"){	
			$text = imap_base64(imap_body($imap, $msg->msgno));
			$text = explode("<br>",$text);
			$text = $text[0];
			$text = explode(" ",$text);
			$text = end($text);
			//echo "getting OTP :".strip_tags($text);
			$OTP=strip_tags($text);
			//echo $msg->uid;
		}
	}
	echo $OTP;
	// na elegso ora minimatos !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
?>