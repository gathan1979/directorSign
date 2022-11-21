<?php
	include 'connection1.php';	
	$queryTmp = "insert into tmpexactcopy (revisionId,status) values (".$_POST['aa'].",0);";
	$rsltTmp= mysqli_query($con,$queryTmp) or die ("apotyxia erotimatas 1".mysql_error());
?>