<?php
	//unset($_SESSION['userSch']);
	$getOtpResult = -100;
	$getOtpResultDesc = "";
	$nextuid = 0;
	
	//---------------------------------request OTP ------------------------------------------------
	$url = "https://sapi.mindigital-shde.gr/Sign/Api/RequestOTP";

	$fields = [
		"Username" => "th.mardiris", 
		"Password" => "Laker17!"
	];
	$fields_string = http_build_query($fields);
	$ch = curl_init();
	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, true);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 
	//$time1 = microtime(true);
	$result = curl_exec($ch);
	//$time2 = microtime(true);
	//echo "Χρόνος 2 :".($time2-$time1);
	//var_dump($result);
	$decResult = json_decode($result,true);
	//echo "<br> OTP result : ".$decResult["Outcome"];
	if ($decResult["Outcome"]== 1){
		$getOtpResult = 1; 
		$getOtpResultDesc  ="Το OTP λαμβάνεται μέσω κινητού";
	}
	else if ($decResult["Outcome"] == 9){
		$getOtpResult = 9; 
		$getOtpResultDesc  = $decResult["Description"];
	}
	//--------------------------------GET last OTP from Email---------------------------------------- $decResult["Outcome"] == 0
	else{
		
		
		if ($imap == false){
			$getOtpResult = -2; 
			$getOtpResultDesc  ="Αδυναμία σύνδεσης στο email";
		}
		else{
			//$time1 = microtime(true);
			$obj = imap_status($imap,"{mail.sch.gr}INBOX",SA_UIDNEXT);
			//$time2 = microtime(true);
			//echo "last message is :".$obj->uidnext;
			//echo "Χρόνος 1 :".($time2-$time1);
			$nextuid = $obj->uidnext;
			
			//echo "</br>getting OTP from Email</br>";
			$otp = getLastOTP($imap , $nextuid);
			$i=0;
			//$time1 = microtime(true);
			while ($otp == -100){
				sleep(2);
				$otp = getLastOTP($imap , $nextuid);
				$i++;
				if ($i>20){
					$getOtpResult = 2;
					$getOtpResultDesc = $nextuid;	
				}
			}
			//$time2 = microtime(true);
			//echo "Χρόνος 3 :".($time2-$time1);
			if ($i <20){
				$getOtpResult = 0;
				$getOtpResultDesc = $otp;
				
			}
		}
		
	}
	
	//echo 	$getOtpResult." ".$getOtpResultDesc;
	//$table1 = array();
	//array_push($table1,$getOtpResult);
	//array_push($table1,$getOtpResultDesc);
	//array_push($table1,$nextuid);
	//echo json_encode($table1);	
	
	


?>