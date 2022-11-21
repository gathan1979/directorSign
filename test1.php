<?php
	$token = null;
	$headers = apache_request_headers();
	if(isset($headers['Authorization'])){
		$matches = array();
		if (! preg_match('/Bearer\s(\S+)/', $headers['Authorization'], $matches)) {
			header('HTTP/1.0 400 Bad Request');
			echo 'Token not found in request';
			exit;
		}
		else{
			if(isset($matches[1])){
			$token = $matches[1];
			echo $token;
			}
			else{
				header('HTTP/1.0 401 Unauthorized');
				echo 'Token not found in request 1';
				exit;
			}
		}
	}
	else{
		header('HTTP/1.0 400 Bad Request');
		echo 'Token not found in request';
		exit;
	}
	
?>