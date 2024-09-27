<?php
	/* if (isset($con))
	{
	  mysqli_close($con);
	  unset($con);
	} */		
    $handle1 = @fopen("../../../../dbcodes.txt", "r");
		if ($handle1) {
			while (($buffer1 = fgets($handle1)) !== false) {
				$kommatia1 = explode("#",$buffer1);
				$n = $kommatia1[0];
				$p = $kommatia1[1];
				$u = $kommatia1[2];
			}
			if (!feof($handle1)) {
				
			}
			fclose($handle1);
		}
		else {
			echo 'adinamia sindesis sti vasi logo kodikon sindesis';
		}
		//$con = mysqli_connect("127.0.0.1","root","root","protokolo") or die('adinamia sindesis sti vasi');
		$con = mysqli_connect($u,$n,$p,"adeies") or die('adinamia sindesis sti vasi');
		if (!$con)
		{
		  die('Could not connect: ' . mysql_error());
		}

?>