<?php
	session_start();
	//The url you wish to send the POST request to
	$url = "https://sapi.mindigital-shde.gr/Sign/Api/RequestOTP";

	//The data you want to send via POST
	if (!isset($_SESSION['userMindigital'])){
		exit("-1");
	}
	
	$fields = [
		"Username" => $_SESSION['userMindigital'], 
		"Password" => $_SESSION['passMindigital']
	];

	//url-ify the data for the POST
	$fields_string = http_build_query($fields);

	//open connection
	$ch = curl_init();

	//set the url, number of POST vars, POST data
	curl_setopt($ch,CURLOPT_URL, $url);
	curl_setopt($ch,CURLOPT_POST, true);
	curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);

	//So that curl_exec returns the contents of the cURL; rather than echoing it
	curl_setopt($ch,CURLOPT_RETURNTRANSFER, true); 

	$result = curl_exec($ch);
	echo $result;
	//echo $username." --- ".$password;
	
?>