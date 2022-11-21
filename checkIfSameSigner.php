<?php
	include 'connection1.php';	
	mysqli_query($con,"set names utf8");	
	
	$error = 0;
	$sql = "SELECT userId from filestobesigned where nextLevel=0 and revisionId=".$_POST['aa'];
	$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysqli_error());
	$row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
	if ($row !== false){
		if ($row['userId'] == $_SESSION['aa_user']){
			echo 1;	
		}
		else{
			echo 0;	
		}
	}
	else{
		echo -1;	
	}
	

?>