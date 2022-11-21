<!DOCTYPE html>

<html>
	<head>
	
	
		<?php
			session_start();
			include 'login.php';
			if (!isset($_SESSION['user'])){
				if ($_SESSION['privilege']!="1") {
					header('Location: index.php');
				}
				//else{
				//	echo "Access restricted";
				//}
			}
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$page = $_SERVER['PHP_SELF'];
			$sec = "90";

		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="style.css" />
		<link rel="stylesheet" type="text/css" href="datatables-1.10.16/css/dataTables.bootstrap.min.css" >
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
		<script src="datatables-1.10.16/js/dataTables.bootstrap.min.js"></script>
		<script src="datatables-1.10.16/js/jquery.dataTables.min.js"></script>
		
		<script type="text/javascript">	
		
			
			function uploadfile(){
				var data = new FormData();
				data.append('selectedFile', document.getElementById('selectedFile').files[0]);
				data.append('authorComment', document.getElementById('authorComment').value);
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
				$('#example1').DataTable( {
				"bFilter": true,
				"paging":   false,
				"ordering": true,
				"order": [[ 1, "desc" ]],
				"info":     false,
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
				});
				
			});
			
			$(function () {
				$(".showModal").click(function(e) {
					e.preventDefault();
					//$("#loading").fadeIn();
					var url=$(this).attr("href");
					setTimeout(function() {
						setTimeout(function() {$("#loading").fadeIn();},90);
						window.location=url;
					},0);

			   });
			});
			
		</script>	

		<style>
			@media print {
				.ektos {display:none};
			}
			
			#loading {
				display:none;
				position:absolute;
				left:0;
				top:0;
				z-index:1000;
				width:100%;
				height:100%;
				min-height:100%;
				background:white;
				opacity:0.8;
				text-align:center;
				color:#fff;
			}
		</style>		

		<meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">	
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
						<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>">Έγγραφα Προς Υπογραφή <br><span class="glyphicon glyphicon-hand-right" style='font-size: 25px;' aria-hidden="true"></a></li>
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>">Υπογεγραμμένα Έγγραφα<br><span class="glyphicon glyphicon-thumbs-up"  style='font-size: 25px;' aria-hidden="true"></a></li>
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>">Απορριφθέντα Έγγραφα<br><span class="glyphicon glyphicon-thumbs-down" style='font-size: 25px;' aria-hidden="true"></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><span class="glyphicon glyphicon-off" style='font-size: 25px;'  aria-hidden="true"></a></li>

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
			<br><span class="label label-default">Έγγραφα για ψηφιακή υπογραφή</span><br><br>
			</h4>
				<button data-toggle="collapse" data-target="#demo">Ανέβασμα νέου Σχεδίου (doc, xls, pdf)</button>
				<div id="demo" class="collapse">
					</br>
					<input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX"/><br>
					<div>
						<label for="uname">Εισαγωγή Σχολίου: </label>
						<textarea type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
					</div>
					<br><br>
					<input type="button" class="btn btn-default ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση"/>
				</div>
			<hr>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
				<br><div class="table-responsive" id="soma"><br>
				<table class="table table-striped" id="example1">
					<thead>
					  <tr>
						<th class="text-right">Έγγραφο προς Υπογραφή</th>
						<th class="text-right">Ημερομηνία Εισαγωγής</th>
						<th class="text-right">Αποστολέας</th>
						<th class="text-right">Παρατηρήσεις</th>
						<th class="text-right">Ενέργειες</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
					  include 'connection1.php';	
					  mysqli_query($con,"set names utf8");					 
					  $sql = "SELECT * from filestobesigned where revisionId=0 and userId in (select attendanceId 
						from signpasswords where department=".$_SESSION['department'].");";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							$sql1 = "SELECT * from filestobesigned where aa=(select max(aa)from 
							filestobesigned where revisionId=".$row['aa'].")";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							
							$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							
							if ($row1!=NULL){      //arxeio me allages
								if($row1['nextLevel']==1){
									echo '<tr class="warning"><td class="text-right">';										
									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
									echo $row['date'].'</td><td class="text-right">';
									echo $row2['fullName'].'</td><td class="text-right">';
									echo $row['comments'].'</td><td class="text-right">';
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
									if ($_SESSION['accessLevel']>="1"){	
										echo "<a class='showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-upload' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a></td></tr>";
									}
								}
							}
							else{              // nea eisagogi arxeiou
								echo '<tr class="success"><td class="text-right">';
								echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
								echo $row['date'].'</td><td class="text-right">';
								echo $row2['fullName'].'</td><td class="text-right">';
								echo $row['comments'].'</td><td class="text-right">';
								echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true'  data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								if ($_SESSION['accessLevel']>="1"){		
									//echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward2.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-upload' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση'></a>&nbsp&nbsp";
									echo "<a class='showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση - Ψηφιακή Υπογραφή Εγγράφου'></a>&nbsp&nbsp&nbsp&nbsp";
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp&nbsp&nbsp";
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a></td></tr>";
								}
							}
					  }
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
		<div id="loading">
			<img src="images/loading.gif" alt="loading">
		</div>
	</body>
</html>