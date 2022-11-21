<?php
	//unset($_SESSION['userSch']);
	session_start();
	$getOtpResult = -100;
	$getOtpResultDesc = "";
	$nextuid = 0;
	if (isset($_SESSION['userSch'])){
		//echo "outcome 2";
		
		//--------------------------------GET last email uid----------------------------------------
		
		$imap = @imap_open("{mail.sch.gr}",$_SESSION['userSch'],$_SESSION['userPass']);
		if ($imap == false){
			unset($_SESSION['userSch']);
			unset($_SESSION['userPass']);
			unset($_SESSION['server']);
			imap_errors();
			//echo "-2";
			$getOtpResult = -2; 
			$getOtpResultDesc  ="Αδυναμία σύνδεσης στο email";
		}
		else{
			//$time1 = microtime(true);
			$obj = imap_status($imap,"{mail.sch.gr}INBOX",SA_UIDNEXT);
			//$time2 = microtime(true);
			//echo "last message is :".$obj->uidnext;
			//echo "Χρόνος 1 :".($time2-$time1);
			$nextuid = $obj->uidnext;
			//---------------------------------request OTP ------------------------------------------------
			
			$url = "https://sapi.mindigital-shde.gr/Sign/Api/RequestOTP";
			if (!isset($_SESSION['userMindigital'])){
				$getOtpResult = -1; 
				$getOtpResultDesc  ="Δεν υπάρχουν διαπιστευτήρια mindigital";
			}
			else{
				$fields = [
					"Username" => $_SESSION['userMindigital'], 
					"Password" => $_SESSION['passMindigital']
				];
				$fields_string = http_build_query($fields);
				$ch = curl_init();
				curl_setopt($ch,CURLOPT_URL, $url);
				curl_setopt($ch,CURLOPT_POST, true);
				curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
				curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
				//$time1 = microtime(true);
				$result = curl_exec($ch);
				//$time2 = microtime(true);
				//echo "Χρόνος 2 :".($time2-$time1);
				//var_dump($result);
				$decResult = json_decode($result,true);
				//echo "<br> OTP result : ".$decResult["Outcome"];
				if ($decResult["Outcome"]== 1){
					$getOtpResult = 1; 
					$getOtpResultDesc  ="Το OTP λαμβάνεται μέσω κινητού";
				}
				else if ($decResult["Outcome"] == 9){
					$getOtpResult = 9; 
					$getOtpResultDesc  = $decResult["Description"];
				}
				//--------------------------------GET last OTP from Email---------------------------------------- $decResult["Outcome"] == 0
				else{
					//echo "</br>getting OTP from Email</br>";
					$otp = getLastOTP($imap , $nextuid);
					$i=0;
					//$time1 = microtime(true);
					while ($otp == -100){
						sleep(2);
						$otp = getLastOTP($imap , $nextuid);
						$i++;
						if ($i>20){
							$getOtpResult = 2;
							$getOtpResultDesc = $nextuid;	
						}
					}
					//$time2 = microtime(true);
					//echo "Χρόνος 3 :".($time2-$time1);
					if ($i <20){
						$getOtpResult = 0;
						$getOtpResultDesc = $otp;
						
					}
				}
			}
		}
		imap_close($imap);
	}
	else{
		$getOtpResult = -3; 
		$getOtpResultDesc  ="Δεν υπάρχουν διαπιστευτήρια email";
	}
	$table1 = array();
	array_push($table1,$getOtpResult);
	array_push($table1,$getOtpResultDesc);
	array_push($table1,$nextuid);
	echo json_encode($table1);	
	
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