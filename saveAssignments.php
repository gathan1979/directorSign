<?php
	session_start();
	include 'connection1.php';
	mysqli_query($con,"SET NAMES 'UTF8'");
	$erotima = "";
	$record;
	if (isset($_POST['postData1'])){
		$vars = json_decode($_POST['postData1'],true);;
		$record = $vars['record'];
		//$erotima = "delete from assignments where record=".$record;
		//$result1 = mysqli_query($con,$erotima) or die ("database read error - show table attachments");
		//$row1 = mysqli_fetch_array($result1, MYSQLI_BOTH);
		unset($vars['record']);
		foreach ($vars as $key => $value) {
			$key = str_replace("user","",$key);
			$erotima = "insert into assignments(record,assignedToUser,assignedBy) values (".$record.",".$key.",".$_SESSION['aa_staff'].")";
			$result1 = mysqli_query($con,$erotima) or die ("database read error - show table attachments");
			//$row1 = mysqli_fetch_array($result1, MYSQLI_BOTH);
			//$sql2 = "insert into history(recordField,userField,actionField) values (".$record.",".$_SESSION['aa_staff'].",'".$erotima."')";
			//$rslt2= mysqli_query($con,$sql2);
		}
		echo $erotima;
		return;
	}
	else{
		echo "no data available";
		return;
	}

	
	mysqli_close($con);
	if ($result1 == true) {
		echo "success";
	}
	else {
		echo $result1." error";
	}
	
?>
	
	


