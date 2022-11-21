<?php
	$mboxCheck = imap_check($imap);
	//$ret = imap_clearflag_full($imap,6014,'\\Seen');
	// get the total amount of messages
	$totalMessages = $mboxCheck->Nmsgs;
	$showMessages = 3;
	$firstMessageToShow = $totalMessages-$showMessages+1;
	// fetch message information for message 2
	// and messages 4 to 6
	$info =array_reverse(imap_fetch_overview($imap,$firstMessageToShow.":".$totalMessages));
	echo "<table style='width:100%;font-family:monospace;'>";
	echo "<tr>";
	echo "<th>ΑΠΟ</th>";
	echo "<th>ΘΕΜΑ</th>";
	echo "<th>ΗΜΕΡ.ΑΠΟΣΤ.</th>";
	echo "<th>ΗΜΕΡ.ΠΑΡΑΛ.</th>";
	echo "<th>OTP</th>";
	echo "</tr>";
	foreach ($info as $msg) {
		if(mime_header_decode($msg->subject) == "Κωδικός Ψηφιακής Υπογραφής μιας χρήσης"){	
			echo "<tr>";
			$text = imap_base64(imap_body($imap, $msg->msgno));
			$text = explode("<br>",$text);
			$text = $text[0];
			$text = explode(" ",$text);
			$text = end($text);

			printf("<td>%s</td>", mime_header_decode($msg->from));
			printf("<td>%s</td>", '<a href="'.$_SERVER['HTTP_HOST'].'/nocc-1.9.8/showMail.php?msg='.$msg->msgno.'" target="_blank">'.mime_header_decode($msg->subject).'</a>');
			printf("<td>%s</td>", $msg->date);
			$dateRecieved =  date("Y-m-d H:i:s", $msg->udate);
			printf("<td>%s</td>", mime_header_decode($dateRecieved));
			$sentSize = mime_header_decode($msg->size);
			$sentSize = number_format(($sentSize/1024),0,'.', '');
			//printf("<td>%s</td>",$sentSize." Kb");
			printf("<td>%s</td>",$text);
			echo "</tr>";
		}
	}
	echo "</table>";
?>