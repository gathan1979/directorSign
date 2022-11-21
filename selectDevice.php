<?php
	session_start();
	$my_text_file = "name".$_SERVER['REMOTE_ADDR'].".txt";
	$all_lines = file($my_text_file);
	$line9=$all_lines[8];
	$temp=explode("<",$line9);
	$pcname=trim($temp[0]);
	
	$my_text_file2 = "out.txt";
	$all_lines2 = file($my_text_file2);
	$devices = [];
	$devnames = [];
	foreach($all_lines2 as $line)
	{
		//echo $line." --> <br>";
	   if (stripos($line,$pcname) !== false) {
			if (strpos($line,"-->") !== false){
				$temp = explode("(",$line);
				array_push($devices,trim($temp[0]));
				array_push($devnames,substr(trim($temp[1]),0,-1));
			}
        }
	}
	//include 'disablepopup.php';
	$_SESSION['device'] = $devnames[$_GET['id']];
	echo $devnames[$_GET['id']];
?>