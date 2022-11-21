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

	
		$file1 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\messages\\'.$_POST['file']; 
		
		//$sql3 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where filename!='' and filename not like '%_signed%' and revisionId=".$_POST['aa'].")"; 
		//$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 3".mysql_error());
		//while ($row3 = mysqli_fetch_array($rslt3, MYSQLI_BOTH)){
			//$file1 = 'C:\xampp\htdocs\directorSign\uploads\\'.$row3['filename'];     //teleutaio arxeio
		//}
		if (file_exists($file1)){
			echo "messages/".$_POST['file'];
		}
		else{
			echo "//10.142.49.10/externaldisk/messages".$_POST['file'];
		}
		
?>