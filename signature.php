<?php
		ini_set('max_execution_time', 120);
		@session_start();
		include 'login.php';
		if (!isset($_SESSION['user'])){
			//if ($_SESSION['privilege']=="1") {
				header('Location: index.php');
			//}
			//else{
			//	echo "Access restricted";
			//}
		}
		$error = 0;
		//echo "--1-- :";
		include 'connection1.php';	
		include 'findLevels.php';
	    mysqli_query($con,"set names utf8");	
		//echo $_GET['aa'];		
	    $sql = "SELECT filename,aped,dep,exactCopySigner from filestobesigned where aa=".$_GET['aa'];
		//echo $sql;
	    $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
	    $row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$file = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.$row['filename'];  
		$ext = 0;
		if (!file_exists($file)){
			if(file_exists($_SESSION['externalDiskSignature'].$row['filename'])){
				$file = $_SESSION['externalDiskSignature'].$row['filename'];     //arxiko arxeio
				$ext = 1;
			}
			else{
					
			}
		}
		$aped = $row['aped'];
		$dep = $row['dep'];
		//echo "----".$file."---";
		//tha elegkso na vro to teleutaio pou anevike sxetiko an iparxei
		mysqli_query($con,"set names utf8");
		$sql2 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where nextLevel>0 and  filename!='' and revisionId=".$_GET['aa'].")"; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error());
		while ($row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH)){
			$file = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.$row2['filename'];     //teleutaio arxeio
			if (!file_exists($file)){
				$file = $_SESSION['externalDiskSignature'].$row2['filename'];   
				$ext = 1;
			}
		}
		//echo "----".$file."---";
		//$fileType = substr(strrchr($row['filename'],'.'),1);
		$path_parts = pathinfo($file);
		//echo "extension ".$path_parts['extension']."<br>";
		//echo "filename ".$path_parts['filename']."<br>";
		$arg1 = $path_parts['filename'].".".$path_parts['extension'];
		$arg2 = $path_parts['filename'].'.pdf';

		// 13-01-2020 
		
		//  13-01-2020-->
		
		//------------27-09-2022
		// if ($isMindigital){
			// $arg3 = $path_parts['filename'].'_MD_Exact_Copy.pdf';   //signed name
		// }
		// else{
			// $arg3 = $path_parts['filename'].'_signed.pdf';   //signed name
		// }
		//------------27-09-2022
		$arg3 = $path_parts['filename'].'_signed.pdf';
		
		//echo "@".$arg1."@".$arg2."@".$arg3."@";
		//if($path_parts['extension'] == "doc" || $path_parts['extension'] =="docx" || $path_parts['extension'] =="DOC" || $path_parts['extension'] =="DOCX" || $path_parts['extension'] =="xlsx" || $path_parts['extension'] =="xls" || $path_parts['extension'] =="XLSX"){
			//$convertToPdf='"C:\Program Files (x86)\Microsoft Office\Office12\winword.exe" "'.$file.'" /mFilePrintDefault /mFileExit /q /n';
			//$convertToPdf = 'C:\\OfficeToPDF\\OfficeToPDF.exe "C:\\xampp\\htdocs\\directorSign\\uploads\\'.$path_parts['filename'].".".$path_parts['extension'].'" "C:\\xampp\\htdocs\\directorSign\\uploads\\'.$path_parts['filename'].'.pdf"';
			
			//$convertToPdf = 'sign.bat "JOHN.doc" "JOHN.pdf"';
			//$convertToPdf = 'sign.bat "'.iconv("UTF-8", "UTF-8",$arg1).'" "'.iconv("UTF-8", "UTF-8",$arg2).'"';
			//$convertToPdf = 'OfficeToPDF.exe "uploads\\'.iconv("UTF-8", "UTF-8",$arg1).'" "uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'"';
			//echo $convertToPdf; 
			//$output="";
			//$output = shell_exec($convertToPdf);
			//echo $output;
			//if ($output="" || $output==null){
				//$output="Δημιουργία PDF επιτυχής";
			//}
			//else{
				//$output="Παρουσιάστηκε πρόβλημα στη δημιουργία του PDF";
			//}
		//}
		//else{
			//$output="Το αρχείο είναι σε μορφή PDF ήδη";
		//}
		
		echo " --2-- : ";
		$outFile="";
		if ($isMindigital){
			//$otp = -100;
			//include 'getLastOTP.php';
			if ($ext){
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$_SESSION['userMindigital'].' '.$_SESSION['passMindigital'].' '.$otp.' "uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'"';
			}
			else{
				$command = 'java -jar "'.$_SESSION['mindigital_dmaked'].'" '.$_SESSION['userMindigital'].' '.$_SESSION['passMindigital'].' '.$otp.' "uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'"';
			}
			$outFile= "uploads\\".iconv("UTF-8", "UTF-8",$arg2);
		}
		else{
			if ($ext){
				$command = 'java -Duser.language=en  -jar "'.$_SESSION['jsignpdf_jar'].'" "'.$_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$arg2).'" -a  -ka "'.$_SESSION['signature'].'" -kst WINDOWS-MY  --tsa-server-url https://timestamp.aped.gov.gr/qtss  -d "'.$_SESSION['externalDiskSignature'].'"';
				$outFile = $_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$arg2);
			}
			else{
				$command = 'java -Duser.language=en -jar "'.$_SESSION['jsignpdf_jar'].'" "c:\xampp\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'" -a  -ka "'.$_SESSION['signature'].'" -kst WINDOWS-MY  --tsa-server-url https://timestamp.aped.gov.gr/qtss  -d "c:\xampp\htdocs\directorSign\uploads"';
				$outFile = "uploads\\".iconv("UTF-8", "UTF-8",$arg2);
			}
		}
		//$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "'.$_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'" -a  -ka "'.$_SESSION['signature'].'" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';

		echo $command;
		exec($command,$output2);
		//$output2 = shell_exec($command);
		var_dump($output2);
		//exit(1);

		$newName = str_replace("_signed","",$path_parts['filename']);
		$newName = str_replace("_MD_Exact_Copy","",$newName);

		echo "dep=".$dep." and #session_department = ".$_SESSION['department'];
		$diff = levelsDiff($dep,$_SESSION['department']);
		
		echo "accessLevel =".$_SESSION['accessLevel'];
		for ($i=0;$i<=$diff;$i++){
			$newName = $newName .'_signed';
		}
		$newName = $newName .'.pdf';
		//if ($_SESSION['accessLevel']==3){
			//$newName = $newName .'_signed_signed_signed.pdf';
		//}
		echo $arg3." ----".$newName;
		if ($ext){
			$basedir = $_SESSION['externalDiskSignature'];
		}
		else{
			$basedir = $_SERVER['DOCUMENT_ROOT'] . "\\directorSign\\uploads\\";
		}
		
		if (file_exists($basedir.iconv("UTF-8", "UTF-8",$arg3))){
			rename ($basedir.iconv("UTF-8", "UTF-8",$arg3), $basedir.iconv("UTF-8", "UTF-8",$newName));
			//iconv("UTF-8", "UTF-8",$arg3)
			echo "</br>--- 2.5 ----";
			//$newURL =$_SERVER['HTTP_REFERER'];
			$newURL ="/directorSign/";
			$newURL = preg_replace('/\?.*/', '', $newURL);  // url xoris oristmata
			$rmsg = end($output2);
			//$rmsg = var_dump($output2);
			echo $rmsg;
			
			// -------- 23-08-2021 
			//if ($_SESSION['accessLevel'] == 1 && $aped==1){
				//include "createErmisSendFile.php";
			//}
			echo "--------------------<br>";
			var_dump(end($output2));
			//echo iconv("utf-8", "iso-8859-1",end($output2));
			//if (strpos(end($output2), 'succesfully') !== false){
				echo "2.6";
				mysqli_query($con,"set names utf8");
				if (isset($type)){
					$sqlcomment = 'Αυτόματη Προώθηση. Το έγγραφο έχει υπογραφεί ψηφιακά';
				}
				else{
					$sqlcomment = 'Το έγγραφο έχει υπογραφεί ψηφιακά';
				}
				mysqli_query($con,"set names utf8");	
				$sql9 = "SELECT last_parent from departmentstypes where aa=".$dep;
				$rslt9= mysqli_query($con,$sql9) or die ("apotyxia erotimatas 1".mysql_error());
				$row9 = mysqli_fetch_array($rslt9, MYSQLI_BOTH);
				$last_parent = $row9[0];
				$sql10 = "SELECT parent from departmentstypes where aa=".$_SESSION['department'];
				$rslt10= mysqli_query($con,$sql10) or die ("apotyxia erotimatas 1".mysql_error());
				$row10 = mysqli_fetch_array($rslt10, MYSQLI_BOTH);
				if ($_SESSION['accessLevel']=="1"){
					if ($last_parent == $_SESSION['department']){
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',0,".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
					}
					else{
						if(!$isLast){
							$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',".($row10[0]).",".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
						}
						else{
							$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',0,".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
						}
					}
				}
				else{
					$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',".$_SESSION['department'].",".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
				}
				$result = mysqli_query($con,$erotima);	
				if ($result == false) {
					$rmsg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
				}
				else {
					$rmsg.= "Καταχώρηση επιτυχημένη. ";
					if($path_parts['extension'] == "doc" || $path_parts['extension'] =="docx" || $path_parts['extension'] =="DOC" || $path_parts['extension'] =="DOCX"){
						//unlink("uploads\\".iconv("UTF-8", "UTF-8",$arg2)); // diafrafi prosorinou pdf
					}
					//efoson evale kai o teleutaios tin ipografi tou tha diagrafoun ta endiamesa arxeia
					 if (($last_parent == $_SESSION['department'])||$isLast){
						$sql4 = "SELECT * from filestobesigned where filename like '%_signed%' and nextLevel!=0 and revisionId=".$_GET['aa'];
						$rslt4= mysqli_query($con,$sql4) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row4 = mysqli_fetch_array($rslt4, MYSQLI_BOTH)){
							if ($ext){
								unlink($_SESSION['externalDiskSignature'].iconv("UTF-8", "UTF-8",$row4['filename']));
							}
							else{
								unlink("uploads\\".iconv("UTF-8", "UTF-8",$row4['filename']));
							}
							$sql5 = "Update filestobesigned set filename='' where aa=".$row4['aa'];
							$rslt5= mysqli_query($con,$sql5) or die ("apotyxia erotimatas 1".mysql_error());
						}
						echo "2.8"; //allagi stis 03-06-2020 prostethike to if kai to deutero skelos
						if (is_null($row['exactCopySigner'])){
							$sql6 = "SELECT signature from signpasswords where accessLevel=1 and prime=1 and department=".$dep;
						}
						else{
							$sql6 = "SELECT signature from signpasswords where signature<>'' and  attendanceId=".$row['exactCopySigner'];	
						}
						  //---------------------------------------------------------------------
						echo '<br><br> SQL6    '.$sql6;
						$rslt6= mysqli_query($con,$sql6) or die ("apotyxia erotimatas 1".mysql_error());
						$sigResult = mysqli_fetch_array($rslt6, MYSQLI_BOTH);
						//include "createSendFile.php";
						
					 }
					
				}
				
				mysqli_close($con);
			//}
			
		}
		else{
			$rmsg = " Αποτυχία ψηφιακής υπογραφής εγγράφου. Ελέγξτε τη σύνδεση σας στο ίντερνετ!!!";
			$error = 1;
		}
		
		
		if ($error){
			//header('Location: '.$newURL."?rmsg=".$rmsg);
		}		
		else{
			//header('Location: '.$newURL);
		}
	    