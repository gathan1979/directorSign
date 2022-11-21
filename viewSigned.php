<?php

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
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql2 = "select filename from filestobesigned where nextLevel=0 and revisionId =".$_POST['aa']; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2");
		$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
		$file2 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.$row2[0];
		if (file_exists($file2)){
			echo "uploads/".$row2[0];
		}
		else{
			//echo "//10.142.49.10/externaldisk/".$row2[0];
			echo "//".$_SESSION['server_address']."/externaldisk/directorSign/".$row2[0];
		}
		
?>