<?php
	include 'connection1.php';
	session_start();
	if (!isset($_SESSION['user'])){
		//if ($_SESSION['privilege']=="1") {
			header('Location: index.php');
		//}
		//else{
		//	echo "Access restricted";
		//}
	}
	$temp = $_SESSION['protocolAccessLevel'];
	$tempRole = $_SESSION['protocolRoleName'];
	$_SESSION['protocolAccessLevel'] = $_SESSION['protocolAccessLevel1'];
	$_SESSION['protocolRoleName'] = $_SESSION['protocolRoleName1'];
	$_SESSION['protocolAccessLevel1'] = $temp;
	$_SESSION['protocolRoleName1'] = $tempRole;
	$newURL ="index.php";
	header('Location: '.$newURL);
?>