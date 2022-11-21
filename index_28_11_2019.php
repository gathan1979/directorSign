<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html lang="el">
<head>

		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Ηλεκτρονικές Υπηρεσίες Εγγράφων</title>
	
			<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />

		<link rel="stylesheet" type="text/css" href="style.css" />
		<link rel="stylesheet" type="text/css" href="css/all.css" />
		
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/buttons.bootstrap.min.css" >
		
		<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css" />

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
	
	
		<?php		
			session_start();
			//$multiuser = 0;
			include 'login.php';
			//$queryString = "?multiuser=".$multiuser;
			if (isset($_SESSION['user'])){
				if ($_SESSION['accessLevel']=="0") {
					header('Location: startPage.php'.$queryString);
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

		?>
		<script type="text/javascript">

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
				 if ((e.charCode >= 97 && e.charCode <= 122) || (e.charCode>=65 && e.charCode<=90)|| (e.charCode>=33 && e.charCode<=57)){
				   document.getElementById('lang').style.display =  'none';
				 }
				 else{
				   document.getElementById('lang').style.display =  'block';
				 }
				});
				
		</script>
	
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
	
	<?php
		include "connection.php";
    ?>
</head>
	
<body>

	<div id="container" class="container-fluid">
		<div id="eikona" class="text-center" style="padding-bottom:20px;">
			<label class="titlos text-center col-md-12">e-digital v2.2</label>
			<!--<img class="img-responsive center-block" src="images/signature.png" alt="logo eisodou"/>
			-->
			<i class="fas fa-file-code fa-10x"></i>
		</div >
			<form action="<?php $_SERVER['PHP_SELF'];?>" method="post" id="login" role="form">
			  <div class="form-row">
					<div class="form-group col-md-3">
						<label for="name" class="control-label">Όνομα Χρήστη</label>
						<input  class="form-control" id="name" name="name" value=""/>
					</div>
					<div class="form-group col-md-9">
						<label for="fullname" class="control-label">Επιλογή Ονόματος Χρήστη</label>
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
						</select>
					</div>

					<!--<input type="text" class="form-control" id="name" name="name" placeholder="Όνομα Χρήστη"/>-->
				
					<br><br>
					<div class="form-group col-md-3">
						<label for="pass" class="control-label">Κωδικός</label>
						<input type="password" class="form-control" id="pass" name="pass" placeholder="Κωδικός Πρόσβασης" onkeyup="checkCapsWarning(event)" onfocus="checkCapsWarning(event)" onblur="removeCapsWarning()"/>
						<div style="display:none;color:red" id="caps">Προσοχή! Το πλήκτρο CapsLock είναι ενεργοποιημένο</div>
						<div style="display:none;color:red" id="lang">Προσοχή! Δε γράφετε στην Αγγλική Γλώσσα</div>
					</div>
				</div>
				<br><br>
				<div class="form-row">
					<div class="form-group col-md-12">
						<button type="submit" class="btn btn-btn-primary" id="submit_form"/>Υποβολή</button>
					</div>
				</div>
				</br>
				  
			</form>
			<br><br><br>
		<div id="bottom" class="text-center">
			<!--<h6><i class="fas fa-keyboard"></i>&nbsp<b> ΣΧΕΔΙΑΣΜΟΣ ΙΑΚΩΒΙΔΗΣ ΚΩΝΣΤΑΝΤΙΝΟΣ 2018 </b></h6>
			<h6><i class="fas fa-keyboard"></i>&nbsp<b> ΤΜΗΜΑ ΠΛΗΡΟΦΟΡΙΚΗΣ ΚΑΙ ΝΕΩΝ ΤΕΧΝΟΛΟΓΙΩΝ Π.Δ.Ε ΔΥΤΙΚΗΣ ΜΑΚΕΔΟΝΙΑΣ 2018 </b></h6>-->
		</div>
	</div>
	

</body>


</html>