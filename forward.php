
<?php
	include 'connection1.php';

	session_start();
	include 'login.php';
	$type = 1;  // autoforward message
	if (!isset($_SESSION['user'])){
		//if ($_SESSION['privilege']=="1") {
			header('Location: index.php');
		//}
		//else{
		//	echo "Access restricted";
		//}
	}	
	mysqli_query($con,"set names utf8");
/* 	$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('','".$_SERVER['REMOTE_ADDR']."',".($_SESSION['accessLevel']+1).",".$_SESSION['aa_user'].",".$_GET['aa'].",'Αυτόματη προώθηση εγγράφου');";
	$result = mysqli_query($con,$erotima);	
	if ($result == false) {
		$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
	}
	else {
		$msg.= "Καταχώρηση επιτυχημένη. ";
	} */
	$isLast  = 0; // Υπογραφή προϊσταμένου ως τελικός υπογράφων
	$isMindigital  = 0; // Υπογραφή με mindigital
	$otp = 0;
	mysqli_close($con);
	//$newURL = "startPage.php";
	$newURL =$_SERVER['HTTP_REFERER'];
	if (isset($_GET['objectionComment'])){
		include 'addObjection.php';
	}
	if (isset($_GET['isLast'])){
		$isLast =$_GET['isLast'];
	}
	if (isset($_GET['mindigital'])){
		$isMindigital =$_GET['mindigital'];
		$otp =$_GET['otp'];
	}
	include 'signature.php';

	//header('Location: '.$newURL);
?>