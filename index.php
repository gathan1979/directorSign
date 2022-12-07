<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html lang="el" style="height:100%">
<head>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Ηλεκτρονικές Υπηρεσίες Εγγράφων</title>
	
			<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="css/all.css" />
		
		
		<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css" />
		
		<link rel="stylesheet" type="text/css" href="style.css" />

		<script src="js/jquery-2.1.4.min.js"></script>

		<script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>	


		
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script src="js/jquery-ui.min.js"></script>
		<!-- The stylesheet should go in the <head>, or be included in your CSS -->
		<link rel="stylesheet" href="tetris/blockrain.css">

		<!-- jQuery and Blockrain.js
		<script src="tetris/jquery.js"></script> -->
		<script src="tetris/blockrain.jquery.min.js"></script>
	
	
		<?php		
			session_start();
			$_SESSION['loginTime'] = time();

			//$multiuser = 0;
			//include 'login1.php';
			//$queryString = "?multiuser=".$multiuser;
			if (isset($_SESSION['user'])){
				if ($_SESSION['accessLevel']=="0") {
					header('Location: headmaster1.php'.$queryString);
				}
				else if ($_SESSION['accessLevel']=="1"){
					if ($_SESSION['department']=='0'||$_SESSION['department']=='1'||$_SESSION['department']=='3'||$_SESSION['department']=='4'){
						header('Location: headmaster1.php'.$queryString);
					}
					else{
						header('Location: headmaster1.php'.$queryString);
					}
				}
				else{
					echo "Access restricted";
				}
			}
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$handle = fopen("versions_log.html", "r");
			if ($handle) {
				$line = fgets($handle);
				$parts= explode("<b>",$line);
				$parts = explode("</b>",$parts[1]);
				$parts = explode(" ",$parts[0]);
				$version = $parts[0];
				fclose($handle);
			} else {
				$version = "unknown version";
			} 
		?>
		
		
		
		<script type="text/javascript">
		
				var capsLockEnabled = null;
		
				$( document ).ready(function(){
					$('.game').blockrain();
				});

				// function setUsername(){
					// var d = document.getElementById("fullname");
					// var name = d.options[d.selectedIndex].value;
					// document.getElementById("name").value = name;
				// }


				function getChar(e) {
				  if (e.which == null) {
					return String.fromCharCode(e.keyCode); // IE
				  }
				  if (e.which != 0 && e.charCode != 0) {
					return String.fromCharCode(e.which); // rest
				  }
				  return null;
				}

				document.onkeydown = function(e) {
				  e = e || event;

				  if (e.keyCode == 20 && capsLockEnabled !== null) {
					capsLockEnabled = !capsLockEnabled;
				  }
				}

				document.onkeypress = function(e) {
				  e = e || event;
				  var chr = getChar(e);
				  if (!chr) return; // special key

				  if (chr.toLowerCase() == chr.toUpperCase()) {
					// caseless symbol, like whitespace 
					// can't use it to detect Caps Lock
					return;
				  }
				  capsLockEnabled = (chr.toLowerCase() == chr && e.shiftKey) || (chr.toUpperCase() == chr && !e.shiftKey);
				}
				
				document.addEventListener('keypress',function(e){
				 if ((e.charCode >= 97 && e.charCode <= 122) || (e.charCode>=65 && e.charCode<=90)|| (e.charCode>=33 && e.charCode<=57) || e.charCode==13){
				   document.getElementById('lang').style.display =  'none';
				 }
				 else{
				   document.getElementById('lang').style.display =  'block';
				 }
				});
				

				/**
				 * Check caps lock 
				 */
				function checkCapsWarning() {
				  document.getElementById('caps').style.display = capsLockEnabled ? 'block' : 'none';
				}

				function removeCapsWarning() {
				  document.getElementById('caps').style.display = 'none';
				}
					
				function changeAssignmentStatus(aa){
					tempUserElement= document.getElementById(aa);
					let userBtns = document.querySelectorAll("#nameList > div > div > div > span");
					userBtns.forEach( btn =>{
						if (tempUserElement !== btn){
							btn.classList.remove('bg-success');
							btn.classList.add('bg-warning','text-dark');
						}
					})
					//$("#nameList > div > div > span").removeClass('label-success');
					//$("#nameList > div > div > span").addClass('label-info');
					if(tempUserElement.classList.contains('bg-success') ===true){
						tempUserElement.classList.remove('bg-success');
						tempUserElement.classList.add('bg-warning','text-dark');
						document.getElementById("name").value="";
						console.log("warn");
					}
					else{
						tempUserElement.classList.remove('bg-warning','text-dark');
						tempUserElement.classList.add('bg-success');	
						console.log("succ");
						document.getElementById("name").value= tempUserElement.innerHTML ;
					}
					
					//$("#saveAssignmentButton  i ").addClass('faa-shake animated');
					
				}
				
				async function login(){
					let formData = new FormData();
					formData.append('name',document.getElementById("name").value);
					formData.append('pass',document.getElementById("pass").value);
					let init = {method: 'POST', body: formData};
					//console.log(init);
					const res = await fetch("login1.php",init); 
					if (res.status >= 200 && res.status <= 299) {
						//const resdec = await res.json();
						//console.log(resdec);
						//localStorage.setItem("jwt",resdec);
						//return res.json();
						<!-- let jwt = localStorage.getItem("jwt"); -->
						<!-- const testInit = {headers: {'Authorization': `Bearer ${jwt}`}}; -->
						<!-- const test = await fetch("test1.php",testInit);  -->
						<!-- if (test.status >= 200 && test.status <= 299) { -->
							<!-- console.log(await test.text()); -->
						<!-- } -->
						location.href= "headmaster1.php"
					}
					else{
						alert("Σφάλμα στην αυθεντικοποίηση");
					}
				}
				
				async function login1(){
					let formData = new FormData();
					formData.append('name',document.getElementById("name").value);
					formData.append('pass',document.getElementById("pass").value);
					let init = {method: 'POST', body: formData};
					//console.log(init);
					const res = await fetch("login2JWT.php",init); 
					if (res.status >= 200 && res.status <= 299) {
						const loginData = await res.json();
						localStorage.setItem("loginData",JSON.stringify(loginData));
						console.log(JSON.parse(localStorage.getItem("loginData")));
						localStorage.setItem("currentRole",0);
						location.href= "headmaster1_test.php"
					}
					else{
						alert("Σφάλμα στην αυθεντικοποίηση");
					}
				}
				
		</script>
	
	<?php
		include "connection.php";
    ?>
</head>
	
<body>

	<div id="container" class="container-fluid" >
		<div id="eikona" class="row" style="margin-bottom:60px;margin-top:20px;">
			<div class="col-md-3 col-sm-2 text-right"><i class="fas fa-balance-scale-left fa-6x"></i></div>
			<div class="col-md-6 col-sm-8"><label class="titlos text-center col-md-12">Aianos <?php echo $version;?></label></div>
			<!--<img class="img-responsive center-block" src="images/signature.png" alt="logo eisodou"/>
			-->
			<div class="col-md-3 col-sm-2 text-left"><i class="fas fa-balance-scale-right fa-6x"></i></div>
		</div >
		<div  class="row" style="padding-top:100px;">
			
			<div class="col-lg-4 col-md-12 col-sm-12" style="padding-left:1em;">
				<div class="col-12">
					<form class="form-horizontal" action="<?php $_SERVER['PHP_SELF'];?>" method="post" id="login" role="form">
						<div class="form-group " style="background-color:rgba(255,255,255,0.7);padding-left:1em;">
							<!--<div class="form-group " style="font-family:robot">-->
								<label for="name" class="control-label">ΟΝΟΜΑ ΧΡΗΣΤΗ</label>
								<input  class="form-control" id="name" name="name" value="" placeholder="ΕΠΙΛΕΞΤΕ ΑΠΟ ΤΗ ΛΙΣΤΑ"/>
								<label for="pass" class="control-label">ΚΩΔΙΚΟΣ</label>
								<input type="password" class="form-control" id="pass" name="pass" placeholder="ΚΩΔΙΚΟΣ ΠΡΟΣΒΑΣΗΣ" onkeyup="checkCapsWarning(event)" onfocus="checkCapsWarning(event)" onblur="removeCapsWarning()"/>
								<div style="display:none;color:red" id="caps">Προσοχή! Το πλήκτρο CapsLock είναι ενεργοποιημένο</div>
								<div style="display:none;color:red" id="lang">Προσοχή! Δε γράφετε στην Αγγλική Γλώσσα</div>
								<!--<div class="form-group" style="padding-top:10px;">
									<button type="submit" class="btn btn-btn-primary" id="submit_form"/>ΥΠΟΒΟΛΗ</button>
								</div>
							</div>
								<button style="margin-top : 0.5em;" type="submit" class="btn btn-primary" id="submit_form"/>Είσοδος</button>-->
								<button style="margin-top : 0.5em;" type="button" onclick="login();" class="btn btn-success" id="submit_form1"/>Σύνδεση</button>
								
							<!--<div class="game" style="height:700px;"></div>-->
						</div>
					</form>
				</div>
				<!--<div class="alert alert-success" role="alert">
				<?php 
					//$page =@file_get_contents("https://michanorg.sites.sch.gr/wordpress/versions.html");
					//if ($page !== false){
						//echo $page;
					//}
				?>
				</div>-->
				<div class="col-12" id="versionChanges" style="overflow-y: scroll; height:400px;margin-top : 3em;">
							<?php include 'versions_log.html' ?>
				</div>
			</div>
			<div class="col-lg-8 col-md-12 col-sm-12" style="height : 300px;" id="nameList">
				<div class="row">
					<?php 		
							mysqli_query($con,"SET NAMES 'UTF8'");
							$erotima = "select aa,fullname from staff where signatureActive=1 order by fullname asc";
							$result1 = mysqli_query($con,$erotima) or die ("database read error - show table attachments");
							$i = 0;
							$countStaff = mysqli_num_rows($result1);
							$rowsPerCol = 12;   // auto edo prepei na allazei - posoi emfanizontai ana grammi !!!!!!!!!!!!!!!!!!!!!!!
							$cols = ($countStaff - $countStaff % $rowsPerCol) / $rowsPerCol;
							if ($countStaff%$rowsPerCol == 0){
								
							}
							else{
								$cols=$cols +1; 
							}
							//echo "columns :".$cols;
							$colsize= intdiv(12,$cols);
							for ($j=0;$j<$cols;$j++){
								echo '<div class="col-xl-'.$colsize.' col-lg-'.$colsize.' col-md-'.$colsize.' col-4 col-sm-'.$colsize.' " style="background-color:rgba(255,255,255,0.7)";>';
								for ($i=0;$i<$rowsPerCol;$i++){
										if (($j*$rowsPerCol+$i+1)>$countStaff){
											break;
										}
										$row1 = mysqli_fetch_array($result1, MYSQLI_BOTH);	
										echo '<div style="padding:6px;border;"><span style="display: block;border-radius: 15px 30px;border:1px solid black;font-size:0.8em;background-color : 	 #ffd699; margin-top :5px;padding:5px;letter-spacing: 1.5px;" class="badge bg-warning text-dark" id="user'.$row1['aa'].'" onclick="changeAssignmentStatus(\'user'.$row1['aa'].'\')" >'.$row1['fullname'].'</span></div>';
								}
								echo '</div>';
							}
					?>	
				</div>			
			</div>
		</div>
		<div class="col-12 text-center" id="bottom" style="margin-top:4em">

		</div>
	</div>
	

</body>
	<?php
		//var_dump( $_SESSION);
	?>

</html>