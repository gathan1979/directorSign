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
			$page = $_SERVER['PHP_SELF'];
			$sec = "120";
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
				$('#example1').DataTable( {
				"bFilter": true,
				"paging":   true,
				"pagingType": "simple_numbers",
				"ordering": true,
				"order": [[ 1, "desc" ]],
				"info":     false,
				"lengthMenu": [[25, 50, -1], [25, 50, "All"]]
				});
				if (hopscotch.getState() === "hello-hopscotch:11") {
				  hopscotch.startTour(tour);
				}
			});
			
			function sendEmail(attachmentFile){
			   try{
				   alert("hi");
				  var theApp = new ActiveXObject("Outlook.Application");
				  var objNS = theApp.GetNameSpace('MAPI');
				  var theMailItem = theApp.CreateItem(0); // value 0 = MailItem
				  theMailItem.to = ('mail@dmaked.pde.sch.gr');
				  theMailItem.Subject = ('Αποστολή Αρχείου');
				  theMailItem.Body = ('Συνημμένο ακριβές αντίγραφο του εγγράφου ψηφιακά υπογεγραμμένο');
				  theMailItem.Attachments.Add(attachmentFile);
				  theMailItem.display();
			  }
			  catch (err) {
				 alert(err.message);
			  } 
		   }
			
			var tour = {
				  id: "hello-hopscotch",
				   i18n: {
					nextBtn: "Επόμενο",
					prevBtn: "Προηγούμενο",
					doneBtn: "Τέλος",
					skipBtn: "Παράβλεψη",
					closeTooltip: "Κλείσιμο",
					stepNums : ["1", "2", "3"]
				  },
				  steps: [
					{
					  title: "Μενού Έγγραφα Προς Υπογραφή",
					  content: "Προσθέστε νέο σχέδιο προς υπογραφή και παρακολουθείστε την πορεία των εγγράφων σας",
					  target: "prosIpografi",
					  placement: "bottom"
					},
					{
					  title: "Μενού Ανέβασμα Νέου Σχεδίου",
					  content: "Πιέστε έδω για να εμφανιστούν οι επιλογές μεταφόρτωσης νέου σχεδίου",
					  target: "neoSxedio",
					  placement: "bottom"
					},
					{
					  title: "Μενού Επιλογή Αρχείου",
					  content: "Επιλέξτε το νέο σχέδιο σε μορφή word, excel ή pdf που θέλετε να υπογραφεί",
					  target: "selectedFile",
					  placement: "bottom"
					},
					{
					  title: "Μενού Εισαγωγής Σχολίου",
					  content: "Προαιρετικά μπορείτε να αναφέρετε ένα σύντομο σχόλιο σχετικά με το σχέδιο που μεταφορτώνετε",
					  target: "authorComment",
					  placement: "bottom"
					},
					{
					  title: "Μενού Μεταφόρτωσης",
					  content: "Πιέστε το πλήκτρο μεταφόρτωσης για να ολοκληρωθεί η αποστολή του σχεδίου σας",
					  target: "uploadFileButton",
					  placement: "bottom"
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ονομασία Σχεδίου",
					  content: "Στη στήλη αυτή βλέπετε τα αρχικά σχέδια που ανεβάσατε (πατώντας κάνετε λήψη). Με κλικ στο βελάκι κάνετε ταξινόμηση ως προς το όνομα",
					  target: "tableCol1",
					  placement: "right"
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ημερομηνία Σχεδίου",
					  content: "Στη στήλη αυτή βλέπετε την ημερομηνία που μεταφορτώσατε το αρχικό σχέδιο. Με κλικ στο βελάκι κάνετε ταξινόμηση ως προς την ημερομηνία",
					  target: "tableCol2",
					  placement: "right"
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Συντάκτης Σχεδίου",
					  content: "Στη στήλη αυτή θα πρέπει να βλέπετε το όνομα σας",
					  target: "tableCol3",
					  placement: "left",
					  xOffset: 100,
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ιστορικό Σχεδίου",
					  content: "Στη στήλη αυτή μπορείτε να βλέπετε ανά πάσα στιγμή την εξέλιξη της πορείας του εγγράφου σας. Τα αρχεία με τις ενδιάμεσες υπογραφές των προϊσταμένων δε σας είναι χρήσιμα. Θα περιμένετε μέχρι το έγγραφο να εμφανιστεί στα Υπογεγραμμένα έγγραφα",
					  target: "tableCol4",
					  placement: "left",
					  xOffset: 100,
					},
					{
					  title: "Αναζήτηση Σχεδίου",
					  content: "Στη στήλη αυτή μπορείτε να πραγματοποιήσετε αναζήτηση ως προς οποιαδήποτε στήλη του πίνακα",
					  target: "tableCol4",
					  placement: "left",
					  xOffset: -100,
					  yOffset: -50,
					},
					{
					  title: "Μενού Υπογεγραμμένα Έγγραφα",
					  content: "Εδώ μπορείτε να αναζητήσετε τα έγγραφα που έχουν λάβει το σύνολο των υπογραφών και έχουν εγκριθεί",
					  target: "ipogegrammena",
					  placement: "bottom",
					  multipage: true,
					  onNext: function() {
						window.location = "signed.php"
					  }
					},
					{
					  title: "Πίνακας Υπογεγραμμένων Σχεδίων - Ιστορικό Σχεδίου",
					  content: "Στη στήλη αυτή μπορείτε να δείτε την εξέλιξη της πορείας του εγγράφου σας. <br><br>Μπορείτε να κατεβάσετε το <b>τελικό σχέδιο</b> με το σύνολο των υπογραφών <b>για αρχειοθέτηση</b> καθώς και <b>ακριβές αντίγραφό</b> του <b>για αποστολή</b>. <br><br> Πιέστε για να επιστρέψετε στο αρχικό μενού",
					  target: "signedHistory",
					  placement: "left",
					  xOffset: 100,
					  multipage: true,
					  onNext: function() {
						window.location = "startPage.php"
					  }
					},
					{
					  title: "Μενού Απορριφθέντα Έγγραφα",
					  content: "Εδώ μπορείτε να αναζητήσετε τα έχουν σχέδια σας που έχουν <b>οριστικά απορριφθεί</b> από κάποιον προϊστάμενο σας",
					  target: "aporrifthenta",
					  placement: "bottom"
					}
				  ]
				};
			
		</script>	

		<style>
			@media print {
				.ektos {display:none};
			}
		</style>		

		<meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">	
	</head>
	<body>
	
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");	
						$newDocs = 0;	
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
							$sql1 = "SELECT * from filestobesigned where userId!=".$_SESSION['aa_user']." and viewed=0 and 
							(SELECT nextLevel from filestobesigned where 
							aa=(select max(aa)from filestobesigned where revisionId=".$row['aa']."))!=4 
							and revisionId=".$row['aa'];
							//echo $sql1."<br>";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$newDocs += mysqli_num_rows($rslt1);
							//echo $newDocs;
						}
				?>	
	
	
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");	
						$signedDocs = 0;	
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
						//echo $sql."<br>";
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
							if($_SESSION['accessLevel']==0){
								$sql1 = "SELECT * from filestobesigned where  viewed=0 and 
							nextLevel=4 and revisionId=".$row['aa'];
							}
							else if($_SESSION['accessLevel']==1){
								$sql1 = "SELECT * from filestobesigned where  viewedHeadmaster1=0 and 
							nextLevel=4 and revisionId=".$row['aa'];
							}
							else if($_SESSION['accessLevel']==2){
								$sql1 = "SELECT * from filestobesigned where  viewedHeadmaster2=0 and 
							nextLevel=4 and revisionId=".$row['aa'];
							}
							//echo $sql1."<br>";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$signedDocs += mysqli_num_rows($rslt1);
							//echo $signedDocs;
						}
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
						
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>">Προς Υπογραφή <?php if ($_SESSION['accessLevel']==1) { echo '<span class="badge">'.$newDocs.'</span>';}?><br><i class="far fa-file fa-lg"></i></a></li>
						<li class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>">Υπογεγραμμένα<?php if ($_SESSION['accessLevel']==1){echo '<span class="badge">'.$signedDocs.'</span>';}?><br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<li class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>">Απορριφθέντα<br><i class="far fa-file-excel fa-lg"></i></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><i class="fas fa-power-off fa-lg"></i></a></li>
					</ul>
					
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Έγγραφα ψηφιακά υπογεγραμμένα</span><br><br>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
			<div class="table-responsive" id="soma">
				<table class="table table-striped" id="example1">
					<thead>
					  <tr>
						<th class="text-right">Έγγραφο υπογεγραμμένο</th>
						<th class="text-right">Ημερομηνία Εισαγωγής</th>
						<th class="text-right">Αποστολέας</th>
						<th class="text-right" id="signedHistory">Ιστορικό</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
				    include 'connection1.php';	
				    mysqli_query($con,"set names utf8");	
					if($_SESSION['accessLevel']<3){					  
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0 order by date desc";
					}
					else{
						$sql = "SELECT * from filestobesigned where revisionId=0 order by date desc";
					}
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							if($_SESSION['accessLevel']==0){
								$sql1 = "SELECT filename as signedFilename,nextLevel,viewed from filestobesigned where aa=(select max(aa)from
								filestobesigned where revisionId=".$row['aa'].")";								
							}
							else{
								$sql1 = "SELECT filename as signedFilename,nextLevel,viewedHeadmaster1 from filestobesigned where aa=(select max(aa)from
								filestobesigned where revisionId=".$row['aa'].")";	
							}
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							if ($row1['nextLevel']==4){				//egkrisi apo perifereiako
								echo '<tr class="success"><td class="text-right">';				
								if($_SESSION['accessLevel']==0){
									if ($row1['viewed']==0){
										echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a> &nbsp<span class="badge">1</span></td><td class="text-right">';
									}
									else{
										echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
									}
								}
								else if($_SESSION['accessLevel']<=1){
									if ($row1['viewedHeadmaster1']==0){
										echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a> &nbsp<span class="badge">1</span></td><td class="text-right">';
									}
									else{
										echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
									}
								}
								else{
									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
								}
								// $row['filename'];
								$file1 = 'C:\xampp\htdocs\directorSign\uploads\\'.$row['filename'];     //arxiko arxeio
								
								mysqli_query($con,"set names utf8");
								$sql3 = "select * from filestobesigned where aa =(SELECT max(aa) from filestobesigned where filename!='' and filename not like '%_signed%' and revisionId=".$row['aa'].")"; 
								$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 2".mysql_error());
								while ($row3 = mysqli_fetch_array($rslt3, MYSQLI_BOTH)){
									$file1 = 'C:\xampp\htdocs\directorSign\uploads\\'.$row3['filename'];     //teleutaio arxeio
								}
								//echo "----".$file."---";
								//$fileType = substr(strrchr($row['filename'],'.'),1);
								$path_parts = pathinfo($file1);	
								
								$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
								$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
								$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);	
								
								echo $row['date'].'</td><td class="text-right">';
								echo $row2['fullName'].'</td><td class="text-right">';
								echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								echo '<a href="\directorSign\uploads\\'.$row1['signedFilename'].'" target="_blank"><span class="glyphicon glyphicon-cloud-download" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Εγγράφου με όλες τις Ψηφιακές Υπογραφές για Αρχειοθέτηση"></a> &nbsp&nbsp';
								echo '<a href="\directorSign\uploads\\'.$path_parts['filename'].'_Exact_Copy.pdf" target="_blank"><span class="glyphicon glyphicon-send" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Αντιγράφου για Αποστολή"></a> &nbsp&nbsp';
								//echo '<a href="#" onclick="'."sendEmail('C:\\xampp\\htdocs\\directorSign\\uploads\\".$path_parts['filename']."_Exact_Copy.pdf');".'"><span class="glyphicon glyphicon-send" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Αντιγράφου για Αποστολή" ></a>&nbsp&nbsp';
								echo "</td></tr>";
							}
					  }
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
	</body>
</html>