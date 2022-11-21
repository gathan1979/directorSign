<?php
	include '../../connection2.php';
	mysqli_query($con,"SET NAMES 'UTF8'");
	$result = "";
	
	$page = $_GET['page'];
	$posX = $_GET['posX'];
	$posY = $_GET['posY'];
	$id = $_GET['id'];
	$sql2 = "insert into sigposition(page,posX,posY,id) values (".$page.",".$posX.",".$posY.",".$id.")";
	$rslt2= mysqli_query($con,$sql2);
	mysqli_close($con);
	if ($rslt2 == false) {
		echo "error";
	}
	else {
		echo "success";
	}

?>