<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html lang="el" style="height:100%">
<head>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Ηλεκτρονικές Υπηρεσίες Εγγράφων</title>
	
			<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />

		
		<link rel="stylesheet" type="text/css" href="css/all.css" />
		
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/buttons.bootstrap.min.css" >
		
		<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css" />
		
		<link rel="stylesheet" type="text/css" href="style.css" />

		<script src="js/jquery-2.1.4.min.js"></script>

		<script src="js/bootstrap.min.js"></script>	

		
		<script src="DataTables-1.10.16/js/jquery.dataTables.js"></script>
		<script src="DataTables-1.10.16/js/dataTables.bootstrap.js"></script>
		
		<script src="DataTables-1.10.16/js/dataTables.buttons.min.js"></script>
		<script src="DataTables-1.10.16/js/buttons.bootstrap.min.js"></script>
		

		<script src="js/hopscotch.js"></script>	
		<script src="js/pdfobject.min.js"></script>	
		
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script src="js/jquery-ui.min.js"></script>
		<!-- The stylesheet should go in the <head>, or be included in your CSS -->
		<link rel="stylesheet" href="tetris/blockrain.css">

		<!-- jQuery and Blockrain.js
		<script src="tetris/jquery.js"></script> -->
		<script src="tetris/blockrain.jquery.min.js"></script>
	
	
		<?php		
			session_start();
			//$multiuser = 0;
			include 'login1.php';
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
				else if ($_SESSION['accessLevel']=="2"){
					header('Location: headmaster2.php'.$queryString);
				}
				else if ($_SESSION['accessLevel']=="3"){
					header('Location: director.php'.$queryString);
				}
				else{
					echo "Access restricted";
				}
			}
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$version = "4.0.8";
		?>
		<script type="text/javascript">
		
				$( document ).ready(function() {
					$('.game').blockrain();
				});

				function setUsername(){
					var d = document.getElementById("fullname");
					var name = d.options[d.selectedIndex].value;

					document.getElementById("name").value = name;
					//alert(document.getElementById("username").value);
				}
				
				
				var capsLockEnabled = null;

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

				/**
				 * Check caps lock 
				 */
				function checkCapsWarning() {
				  document.getElementById('caps').style.display = capsLockEnabled ? 'block' : 'none';
				}

				function removeCapsWarning() {
				  document.getElementById('caps').style.display = 'none';
				}
				
				document.addEventListener('keypress',function(e){
				 if ((e.charCode >= 97 && e.charCode <= 122) || (e.charCode>=65 && e.charCode<=90)|| (e.charCode>=33 && e.charCode<=57) || e.charCode==13){
				   document.getElementById('lang').style.display =  'none';
				 }
				 else{
				   document.getElementById('lang').style.display =  'block';
				 }
				});
				
				function changeAssignmentStatus(aa){
					tempUserElement= document.getElementById(aa);
					$("#nameList > div > div > span").removeClass('label-success');
					$("#nameList > div > div > span").addClass('label-info');
					if(tempUserElement.classList.contains('label-success')){
						tempUserElement.classList.remove('label-success');
						tempUserElement.classList.add('label-info');
					}
					else{
						tempUserElement.classList.remove('label-info');
						tempUserElement.classList.add('label-success');	
					}
					document.getElementById("name").value= tempUserElement.innerHTML ;
					//$("#saveAssignmentButton  i ").addClass('faa-shake animated');
					
				}
				
		</script>
	
		<!--<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	-->
	
	<?php
		include "connection.php";
    ?>
</head>
	
<body>

	<div id="container" class="container-fluid" >
		<div id="eikona" class="container-row" style="margin-bottom:60px;margin-top:20px;">
			<div class="col-md-3 col-sm-2 text-right"><i class="fas fa-file-code fa-6x"></i></div>
			<div class="col-md-6 col-sm-8"><label class="titlos text-center col-md-12">e-digital <?php echo $version;?></label></div>
			<!--<img class="img-responsive center-block" src="images/signature.png" alt="logo eisodou"/>
			-->
			<div class="col-md-3 col-sm-2 text-left"><i class="fas fa-file-code fa-6x"></i></div>
		</div >
		<div style="padding-top:100px;">
			<form action="<?php $_SERVER['PHP_SELF'];?>" method="post" id="login" role="form">
			<div class="form-row" >
				<div class="form-group col-lg-3 col-md-12 col-sm-12" style="background-color:rgba(255,255,255,0.7)">
					<div class="form-group " style="font-family:robot">
						<label for="name" class="control-label">ΟΝΟΜΑ ΧΡΗΣΤΗ</label>
						<input  class="form-control" id="name" name="name" value=""/>
						<label for="pass" class="control-label">ΚΩΔΙΚΟΣ</label>
						<input type="password" class="form-control" id="pass" name="pass" placeholder="ΚΩΔΙΚΟΣ ΠΡΟΣΒΑΣΗΣ" onkeyup="checkCapsWarning(event)" onfocus="checkCapsWarning(event)" onblur="removeCapsWarning()"/>
						<div style="display:none;color:red" id="caps">Προσοχή! Το πλήκτρο CapsLock είναι ενεργοποιημένο</div>
						<div style="display:none;color:red" id="lang">Προσοχή! Δε γράφετε στην Αγγλική Γλώσσα</div>
						<div class="form-group" style="padding-top:10px;">
							<button type="submit" class="btn btn-btn-primary" id="submit_form"/>ΥΠΟΒΟΛΗ</button>
						</div>
					</div>
					<div id="versionChanges" style="overflow-y: scroll; height:400px;margin-top : 3em;">
						<?php include 'versions_log.html' ?>
					</div>
					<!--<div class="game" style="height:700px;"></div>-->
				</div>
			</form>
				<div class="form-group col-lg-9 col-md-12 col-sm-12" style="height : 300px;" id="nameList">
					<!--<label for="fullname" class="control-label">Επιλογή Ονόματος Χρήστη</label>
					<select id='fullname' name='fullname' class="form-control" onchange="setUsername();">
					<?php
						mysqli_query($con,"set names utf8");
						$res=mysqli_query($con,'SELECT fullName,attendanceNumber FROM `staff` where signatureActive=1 UNION
						SELECT fullName,attendanceNumber FROM `staff` where staffType=9 or aa=59 or aa=68  or aa=116
						order by fullName asc;') or die('database error'); // 59 kai 68 oi proistamenoi pou allios de mporousan na emfanistoun
						while ($k = mysqli_fetch_array($res)) {
							echo '<option value="'.$k['fullName'].'">'.$k['fullName'].'</option>';
						}
					?>
					</select>-->
						
						<?php 		
								mysqli_query($con,"SET NAMES 'UTF8'");
								$erotima = "select aa,fullname from staff where signatureActive=1 order by fullname asc";
								$result1 = mysqli_query($con,$erotima) or die ("database read error - show table attachments");
								$i = 0;
								$countStaff = mysqli_num_rows($result1);
								$rowsPerCol = 17;
								$cols = ($countStaff - $countStaff % $rowsPerCol) / $rowsPerCol;
								if ($countStaff%$rowsPerCol == 0){
									
								}
								else{
									$cols=$cols +1; 
								}
								for ($j=0;$j<$cols;$j++){
									echo '<div class="col-xl-3 col-lg-4 col-md-4 col-4 col-sm-4" style="background-color:rgba(255,255,255,0.7)";>';
									for ($i=0;$i<$rowsPerCol;$i++){
											if (($j*$rowsPerCol+$i+1)>$countStaff){
												break;
											}
											$row1 = mysqli_fetch_array($result1, MYSQLI_BOTH);	
											echo '<div style="padding:6px;border;"><span style="display: block;border-radius: 15px 30px;border:1px solid black;font-size:0.9em;color: black;background-color : 	 #ffd699; margin-top :5px;padding:5px;letter-spacing: 1.5px;font-family: robot ;" class="label label-warning" id="user'.$row1['aa'].'" onclick="changeAssignmentStatus(\'user'.$row1['aa'].'\')" >'.$row1['fullname'].'</span></div>';
									}
									echo '</div>';
								}
								//echo $cols;
								
						?>						
				</div>

					<!--<input type="text" class="form-control" id="name" name="name" placeholder="Όνομα Χρήστη"/>-->
				
					<br><br>

			</div>
		</div>
		<div id="bottom" class="text-center">
			<!--<h6><i class="fas fa-keyboard"></i>&nbsp<b> ΣΧΕΔΙΑΣΜΟΣ ΙΑΚΩΒΙΔΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ 2018 </b></h6>
			<h6><i class="fas fa-keyboard"></i>&nbsp<b> ΤΜΗΜΑ ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΝΕΩΝ ΤΕΧΝΟΛΟΓΙΩΝ Π.Δ.Ε ΔΥΤΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ 2018 </b></h6>-->
		</div>
	</div>
	

</body>


</html>