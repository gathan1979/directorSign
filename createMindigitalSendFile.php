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
	    mysqli_query($con,"set names utf8");	
		
		$mindigitalUname = $_SESSION['userMindigital'];
		$mindigitalPass = $_SESSION['passMindigital'];
		
		$ext=0;
		//prostethike stis 15-05-2020 gia na ipografei sti thesi pou theloyme
		$positionSelected = false;
		$sqlpos = "SELECT * from sigposition where aa = (select max(aa) from sigposition where id=".$_GET['aa'].")";
	    $rsltpos= mysqli_query($con,$sqlpos) or die ("apotyxia erotimatas 1".mysql_error());
	    $row_cnt = mysqli_num_rows($rsltpos);
		// -llx 335 -lly 780 -urx 565 -ury 830
		$page = 1;
		$llx = 335;
		$lly = 780;
		$urx = 565;
		$ury = 830;
		
		// if ($row_cnt > 0){
			// $rowpos = mysqli_fetch_array($rsltpos, MYSQLI_BOTH);
			// $positionSelected = true;
			// $posX = $rowpos['posX'];
			// $posY = $rowpos['posY'];
			// $page = $rowpos['page'];
			// $llx = $posX * 590 - 75;
			// $urx = $posX * 590 + 75;
			// $lly = (1-$posY) * 800 -50;
			// $ury = (1-$posY) * 800 + 50;	
		// }
		
		if ($row_cnt > 0){
			$rowpos = mysqli_fetch_array($rsltpos, MYSQLI_BOTH);
			$positionSelected = true;
			$posX = $rowpos['posX'];   // ποσοστό %  (595.44 pixels to A4)
			$posY = $rowpos['posY'];   // ποσοστό %  (841.68 pixels to A4)
			$page = $rowpos['page'];
			$ulx = intval($posX * 595.44 - 72);   // σε dots  με 72dpi
			$uly = intval($posY * 841.68 - 36);	  // σε dots  με 72dpi
		}
		
		//-----------------------------------
	    mysqli_query($con,"set names utf8");					 
	    $sql = "SELECT filename from filestobesigned where aa=".$_GET['aa'];
	    $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
	    $row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$file = 'C:\xampp\htdocs\directorSign\uploads\\'.$row['filename'];     //arxiko arxeio
		if (!file_exists($file)){
			$file = $_SESSION['externalDiskSignature'].$row['filename'];     //arxiko arxeio
			$ext = 1;
		}
		//echo "----".$file."---";
		//tha elegkso na vro to teleutaio pou anevike sxetiko an iparxei
		mysqli_query($con,"set names utf8");
		$sql2 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where filename!='' and filename not like '%_signed%' and revisionId=".$_GET['aa'].")"; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error());
		while ($row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH)){
			$file = 'C:\xampp\htdocs\directorSign\uploads\\'.$row2['filename'];     //teleutaio arxeio
			if (!file_exists($file)){
				$file = $_SESSION['externalDiskSignature'].$row2['filename'];   
				$ext = 1;
			}
		}
		
		
		//echo "----".$file."---";
		//$fileType = substr(strrchr($row['filename'],'.'),1);
		$path_parts = pathinfo($file);
		echo "extension ".$path_parts['extension']."<br>";
		echo "filename ".$path_parts['filename']."<br>";
		$arg1 = $path_parts['filename'].".".$path_parts['extension'];
		$arg2 = $path_parts['filename'].'.pdf';
		$arg3 = $path_parts['filename'].'_signed.pdf';   //signed name
		$arg4 = $path_parts['filename'].'_mindigital.pdf';
		$arg5 = $path_parts['filename'].'_mindigital_signed.pdf';
		$arg6 = $path_parts['filename'].'_exact_copy_temp.pdf';
		$arg7 = $path_parts['filename'].'_exact_copy_temp_signed.pdf';
		//echo "@".$arg1."@".$arg2."@".$arg3."@";
		copy("uploads\\".$arg2,"uploads\\".$arg6);
		//copy("uploads\\".iconv("cp1253", "UTF-8",$arg2),"uploads\\".iconv("cp1253", "UTF-8",$arg6));
		echo "4";
		//copy("uploads\\".iconv("UTF-8", "UTF-8",$arg2),"uploads\\".iconv("UTF-8", "UTF-8",$arg4));
		echo "5  <br>";
		echo "deuteri ipografi -- ".$arg2."<br>";
		
		if ($ext){
			if ($positionSelected){
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$mindigitalUname.' '.$mindigitalPass.' '.$_GET['otp'].' "'.$_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$arg6).'" 1 '.$page.' '.$ulx.' '.$uly;
			}
			else{
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$mindigitalUname.' '.$mindigitalPass.' '.$_GET['otp'].' "'.$_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$arg6).'"';
			}
		}
		else{
			if ($positionSelected){
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$mindigitalUname.' '.$mindigitalPass.' '.$_GET['otp'].' "uploads\\'.iconv("UTF-8", "UTF-8",$arg6).'" 1 '.$page.' '.$ulx.' '.$uly;
			}
			else{
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$mindigitalUname.' '.$mindigitalPass.' '.$_GET['otp'].' "uploads\\'.iconv("UTF-8", "UTF-8",$arg6).'"';;
			}	
		}	
		echo '<br>'.$command.'<br><br><br>';
		exec($command,$output2);
		for ($i=0;$i<sizeof($output2);$i++){
			echo $output2[$i];
		}
		if (strpos(end($output2), 'succesfully') !== false){
			echo "6";
			$arg8 = str_replace("exact_copy_temp_signed","MD_Exact_Copy",$arg7);	
			echo '<br>';
			echo $arg3." ====".$arg4."====<br>";
			rename("uploads\\".$arg7,"uploads\\".$arg8);
			echo "7";
			
			$sql5 = "Update tmpexactcopy set status=1 where revisionId=".$_GET['aa'];
			$rslt5= mysqli_query($con,$sql5) or die ("apotyxia erotimatas update tmpexactcopy");
			unlink("uploads\\".$arg6);	
		}
		
		//$newURL =$_SERVER['HTTP_REFERER'];
		//$newURL = preg_replace('/\?.*/', '', $newURL);  // url xoris oristmata
		//$rmsg = $output."---".end($output2);
	    //header('Location: '.$newURL."?rmsg=".$rmsg);