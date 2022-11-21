<?php

		if (!isset($_SESSION['user'])){
			//if ($_SESSION['privilege']=="1") {
				header('Location: index.php');
			//}
			//else{
			//	echo "Access restricted";
			//}
		}

		//echo "@".$arg1."@".$arg2."@".$arg3."@";
		//echo "4"; 
		mb_internal_encoding("UTF-8");
		$type = pathinfo($target_file,PATHINFO_EXTENSION);
		if($type == "doc" || $type =="docx" || $type =="DOC" || $type =="DOCX" || $type =="xlsx" || $type =="xls" || $type =="XLSX"){
			//$convertToPdf='"C:\Program Files (x86)\Microsoft Office\Office12\winword.exe" "'.$file.'" /mFilePrintDefault /mFileExit /q /n';
			//$convertToPdf = 'C:\\OfficeToPDF\\OfficeToPDF.exe "C:\\xampp\\htdocs\\directorSign\\uploads\\'.$path_parts['filename'].".".$path_parts['extension'].'" "C:\\xampp\\htdocs\\directorSign\\uploads\\'.$path_parts['filename'].'.pdf"';
			
			//$convertToPdf = 'sign.bat "JOHN.doc" "JOHN.pdf"';
			//$convertToPdf = 'sign.bat "'.iconv("UTF-8", "UTF-8",$arg1).'" "'.iconv("UTF-8", "UTF-8",$arg2).'"';
			$convertToPdf = 'OfficeToPDF.exe "uploads\\'.iconv("UTF-8", "UTF-8",basename($_FILES["selectedFile"]["name"])).'" "uploads\\'.iconv("UTF-8", "UTF-8",pathinfo($target_file,PATHINFO_FILENAME).".pdf").'"';
			//$convertToPdf = 'OfficeToPDF.exe "uploads\\'.basename($_FILES["selectedFile"]["name"]).'" "uploads\\'."preview_".pathinfo($target_file,PATHINFO_FILENAME).".pdf".'"';
			//echo $convertToPdf; 
			//exit;
			$output = shell_exec($convertToPdf);
			//echo $output;
			if ($output="" || $output==null){
				$output="Δημιουργία PDF επιτυχής";
				//echo "4.5 <br>";
			}
			else{
				//$output="Παρουσιάστηκε πρόβλημα στη δημιουργία του PDF";
				//echo "4.6 <br>";
				//break;
				 throw new Exception('Παρουσιάστηκε πρόβλημα στη δημιουργία του PDF - '.$output);
			}
		}
		else{
			//$output="Το αρχείο είναι σε μορφή PDF ήδη";
		}
		
		