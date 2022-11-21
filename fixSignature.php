<?php
	session_start();
	set_time_limit(120); //to scriptaki diarkei max 2 lepta

	include 'connection1.php';	
	mysqli_query($con,"set names utf8");	
	
	//echo $_GET['aa'];	
	$otp = $_GET['otp'];

	$sql = "SELECT filename,aa,aped,dep,userId from filestobesigned where nextLevel=0 and revisionId=".$_GET['aa'];
	
	$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysqli_error());
	$row = mysqli_fetch_array($rslt, MYSQLI_BOTH);

	//echo "aa =".$row['aa']."  ";
	//$time_start = microtime(true);
	//$command = 'java -jar "c:\xampp\htdocs\directorSign\mindigital_dmaked_pub.jar" th.mardiris Laker17! '.$otp.' "uploads\\'.iconv("UTF-8", "CP1253",$row[0]).'"';
	if (file_exists("uploads/".$row['filename'])){
		$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$_SESSION['userMindigital'].' '.$_SESSION['passMindigital'].' '.$otp.' "uploads\\'.iconv("UTF-8", "UTF-8",$row['filename']).'"';
	}
	else if (file_exists($_SESSION['externalDiskSignature'].$row['filename'])){
		$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$_SESSION['userMindigital'].' '.$_SESSION['passMindigital'].' '.$otp.' "'.$_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$row['filename']).'"';
	}
	//$command = 'java -jar "c:\xampp\htdocs\directorSign\mindigital_dmaked_pub.jar"  '.$otp.' "e:\\digitalSignature\\directorSign\\'.iconv("UTF-8", "CP1253",$row[0]).'"';
	//echo $command;
	//exit();
	exec($command,$output3);
	if (strpos(end($output3), 'succesfully') !== false){
		$sql10 = "update filestobesigned set aped=1 where nextLevel=0 and revisionId=".$_GET['aa'];
		$rslt10= mysqli_query($con,$sql10) or die ("apotyxia erotimatas 1".mysqli_error());
		$row10 = mysqli_fetch_array($rslt10, MYSQLI_BOTH);
		
		echo "Το αρχείο ".$row['filename']." έχει υπογραφεί με επιτυχία";
		$path_parts = pathinfo($row['filename']);
		$newSigned= $path_parts['filename']."_signed.".$path_parts['extension'];
		$oldRenamed= $path_parts['filename']."_sch.".$path_parts['extension'];
		if (file_exists("uploads/".$newSigned)){
			if (rename("uploads/".$row[0],"uploads/".$oldRenamed)){
				rename("uploads/".$newSigned,"uploads/".$row[0]);
			}
		}
		else if (file_exists($_SESSION['externalDiskSignature'].$newSigned)){
			if (rename($_SESSION['externalDiskSignature'].$row['filename'],$_SESSION['externalDiskSignature'].$oldRenamed)){
				rename($_SESSION['externalDiskSignature'].$newSigned,$_SESSION['externalDiskSignature'].$row['filename']);
			}
		}
	}
	else{
		echo "Η υπογραφή του αρχείου ".$row['filename']." απέτυχε";
	}		
	//break;  // διώξε σχόλιο για να τρέξει πέραν της μιας φοράς
?>
