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
	$erotima = "select closed from messages where aa=".$_GET['aa'];
	$result = mysqli_query($con,$erotima);	
	$row = mysqli_fetch_array($result, MYSQLI_BOTH);
	$closed = $row[0];
	
	if ($closed){
		$erotima1 = "update messages set closed=0 where aa=".$_GET['aa'];
	}
	else{
		$erotima1 = "update messages set closed=1 where aa=".$_GET['aa'];
	}
	$result1 = mysqli_query($con,$erotima1);	
	if ($result1 == false) {
		$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
	}
	else {
		$msg.= "Καταχώρηση επιτυχημένη. ";
	}
	
	mysqli_close($con);
	$newURL =$_SERVER['HTTP_REFERER'];
	header('Location: '.$newURL);
?>