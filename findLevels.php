<?php

	function allLevelsUp($dep){  //emfanizei ton arithmo ton epipedon mexri to epipedo 0 diladi ton arxiko komvo
		@session_start();
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql = "select last_parent from departmentstypes where aa=".$dep ;
		$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas allLevelsUp");
		$row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$levels = 0;
		if ($row[0] == $dep){ return 0;};
		$par = levelUp($dep);
		while($par<>$row[0]){    
		// $par einai o goneas pou epistrefei apo ti levelUp. $row[0] einai to teleytaio epipedo diladi to lastparent
		// ston pinaka departmentstypes
			$levels++;
			$par = levelup($par);
		}	
		$levels++;
		return $levels;  
	}		
	
	
	function levelsDiff($dep1,$dep2){  //emfanizei ti diafora ton epipedon 2 tmimaton. $dep1 to xamilotero tmina ierarxika
		if ($dep1 == $dep2){ return 0;}
		@session_start();
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql = "select last_parent from departmentstypes where aa=".$dep1 ;
		$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas allLevelsUp");
		$row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		$levels = 0;
		$par = levelUp($dep1);
		while($par<>$dep2 || $par==0){    
		// $par einai o goneas pou epistrefei apo ti levelUp. $row[0] einai to teleytaio epipedo diladi to lastparent
		// ston pinaka departmentstypes
			$levels++;
			$par = levelup($par);
		}	
		$levels++;
		return $levels;  
	}		

	function levelUp($dep){
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql = "select parent from departmentstypes where aa=".$dep ;
		$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas levelUp ".$sql);
		$row = mysqli_fetch_array($rslt, MYSQLI_BOTH);
		return $row[0];
	}
	
	function depsDown($dep){
		@session_start();
		$deps = array();
		depDown($dep,$deps);
		return $deps; 
	}
	
	function depDown($dep, &$deps){   //epistrefei ston pinaka $deps ola ta tmimata pou vriksontai kato apo to $dep
		// to xrisimopoioume gia na emfanizoyme stoys proistamenoys ta eggrafa tvn ifistamenvn tous
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql = "select aa from departmentstypes where parent=".$dep ;
		$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
		while($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
			array_push($deps, $row[0]);
			depDown($row[0],$deps);
		}
		return "ok";
	}
	
	function relevantDepsDown($dep){ //emfanizei ola ta tmimata kato apo to $dep pou sxetizontai me auto stis ipografes
	// giati mporei kapoio tmima pou vrisketai katotera stin ierarxia na stamata se proigoumeno epipedo os last_department
		@session_start();
		$deps = array();
		
		relevantDepDown($dep,$deps);
		array_push($deps, $dep);
		return $deps; 
	}
	
	function relevantDepDown($dep, &$deps){   //epistrefei ston pinaka $deps ola ta tmimata pou vriksontai kato apo to $dep
		// to xrisimopoioume gia na emfanizoyme stoys proistamenoys ta eggrafa tvn ifistamenvn tous
		include 'connection1.php';	
		mysqli_query($con,"set names utf8");
		$sql = "select aa,last_parent from departmentstypes where parent=".$dep ;
		$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1");
		while($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
			if (!in_array($row[1],$deps)){
				array_push($deps, $row[0]);	
			}
			relevantDepDown($row[0],$deps);
		}
		return "ok";
	}
	
	function previousLevel($startDep, $currentDep){
		@session_start();
		$curr = $startDep;
		$par = levelUp($startDep);
		while($par <> $currentDep){    // $par einai o goneas pou epistrefei apo ti levelUp. An 0 eimaste ston arxiko komvo
			$curr = $par;
			$par = levelup($par);
		}	
		return $curr;  
	}


?>