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
			$sec = "60";
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
		
				<?php
					if (isset($_GET['rmsg'])){
						echo 'alert("'.$_GET['rmsg'].'");';
					}
				?>	
			
			function uploadfile(){
				$("#loading").fadeIn();
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
				$('#example1').DataTable( {
				"bFilter": true,
				"paging":   false,
				"ordering": true,
				"info":     false,
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				responsive : true,
				language : {
						"sDecimal":           ",",
						"sEmptyTable":        "Δεν υπάρχουν δεδομένα στον πίνακα",
						"sInfo":              "Εμφανίζονται _START_ έως _END_ από _TOTAL_ εγγραφές",
						"sInfoEmpty":         "Εμφανίζονται 0 έως 0 από 0 εγγραφές",
						"sInfoFiltered":      "(φιλτραρισμένες από _MAX_ συνολικά εγγραφές)",
						"sInfoPostFix":       "",
						"sInfoThousands":     ".",
						"sLengthMenu":        "Δείξε _MENU_ εγγραφές",
						"sLoadingRecords":    "Φόρτωση...",
						"sProcessing":        "Επεξεργασία...",
						"sSearch":            "Αναζήτηση:",
						"sSearchPlaceholder": "Αναζήτηση",
						"sThousands":         ".",
						"sUrl":               "",
						"sZeroRecords":       "Δεν βρέθηκαν εγγραφές που να ταιριάζουν",
						"oPaginate": {
							"sFirst":    "Πρώτη",
							"sPrevious": "Προηγούμενη",
							"sNext":     "Επόμενη",
							"sLast":     "Τελευταία"
						},
						"oAria": {
							"sSortAscending":  ": ενεργοποιήστε για αύξουσα ταξινόμηση της στήλης",
							"sSortDescending": ": ενεργοποιήστε για φθίνουσα ταξινόμηση της στήλης"
						}
					}
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

			function preview_PDF(file){	
				 $( "#my-container").dialog({width : 900, height : 500, modal :true});
				  var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
			}
			
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
				<?php	
						//echo $_SESSION['accessLevel'];
						/* include 'connection1.php';	
						mysqli_query($con,"set names utf8");	
						$newDocs = 0;	
						$sql = "SELECT * from filestobesigned where  revisionId=0";
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
							$sql3 = "SELECT * from filestobesigned where revisionId=".$row['aa'];
							//echo $sql3."<br>";
							$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 5 ".mysqli_error($con)); 
							if ( mysqli_num_rows($rslt3) == 0){
								echo "mhdeno";
								if ($row['viewedHeadmaster1']==0){
									$newDocs ++;
								}
							}
							else{
								$sql1 = "SELECT * from filestobesigned where userId!=".$_SESSION['aa_user']." and revisionId=".$row['aa']." and viewedHeadmaster1=0 and 
								(SELECT nextLevel from filestobesigned where 
								aa=(select max(aa)from filestobesigned where revisionId=".$row['aa']."))=1";
								//echo $sql1."<br>";
								$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 33 ".mysqli_error($con)); 
								$newDocs += mysqli_num_rows($rslt1);
								//echo $newDocs;
							}
						} */
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
						<!--<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">-->
						<i class="fas fa-tags fa-3x"></i>
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>">Προς Υπογραφή <br><i class="far fa-file fa-lg"></i></a></li>
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>">Υπογεγραμμένα<br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>">Απορριφθέντα<br><i class="far fa-file-excel fa-lg"></i></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><i class="fas fa-power-off fa-lg"></i></a></li>
					<li class="text-center" id="emfanisiOnomatos" style="padding-left:100px;"><a>Χρήστης <br><b><?php echo $_SESSION['user'];?></b></a></li>

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
				<button class="btn btn-default" data-toggle="collapse" data-target="#demo">Ανέβασμα νέου Σχεδίου (doc, xls, pdf) &nbsp<i class="fas fa-external-link-alt"></i></button>

				<div id="demo" class="collapse">
								<br>
					<input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" accept="pdf,PDF,doc,DOC,docx,DOCX"/><br>
					<input type="button" class="btn btn-primary ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Νέου Εγγράφου"/>
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
					  $sql = "SELECT * from filestobesigned where revisionId=0";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							/* $newDocs = 0;
							$sql11 = "SELECT * from filestobesigned where userId!=".$_SESSION['aa_user']." and 
								revisionId=".$row['aa']." and viewedHeadmaster2=0 and 
								(SELECT nextLevel from filestobesigned where 
								aa=(select max(aa)from filestobesigned where revisionId=".$row['aa']."))=1";
							$rslt11= mysqli_query($con,$sql11) or die ("apotyxia erotimatas 11 ".mysqli_error($con)); 
							$newDocs = mysqli_num_rows($rslt11); */
							$sql1 = "(SELECT * from filestobesigned where aa=(select max(aa)from 
							filestobesigned where revisionId=".$row['aa']."))";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							
							$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							
							$file_extension = pathinfo($row['filename'], PATHINFO_EXTENSION);
							$file_without_extension = pathinfo($row['filename'], PATHINFO_FILENAME);
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file = $row['filename'];
							}
							else{
								$preview_file = "preview_".$file_without_extension.".pdf";
							}
							
							$file_extension = pathinfo($row1['filename'], PATHINFO_EXTENSION);
							$file_without_extension = pathinfo($row1['filename'], PATHINFO_FILENAME);
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file_signed = $row1['filename'];
							}
							else{
								$preview_file_signed = "preview_".$file_without_extension.".pdf";
							}
							
							if ($row1!=NULL){      //arxeio me allages
								if($row1['nextLevel']==2){
									echo '<tr class="success"><td class="text-right">';										
									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a>&nbsp<i  class="fas fa-search" title="προεπισκόπηση τελευταίας τροποποίησης εγγράφου" onclick="preview_PDF(\''.$preview_file_signed.'\');"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i  class="fas fa-book" title="προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\');"></i>&nbsp</td><td class="text-right">';
									echo $row['date'].'</td><td class="text-right">';
									echo $row2['fullName'].'</td><td class="text-right">';
									echo $row['comments'].'</td><td class="text-right">';
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
									if ($_SESSION['accessLevel']>="1"){	
										echo "<a class='showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση - Ψηφιακή Υπογραφή Εγγράφου'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a></td></tr>";
									}
								}
							}
							else{
								if($row['nextLevel']==2){
									echo '<tr class="success"><td class="text-right">';										
									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a>&nbsp<i  class="fas fa-search" title="προεπισκόπηση τελευταίας τροποποίησης εγγράφου" onclick="preview_PDF(\''.$preview_file_signed.'\');"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i  class="fas fa-book" title="προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\');"></i>&nbsp</td><td class="text-right">';
									echo $row['date'].'</td><td class="text-right">';
									echo $row2['fullName'].'</td><td class="text-right">';
									echo $row['comments'].'</td><td class="text-right">';
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
									if ($_SESSION['accessLevel']>="1"){	
										echo "<a class='showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση - Ψηφιακή Υπογραφή Εγγράφου'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a></td></tr>";
									}
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
		<div id="my-container" title="Προεπισκόπηση Εγγράφου"></div>
	</body>
</html>