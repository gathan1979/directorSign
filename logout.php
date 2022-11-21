<?php
	session_start();
	include 'connection.php';
	$res=mysqli_query($con,'insert into `logout` (userId, fromIP) values ('.$_SESSION['aa_user'].",'".$_SERVER['REMOTE_ADDR']."');") or die ('login import to database error');
	session_destroy();
	session_unset();
	header('Location: index.php');
	mysqli_close($con);
	
?>