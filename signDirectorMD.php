<?php
	session_start();
	set_time_limit(3600); //to scriptaki diarkei max 30 lepta

	include 'connection1.php';	
	mysqli_query($con,"set names utf8");	
	
	//echo $_GET['aa'];		
	$sql = 'SELECT filename,aa from filestobesigned where nextLevel=0 and userId=45 and aped=0  ';
	//$sql = 'SELECT filename,aa from filestobesigned where nextLevel=0 and userId=45 and `aa`>58683';
	//echo $sql;
	$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1 ".mysqli_error());
	$imap = @imap_open("{mail.sch.gr}","thmardiris","L9@");
	$error = 0;
	while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
		$otp = -100;
		//$time_start = microtime(true);
		include 'getLastOTP_Director.php';
		//$time_end = microtime(true);
		//$time = $time_end - $time_start;
		//echo " Χρόνος λήψης email : ".$time."sec ";
		echo "aa =".$row[1]."  ";
		if ($getOtpResult == 0){
			//$time_start = microtime(true);
			$command = 'java -jar "c:\xampp\htdocs\directorSign\mindigital_dmaked_pub.jar" th.mardiris La7! '.$otp.' "uploads\\'.iconv("UTF-8", "CP1253",$row[0]).'"';
			//$command = 'java -jar "c:\xampp\htdocs\directorSign\mindigital_dmaked_pub.jar" th.mardiris 12345678 '.$otp.' "e:\\digitalSignature\\directorSign\\'.iconv("UTF-8", "CP1253",$row[0]).'"';
			echo $command;
			flush();
			ob_flush();
			exec($command,$output3);
			if (strpos(end($output3), 'succesfully') !== false){
				echo "<span style='color:green;'>Το αρχείο ".$row[0]." έχει υπογραφεί με επιτυχία (".$getOtpResultDesc.")</span><br>";
				$path_parts = pathinfo($row[0]);
				$newSigned= $path_parts['filename']."_signed.".$path_parts['extension'];
				$oldRenamed= $path_parts['filename']."_sch.".$path_parts['extension'];
				if (file_exists("uploads/".$newSigned)){
					if (rename("uploads/".$row[0],"uploads/".$oldRenamed)){
						rename("uploads/".$newSigned,"uploads/".$row[0]);
					}
				}
				// if (file_exists("e:\\digitalSignature\\directorSign\\".$newSigned)){
					// if (rename("e:\\digitalSignature\\directorSign\\".$row[0],"e:\\digitalSignature\\directorSign\\".$oldRenamed)){
						// rename("e:\\digitalSignature\\directorSign\\".$newSigned,"e:\\digitalSignature\\directorSign\\".$row[0]);
					// }
				// }
				$error = 0;
			}
			else{
				echo "<span style='color:red;'>Η υπογραφή του αρχείου ".$row[0]." απέτυχε</span><br>";
				$error++;
				if ($error == 5) {
					exit("πολλές αποτυχημένες προσπάθειες. Συνδεθείτε στην online εφαρμογή για να μην κλειδώσετε το λογαριασμό σας");
				}
			}		
			//break;  // διώξε σχόλιο για να τρέξει πέραν της μιας φοράς
		}	
		else {
			echo $getOtpResultDesc;
			exit(2);
		}
		flush();
		ob_flush();
	}
	imap_close($imap);
	
	function mime_header_decode($header) {
        $source = imap_mime_header_decode($header);
        //result[] = new result;
        //$result[0]->text='';
        //$result[0]->charset='ISO-8859-1';
		//$result[0]->charset=detect_charset($source[$j]->text);
		$str = "";
        for ($j = 0; $j < count($source); $j++ ) {
           $element_charset =  ($source[$j]->charset == 'default') ? 'ISO-8859-1' : $source[$j]->charset;
			 if ($element_charset == '' || $element_charset == null) {
				$element_charset = 'ISO-8859-1';

			}
			if (($element_charset =="UTF-8")||($element_charset =="utf-8")){
				//$element_converted = ConvertToUTF8($source[$j]->text);
				$element_converted = $source[$j]->text;					
            }
			else{
				$element_converted = iconv($element_charset, 'UTF-8', $source[$j]->text);
				if (!$element_converted){
					//return "error in mail ".$source[$j]->text;
					//continue;
				}
			}
			$result[$j] = new stdClass();
            $result[$j]->text = $element_converted;
            $result[$j]->charset = 'UTF-8';
			$str .= $result[$j]->text;
        }
        return $str;

    }
	
	function getLastOTP($imap, $nextuid){
		$OTP = -100;
		$MC = imap_check($imap);
		$lastMessage = $MC->Nmsgs;
		$firstMessage = $MC->Nmsgs-5;
		
		//$info =array_reverse(imap_fetch_overview($imap,"{$nextuid}:*",FT_UID));
		$info =array_reverse(imap_fetch_overview($imap,"{$firstMessage}:{$lastMessage}"));
		//echo "αριθμός μηνυμάτων για αναζήτηση :".sizeof($info);
		$i=0;
		$lastUidSelected = 0;
		foreach ($info as $msg) {
			if ($msg->uid < $nextuid){
				//echo " μικρότερο uid ".$msg->uid."</br>";
				continue;	
			}
			$i++;
			//echo $i;
			if(mime_header_decode($msg->subject) == "Κωδικός Ψηφιακής Υπογραφής μιας χρήσης"){	
				if ($msg->uid > $lastUidSelected){
					$lastUidChecked = $msg->uid;
					$text = imap_base64(imap_body($imap, $msg->msgno));
					$text = explode("<br>",$text);
					$text = $text[0];
					$text = explode(" ",$text);
					$text = end($text);
					//echo "getting OTP :".strip_tags($text);
					$OTP=strip_tags($text);
				}
			}
		}
		return $OTP;
	}
	

	
?>
