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
	include 'findLevels.php';
	$startDep = $_GET['dep'];
	$prev=previousLevel($startDep, $_SESSION['department']);
	mysqli_query($con,"set names utf8");
	$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('','".$_SERVER['REMOTE_ADDR']."',".$prev.",".$_SESSION['aa_user'].",".$_GET['aa'].",'Αυτόματη επιστροφή εγγράφου');";
	$result = mysqli_query($con,$erotima);	
	if ($result == false) {
		$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
	}
	else {
		$msg.= "Καταχώρηση επιτυχημένη. ";
	}
	
	mysqli_close($con);
	//$newURL = "startPage.php";
	$newURL =$_SERVER['HTTP_REFERER'];
	header('Location: '.$newURL);
?>