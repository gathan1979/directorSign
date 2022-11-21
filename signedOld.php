<!DOCTYPE html>

<html>
	<head>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="style.css" />
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
		
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
						alert(xmlhttp.responseText);
					}
				}
				xmlhttp.open("POST","upload.php");
				xmlhttp.send(data);	
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
						<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						
						<li class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>">Έγγραφα Προς Υπογραφή<br><span class="glyphicon glyphicon-user" aria-hidden="true"></a></li>
					</ul>
					
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Υπογεγραμμένα Έγγραφα</span><br><br>
			</h4>
			<!--<input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" accept="application/pdf"/>
				<input type="button" class="btn btn-default ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Pdf"/>
			<hr>
			<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
			<div class="table-responsive" id="soma">
				<table class="table table-striped">
					<thead>
					  <tr>
						<th>Έγγραφο προς Υπογραφή</th>
						<th>Υπογεγραμμένο Έγγραφο</th>
						<th>Ημερομηνία Εισαγωγής</th>
						<th>Αποστολέας</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
					  include 'connection.php';	
					  mysqli_query($con,"set names utf8");					 
					  $sql = "SELECT filename,date,fromIP,signedfilename from filesTobeSigned where signedfilename!='' order by date asc";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
						echo '<tr><td>';
						echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td>';
						echo '<a href="\directorSign\uploads\\'.$row['signedfilename'].'" target="_blank">'.$row['signedfilename'].'</a></td><td>';
						echo $row['date'].'</td><td>';
						echo $row['fromIP'].'</td></tr>';
					  }
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
	</body>
</html>