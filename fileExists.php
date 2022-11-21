<?php

		session_start();
		$file = $_POST['file'];
		$file2 = $_SERVER['DOCUMENT_ROOT'].'\directorSign\uploads\\'.iconv("UTF-8", "UTF-8",$file);
		if (file_exists($file2)){
			echo "../../uploads/";
		}
		else{
			echo '//'.$_SESSION['server_address']."/externaldisk/directorSign/";
		}
		
?>