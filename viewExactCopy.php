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
		$sql2 = "select * from filestobesigned where aa =".$_POST['aa']; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error());
		$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
		
		$file1 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.$row2['filename']; 
		
		
		$sql3 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where filename!='' and filename not like '%_signed%' and revisionId=".$_POST['aa'].")"; 
		$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 3".mysql_error());
		while ($row3 = mysqli_fetch_array($rslt3, MYSQLI_BOTH)){
			$file1 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.$row3['filename'];     //teleutaio arxeio
		}
		$path_parts = pathinfo($file1);	
		
		$file2 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$path_parts['filename']).'_Exact_Copy.pdf';
		if (file_exists($file2)){
			echo "uploads/".$path_parts['filename'].'_Exact_Copy.pdf';
		}
		else{
			//echo "//10.142.49.10/externaldisk/".$path_parts['filename'].'_Exact_Copy.pdf';
			echo "//".$_SESSION['server_address']."/externaldisk/directorSign/".$path_parts['filename'].'_Exact_Copy.pdf';
		}
		
		
?>