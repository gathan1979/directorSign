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
		
		if ($row_cnt > 0 ){
			$rowpos = mysqli_fetch_array($rsltpos, MYSQLI_BOTH);
			$positionSelected = true;
			$posX = $rowpos['posX'];
			$posY = $rowpos['posY'];
			$page = $rowpos['page'];
			$llx = $posX * 590 - 75;
			$urx = $posX * 590 + 75;
			$lly = (1-$posY) * 800 -50;
			$ury = (1-$posY) * 800 + 50;	
		}
		
		//-----------------------------------
	    mysqli_query($con,"set names utf8");					 
	    $sql = "SELECT filename from filestobesigned where aa=".$_GET['aa'];
	    $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
	    $row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$file = 'C:\xampp\htdocs\directorSign\uploads\\'.$row['filename'];     //arxiko arxeio
		//echo "----".$file."---";
		//tha elegkso na vro to teleutaio pou anevike sxetiko an iparxei
		mysqli_query($con,"set names utf8");
		$sql2 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where filename!='' and filename not like '%_signed%' and revisionId=".$_GET['aa'].")"; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error());
		while ($row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH)){
			$file = 'C:\xampp\htdocs\directorSign\uploads\\'.$row2['filename'];     //teleutaio arxeio
		}
		
		
		//echo "----".$file."---";
		//$fileType = substr(strrchr($row['filename'],'.'),1);
		$path_parts = pathinfo($file);
		echo "extension ".$path_parts['extension']."<br>";
		echo "filename ".$path_parts['filename']."<br>";
		$arg1 = $path_parts['filename'].".".$path_parts['extension'];
		$arg2 = $path_parts['filename'].'.pdf';
		$arg3 = $path_parts['filename'].'_signed.pdf';   //signed name
		$arg4 = $path_parts['filename'].'_aped.pdf';
		$arg5 = $path_parts['filename'].'_aped_signed.pdf';
		//echo "@".$arg1."@".$arg2."@".$arg3."@";
		echo "4";
		copy("uploads\\".iconv("UTF-8", "UTF-8",$arg2),"uploads\\".iconv("UTF-8", "UTF-8",$arg4));
		echo "5  <br>";
		echo "deuteri ipografi -- ".$arg2."<br>";
		//if ($_SESSION['department']>0){
			//$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'" -a  --visible-signature --l2-text "'.iconv("UTF-8", "UTF-8",'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}').'" -llx 335 -lly 835 -urx 565 -ury 785 -ka "KOTZATISOGLOU CHARALAMPOS" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		//}
		//else{
			//$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'" -a  --visible-signature --l2-text "'.iconv("UTF-8", "UTF-8",'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}').'" -llx 335 -lly 835 -urx 565 -ury 785 -ka "CHATSIDOU EIRINI" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		//}
		exec('vhui_connect.bat '.$_SESSION['device'],$out);
		pclose(popen("start /B ". 'c:\xampp2\htdocs\directorSign\javatest.bat', "r"));
		//exec('c:\xampp2\htdocs\directorSign\javatest.bat 2>&1');
		//exec("c:\xampp2\php\php.exe c:\xampp2\htdocs\directorSign\test.php > NUL 2> NUL");
		//proc_close (proc_open ('SendKeys.bat',array(),$somefun));
		echo "ΑΝΤΙΓΡΑΦΟ ΑΚΡΙΒΕΣ <br>";
		//exec('SendKeys.bat',$out);
		//$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp2\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg4).'" -a  --font-size 10.0 --visible-signature --l2-text "'.iconv("UTF-8", "UTF-8",'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}').'" -llx 335 -lly 780 -urx 565 -ury 830 -ka "'.$_SESSION['signatureAped'].'"  -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		if ($positionSelected){
			$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp2\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg4).'" -a  --font-size 10.0 --visible-signature --l2-text "'.iconv("UTF-8", "UTF-8",'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}').'" -pg '.$page.' -llx '.$llx.' -lly '.$lly.' -urx '.$urx.' -ury '.$ury.' -ka "IOANNIS CHARISOPOULOS 1" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		}
		else{
			$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp2\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg4).'" -a  --font-size 10.0 --visible-signature --l2-text "'.iconv("UTF-8", "UTF-8",'Ακριβές Αντίγραφο Ψηφιακά υπογεγραμμένο από ${signer}').'" -llx 335 -lly 780 -urx 565 -ury 830 -ka "IOANNIS CHARISOPOULOS 1" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		}	
			
		echo '<br>'.$command.'<br><br><br>';
		exec($command,$output3);
		//exec('SendKeys.bat',$out);
		exec('vhui_disconnect.bat',$out);
		//$command ='vhui_all.bat "'.$_SESSION['device'].'" "'.iconv("UTF-8", "UTF-8",$arg4).'" "'.$_SESSION['signatureAped'].'"';
		//echo $command;
		//exit($command);
		//exec($command,$out);
		//print_r(array_values($output2));
	
		
		if (strpos(end($output3), 'succesfully') !== false){
			echo "6";
			$arg6 = str_replace("_aped_signed","_Exact_Copy",$arg5);	
			echo '<br>';
			echo $arg3." ====".$arg4."====<br>";
			rename("uploads\\".iconv("UTF-8", "UTF-8",$arg5),"uploads\\".iconv("UTF-8", "UTF-8",$arg6));
			echo "7";
			$sqlcomment = 'Ακριβές Αντίγραφο Υπογεγραμμένο από Προϊστάμενο Διοικητικού';
			//if ($_SESSION['department']>0){
				//$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$arg4."','".$_SERVER['REMOTE_ADDR']."',7,".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
			//}
			//else{
				//$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$arg4."','".$_SERVER['REMOTE_ADDR']."',7,".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
			//}
			//if ($result == false) {
				//$rmsg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
			//}
			//unlink("uploads\\".iconv("UTF-8", "UTF-8",$arg2));
		}
		
		//$newURL =$_SERVER['HTTP_REFERER'];
		//$newURL = preg_replace('/\?.*/', '', $newURL);  // url xoris oristmata
		//$rmsg = $output."---".end($output2);
	    //header('Location: '.$newURL."?rmsg=".$rmsg);