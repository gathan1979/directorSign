<?php 
		if (isset($_POST['name']) and isset($_POST['pass'])){
	//		$handle = @fopen("../codes.txt", "r");     palia morfi pou to diavasma xriston to ekana me file
			include 'connection.php';
			mysqli_query($con,"SET NAMES 'UTF8'");
			mysqli_query($con,"set names utf8");
			$query = 'SELECT attendanceNumber,fullName,password,accessLevel,department,signature,signatureAped,roleName,prime, protocolAccessLevel,presenceAccessLevel,staff.aa as staffAA FROM 
			`staff` left join `signpasswords` on attendanceNumber=attendanceId order by prime desc;';
			$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
			//$fullname=mysqli_real_escape_string($con,strip_tags($_POST['fullname']));
			$name=mysqli_real_escape_string($con,strip_tags($_POST['name']));
			$pass=mysqli_real_escape_string($con,strip_tags($_POST['pass']));
			$multiuser = 0;
			//variables for protocol
			//session_start();
			$_SESSION['serverPath']="C:\xampp2\htdocs";
			$_SESSION['applicationFolder']='nocc-1.9.8';
			$_SESSION['applicationFolderAdeies']='adeies';
			$_SESSION['applicationFolderProtocol']='protocol';
			$_SESSION['selectedYear'] =date("Y"); 
			$_SESSION['database']='protocol'.$_SESSION['selectedYear'];
			//end
			while ($k = mysqli_fetch_array($result,MYSQLI_BOTH)) {			
				if (($name == $k['fullName']) and (md5($pass."_2_4") == $k['password'])){
					$multiuser +=1;
					//echo $multiuser;
					$_SESSION['privilege'] =$k['presenceAccessLevel'] ;
					$_SESSION['user'] = $name;
					$_SESSION['aa_user'] = $k['attendanceNumber'];
					$_SESSION['aa_staff'] = $k['staffAA'];
					if (isset($_SESSION['accessLevel'])&&!isset($_SESSION['accessLevel1'])){
						$_SESSION['accessLevel1'] = $k['accessLevel'];
						$_SESSION['protocolAccessLevel1'] = $k['protocolAccessLevel'];
						$_SESSION['roleName1'] = $k['roleName'];
						$_SESSION['department1'] = $k['department'];
						$_SESSION['prime1'] = $k['prime'];
					}
					else if (isset($_SESSION['accessLevel1'])){
						$_SESSION['accessLevel2'] = $k['accessLevel'];
						$_SESSION['protocolAccessLevel2'] = $k['protocolAccessLevel'];
						$_SESSION['roleName2'] = $k['roleName'];
						$_SESSION['department2'] = $k['department'];
						$_SESSION['prime2'] = $k['prime'];
					}
					else{
						$_SESSION['accessLevel'] = $k['accessLevel'];
						if ($k['protocolAccessLevel']==1){
							$_SESSION['protocolAccessLevel'] = 1;
							$_SESSION['protocolRoleName'] = "Διαχειριστής";
							$_SESSION['protocolAccessLevel1'] = 0;
							$_SESSION['protocolRoleName1'] = "Χρήστης";
						}
						else{
							$_SESSION['protocolAccessLevel'] = $k['protocolAccessLevel'];
						}
						
						$_SESSION['roleName'] = $k['roleName'];
						$_SESSION['department'] = $k['department'];
						$_SESSION['prime'] = $k['prime'];
					}
					$_SESSION['signature'] = $k['signature'];
					$_SESSION['signatureAped'] = $k['signatureAped'];
					$_SESSION['device'] ="";
					$res=mysqli_query($con,'insert into `login` (userId, fromIP) values ('.$_SESSION['aa_user'].",'".$_SERVER['REMOTE_ADDR']."');") or die ('login import to database error');
				}
			}
			mysqli_close($con);
		}
?>