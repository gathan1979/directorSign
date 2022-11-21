<?php
	include 'connection1.php';

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
	$_SESSION['pbValue'] = 0;
	$_SESSION['pbText'] = "Έναρξη Υπογραφής Εγγράφου";
	
	$target_dir = "uploads/";
	$target_file = $target_dir . basename($_FILES["selectedFile"]["name"]);
	$uploadOk = 1;
	$imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
	$msg = "";
	// Check if file already exists.
	mb_internal_encoding("UTF-8");
	if (file_exists($target_file)) {
		$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
		$uploadOk = 0;
	}
	if (preg_match('/[*#{}!^]/', basename($_FILES["selectedFile"]["name"])))
	{
		$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Περιέχει ειδικούς χαρακτήρες";
		$uploadOk = 0;
	}
	// Check file size
	if ($_FILES['selectedFile']['size'] > 5000000) {
		$msg.= "Το αρχείο σας υπερβαίνει τα 5Mbyte. ";
		$uploadOk = 0;
	}
	// Allow certain file formats
	if($imageFileType != "pdf" && $imageFileType != "PDF" && $imageFileType != "doc" && $imageFileType != "docx" && $imageFileType != "xls" && $imageFileType != "xlsx") {
		$msg.= "Το αρχείο σας δεν είναι σε μορφή pdf ή doc,docx. ";
		$uploadOk = 0;
	}
	// Check if $uploadOk is set to 0 by an error
	if ($uploadOk == 0) {
		$msg." Υπάρχει Σφάλμα το αρχείο σας δεν έχει ληφθεί. ";
		//if everything is ok, try to upload file
	} else {
		$_SESSION['pbValue'] = 5;
		$_SESSION['pbText'] = "Έναρξη Μεταφοράς Εγγράφου";
		if (move_uploaded_file($_FILES["selectedFile"]["tmp_name"], $target_file)) {
			$msg.= "Το αρχείο σας ". basename( $_FILES["selectedFile"]["name"]). " έχει μεταφερθεί με επιτυχία. ";
			$_SESSION['pbValue'] = 45;
			$_SESSION['pbText'] = "Μεταφορά Εγγράφου Επιτυχής";
			$_SESSION['pbValue'] = 50;
			$_SESSION['pbText'] = "Έναρξη Δημιουργίας Προεπισκόπησης Εγγράφου Επιτυχής";
			include 'createPreviewFile.php';
			$_SESSION['pbValue'] = 75;
			$_SESSION['pbText'] = "Δημιουργία Προεπισκόπησης Εγγράφου Επιτυχής";
			
		} else {
			$msg.= "Yπάρχει πρόβλημα στη μεταφορά του αρχείου";
			
		}
	}
	if ($uploadOk == 1) {
		$_SESSION['pbValue'] = 80;
		$_SESSION['pbText'] = "Έναρξη Καταχώρησης Εγγράφου στη Βάση Δεδομένων";
		mysqli_query($con,"set names utf8");
		if ($_SESSION['accessLevel']=="0"){
			$authorComment="είσοδος αρχείου";
			if (isset($_POST['authorComment'])){
			   $authorComment .= " - ";
			   $authorComment .= $_POST['authorComment'];
			}
			if (!isset($_POST['aa'])){
				$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',1,".$_SESSION['aa_user'].",'".$authorComment."');";
			}
			else{
				$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',1,".$_SESSION['aa_user'].",'είσοδος διορθωμένου αρχείου',".$_POST['aa'].");";
			}
			$_SESSION['pbValue'] = 85;
			$_SESSION['pbText'] = "Καταχώρηση Εγγράφου στη Βάση Δεδομένων Επιτυχής";
		}
		else{
			if (isset($_POST['action'])){
				if ($_POST['action']==1){
					$nextLevel = $_SESSION['accessLevel']+1;
					if ($_SESSION['accessLevel']=="3"){
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος υπογεγγραμμένου αρχείου',".$_POST['aa'].");";
					}
					else{
						$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος αρχείου - προώθηση εγγράφου',".$_POST['aa'].");";
					}	
				}
				else{
					$nextLevel = $_SESSION['accessLevel']-1;
					$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments,revisionId) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'είσοδος αρχείου - επιστροφή εγγράφου',".$_POST['aa'].");";
				}
			}
			else{
				$nextLevel = $_SESSION['accessLevel']; //mallon axristo
				$authorComment="είσοδος αρχείου από προϊστάμενο";
				if (isset($_POST['authorComment'])){
				   $authorComment .= " - ";
				   $authorComment .= $_POST['authorComment'];
				}
				$erotima = "insert into filesTobeSigned (filename,fromIP,nextLevel,userId,comments) values ('".basename( $_FILES["selectedFile"]["name"])."','".$_SERVER['REMOTE_ADDR']."',".$nextLevel.",".$_SESSION['aa_user'].",'".$authorComment."');";
			}
			$_SESSION['pbValue'] = 85;
			$_SESSION['pbText'] = "Καταχώρηση Εγγράφου στη Βάση Δεδομένων Επιτυχής";
		}
		$result = mysqli_query($con,$erotima);	
		if ($result == false) {
			$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
		}
		else{
			$msg.= "Καταχώρηση επιτυχημένη. ";
		}
		$_SESSION['pbValue'] = 100;
		$_SESSION['pbText'] = "Ολοκλήρωση Υπογραφής Εγγράφου";
	}
	mysqli_close($con);
	echo $msg;
?>