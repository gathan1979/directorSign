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
		echo "3";
		include 'connection1.php';	

		//+++ allagi stis 08-07-2020
		$sql = "SELECT filename,aped,dep,exactCopySigner from filestobesigned where aa=".$_GET['aa'];
		echo $sql;
	    $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas ".$sql);
	    $row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$file = 'C:\xampp\htdocs\directorSign\uploads\\'.$row['filename'];     //arxiko arxeio
		$aped = $row['aped'];
		$dep = $row['dep'];
		
		$signerId = str_replace("user","",$_GET['signer']);;
		echo "attendanceId= ".$signerId;
		$sql6 = "SELECT signature from signpasswords where signature<>'' and attendanceId=".$signerId;
		$rslt6= mysqli_query($con,$sql6) or die ("apotyxia erotimatas ".$sql);
		$sigResult = mysqli_fetch_array($rslt6, MYSQLI_BOTH);
		echo "υπογραφή από :".$sigResult['signature'];
		$recreate = true;
		if ($aped == 0) {
			include "createSendFile.php";
		}
		//else{
			
		//}
		//---------------------------------------------------------------------------------------------
		//--- allagi stis 08-07-2020
		
		
		
		//$sql6 = "SELECT signature from signpasswords where accessLevel=1 and prime=1 and department in (select department from signpasswords where attendanceId in (select userId from filestobesigned where aa=".$_GET['aa']." ) ) limit 1";
		//echo '<br><br> SQL6    '.$sql6;
		//$rslt6= mysqli_query($con,$sql6) or die ("apotyxia erotimatas 1".mysql_error());
		//$sigResult = mysqli_fetch_array($rslt6, MYSQLI_BOTH);
		//----------------------------------------------------------------------------
		
		//include "createSendFile.php";
		$newURL =$_SERVER['HTTP_REFERER'];
		$newURL = preg_replace('/\?.*/', '', $newURL);  // url xoris oristmata
		//header('Location: '.$newURL."?aa=".$_GET['aa']);
?>