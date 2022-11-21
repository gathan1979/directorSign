<?php
	include 'connection1.php';

	session_start();
	include 'login.php';
	if (!isset($_SESSION['user'])){
		//if ($_SESSION['privilege']=="1") {
			header('Location: index.php');
		//}
		//else{
		//	echo "Access restricted";
		//}
	}	
	mysqli_query($con,"set names utf8");
	$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('','".$_SERVER['REMOTE_ADDR']."',-2,".$_SESSION['aa_user'].",".$_GET['aa'].",'".$_GET['comment']."');";
	//echo $erotima;
	$result = mysqli_query($con,$erotima);	
	if ($result == false) {
		$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
	}
	else {
		$msg.= "Καταχώρηση επιτυχημένη. ";
	}
	
	mysqli_close($con);
	$newURL ="headmaster1.php";
	header('Location: '.$newURL);
?>