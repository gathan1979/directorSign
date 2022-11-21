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
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$page = $_SERVER['PHP_SELF'];
			$sec = "120";
			include 'connection1.php';	
			mysqli_query($con,"set names utf8");					 
			$sqlN = "select * from `filestobesigned` where aa in (SELECT aa FROM `filestobesigned` WHERE `userId`=".$_SESSION['aa_user'].') and `date`>(select max(notificationUpdate) from lastnotification where userId='.$_SESSION['aa_user'].')';
			//echo $sqlN;
			$rsltN= mysqli_query($con,$sqlN) or die ("apotyxia erotimatas 1".mysql_error());
			while ($row = mysqli_fetch_array($rsltN, MYSQLI_BOTH)){
				
				
				
			}
		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="datatables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="style.css" />
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
		<script src="datatables-1.10.16/js/dataTables.bootstrap.min.js"></script>
		<script src="datatables-1.10.16/js/jquery.dataTables.min.js"></script>
		<script src="js/hopscotch.js"></script>	
		
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
							//notifyMe(response);
						}
						location.reload();
					}
				}
				xmlhttp.open("POST","upload.php");
				xmlhttp.send(data);	
			}	
		
			function notifyMe() {
				var notification = new Notification();
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
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
				});
				if (hopscotch.getState() === "hello-hopscotch:12") {
				  hopscotch.startTour(tour);
				}
				//notifyMe();
			});
			
			function runHelp(){
				hopscotch.startTour(tour);
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
					  content: "Πιέστε έδω για να εμφανιστούν οι επιλογές μεταφόρτωσης νέου σχεδίου.<br><br><b> Κάντε κλικ για να συνεχίσει η επίδειξη...</b>",
					  target: "neoSxedio",
					  placement: "bottom",
					  nextOnTargetClick: true,
					  showNextButton: false,
					},
					{
					  title: "Μενού Επιλογή Αρχείου",
					  content: "Επιλέξτε το νέο σχέδιο σε μορφή <b>word, excel ή pdf </b>που θέλετε να υπογραφεί",
					  target: "selectedFile",
					  placement: "bottom",
					  delay: 500
					},
					{
					  title: "Μενού Εισαγωγής Σχολίου",
					  content: "<b>Προαιρετικά </b> μπορείτε να αναφέρετε ένα σύντομο σχόλιο σχετικά με το σχέδιο που μεταφορτώνετε",
					  target: "authorComment",
					  placement: "bottom"
					},
					{
					  title: "Μενού Μεταφόρτωσης",
					  content: "Πιέστε το πλήκτρο μεταφόρτωσης <b> για να ολοκληρωθεί η αποστολή </b> του σχεδίου σας",
					  target: "uploadFileButton",
					  placement: "bottom"
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ονομασία Σχεδίου",
					  content: "Στη στήλη αυτή βλέπετε τα αρχικά σχέδια που ανεβάσατε (πατώντας κάνετε λήψη).<br><br> Με κλικ στο βελάκι κάνετε ταξινόμηση ως προς το όνομα",
					  target: "tableCol1",
					  placement: "right"
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ημερομηνία Σχεδίου",
					  content: "Στη στήλη αυτή βλέπετε την ημερομηνία που μεταφορτώσατε το αρχικό σχέδιο.<br><br> Με κλικ στο βελάκι κάνετε ταξινόμηση ως προς την ημερομηνία",
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
					  content: "Στη στήλη αυτή μπορείτε να βλέπετε ανά πάσα στιγμή την εξέλιξη της πορείας του εγγράφου σας. <b>Τα αρχεία με τις ενδιάμεσες υπογραφές των προϊσταμένων δε σας είναι χρήσιμα</b>.<br><br> Θα περιμένετε μέχρι το έγγραφο να εμφανιστεί στα Υπογεγραμμένα έγγραφα",
					  target: "tableCol4",
					  placement: "left",
					  xOffset: 100,
					},
					{
					  title: "Αναζήτηση Σχεδίου",
					  content: "Στη στήλη αυτή μπορείτε να πραγματοποιήσετε <b>αναζήτηση</b> ως προς οποιαδήποτε στήλη του πίνακα",
					  target: "tableCol4",
					  placement: "left",
					  xOffset: -100,
					  yOffset: -50,
					},
					{
					  title: "Μενού Υπογεγραμμένα Έγγραφα",
					  content: "Εδώ μπορείτε να αναζητήσετε τα έγγραφα που έχουν λάβει το σύνολο των υπογραφών και έχουν εγκριθεί.<br><br><b> Κάντε κλικ για να συνεχίσει η επίδειξη...</b>",
					  target: "ipogegrammena",
					  placement: "bottom",
					  multipage: true,
					  nextOnTargetClick: true,
					  showNextButton: false,
					  onNext: function() {
						window.location = "signed.php"
					  }
					},
					{
					  title: "Πίνακας Υπογεγραμμένων Σχεδίων - Ιστορικό Σχεδίου",
					  content: "Στη στήλη αυτή δείτε την εξέλιξη της πορείας του εγγράφου σας. Μπορείτε να κατεβάσετε το τελικό σχέδιο με το σύνολο των υπογραφών για αρχειοθέτηση καθώς και ακριβές αντίγραφό του για αποστολή",
					  target: "signedHistory",
					  placement: "left",
					  xOffset: 100,
					  onNext: function() {
						window.location = "startPage.php"
					  }
					},
					{
					  title: "Μενού Απορριφθέντα Έγγραφα",
					  content: "Εδώ μπορείτε να αναζητήσετε τα σχέδια σας που έχουν <b>οριστικά απορριφθεί</b> από κάποιον προϊστάμενο σας",
					  target: "aporrifthenta",
					  placement: "bottom"
					},
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
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");	
						$newDocs = 0;	
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysqli_error($con));
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
							$sql1 = "SELECT * from filestobesigned where  viewed=0 and 
							nextLevel=4 and revisionId=".$row['aa'];
							//echo $sql1."<br>";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$signedDocs += mysqli_num_rows($rslt1);
							//echo $signedDocs;
						}
				?>	
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<li id="prosIpografi" class="active text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>">Έγγραφα Προς Υπογραφή <span class="badge"><?php echo $newDocs;?></span><br><span class="glyphicon glyphicon-hand-right" style='font-size: 25px;' aria-hidden="true"></a></li>
						<li id="ipogegrammena" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>">Υπογεγραμμένα Έγγραφα <span class="badge"><?php echo $signedDocs;?></span><br><span class="glyphicon glyphicon-thumbs-up"  style='font-size: 25px;' aria-hidden="true"></a></li>
						<li id="aporrifthenta" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>">Απορριφθέντα Έγγραφα<br><span class="glyphicon glyphicon-thumbs-down" style='font-size: 25px;' aria-hidden="true"></a></li>
						<?php 
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
						?>
						<li class="text-center"><a href="#" onclick="runHelp()">Βοήθεια<br><span class="glyphicon glyphicon-education" aria-hidden="true" style='font-size: 25px;'></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><span class="glyphicon glyphicon-off" style='font-size: 25px;'  aria-hidden="true"></a></li>
					</ul>
					
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Έγγραφα για ψηφιακή υπογραφή</span><br><br>
			</h4>
				<button data-toggle="collapse" data-target="#demo" id="neoSxedio">Ανέβασμα νέου Σχεδίου (doc, xls, pdf)</button>
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
			<div class="table-responsive" id="soma">
				<table class="table table-striped" id="example1">
					<thead>
					  <tr>
						<th class="text-right" id="tableCol1">Έγγραφο προς Υπογραφή</th>
						<th class="text-right" id="tableCol2">Ημερομηνία Εισαγωγής</th>
						<th class="text-right" id="tableCol3">Αποστολέας</th>
						<th class="text-right" id="tableCol4">Ιστορικό</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
					  include 'connection1.php';	
					  mysqli_query($con,"set names utf8");					 
					  $sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							//emfanizei noumero sto badge
							$newDocs = 0;
							$sql1 = "SELECT date from filestobesigned where userId!=".$_SESSION['aa_user']." and viewed=0
							and revisionId=".$row['aa'];
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$newDocs = mysqli_num_rows($rslt1);
							$sql1 = "SELECT nextLevel from filestobesigned where aa=(select max(aa)from 
							filestobesigned where revisionId=".$row['aa'].")";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							if ($row1!=NULL){ 
								if ($row1['nextLevel']<4 && $row1['nextLevel']>-2){ //den exei parei ipografi kai den aporifthike 
									if ($row1['nextLevel']==0){                     //epistrafike apo proistameno
										echo '<tr class="danger"><td class="text-right">';
									}  
									else if ($row1['nextLevel']==1){
										echo '<tr class="warning"><td class="text-right">';			    //egkrisi apo proistameno
									} 
									else if ($row1['nextLevel']==2){
										echo '<tr class="info"><td class="text-right">';			    //egkrisi apo proistameno
									}  
									else if ($row1['nextLevel']==3){
										echo '<tr class="info"><td class="text-right">';				//egkrisi apo proistameno 2
									}  
									else if ($row1['nextLevel']==-2){
										echo '<tr class="danger"><td class="text-right">';				//aporifthike
									}
									else if ($row1['nextLevel']==-1){
										echo '<tr class="warning"><td class="text-right">';			//zitountai allages
									}
									else{
										echo '<tr><td>';
									}   
									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a> &nbsp&nbsp <span class="badge">'.$newDocs.'</span></td><td class="text-right">';
									echo $row['date'].'</td><td class="text-right">';
									echo $row['fromIP'].'</td><td class="text-right">';
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
									if ($_SESSION['accessLevel']>"1"){	
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ok-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση'></a>&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-remove-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Απόρριψη'></a></td></tr>";
									}
								}
							}
							else{              // nea eisagogi arxeiou
								echo '<tr ><td class="text-right">';
								echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a>   &nbsp&nbsp <span class="badge">'.$newDocs.'</span></td><td class="text-right">';
								echo $row['date'].'</td><td class="text-right">';
								echo $row['fromIP'].'</td><td class="text-right">';
								echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								if ($_SESSION['accessLevel']>"1"){	
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ok-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση'></a>&nbsp&nbsp";
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-remove-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Απόρριψη'></a></td></tr>";
								}
							}
					}
				?>	  
					</tbody>
			  </table>
			</div>
		</div>
	</body>
</html>