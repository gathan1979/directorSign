<?php	
	session_start();
	$nextuid = $_GET['nextuid'];
	//unset($_SESSION['userSch']);
	sleep(2);
	if (isset($_SESSION['userSch'])){
		//echo "outcome 2";
		$imap = @imap_open("{mail.sch.gr}",$_SESSION['userSch'],$_SESSION['userPass']);
		if ($imap == false){
			unset($_SESSION['userSch']);
			unset($_SESSION['userPass']);
			echo imap_errors();
			echo "-1";
			//imap_errors();
			exit();
		}
		//include 'getLastOTP.php';
		echo getLastOTP($imap , $nextuid);
		imap_close($imap );
	}
	else{
		$imap = @imap_open("{mail.sch.gr}INBOX",$_POST['username'],$_POST['password']);
		//echo $_POST['username']."===============".$_POST['password'];
		if ($imap == false){
			echo "-1";
			echo imap_errors();
			//imap_errors();
			exit();
		}
		else{
			$_SESSION['userSch'] = $_POST['username'];
			$_SESSION['userPass']= $_POST['password'];
			//include 'getLastOTP.php';
			echo getLastOTP($imap , $nextuid);
			//echo "outcome 1";
			imap_errors();
			imap_close($imap );
		}
	}
	
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
		$OTP = 0;
		
		$info =array_reverse(imap_fetch_overview($imap,"{$nextuid}:*",FT_UID));
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
		return $OTP;
		// na elegso ora minimatos !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
	}

?>