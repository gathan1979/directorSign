<?php
	include 'connection1.php';
	session_start();
	if (!isset($_SESSION['user'])){
		//if ($_SESSION['privilege']=="1") {
			header('Location: index.php');
		//}
		//else{
		//	echo "Access restricted";
		//}
	}
	if ($_GET['role']==2){
		$temp = $_SESSION['accessLevel'];
		$temp1 = $_SESSION['roleName'];
		$temp2 = $_SESSION['department'];
		$temp3 = $_SESSION['protocolAccessLevel'];
		$temp4 = $_SESSION['prime'];
		$temp5 = $_SESSION['departmentName'];
		$temp6 = $_SESSION['canSignAsLast'];
		$temp7 =  $_SESSION['privilege'];
		$temp8 =  $_SESSION['role'];
		
		$_SESSION['accessLevel'] = $_SESSION['accessLevel1'];
		$_SESSION['roleName'] = $_SESSION['roleName1'];
		$_SESSION['department'] = $_SESSION['department1'];
		$_SESSION['prime'] = $_SESSION['prime1'];
		$_SESSION['protocolAccessLevel'] = $_SESSION['protocolAccessLevel1'];
		$_SESSION['canSignAsLast']=$_SESSION['canSignAsLast1'];
		$_SESSION['departmentName'] = $_SESSION['departmentName1'];
		$_SESSION['privilege'] = $_SESSION['privilege1'];
		$_SESSION['role'] = $_SESSION['role1'];
		
		$_SESSION['accessLevel1'] = $temp;
		$_SESSION['roleName1'] = $temp1;
		$_SESSION['department1'] = $temp2;
		$_SESSION['protocolAccessLevel1'] = $temp3;
		$_SESSION['prime1'] = $temp4;
		$_SESSION['departmentName1']=$temp5;
		$_SESSION['canSignAsLast1']=$temp6;
		$_SESSION['privilege1'] = $temp7;
		$_SESSION['role1'] = $temp8;
		
	}
	else if ($_GET['role']==3){
		$temp = $_SESSION['accessLevel'];
		$temp1 = $_SESSION['roleName'];
		$temp2 = $_SESSION['department'];
		$temp3 = $_SESSION['protocolAccessLevel'];
		$temp4 = $_SESSION['prime'];
		$temp5 = $_SESSION['departmentName'];
		$temp6 = $_SESSION['canSignAsLast'];
		$temp7 =  $_SESSION['privilege'];
		$temp8 =  $_SESSION['role'];
		
		$_SESSION['accessLevel'] = $_SESSION['accessLevel2'];
		$_SESSION['roleName'] = $_SESSION['roleName2'];
		$_SESSION['department'] = $_SESSION['department2'];
		$_SESSION['prime'] = $_SESSION['prime2'];
		$_SESSION['protocolAccessLevel'] = $_SESSION['protocolAccessLevel2'];
	    $_SESSION['canSignAsLast']=$_SESSION['canSignAsLast2'];
        $_SESSION['departmentName'] = $_SESSION['departmentName2'];
		$_SESSION['privilege'] = $_SESSION['privilege2'];
		$_SESSION['role'] = $_SESSION['role2'];
		
		$_SESSION['accessLevel2'] = $temp;
		$_SESSION['roleName2'] = $temp1;
		$_SESSION['department2'] = $temp2;
		$_SESSION['protocolAccessLevel2'] = $temp3;
		$_SESSION['prime2'] = $temp4;
		$_SESSION['departmentName2']=$temp5;
		$_SESSION['canSignAsLast2']=$temp6;
		$_SESSION['privilege2'] = $temp7;
		$_SESSION['role2'] = $temp8;
	}
	$newURL ="headmaster1.php";
	header('Location: '.$newURL."?role=".$_SESSION['role']);
?>