<?php

	session_start();
	//unset($_SESSION['userSch']);
	if (isset($_SESSION['userSch'])){
		//echo "outcome 2";
		$imap = @imap_open("{mail.sch.gr}",$_SESSION['userSch'],$_SESSION['userPass']);
		if ($imap == false){
			unset($_SESSION['userSch']);
			unset($_SESSION['userPass']);
			imap_errors();
			echo "outcome 0";
			//imap_errors();
			exit();
		}
		include 'getEmails.php';
		imap_close($imap );
	}
	else{
		$imap = @imap_open("{mail.sch.gr}INBOX",$_POST['username'],$_POST['password']);
		//echo $_POST['username']."===============".$_POST['password'];
		if ($imap == false){
			echo "outcome 0";
			imap_errors();
			//imap_errors();
			exit();
		}
		else{
			$_SESSION['userSch'] = $_POST['username'];
			$_SESSION['userPass']= $_POST['password'];
			include 'getEmails.php';
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

?>