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
		$obj = imap_status($imap,"{mail.sch.gr}INBOX",SA_UIDNEXT);
		echo $obj->uidnext;
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
			$obj = imap_status($imap,"{mail.sch.gr}INBOX",SA_UIDNEXT);
			echo $obj->uidnext;
			//echo "outcome 1";
			//imap_errors();
			imap_close($imap );
		}
		
	}
	
	

?>