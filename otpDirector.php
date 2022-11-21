<?php

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
	$result = curl_exec($ch);
	//$time2 = microtime(true);
	//echo "Χρόνος 2 :".($time2-$time1);
	//var_dump($result);
	$decResult = json_decode($result,true);
	var_dump($decResult);
	
?>