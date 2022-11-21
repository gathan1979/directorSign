<?php
	session_start();
	if (isset($_SESSION['userMindigital'])){
		unset($_SESSION['userMindigital']);
		unset($_SESSION['passMindigital']);
		echo 0;
	}
	else{
		$_SESSION['userMindigital'] = $_POST['Username'];
		$_SESSION['passMindigital']= $_POST['Password'];
		echo 1;
	}
		
?>