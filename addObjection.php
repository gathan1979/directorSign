<?php
	session_start();
	include 'login.php';
	if (!isset($_SESSION['user'])){
		header('Location: index.php');
	}
	$error = 0;
	echo "1";
	include 'connection1.php';	
	mysqli_query($con,"set names utf8");
	$erotima = "insert into objections (userId,documentId,comment) values (".$_SESSION['aa_user'].",".$_GET['aa'].",'".$_GET['objectionComment']."');";
	$result = mysqli_query($con,$erotima);	
	if ($result == false) {
		$rmsg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
	}
?>