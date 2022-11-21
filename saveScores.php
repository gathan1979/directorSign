<?php
	session_start();
	include 'connection.php';
	mysqli_query($con,"SET NAMES 'UTF8'");
	$sql2 = "insert into games(game,user,score) values ('tetris','".$_SESSION['user']."',".$_POST['score'].")";
	$rslt2= mysqli_query($con,$sql2);

?>