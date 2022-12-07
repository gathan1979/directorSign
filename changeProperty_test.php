<?php
	include 'validateToken.php';
	include 'connection.php';
	
	session_start();
	
	if (isset($_POST['role'])){
		echo "test";
		$_SESSION['accessLevel'] = $_SESSION['accessLevel2'];
		$_SESSION['roleName'] = $_SESSION['roleName2'];
		$_SESSION['department'] = $_SESSION['department2'];
		$_SESSION['prime'] = $_SESSION['prime2'];
		$_SESSION['protocolAccessLevel'] = $_SESSION['protocolAccessLevel2'];
	    $_SESSION['canSignAsLast']=$_SESSION['canSignAsLast2'];
        $_SESSION['departmentName'] = $_SESSION['departmentName2'];
		$_SESSION['privilege'] = $_SESSION['privilege2'];
		
	}
	//$newURL ="index.php";
	//header('Location: '.$newURL);
?>