<!DOCTYPE html>

<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php
		session_start();
		if (!isset($_SESSION['user'])){
			header('Location: index.php');
		}
		include 'connection.php';
		include $_SERVER['DOCUMENT_ROOT'].'/adeies/qrcode/phpqrcode/qrlib.php';

	?>
	
		<title>Ρύθμιση Υπογραφής</title>
		
		 <!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/buttons.bootstrap.min.css" >


		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
		
		<script src="DataTables-1.10.16/js/jquery.dataTables.js"></script>
		<script src="DataTables-1.10.16/js/dataTables.bootstrap.js"></script>
		
		<script src="DataTables-1.10.16/js/dataTables.buttons.min.js"></script>
		<script src="DataTables-1.10.16/js/buttons.bootstrap.min.js"></script>
		<script src="js/hopscotch.js"></script>	
		
		<script defer src="js/fontawesome.min.js"></script>	
		<link rel="stylesheet" type="text/css" href="css/all.css" />
		<link rel="stylesheet" type="text/css" href="style.css" />
		
		
		<script type="text/javascript">
		
			function kataxorisi (e){
				var xmlhttp, r = "";
				if (window.XMLHttpRequest)
				  {// code for IE7+, Firefox, Chrome, Opera, Safari
					xmlhttp=new XMLHttpRequest();
				  }
				else
				{// code for IE6, IE5
					xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
				}
				xmlhttp.onreadystatechange=function()
				{
					if (xmlhttp.readyState==4 && xmlhttp.status==200)
					{
						var response = xmlhttp.responseText;
						alert(response);
						//location.reload();
					}
				}
				var oldpass = encodeURIComponent(document.getElementById("oldpasswd").value);
				var newpass = encodeURIComponent(document.getElementById("passwd").value);
				var newpass2 = encodeURIComponent(document.getElementById("passwd2").value);		
				r = "aaP="+document.getElementById("xristis").value+"&aa="+document.getElementById("aaXristi").value+"&passwd="+newpass+"&passwd2="+newpass2+"&oldpasswd="+oldpass;
				var url = "changePassword.php";
				//alert(url);
				xmlhttp.open("POST",url,true);
				xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				xmlhttp.send(r);	
			}	
			
			function showPass(field) {
				if (field == "passwd"){
					 var x = document.getElementById("passwd");
				}
				else if (field == "passwd2"){
					var x = document.getElementById("passwd2");
				}
				else if (field == "oldpasswd"){
					var x = document.getElementById("oldpasswd");
				}
			 
				if (x.type === "password") {
					x.type = "text";
				} else {
					x.type = "password";
				}
			}
			
		</script>
		
	</head>
	<body>
			<?php
				include 'connection.php';
				mysqli_query($con,"SET NAMES 'UTF8'");
				$erotima2 = "select * from `staff` where aa=".$_GET['aa'];
				$result2 = mysqli_query($con,$erotima2) or die ("database read error - get staffType");
				$row2 = mysqli_fetch_array($result2, MYSQLI_BOTH);
			
			?>		
		<nav class="navbar navbar-default">
					<div class="container-fluid">
						<div class="navbar-header">
							<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
								<span class="sr-only">Toggle navigation</span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
								<span class="icon-bar"></span>
							  </button>
							<a class="navbar-brand" href="#">
								<i class="fas fa-file-signature fa-3x"></i>
							 </a>
						</div>
						 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
							<input class="hidden" name="xristis" id="xristis" value="<?php echo $row2['attendanceNumber']; ?>"/>
							<input class="hidden" name="line" id="line" value="<?php echo $_GET['line']; ?>"/>
							<input class="hidden" name="aaXristi" id="aaXristi" value="<?php echo $_GET['aa']; ?>"/>
							<ul class="nav navbar-nav">
								<li class=" text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/";?>directorSign">Πίσω<br><i class="far fa-arrow-alt-circle-left fa-2x" style="padding-top: 5px;"></i></a></li>
								<li class="active text-center"><a href="#">Αλλαγή Κωδικού<br><i class="fas fa-edit fa-2x" style="padding-top: 5px;"></i></a></li>
								<li class="text-center"><a href="logout.php">Αποσύνδεση<br><i class="fas fa-power-off fa-2x" style="padding-top: 5px;"></i></a></li>
							</ul>
						</div><!-- /.navbar-collapse -->
					</div><!-- /.container-fluid -->
			</nav>
			<ol class="breadcrumb ">
			  <li>Διαχείριση</li>
			   <li class="active">Επεξεργασία Χρήστη</li>
				<li class="active">Αλλαγή Κωδικού Πρόσβασης</li>
			</ol>
		
		<div id="soma" class="container-fluid col-md-12 ">
			<div class="table-responsive col-md-8">

				<table class="table table-hover" >
					<tr><td class="emfanisi">Επώνυμο Όνομα</td><td><input type="text" name="name" id="name" value="<?php echo $row2['fullName']?>" style="text-transform:uppercase" disabled/></td></tr>
					<tr><td class="emfanisi">Παλιός Κωδικός Πρόσβασης</td><td><input type="password" size="60" name="oldpasswd" id="oldpasswd" />&nbsp<i onclick="showPass('oldpasswd')" class="fas fa-eye fa-1x"></i></td></tr>					
					<tr><td class="emfanisi">Νέος Κωδικός Πρόσβασης</td><td><input type="password" size="60" name="passwd" id="passwd" />&nbsp<i onclick="showPass('passwd')" class="fas fa-eye fa-1x"></i></td></tr>
					<tr><td class="emfanisi">Επανεισαγωγή Νέου Κωδικού Πρόσβασης</td><td><input type="password" size="60" name="passwd2" id="passwd2" />&nbsp<i onclick="showPass('passwd2')" class="fas fa-eye fa-1x"></i></td></tr>

					<tr><td></td><td><input type="button" id="import" value="Επεξεργασία" onclick="kataxorisi(event);"/></td></tr>
				</table>
				<?php
					echo "<hr> Αύξον Αριθμός Χρήστη :".$_GET['aa'];
					echo "<br> Αύξον Αριθμός Χρήστη στο Παρουσιολόγιο :".$row2['attendanceNumber'];
					mysqli_close($con);
				?>
			</div>
		</div>
	</body>
</html>