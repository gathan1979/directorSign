<?php
	session_start();
	include 'connection.php';
	mysqli_query($con,"set names utf8");
	$file = $_GET['contents'];
	$lines = explode('*',$file);
	$res = true;
	foreach($lines as $line){
	  //echo $line."----";
	  $arr = explode('@', $line);
	  if (sizeof($arr)==2){
		  $erotima = "insert into attendace (userId,logTime) values (".$arr[0].",'".$arr[1]."');";
		  //echo $erotima;
		  //echo $arr[0]." ".$arr[1]."**";
		  $result = mysqli_query($con,$erotima);
		  if ($result == false) {
			  $res = false;
		  }
	  }
	}  
	mysqli_close($con);
	if ($res == false) {
		echo "Αποτυχία Καταχώρησης";
	}
	else {
		echo "Καταχώρηση Επιτυχής";
	}
?>