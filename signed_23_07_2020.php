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
		
			/* function notifyMe(e) {
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
			} */
			
			
			
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
				$('#showEmployees').change(function() {
					if(this.checked) {
						$('#example1').DataTable().search("").draw();
					}
					else{
						$('#example1').DataTable().search($('#connectedUser').text()).draw();
					}
				});
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
		   
		   function viewExactCopy(aa){
				$.ajax({
  				   type: "post",
				   data: {"aa" :  aa},
				   url: "viewExactCopy.php",
				   success: function(msg){
					   	window.open("uploads/"+msg); 
					}  
				   
				});	  		
			}
			
			 function viewSigned(aa){
				$.ajax({
  				   type: "post",
				   data: {"aa" :  aa},
				   url: "viewSigned.php",
				   success: function(msg){
					   	window.open("uploads/"+msg); 
					}  
				   
				});	  		
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
				
			function preview_PDF(file,id){	
				 //$( "#my-container").dialog({width : 800, height : 800, modal :true});
				  //var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
				  window.open("pdfjs/web/viewer.php?file=../../uploads/"+file+"&id="+id+"#zoom=page-fit");
			}
			
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
						/* $newDocs = 0;	
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
						} */
				?>	
	
	
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");	
						$signedDocs = 0;	
						/* $sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
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
						<!--<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">
						<i class="fas fa-tags fa-3x"></i>-->
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
										<ul class="nav navbar-nav">
						<li id="prosIpografi" class=" text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>"><span class="label label-warning">Προς Υπογραφή</span></br></br><i class="far fa-file fa-lg"></i></a></li>
						<li id="ipogegrammena" class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>"><span class="label label-success">Υπογεγραμμένα</span></br></br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<li id="aporrifthenta" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>"><span class="label label-danger">Απορριφθέντα</span></br></br><i class="far fa-file-excel fa-lg"></i></a></li>
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
						<li class="text-center" id="emfanisiOnomatos" style="padding-left:100px;"><a><b>Χρήστης </br></br></b><h6 id="connectedUser"><?php echo $_SESSION['user'];?></h6></a></li>
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
			<div class="col-12" style="padding-bottom:1em;">
				<h4 class="text-center">
				<span class="label label-default">Έγγραφα ψηφιακά υπογεγραμμένα</span><br><br>
				<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
				</h4>
				<label class="checkbox-inline"><input type="checkbox" checked class="form-check-input" id="showEmployees">Εμφάνιση Εγγράφων Υφισταμένων</label>
			</div>
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
					/* <!-- (-) 14-01-2020
					if($_SESSION['accessLevel']<1){					  
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0 order by date desc";
					}
					else if($_SESSION['accessLevel']<3){					  
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0 order by date desc";
					}
					else{
						$sql = "SELECT * from filestobesigned where revisionId=0 order by date desc";
					}
					
					(-) 14-01-2020 --!>*/
					
					// <!-- (+)14-01-2020 αντικατάσταση των ερωτημάτων 
					if($_SESSION['accessLevel']<1){					  
						$sql = "select * from `filestobesigned` where aa in (select revisionId from `filestobesigned` where aa in ( SELECT max(aa) FROM `filestobesigned` WHERE `revisionId`!=0 group by revisionId order by `aa` asc) and nextLevel=4) and userId=".$_SESSION['aa_user'];
					}
					else if($_SESSION['accessLevel']<3){					  
						$sql = "select * from `filestobesigned` where aa in (select revisionId from `filestobesigned` where aa in ( SELECT max(aa) FROM `filestobesigned` WHERE `revisionId`!=0 group by revisionId order by `aa` asc) and nextLevel=4) and userId=".$_SESSION['aa_user'];
					}
					else{
						$sql = "select * from `filestobesigned` where aa in (select revisionId from `filestobesigned` where aa in ( SELECT max(aa) FROM `filestobesigned` WHERE `revisionId`!=0 group by revisionId order by `aa` desc) and nextLevel=4 ) ";
					}
					
					// (+) 14-01-2020 --!>
					
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							  $file_extension = pathinfo($row['filename'], PATHINFO_EXTENSION);
								$file_without_extension = pathinfo($row['filename'], PATHINFO_FILENAME);
								if ($file_extension=="pdf" || $file_extension=="PDF"){
									$filename = $row['filename'];
								}
								else{
									$filename = $file_without_extension.".pdf";
								}
						  	/* <!-- (-) 14-01-2020
							 if($_SESSION['accessLevel']==0){
								$sql1 = "SELECT filename as signedFilename,nextLevel from filestobesigned where aa=(select max(aa)from
								filestobesigned where revisionId=".$row['aa'].")";								
							}
							else{
								$sql1 = "SELECT filename as signedFilename,nextLevel from filestobesigned where aa=(select max(aa)from
								filestobesigned where revisionId=".$row['aa'].")";	
							} 
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							if ($row1['nextLevel']==4){				//egkrisi apo perifereiako
							(-) 14-01-2020 --!>*/	
								echo '<tr class="success"><td class="text-right">';				
								// <!-- (-)14-01-2020 τροποποίηση των ερωτημάτων 
								//if($_SESSION['accessLevel']==0){

										echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a>&nbsp&nbsp<i class="fas fa-search" title="Προεπισκόπηση τελευταίας ανακοινοποίησης" onclick="preview_PDF(\''.$filename.'\','.$row['aa'].');"></i></td><td class="text-right">';

								//}
								//else if($_SESSION['accessLevel']<=1){

										//echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
								//}
								//else{
									//echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a></td><td class="text-right">';
								//}
								// (-) 14-01-2020 --!>
								// $row['filename'];
								
								/* <!-- (-)14-01-2020
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
								(-) 14-01-2020 --!>*/
								$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
								$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
								$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);

								// (+) 14-01-2020
								$exactCopyString = '<button class="btn btn-success" onclick="viewExactCopy('.$row['aa'].')"><span class="glyphicon glyphicon-send" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Αντιγράφου για Αποστολή"> </button>&nbsp&nbsp';
								$signedString = '<button class="btn btn-success" onclick="viewSigned('.$row['aa'].')"><span class="glyphicon glyphicon-cloud-download" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Εγγράφου με όλες τις Ψηφιακές Υπογραφές για Αρχειοθέτηση"> </button>&nbsp&nbsp';
								// (+) 14-01-2020 --!>
								
								
								echo $row['date'].'</td><td class="text-right">';
								echo $row2['fullName'].'</td><td class="text-right">';
								echo "<a class='btn btn-success btn-sm ' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								//echo '<a href="\directorSign\uploads\\'.$path_parts['filename'].'_signed_signed_signed.pdf" target="_blank"><span class="glyphicon glyphicon-cloud-download" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Εγγράφου με όλες τις Ψηφιακές Υπογραφές για Αρχειοθέτηση"></a> &nbsp&nbsp';
								echo $signedString;
								echo $exactCopyString;
								//echo '<a href="\directorSign\uploads\\'.$path_parts['filename'].'_Exact_Copy.pdf" target="_blank"><span class="glyphicon glyphicon-send" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Αντιγράφου για Αποστολή"></a> &nbsp&nbsp';
								//echo '<a href="#" onclick="'."sendEmail('C:\\xampp\\htdocs\\directorSign\\uploads\\".$path_parts['filename']."_Exact_Copy.pdf');".'"><span class="glyphicon glyphicon-send" style="font-size: 20px;" aria-hidden="true" data-toggle="tooltip" title="Λήψη Αντιγράφου για Αποστολή" ></a>&nbsp&nbsp';
								echo "</td></tr>";
							//	(-) 14-01-2020 --!>  }
					  }
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
	</body>
</html>