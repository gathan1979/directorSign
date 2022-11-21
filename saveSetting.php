<?php
	if (session_status() == PHP_SESSION_NONE) {
		session_start();
	}
	
	include 'connection.php';
	mysqli_query($con,"SET NAMES 'UTF8'");
	$erotima2 = "INSERT INTO usersettings (userField,setting,value) VALUES (".$_POST['user'].",'".$_POST['setting']."','".$_POST['value']."')
		ON DUPLICATE KEY UPDATE value='".$_POST['value']."'";
			echo $erotima2;
	$result2 = mysqli_query($con,$erotima2) or die ("database select error - remove");
	//$row2 = mysqli_fetch_array($result2, MYSQLI_BOTH);

	if ($result2 ){	
			$_SESSION[$_POST['setting']]=$_POST['value'];
		echo "Αλλαγή ρυθμίσεων επιτυχής";
		
	}
	else{
		echo "Σφάλμα στην αλλαγή ρυθμίσεων";
	}
	
?>