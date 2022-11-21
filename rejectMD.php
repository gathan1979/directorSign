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
	$erotima = "delete from tmpexactcopy where aa=".$_GET['aa'];
	//echo $erotima;
	$result = mysqli_query($con,$erotima);	
	if ($result == false) {
		echo 0;
	}
	else {
		echo 1;
	}
	
	mysqli_close($con);
?>