<!DOCTYPE html>

<html>
	<head>
	
	
		<?php
			session_start();
			include 'login.php';
			if (!isset($_SESSION['user'])){
				//if ($_SESSION['privilege']=="1") {
					header('Location: index.php');
				//}
				//else{
				//	echo "Access restricted";
				//}
			}

		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
						<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />

		<link rel="stylesheet" type="text/css" href="style.css" />
		
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
		
		<link href="css/fontawesome-all.css" rel="stylesheet">
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script src="js/jquery-ui.min.js"></script>
		
		<script type="text/javascript">	
		
			
			function uploadfile(){
				var data = new FormData();
				data.append('selectedFile', document.getElementById('selectedFile').files[0]);
				var xmlhttp;
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
						//document.getElementById("soma").innerHTML=xmlhttp.responseText;
						var response = xmlhttp.responseText;
						alert(xmlhttp.responseText);
						var checkSigned = response.search("@");
						if (checkSigned != "-1"){
							notifyMe(response);
						}
						location.reload();
					}
				}
				xmlhttp.open("POST","upload.php");
				xmlhttp.send(data);	
			}	
		
			function notifyMe(e) {
				var notification = new Notification(e);
				  // Let's check if the browser supports notifications
				  if (!("Notification" in window)) {
					alert("This browser does not support desktop notification");
				  }

				  // Let's check whether notification permissions have already been granted
				  else if (Notification.permission === "granted") {
					// If it's okay let's create a notification
					var notification = new Notification(e);
				  }

				  // Otherwise, we need to ask the user for permission
				  else if (Notification.permission !== "denied") {
					Notification.requestPermission(function (permission) {
					  // If the user accepts, let's create a notification
					  if (permission === "granted") {
						var notification = new Notification(e);
					  }
					});
				  }
			}
			
			
			
			function allowDrop(ev) {
				ev.preventDefault();
			}

			
			
			function drag(ev) {
				ev.dataTransfer.setData("text", ev.target.id);
			}

			
			
			function drop(ev) {
				ev.preventDefault();
				var data = ev.dataTransfer.getData("text");
				ev.target.innerHTML="";
				ev.target.appendChild(document.getElementById(data));
			}
			
			
			$(document).ready(function(){
				$('[data-toggle="tooltip"]').tooltip(); 
				
			});
			
			
		</script>	

		<style>
			@media print {
				.ektos {display:none};
			}
		</style>		

			
	</head>
	<body>
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
						<!--<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">
						<i class="fas fa-tags fa-3x"></i>-->
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li id="prosIpografi" class=" text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>"><span class="label label-warning">Προς Υπογραφή</span></br></br><i class="far fa-file fa-lg"></i></a></li>
						<li id="ipogegrammena" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>"><span class="label label-success">Υπογεγραμμένα</span></br></br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<li id="aporrifthenta" class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>"><span class="label label-danger">Απορριφθέντα</span></br></br><i class="far fa-file-excel fa-lg"></i></a></li>
						<?php 
							if ($_SESSION['protocolAccessLevel'] == 1){
								echo '<li class="text-center"><a target="_blank" href="http://'.$_SERVER['SERVER_ADDR'].'/nocc-1.9.8/index.php"><span class="label label-primary">Emails</span></br></br><i class="fas fa-envelope  fa-lg"></i></a></li>';
							}
							
						?>
							
						<li class="text-center"><a target="_blank" href="
						<?php 
							if ($_SESSION['protocolAccessLevel'] == 1){
								echo "http://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/editTable1.php?tn=book";
							}
							else if ($_SESSION['protocolAccessLevel'] == 2){
								echo "http://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/editTableAdvUser.php?tn=book";
							}
							else{
								echo "http://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/editTableUser.php?tn=book";
							}
						
						?>"><span class="label label-primary">
						
						<?php
						if ($_SESSION['protocolAccessLevel'] == 0){
							echo "Χρεώσεις Μου";
						}
						else {
							echo "Διαχειριστής";
						}
	
						?>
						</span></br></br><i class="fas fa-book fa-lg"></i></a></li>
						
								
						<li class="text-center"><a target="_blank" href="
						<?php 
						
								echo "http://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/protocolBook.php?tn=book";
							
						
						?>"><span class="label label-primary">
						Πρωτόκολλο</span></br></br><i class="fab fa-readme fa-lg"></i></a></li>
						
						<!-- <?php 
							if (isset($_SESSION['accessLevel1'])){
								switch ($_SESSION['accessLevel1']){
									case 0 :
										echo '<li class="text-center"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php">Αλλαγή σε Χρήστη<br><span class="glyphicon glyphicon-random" style="font-size: 25px;" aria-hidden="true"></a></li>';
										break;
									case 1 :
										echo '<li class="text-center"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php">Αλλαγή σε Προϊστάμενο Β<br><span class="glyphicon glyphicon-random" style="font-size: 25px;" aria-hidden="true"></a></li>';
										break;
									case 2 :
										echo '<li class="text-center"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php">Αλλαγή σε Προϊστάμενο Α<br><span class="glyphicon glyphicon-random" style="font-size: 25px;" aria-hidden="true"></a></li>';
										break;
									case 3 :
										echo '<li class="text-center"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php">Αλλαγή σε Διευθυντή<br><span class="glyphicon glyphicon-random" style="font-size: 25px;" aria-hidden="true"></a></li>';
										break;
								}

							}
						?> -->
						<li class="text-center"><a href="#" onclick="runHelp()"><span class="label label-info">Βοήθεια</span></br></br><i class="fas fa-question fa-lg"></i></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php"><span class="label label-default">Αποσύνδεση</span></br></br><i class="fas fa-power-off fa-lg"></i></a></li>
						<li class="text-center" id="emfanisiOnomatos" style="padding-left:100px;"><a><b>Χρήστης </br></br></b><?php echo $_SESSION['user'];?></a></li>
						<?php 
							if (isset($_SESSION['accessLevel1'])){
								echo '<li class="text-center"><div class="dropdown" style="padding-top:20px">';
								echo  '<button class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">';
								echo 'Αλλαγή Ιδιότητας';
								echo '<span class="caret"></span></button>';
								echo '<ul class="dropdown-menu">';
								echo '<li class="disabled"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=1">'.$_SESSION['roleName'].'</a></li>';	
								echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=2">'.$_SESSION['roleName1'].'</a></li>';
								if (isset($_SESSION['accessLevel2'])){
									echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=3">'.$_SESSION['roleName2'].'</a></li>';
								}
								echo '</ul></li></div>';
							}
						?>
					</ul>
					
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Έγγραφα που απορρίφθηκαν</span><br><br>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
			<div class="table-responsive" id="soma">
				<table class="table table-striped">
					<thead>
					  <tr>
						<th>Έγγραφο που απορρίφθηκε</th>
						<th>Ημερομηνία Εισαγωγής</th>
						<th>Αποστολέας</th>
						<th>Ιστορικό</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");					 
						if($_SESSION['accessLevel']==0){						
							$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0 and
								aa in (select revisionId from filestobesigned where nextLevel=-2)";
	
						}
						else{
							 $sql="SELECT * from filestobesigned where revisionId=0 and aa in 
							 (select revisionId from filestobesigned where nextLevel=-2 
							and userId in (select attendanceId from signpasswords where prime=1 
							and department=".$_SESSION['department'].")) order by date desc";
							//echo $sql;
						}
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							//$sql1 = "SELECT nextLevel from filestobesigned where aa=(select max(aa)from 
							//filestobesigned where revisionId=".$row['aa'].")";
							//$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							//$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							//if ($row1['nextLevel']==-2){
								echo '<tr class="danger"><td>';				//egkrisi apo perifereiako
								echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td>';
								echo $row['date'].'</td><td>';
								echo $row['fromIP'].'</td><td>';
								echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-info-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								echo "</td></tr>";
							//}
					  }
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
	</body>
</html>