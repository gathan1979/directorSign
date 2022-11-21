<?php

	session_start();
	//unset($_SESSION['userSch']);
	if (isset($_SESSION['userMindigital'])){
		
	}
	else{
		$imap = @imap_open("{mail.sch.gr}INBOX",$_POST['username'],$_POST['password']);
		//echo $_POST['username']."===============".$_POST['password'];
		if ($imap == false){
			echo "outcome 0";
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


?>