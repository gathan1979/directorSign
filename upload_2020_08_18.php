<?php
	include 'connection1.php';

	session_start();
	//print_r($_POST); 

	include 'login.php';
	if (!isset($_SESSION['user'])){
		//if ($_SESSION['privilege']=="1") {
			header('Location: index.php');
		//}
		//else{
		//	echo "Access restricted";
		//}
	}
	$msg = "";
	$uploadOk = 1;
	$numFiles = $_POST['numFiles'];
	$aped = $_POST['aped'];
	if (isset($_POST['tobeSigned'])){
		$tobeSigned = $_POST['tobeSigned'];
	}
	else{
		$msg.="Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά";
		$uploadOk = 0;
	}
	$target_dir = "uploads/";
	$relevantDocs ="";
	
	//++++++18-08-2020  elegxos onomaton kai metonomasia arxeion 
	for($i=0;$i<$numFiles;$i++){
		if ($tobeSigned == $i){
			continue;
		}
		if ($i==0 || $tobeSigned==0){
			$relevantDocs = $_FILES["selectedFile".$i]["name"];	
		}
		else{
			$relevantDocs = $relevantDocs."*".$_FILES["selectedFile".$i]["name"];	
		}
		
	}
	//+++++++++++++++++++++++++++++++++++++++++++++++++
	
	//$msg.=$relevantDocs;
	
	for($i=0;$i<$numFiles;$i++){
			$target_file = $target_dir . basename($_FILES["selectedFile".$i]["name"]);
			
			$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
			// Check if file already exists
			if (file_exists("wfio://".$target_file)) {
				//$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
				$target_file = $target_dir . pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_FILENAME)."_".date('d-m-Y')."_".rand(0,1000).".".pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_EXTENSION);
				$uploadOk = 1;
			}
			if (file_exists("wfio://".$target_file)) {
				$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
				//$target_file = $target_dir . basename($_FILES["selectedFile".$i]["name"]).;
				$uploadOk = 0;
			}
			if (preg_match('/[*#{}!^.\'\"]/', pathinfo($target_file,PATHINFO_FILENAME)))
			{
				$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Περιέχει ειδικούς χαρακτήρες";
				$uploadOk = 0;
			}
			// Check file size
			if ($_FILES['selectedFile'.$i]['size'] > 10000000) {
				$msg.= "Το αρχείο σας υπερβαίνει τα 10Mbyte. ";
				$uploadOk = 0;
			}
			// Allow certain file formats
			if($imageFileType != "pdf" && $imageFileType != "PDF" && $imageFileType != "doc" && $imageFileType != "docx" && $imageFileType != "xls" && $imageFileType != "xlsx") {
				$msg.= "Το αρχείο σας δεν είναι σε μορφή pdf,doc,docx,xls,xlsx ";
				$uploadOk = 0;
			}
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 0) {
				$msg." Υπάρχει Σφάλμα το αρχείο σας δεν έχει ληφθεί. ";
				//if everything is ok, try to upload file
			} else {
				if (move_uploaded_file($_FILES["selectedFile".$i]["tmp_name"], "wfio://".$target_file)) {
					$msg.= "Το αρχείο σας ". basename( $_FILES["selectedFile".$i]["name"]). " έχει μεταφερθεί με επιτυχία. ";
					
					include 'createPreviewFileTest.php';
					
					
				} else {
					$msg.= "Yπάρχει πρόβλημα στη μεταφορά του αρχείου";
					
				}
			}
			if ($uploadOk == 1 && $tobeSigned==$i) {
				mysqli_query($con,"set names utf8");
				if ($_SESSION['accessLevel']=="0"){  //aplos ypallilos
					$authorComment="είσοδος αρχείου";
					if (isset($_POST['authorComment'])){
					   $authorComment .= " - ";
					   $authorComment .= $_POST['authorComment'];
					}
					if (!isset($_POST['aa'])){
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,relevantDocs,aped,dep) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',1,".$_SESSION['aa_user'].",'".$authorComment."','".$relevantDocs."',".$aped.",".$_SESSION['department'].");";
					}
					else{
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',1,".$_SESSION['aa_user'].",'είσοδος διορθωμένου αρχείου',".$_POST['aa'].");";
					}
					
				}
				else{  // kathe allos ektos apo ypallilo
					if (isset($_POST['action'])){  //mallon afora tropopoiiseis an einai true
						if ($_POST['action']==1){
							$nextLevel = $_SESSION['accessLevel']+1;
							if ($_SESSION['accessLevel']=="3"){
								$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος υπογεγγραμμένου αρχείου',".$_POST['aa'].");";
							}
							else{
								$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος αρχείου - προώθηση εγγράφου',".$_POST['aa'].");";
							}	
						}
						else{
							$nextLevel = $_SESSION['accessLevel']-1;
							$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος αρχείου - επιστροφή εγγράφου',".$_POST['aa'].");";
						}
					}
					else{
						$nextLevel = $_SESSION['accessLevel']; //eisagogi neou apo proistamenous
						$authorComment="είσοδος αρχείου από προϊστάμενο";
						if (isset($_POST['authorComment'])){
						   $authorComment .= " - ";
						   $authorComment .= $_POST['authorComment'];
						}
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,relevantDocs,aped,dep) values ('".pathinfo($target_file,PATHINFO_BASENAME)."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'".$authorComment."','".$relevantDocs."',".$aped.",".$_SESSION['department'].");";
					}
					
				}
				$result = mysqli_query($con,$erotima);	
				if ($result == false) {
					$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
				}
				else{
					$msg.= "Καταχώρηση επιτυχημένη. ";
				}
				
			}
	}
	
	mysqli_close($con);
	echo $msg;

?>