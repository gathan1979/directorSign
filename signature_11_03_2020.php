<?php
		ini_set('max_execution_time', 120);
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
		$error = 0;
		echo "1";
		include 'connection1.php';	
	    mysqli_query($con,"set names utf8");	
		//echo $_GET['aa'];		
	    $sql = "SELECT filename from filestobesigned where aa=".$_GET['aa'];
		echo $sql;
	    $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
	    $row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$file = 'C:\xampp2\htdocs\directorSign\uploads\\'.$row['filename'];     //arxiko arxeio
		//echo "----".$file."---";
		//tha elegkso na vro to teleutaio pou anevike sxetiko an iparxei
		mysqli_query($con,"set names utf8");
		$sql2 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where nextLevel<4 and  filename!='' and revisionId=".$_GET['aa'].")"; 
		$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error());
		while ($row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH)){
			$file = 'C:\xampp2\htdocs\directorSign\uploads\\'.$row2['filename'];     //teleutaio arxeio
		}
		//echo "----".$file."---";
		//$fileType = substr(strrchr($row['filename'],'.'),1);
		$path_parts = pathinfo($file);
		echo "extension ".$path_parts['extension']."<br>";
		echo "filename ".$path_parts['filename']."<br>";
		$arg1 = $path_parts['filename'].".".$path_parts['extension'];
		$arg2 = $path_parts['filename'].'.pdf';
		
		// 13-01-2020 
		
		//  13-01-2020-->
		
		$arg3 = $path_parts['filename'].'_signed.pdf';   //signed name
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
		echo " --2";
		$command = 'java -jar "C:\Program Files (x86)\JSignPdf\JSignPdf.jar" "C:\xampp2\htdocs\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$arg2).'" -a  -ka "'.$_SESSION['signature'].'" -kst WINDOWS-MY  --tsa-server-url http://timestamp.ermis.gov.gr/TSS/HttpTspServer --tsa-policy-oid 1.3.6.1.4.1.601.10.3.1 -d "uploads\\"';
		echo $command;
		exec($command,$output2);
		$newName = str_replace("_signed","",$path_parts['filename']);
		if ($_SESSION['accessLevel']==1){
			$newName = $newName .'_signed.pdf';
		}
		else if ($_SESSION['accessLevel']==2){
			$newName = $newName .'_signed_signed.pdf';
		}
		else if ($_SESSION['accessLevel']==3){
			$newName = $newName .'_signed_signed_signed.pdf';
		}
		echo $arg3." ----".$newName;
		$basedir = $_SERVER['DOCUMENT_ROOT'] . "\\directorSign\\uploads\\";
		rename ($basedir.iconv("UTF-8", "UTF-8",$arg3), $basedir.iconv("UTF-8", "UTF-8",$newName));
		//iconv("UTF-8", "UTF-8",$arg3)
		echo "</br>--- 2.5 ----";
		$newURL =$_SERVER['HTTP_REFERER'];
		$newURL = preg_replace('/\?.*/', '', $newURL);  // url xoris oristmata
		$rmsg = end($output2);
		$rmsg = var_dump($output2);
		echo $rmsg;
		if (strpos(end($output2), 'succesfully') !== false){
			echo "2.6";
			mysqli_query($con,"set names utf8");
			if (isset($type)){
				$sqlcomment = 'Αυτόματη Προώθηση. Το έγγραφο έχει υπογραφεί ψηφιακά';
			}
			else{
				$sqlcomment = 'Το έγγραφο έχει υπογραφεί ψηφιακά';
			}
			mysqli_query($con,"set names utf8");					 
			$sql10 = "SELECT bypass from departmentstypes where aa=".$_SESSION['department'];
			$rslt10= mysqli_query($con,$sql10) or die ("apotyxia erotimatas 1".mysql_error());
			$row10 = mysqli_fetch_array($rslt10, MYSQLI_BOTH);
			if ($row10['bypass']){
				$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',".($_SESSION['accessLevel']+2).",".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
			}
			else{
				$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,revisionId,comments) values ('".$newName."','".$_SERVER['REMOTE_ADDR']."',".($_SESSION['accessLevel']+1).",".$_SESSION['aa_user'].",".$_GET['aa'].",'".$sqlcomment."');";
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
				//efoson evale kai o perifereiakos tin ipografi tou tha diagrafoun ta endiamesa arxeia
				 if ($_SESSION['accessLevel'] == 3){
					$sql4 = "SELECT * from filestobesigned where filename like '%_signed%' and nextLevel!=4 and revisionId=".$_GET['aa'];
					$rslt4= mysqli_query($con,$sql4) or die ("apotyxia erotimatas 1".mysql_error());
					while ($row4 = mysqli_fetch_array($rslt4, MYSQLI_BOTH)){
						unlink("uploads\\".iconv("UTF-8", "UTF-8",$row4['filename']));
						$sql5 = "Update filestobesigned set filename='' where aa=".$row4['aa'];
						$rslt5= mysqli_query($con,$sql5) or die ("apotyxia erotimatas 1".mysql_error());
					}
					echo "2.8";
					$sql6 = "SELECT signature from signpasswords where accessLevel=1 and prime=1 and department in (select department from signpasswords where attendanceId in (select userId from filestobesigned where aa=".$_GET['aa']." ) ) limit 1";
					echo '<br><br> SQL6    '.$sql6;
					$rslt6= mysqli_query($con,$sql6) or die ("apotyxia erotimatas 1".mysql_error());
					$sigResult = mysqli_fetch_array($rslt6, MYSQLI_BOTH);
					include "createSendFile.php";
				 }
				
			}
			
			mysqli_close($con);
		}
		else{
			$rmsg = " Αποτυχία ψηφιακής υπογραφής εγγράφου. Ελέγξτε τη σύνδεση σας στο ίντερνετ!!!";
			$error = 1;
		}
		if ($error){
			header('Location: '.$newURL."?rmsg=".$rmsg);
		}
		else{
			header('Location: '.$newURL);
		}
	    