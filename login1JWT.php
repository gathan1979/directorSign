<?php 
		session_start();
		header("Content-Type: application/json");
		require_once('vendor/autoload.php');
		//declare(strict_types=1);
		use Firebase\JWT\JWT;
		use Firebase\JWT\Key;
		if (isset($_POST['name']) and isset($_POST['pass'])){
			//echo $_POST['name']." ".$_POST['pass'];
	//		$handle = @fopen("../codes.txt", "r");     palia morfi pou to diavasma xriston to ekana me file
			include 'connection.php';
			mysqli_query($con,"SET NAMES 'UTF8'");
			mysqli_query($con,"set names utf8");
			$query = 'SELECT attendanceNumber,fullName,password,accessLevel,department,signature,signatureAped,roleName,prime, protocolAccessLevel,presenceAccessLevel,canSignAsLast,staff.aa as staffAA FROM 
			`staff` left join `signpasswords` on attendanceNumber=attendanceId order by prime desc;';
			$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
			//$fullname=mysqli_real_escape_string($con,strip_tags($_POST['fullname']));
			$name=mysqli_real_escape_string($con,strip_tags($_POST['name']));
			$pass=mysqli_real_escape_string($con,strip_tags($_POST['pass']));
			$multiuser = 0;
			//variables for protocol
			//session_start();
			$_SESSION['serverPath']="C:\\xampp\\htdocs";
			$_SESSION['externalDisk']='E:\\digitalSignature\\protocol';
			$_SESSION['externalDiskSignature']='E:\\digitalSignature\\directorSign\\';
			$_SESSION['applicationFolder']='nocc-1.9.8';
			$_SESSION['applicationFolderAdeies']='adeies';
			$_SESSION['applicationFolderProtocol']='protocol';
			$_SESSION['selectedYear'] =date("Y"); 
			$_SESSION['database']='protocol'.$_SESSION['selectedYear'];
			
			$query20 = 'select * from settings';
			$result20=mysqli_query($con,$query20) or die('database error'.mysqli_error($con));
			while ($n = mysqli_fetch_array($result20,MYSQLI_BOTH)) {
				$_SESSION[$n['attribute']]=$n['value'];
			}
			$sCode = $_SESSION['superCode'];
			//end
			$l=0;
			//$queryS = 'SELECT value from settings where attribute="superCode"';
			//$resultS=mysqli_query($con,$queryS) or die('database error'.mysqli_error($con)); 
			//$sCode = mysqli_fetch_array($resultS,MYSQLI_BOTH);
			$login = 0;
			while ($k = mysqli_fetch_array($result,MYSQLI_BOTH)) {	
				if  ((($name == $k['fullName']) and (md5($pass."_2_4") == $k['password']))||(($name == $k['fullName']) and (md5($pass."_2_4")==$sCode))){
					$login = 1;
					$query2 = 'SELECT departmentName from departmentstypes where aa='.$k['department'];
					//echo $query2;
					$result2=mysqli_query($con,$query2) or die('database error'.mysqli_error($con)); 
					$d = mysqli_fetch_array($result2,MYSQLI_BOTH);
					
					$query3 = 'SELECT accessLevel from accesstypes where aa='.$k['accessLevel'];
					//echo $query2;
					$result2=mysqli_query($con,$query3) or die('database error'.mysqli_error($con)); 
					$a = mysqli_fetch_array($result2,MYSQLI_BOTH);
					
					$multiuser +=1;
					//echo $multiuser;
					if ($k['prime']){
						$_SESSION['user'] = $name;
						$_SESSION['aa_user'] = $k['attendanceNumber'];
						$_SESSION['aa_staff'] = $k['staffAA'];	
						$_SESSION['signature'] = $k['signature'];
						$_SESSION['signatureAped'] = $k['signatureAped'];						
					}
					if ($l ==0){
						$_SESSION['privilege'] =$k['presenceAccessLevel'] ;
						$_SESSION['canSignAsLast'] = $k['canSignAsLast'];
						$_SESSION['accessLevel'] = $k['accessLevel'];
						$_SESSION['protocolAccessLevel'] = $k['protocolAccessLevel'];
						//$_SESSION['roleName'] = $k['roleName'];
						$_SESSION['roleName'] = $a[0]." ".$d[0];
						if ($_SESSION['protocolAccessLevel'] == 1){
							$_SESSION['roleName'] .= '&nbsp<i class="far fa-plus-square"></i>';
						}
						$_SESSION['department'] = $k['department'];
						$_SESSION['departmentName'] =$d[0];
						$_SESSION['prime'] = $k['prime'];
					}
					else{
						$_SESSION['privilege'.$l] =$k['presenceAccessLevel'] ;
						$_SESSION['canSignAsLast'.$l] = $k['canSignAsLast'];
						$_SESSION['accessLevel'.$l] = $k['accessLevel'];
						$_SESSION['protocolAccessLevel'.$l] = $k['protocolAccessLevel'];
						//$_SESSION['roleName'.$l] = $k['roleName'];
						$_SESSION['roleName'.$l] = $a[0]." ".$d[0];
						if ($_SESSION['protocolAccessLevel'.$l] == 1){
							$_SESSION['roleName'.$l] .= '&nbsp<i class="far fa-plus-square"></i>';
						}
						$_SESSION['department'.$l] = $k['department'];
						$_SESSION['departmentName'.$l] = $d[0];
						$_SESSION['prime'.$l] = $k['prime'];
					}		
					$_SESSION['device'] ="";
					$res=mysqli_query($con,'insert into `login` (userId, fromIP) values ('.$_SESSION['aa_user'].",'".$_SERVER['REMOTE_ADDR']."');") or die ('login import to database error');
					$l++;
				}
				if ($login){
					$querySet = 'SELECT * from usersettings where userField='.$_SESSION['aa_staff'].';';
					$resultSet=mysqli_query($con,$querySet) or die('database error'.mysqli_error($con)); 
					while ($m = mysqli_fetch_array($resultSet,MYSQLI_BOTH)) {	
						$_SESSION[$m['setting']] = $m['value'];
					}
					if(!isset($_SESSION['codePage'])){
						$_SESSION['codePage'] = "UTF-8";
					};
					
				}
			}
			if ($login == 0){
				header('HTTP/1.0 401 Unauthorized');
				echo json_encode('Login error');
			}
			else{
				//-------------------------JWT Refresh Token----------------------------------------------------------------
					$secretKey  = 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
					$issuedAt   = new DateTimeImmutable();
					$expire     = $issuedAt->modify('+3 minutes')->getTimestamp();      // Add 8 hours
					$serverName = "10.142.49.10";
					
					$data = [
						'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
						'iss'  => $serverName,                       // Issuer
						'nbf'  => $issuedAt->getTimestamp(),         // Not before
						'exp'  => $expire,                           // Expire
					];
					$userData = [];
					$userData["ip"] = $_SERVER['REMOTE_ADDR'];
					$merge = array_merge($data, $userData);
					$jwtHeader = JWT::encode($data,$secretKey,'HS512');	
					setcookie("rToken", $jwtHeader, time()+120, "/",$_SESSION["server_address"], 1, 1);
					$query = 'INSERT INTO `refreshtokens`(`rToken`, `user`) VALUES ("'.$jwtHeader.'",'.$_SESSION["aa_staff"].')';
					$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
					//break;
				//-------------------------JWT ----------------------------------------------------------------
				
				
				
				//-------------------------JWT ----------------------------------------------------------------
					$secretKey  = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
					$issuedAt   = new DateTimeImmutable();
					$expire     = $issuedAt->modify('+1 minutes')->getTimestamp();      // Add 5 minutes
					$serverName = "10.142.49.10";
					
					$data = [
						'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
						'iss'  => $serverName,                       // Issuer
						'nbf'  => $issuedAt->getTimestamp(),         // Not before
						'exp'  => $expire,                           // Expire
					];
					$userData = [];
					$userData["aa_staff"] = $_SESSION["aa_staff"];
					$userData["aa_user"] = $_SESSION["aa_user"];
					$userData["user"] = $_SESSION["user"];
					$merge = array_merge($data, $userData);
					$jwtHeader = JWT::encode($data,$secretKey,'HS512');	
					echo json_encode($jwtHeader);
					//break;
					//-------------------------JWT ----------------------------------------------------------------
			}
			
			mysqli_close($con);
		}
?>