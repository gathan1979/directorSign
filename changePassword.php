<?php
	session_start();
	include 'connection.php';
	mysqli_query($con,"SET NAMES 'UTF8'");
	mysqli_query($con,"set names utf8");
	$staffAA = $_POST['aa'];
	$attendanceAA = $_POST['aaP'];
	$oldpass = $_POST['oldpasswd'];
	$newpass = $_POST['passwd'];
	$newpass2 = $_POST['passwd2'];
	$query = 'SELECT password FROM `signpasswords` where attendanceId='.$attendanceAA." limit 1";
	$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
	$oldpass=mysqli_real_escape_string($con,strip_tags($oldpass));
	$newpass=mysqli_real_escape_string($con,strip_tags($newpass));
	$newpass2=mysqli_real_escape_string($con,strip_tags($newpass2));
	$k = mysqli_fetch_array($result,MYSQLI_BOTH);	
	if (md5($oldpass."_2_4") == $k['password']){ //o palios kodikos einai sostos
		if ($newpass == $newpass2){	
			$lowercase = preg_match('@[a-z]@', $newpass);
			$number    = preg_match('@[0-9]@', $newpass);
			if(!$lowercase || !$number || strlen($newpass) < 8) {
				echo "ο κωδικός πρέπει να περιέχει αγγλικούς χαρακτήρες, αριθμούς και να έχει συνολικούς χαρακτήρες περισσότερους από 8 ";
			}
			else{
				mysqli_query($con,"SET NAMES 'UTF8'");
				$erotima = "update signpasswords set password='".md5($newpass."_2_4")."' where attendanceId=".$attendanceAA;
				$result = mysqli_query($con,$erotima);
				//echo $erotima;
				mysqli_close($con);
				if ($result == false) {
					echo "αποτυχία αλλαγής κωδικού";
				}
				else {
					echo "επιτυχής αλλαγής κωδικού";
				}
			}
		}
		else{
			echo "οι κωδικοί δεν ταιριάζουν";	
		}
	}
	else{
		echo "ο παλιός κωδικός δεν είναι σωστός";	
	}
?>