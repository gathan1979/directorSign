<?php 
		if (isset($_POST['name']) and isset($_POST['pass'])){
	//		$handle = @fopen("../codes.txt", "r");     palia morfi pou to diavasma xriston to ekana me file
			include 'connection.php';
			mysqli_query($con,"SET NAMES 'UTF8'");
			mysqli_query($con,"set names utf8");
			$query = 'SELECT attendanceNumber,fullName,password,accessLevel,department,signature,roleName FROM 
			`staff` left join `signpasswords` on attendanceNumber=attendanceId;';
			$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
			$fullname=mysqli_real_escape_string($con,strip_tags($_POST['fullname']));
			$name=mysqli_real_escape_string($con,strip_tags($_POST['name']));
			$pass=mysqli_real_escape_string($con,strip_tags($_POST['pass']));
			$multiuser = 0;
			while ($k = mysqli_fetch_array($result,MYSQLI_BOTH)) {			
				if (($name == $k['fullName']) and (md5($pass."_2_4") == $k['password'])){
					$multiuser +=1;
					//echo $multiuser;
					$_SESSION['user'] = $name;
					$_SESSION['aa_user'] = $k['attendanceNumber'];
						$_SESSION['accessLevel'.$multiuser] = $k['accessLevel'];
						$_SESSION['roleName'.$multiuser] = $k['roleName'];
						$_SESSION['department'.$multiuser] = $k['department'];
					$_SESSION['signature'] = $k['signature'];
					$res=mysqli_query($con,'insert into `login` (userId, fromIP) values ('.$_SESSION['aa_user'].",'".$_SERVER['REMOTE_ADDR']."');") or die ('login import to database error');		
				}
			}
			mysqli_close($con);
		}
?>