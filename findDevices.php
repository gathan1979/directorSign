<?php
	
	//$output2 = shell_exec("nbtstat -A ".$_SERVER['REMOTE_ADDR']);
	exec('vhui_get_pcname.bat '.$_SERVER['REMOTE_ADDR'],$out);
	//sleep(3);
	//$file = fopen("name.txt", "r") or exit("Unable to open file!");
	//Output a line of the file until the end is reached
	$my_text_file = "name".$_SERVER['REMOTE_ADDR'].".txt";
	$all_lines = file($my_text_file);
	$line9=$all_lines[8];
	$temp=explode("<",$line9);
	$pcname=trim($temp[0]);
	echo "<b>".$pcname."</b>";

	exec('vhui.bat',$out);
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
				$temp1 = str_replace("-->", "", trim($temp[0]));
				array_push($devices,$temp1);
				array_push($devnames,substr(trim($temp[1]),0,-1));
			}
        }
	}
	if (count($devices)==0){
		echo "<br><br>Πρέπει να εκτελείτε την εφαρμογή <b>vitrualhere Server</b> στον υπολογιστή σας<br>";
		echo "Αν δεν την έχετε <a href='virtualhereSoftware/vhusbdwin64.exe' target='_blank'>Κατεβάστε εδώ</a>";
	
	}
	else{
	//var_dump($devices);
	//var_dump($devnames);
		 echo '<ul id="alldevices" class="list-group">';
			for ($i=0;$i<count($devices);$i++){
				if (isset($_SESSION['device'])){
					if (stripos($devnames[$i],$_SESSION['device']) !== false) {
						echo '<li id="device'.$i.'" class="list-group-item active" onclick="selectDevice('.$i.')">'.$devices[$i].'</li>';
					}
					else{
						echo '<li id="device'.$i.'" class="list-group-item" onclick="selectDevice('.$i.')">'.$devices[$i].'</li>';
					}
				}
				else{
					echo '<li id="device'.$i.'" class="list-group-item" onclick="selectDevice('.$i.')">'.$devices[$i].'</li>';
				}
			} 
		echo '</ul>';
	}
	
?>