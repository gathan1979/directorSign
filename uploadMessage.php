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
	$target_dir = "messages/";
	$relevantDocs ="";
	$fileNames =[];
	
	//++++++18-08-2020  elegxos onomaton kai metonomasia arxeion 
	for($i=0;$i<$numFiles;$i++){
		$target_file = $target_dir . basename($_FILES["selectedFile".$i]["name"]);
		$newName = pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_FILENAME).".".pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_EXTENSION);;
		$fileNames[$i] = $target_file;
		//if (file_exists("wfio://".$target_file)) {
		if (file_exists($target_file)) {
			//$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
			$newName = pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_FILENAME)."_".date('d-m-Y')."_".rand(0,1000).".".pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_EXTENSION);
			$target_file = $target_dir . $newName;
			$fileNames[$i] = $target_file;
			$uploadOk = 1;
		}
		//if (file_exists("wfio://".$target_file)){
		if ($i==0){
			//$relevantDocs = basename($_FILES["selectedFile".$i]["name"]);
			$relevantDocs = $newName;	
		}
		else{
			$relevantDocs = $relevantDocs."*".$newName;	
		}
		
	}
	//+++++++++++++++++++++++++++++++++++++++++++++++++
	
	//$msg.=$relevantDocs;
	
	for($i=0;$i<$numFiles;$i++){
			//$target_file = $target_dir . basename($_FILES["selectedFile".$i]["name"]);
			
			$imageFileType = strtolower(pathinfo($fileNames[$i],PATHINFO_EXTENSION));
			// Check if file already exists
			//if (file_exists("wfio://".$target_file)) {
				//$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
				//$target_file = $target_dir . pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_FILENAME)."_".date('d-m-Y')."_".rand(0,1000).".".pathinfo($_FILES["selectedFile".$i]["name"],PATHINFO_EXTENSION);
				//$uploadOk = 1;
			//}
			//if (file_exists("wfio://".$target_file)) {
				//$msg.="Παρακαλώ αλλάξτε το όνομα αρχείου. Υπάρχει αρχείο με το ίδιο όνομα. ";
				//$target_file = $target_dir . basename($_FILES["selectedFile".$i]["name"]).;
				//$uploadOk = 0;
			//}
			if (preg_match('/[*#{}!^\'\"]/', pathinfo($fileNames[$i],PATHINFO_FILENAME)))
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
			// Check if $uploadOk is set to 0 by an error
			if ($uploadOk == 0) {
				$msg." Υπάρχει Σφάλμα το αρχείο σας δεν έχει ληφθεί. ";
				//if everything is ok, try to upload file
			} else {
				//if (move_uploaded_file($_FILES["selectedFile".$i]["tmp_name"], "wfio://".$fileNames[$i])) {
				if (move_uploaded_file($_FILES["selectedFile".$i]["tmp_name"], $fileNames[$i])) {
					$msg.= "Το αρχείο σας ". basename( $_FILES["selectedFile".$i]["name"]). " έχει μεταφερθεί με επιτυχία. ";		
					
				} else {
					$msg.= "Yπάρχει πρόβλημα στη μεταφορά του αρχείου";
					
				}
			}
			
	}
	if ($uploadOk == 1) {
		mysqli_query($con,"set names utf8");
		$authorComment = $_POST['authorComment'];
		$erotima = "insert into messages (fromIP,userId,comments,relevantDocs,dep) values ('".$_SERVER['REMOTE_ADDR']."',".$_SESSION['aa_staff'].",'".$authorComment."','".$relevantDocs."',".$_SESSION['department'].");";

		$result = mysqli_query($con,$erotima);	
		if ($result == false) {
			$msg.= "Αποτυχία εκτέλεσης καταχώρησης στη βάση. ";
		}
		else{
			$msg= mysqli_insert_id($con);
		}
				
	}
	mysqli_close($con);
	echo $msg;

?>