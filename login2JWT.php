<?php 
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
			$query = 'SELECT `signpasswords`.aa as roleAA,attendanceNumber,fullName,password,accessLevel,department,signature,signatureAped,roleName,prime, protocolAccessLevel,presenceAccessLevel,canSignAsLast,staff.aa as staffAA FROM 
			`staff` left join `signpasswords` on attendanceNumber=attendanceId order by prime desc;';
			$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
			//$fullname=mysqli_real_escape_string($con,strip_tags($_POST['fullname']));
			$name=mysqli_real_escape_string($con,strip_tags($_POST['name']));
			$pass=mysqli_real_escape_string($con,strip_tags($_POST['pass']));
			$multiuser = 0;
			//variables for protocol
			//session_start();
			$settings['serverPath']="C:\\xampp\\htdocs";
			$settings['externalDisk']='E:\\digitalSignature\\protocol';
			$settings['externalDiskSignature']='E:\\digitalSignature\\directorSign\\';
			$settings['applicationFolder']='nocc-1.9.8';
			$settings['applicationFolderAdeies']='adeies';
			$settings['applicationFolderProtocol']='protocol';
			$settings['selectedYear'] =date("Y"); 
			$settings['database']='protocol'.$settings['selectedYear'];
			
			$query20 = 'select * from settings';
			$result20=mysqli_query($con,$query20) or die('database error'.mysqli_error($con));
			while ($n = mysqli_fetch_array($result20,MYSQLI_BOTH)) {
				$settings[$n['attribute']]=$n['value'];
			}
			$sCode = $settings['superCode'];

			$login = 0;
			$user = [];
			$user['roles'] = [];
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
						$user['user'] = $name;
						$user['aa_user'] = $k['attendanceNumber'];
						$user['aa_staff'] = $k['staffAA'];	
						$user['signature'] = $k['signature'];
						$user['signatureAped'] = $k['signatureAped'];	
					}
					
					$role['privilege'] =$k['presenceAccessLevel'] ;
					$role['canSignAsLast'] = $k['canSignAsLast'];
					$role['accessLevel'] = $k['accessLevel'];
					$role['protocolAccessLevel'] = $k['protocolAccessLevel'];
					//$_SESSION['roleName'] = $k['roleName'];
					$role['roleName'] = $a[0]." ".$d[0];
					if ($role['protocolAccessLevel'] == 1){
						$role['roleName'] .= '&nbsp<i class="far fa-plus-square"></i>';
					}
					$role['department'] = $k['department'];
					$role['departmentName'] =$d[0];
					$role['prime'] = $k['prime'];
					$role['aa_role'] = $k['roleAA'];
		
					$role['device'] ="";
					array_push($user['roles'],$role);
					
				}
				if ($login){
					$querySet = 'SELECT * from usersettings where userField='.$user['aa_staff'].';';
					$resultSet=mysqli_query($con,$querySet) or die('database error'.mysqli_error($con)); 
					while ($m = mysqli_fetch_array($resultSet,MYSQLI_BOTH)) {	
						$userSettings[$m['setting']] = $m['value'];
					}
					if(!isset($userSettings['codePage'])){
						$userSettings['codePage'] = "UTF-8";
					};
					
				}
			}
			//var_dump($user);
			//exit();
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
					$userData["aa_staff"] = $user["aa_staff"];
					$userData["aa_user"] = $user["aa_user"];
					$merge = array_merge($data, $userData);
					$jwtHeader = JWT::encode($merge,$secretKey,'HS512');	
					setcookie("rToken", $jwtHeader, time()+24000, "/",$settings["server_address"], 1, 1);
					$query = 'INSERT INTO `refreshtokens`(`rToken`, `user`) VALUES ("'.$jwtHeader.'",'.$user["aa_staff"].')';
					$result=mysqli_query($con,$query) or die('database error'.mysqli_error($con)); 
					//break;
				//-------------------------JWT ----------------------------------------------------------------
				
				
				
				//-------------------------JWT ----------------------------------------------------------------
					$secretKey  = 'bGS6lzFqvvSQ8ALbOxatm7/Vk7mLQyzqaS34Q4oR1ew=';
					$issuedAt   = new DateTimeImmutable();
					$expire     = $issuedAt->modify('+10 minutes')->getTimestamp();      // Add 5 minutes
					$serverName = "10.142.49.10";
					
					$data = [
						'iat'  => $issuedAt->getTimestamp(),         // Issued at: time when the token was generated
						'iss'  => $serverName,                       // Issuer
						'nbf'  => $issuedAt->getTimestamp(),         // Not before
						'exp'  => $expire,                           // Expire
					];
					$userData = [];
					$userData["aa_staff"] = $user["aa_staff"];
					$userData["aa_user"] = $user["aa_user"];
					$userData["user"] = $user["user"];
					$merge = array_merge($data, $userData);
					$jwtHeader = JWT::encode($merge,$secretKey,'HS512');	
					
					$loginData = [];
					$loginData["jwt"] = $jwtHeader;
					$loginData["userSettings"] = $userSettings;
					$loginData["user"] = $user;
					$loginData["settings"] = $settings;
					
					echo json_encode($loginData);
					//break;
					//-------------------------JWT ----------------------------------------------------------------
			}
			
			mysqli_close($con);
		}
?>