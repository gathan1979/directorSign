<?php
		include '../../connection2.php';
		$sqlpos = "SELECT * from sigposition where aa = (select max(aa) from sigposition where id=".$_GET['id'].")";
	    $rsltpos= mysqli_query($con,$sqlpos) or die ("apotyxia erotimatas 1".mysql_error());
	    $row_cnt = mysqli_num_rows($rsltpos);
		$table1 = array();
		if ($row_cnt > 0 ){
			$rowpos = mysqli_fetch_array($rsltpos, MYSQLI_BOTH);
			array_push($table1,$rowpos);
			echo json_encode($table1);
		}
		else{
			echo "empty";
		}
		
		mysqli_close($con); 

?>