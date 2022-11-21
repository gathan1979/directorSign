<?php
	session_start();
	if (isset($_SESSION['userMindigital'])){
		$username = $_SESSION['userMindigital'];
		$password = $_SESSION['passMindigital'];
	}
	else{
		$username = $_POST['Username'];
		$password = $_POST['Password'];
	}
	
	
	//The url you wish to send the POST request to
	$url = "https://sapi.mindigital-shde.gr/Sign/Api/Certificates";
	
	$fields = [
		"Username" => $username, 
		"Password" => $password
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
	//echo $result;
	$resultDecoded  = json_decode($result,true);
	
	//var_dump($resultDecoded);
	if(isset($resultDecoded['Success'])){
		unset($_SESSION['userMindigital']);
		unset($_SESSION['passMindigital']);
		echo 0;
	}
	else{
		$_SESSION['userMindigital'] = $username;
		$_SESSION['passMindigital'] = $password;
		$certs = $resultDecoded["Certificates"];
		$file = "certs\\".$username.".cer";
		file_put_contents($file,'-----BEGIN CERTIFICATE-----'.PHP_EOL.$certs[0].PHP_EOL.'-----END CERTIFICATE-----');
		
		$file = "certs\\".$username."_inter_.cer";
		file_put_contents($file,'-----BEGIN CERTIFICATE-----'.PHP_EOL.$certs[1].PHP_EOL.'-----END CERTIFICATE-----');
		
		$file = "certs\\".$username."_root_.cer";
		file_put_contents($file,'-----BEGIN CERTIFICATE-----'.PHP_EOL.$certs[2].PHP_EOL.'-----END CERTIFICATE-----');
		echo 1;
	}
		
		
?>