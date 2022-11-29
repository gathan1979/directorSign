<?php
	session_start();
	$userData = [];
	$userData["aa_staff"] = $_SESSION["aa_staff"];
	$userData["aa_user"] = $_SESSION["aa_user"];
	$userData["accessLevel"] = $_SESSION["accessLevel"];
	$userData["protocolAccessLevel"] = $_SESSION["protocolAccessLevel"];
	$userData["canSignAsLast"] = $_SESSION["canSignAsLast"];
	$userData["department"] = $_SESSION["department"];
	$userData["oldAssignmentsStyle"] = (isset($_SESSION["oldAssignmentsStyle"])?$_SESSION["oldAssignmentsStyle"]:"");
	$userData["prime"] = $_SESSION["prime"];
	$userData["privilege"] = $_SESSION["privilege"];
	$userData["user"] = $_SESSION["user"];
	$userData["visableRecordsStyle"] = (isset($_SESSION["visableRecordsStyle"])?$_SESSION["visableRecordsStyle"]:"");
	echo json_encode($userData);
?>

