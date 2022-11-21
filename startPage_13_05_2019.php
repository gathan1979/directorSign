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
			
			$dServer = array();
			
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$page = $_SERVER['PHP_SELF'];
			$sec = "120";
			include 'connection1.php';	
			mysqli_query($con,"set names utf8");	
			/* $notifications='"';			
			$sqlN = "select * from `filestobesigned` where revisionId in (SELECT aa FROM `filestobesigned` WHERE `userId`=".$_SESSION['aa_user'].') and `date`>(select IFNull(max(notificationUpdate),0) from lastnotification where userId='.$_SESSION['aa_user'].') order by aa desc limit 5';
			//echo $sqlN;
			$rsltN= mysqli_query($con,$sqlN) or die ("apotyxia erotimatas 1".mysql_error());
			while ($row = mysqli_fetch_array($rsltN, MYSQLI_BOTH)){	
				$sqlN1 = "select fullName from `staff` where attendanceNumber=".$row['userId'];
				$rsltN1= mysqli_query($con,$sqlN1) or die ("apotyxia erotimatas 1 ".mysql_error());
				$row1 = mysqli_fetch_array($rsltN1, MYSQLI_BOTH);
				if ($row['userId']!=$_SESSION['aa_user']){
					$msg = "Το αρχείο ".$row['filename']." έχει υπογραφεί από ".$row1['fullName'].',';
					//echo $msg;
					$notifications .= $msg;
				}
			}
			$notifications = $notifications.'"'; */
			//echo $notifications;
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
				
			
			 //checkNotifications();
			 //let instance = new minitoast();
			
			function uploadfile(){
				$("#loading").fadeIn();
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
						clearInterval() 
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
				window.setInterval(function(){
					$("#pbvalue").val($("#pbvalue").val()+10); 
					$("#pbtext").html("<b>Πρόδος Υπογραφής</b>");
				}, 500);
			}	
			
			
		
			/* function checkNotifications(){
				var arrayString = <?php echo $notifications; ?>;
				var notifications = arrayString.split(",");
				if ((notifications.length)>0){
					notifyMe("Έχετε νέες ειδοποιήσεις στην πλατφόρμα των ψηφιακών υπογραφών");	
					//instance.success('Έχετε νέες ειδοποιήσεις στην πλατφόρμα των ψηφιακών υπογραφών');
				}
				//notifyMe(notifications[1]);
				//for (var i = 0; i < (notifications.length-1); i++) { 
					  //notifyMe("Έχετε νέες ειδοποιήσεις στην πλατφόρμα των ψηφιακών υπογραφών");				
				//}
			}	
		
		
			function notifyMe(k) {
				  //var options = {
					 // requireInteraction: shouldRequireInteraction
					//}
				 //var notification = new Notification("HI");
				  // Let's check if the browser supports notifications
				  if (!("Notification" in window)) {
					alert("This browser does not support desktop notification");
				  }

				  // Let's check whether notification permissions have already been granted
				  else if (Notification.permission === "granted") {
					// If it's okay let's create a notification
					var notification = new Notification(k);
					//var notification = new WebkitNotification(k);
				  }

				  // Otherwise, we need to ask the user for permission
				  else if (Notification.permission !== "denied") {
					Notification.requestPermission(function (permission) {
					  // If the user accepts, let's create a notification
					  if (permission === "granted") {
						var notification = new Notification(k);
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
				if (hopscotch.getState() === "hello-hopscotch:12") {
				  hopscotch.startTour(tour);
				}
				//notifyMe();
				
				if(PDFObject.supportsPDFs){
				    
				} else {
				   alert("Η προεπισκόπηση PDF δεν υποστηρίζεται από τον browser σας");
				}
			});
			
			function runHelp(){
				hopscotch.startTour(tour);
			}
			
			function preview_PDF(file){
				
				 $( "#my-container").dialog({width : 900, height : 500, modal :true});
				  var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
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
					  title: "Πίνακας Σχεδίων σε Αναμονή - Κατάσταση Σχεδίου",
					  content: "Στη στήλη αυτή βλέπετε την πορεία του σχεδίου μέχρι τη λήψη της τελικής υπογραφής του. ",
					  target: "tableCol3",
					  placement: "left",
					  xOffset: 100,
					},
					{
					  title: "Πίνακας Σχεδίων σε Αναμονή - Ιστορικό Σχεδίου <span class='glyphicon glyphicon-inbox'  aria-hidden='true'/>",
					  content: "Στη στήλη αυτή μπορείτε να βλέπετε ανά πάσα στιγμή αναλυτικά την εξέλιξη της πορείας του εγγράφου σας. <b>Τα αρχεία με τις ενδιάμεσες υπογραφές των προϊσταμένων δε σας είναι χρήσιμα</b>.<br><br> Θα περιμένετε μέχρι το έγγραφο να εμφανιστεί στα Υπογεγραμμένα έγγραφα",
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
					  title: "Μενού Υπογεγραμμένα Έγγραφα &nbsp<span class='glyphicon glyphicon-thumbs-up'  style='font-size: 25px;' aria-hidden='true'>",
					  content: "<br>Εδώ μπορείτε να αναζητήσετε τα έγγραφα που έχουν λάβει το σύνολο των υπογραφών και έχουν εγκριθεί.<br><br><b> Κάντε κλικ για να συνεχίσει η επίδειξη...</b>",
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
			
			
		function enableFileLoadButton(){
			if(document.getElementById("selectedFile").value != "") {
				document.getElementById("uploadFileButton").disabled = false;
			}
			else{
				document.getElementById("uploadFileButton").disabled = true;
			}
		}		
		
		</script>	

		<style>
			@media print {
				.ektos {display:none};
			}
			
			.pdfobject-container {
			    <!-- max-width: 100%;
				width: 800px;
				height: 400px;
				border: 10px solid rgba(0,0,0,.2);
				margin: 0;
				margin-left : 100px; -->
			}
			
			#loading {
				display:none;
				position:absolute;
				left:0;
				top:0;
				z-index:1000;
				width:100%;
				height:250%;
				min-height:250%;
				background:white;
				opacity:0.8;
				text-align:center;
				color:#fff;
			}
			
			progress {
			  -webkit-appearance: none;
			  appearance: none;
			  border: none;
			  height: 40px;
			  width: 80%;
			  margin: 100px;
			}
			progress::-webkit-progress-bar {
			  background: #ccc;
			  box-shadow: inset 0px 0px 10px 5px #aaa;
			  border-radius: 20px;
			}
			progress::-webkit-progress-value {
			  background-image: repeating-linear-gradient(45deg, #FF94AA, #FF94AA 8px, #FF7799 8px, #FF7799 16px);
			  border-radius: 20px;
			}
			progress::before {
			  content: attr(value);
			  position: relative;
			  left: 70%;
			  display: block;
			  margin: 5px;
			  font: caption;
			  font-size: 20px;
			  color: #FF7799;
			}
			
		</style>		

		<meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">	
	</head>
	<body>
	
		<?php include 'startPageMenu.php';?> 
		
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Έγγραφα για ψηφιακή υπογραφή</span><br><br>
			</h4>
				<button class="btn btn-default" data-toggle="collapse" data-target="#demo" id="neoSxedio">Ανέβασμα νέου Σχεδίου (doc, xls, pdf) &nbsp<i class="fas fa-external-link-alt"></i></button>
				<div id="demo" class="collapse">
					</br>
					<input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
					<div>
						<label for="uname">Εισαγωγή Σχολίου: </label>
						<textarea type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
					</div>
					<br><br>
					<input type="button" disabled class="btn btn-primary ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Αρχείου"/>
				</div>
			<hr>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
			<div class="table-responsive" id="soma">
				<table class="table table-striped" id="example1">
					<thead>
					  <tr>
						<th class="text-right" id="tableCol1">Έγγραφο προς Υπογραφή</th>
						<th class="text-right" id="tableCol2">Ημερομηνία Εισαγωγής</th>
						<th class="text-right" id="tableCol3">Κατάσταση</th>
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
							/* $newDocs = 0;
							$sql1 = "SELECT date from filestobesigned where userId!=".$_SESSION['aa_user']." and viewed=0
							and revisionId=".$row['aa'];
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$newDocs = mysqli_num_rows($rslt1); */
							
							$sql1 = "SELECT nextLevel,filename from filestobesigned where aa=(select max(aa)from 
							filestobesigned where revisionId=".$row['aa'].")";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							
							//preview
							$file_extension = pathinfo($row['filename'], PATHINFO_EXTENSION);
							$file_without_extension = pathinfo($row['filename'], PATHINFO_FILENAME);
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file = $row['filename'];
							}
							else{
								$preview_file = $file_without_extension.".pdf";
							}
							//------
							if ($row1!=NULL){ 
							
								//preview last upload
								$file_extension = pathinfo($row1['filename'], PATHINFO_EXTENSION);
								$file_without_extension = pathinfo($row1['filename'], PATHINFO_FILENAME);
								if ($file_extension=="pdf" || $file_extension=="PDF"){
									$preview_file_last = $row['filename'];
								}
								else{
									$preview_file_last = $file_without_extension.".pdf";
								}
								//------
								if ($row1['nextLevel']<4 && $row1['nextLevel']>-2){ //den exei parei ipografi kai den aporifthike 
									if ($row1['nextLevel']==0){                     //epistrafike apo proistameno
										echo '<tr class="danger"><td class="text-right">';
									}  
									else if ($row1['nextLevel']==1){
										echo '<tr class="warning"><td class="text-right"><i class="fas fa-flag" title="Προεπισκόπηση τελευταίας ανακοινοποίησης" onclick="preview_PDF(\''.$preview_file_last.'\');"></i>&nbsp ';			    //egkrisi apo proistameno
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

									echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a> &nbsp&nbsp <i  class="fas fa-search" title="Προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\');"></i></td><td class="text-right">';
									echo $row['date'].'</td><td class="text-right">';
									
									if ($row1['nextLevel']==0){  		//epistrafike apo proistameno
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>';	
									}  
									else if ($row1['nextLevel']==1){
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>';		//egkrisi apo proistameno
									} 
									else if ($row1['nextLevel']==2){
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>';		//egkrisi apo proistameno
									}  
									else if ($row1['nextLevel']==3){
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-check fa-2x" style="color:green"></i>&nbsp';
										echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>';		//egkrisi apo proistameno 2
									}  
									
									echo '</td><td class="text-right">';
									echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
									if ($_SESSION['accessLevel']>"1"){	
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ok-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση'></a>&nbsp&nbsp";
										echo "<a href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-remove-sign' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Απόρριψη'></a></td></tr>";
									}
								}
							}
							else{              // nea eisagogi arxeiou
								
								echo '<tr ><td class="text-right">';
								echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename'].'</a>   &nbsp&nbsp <i  class="fas fa-search" title="Προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\');"></i></td><td class="text-right">';
								echo $row['date'].'</td><td class="text-right">';
								
									echo '<i class="fas fa-calendar-check fa-2x " style="color:green"></i>&nbsp';
									echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
									echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>&nbsp';
									echo '<i class="fas fa-calendar-times fa-2x" style="color:purple"></i>';		//egkrisi apo proistameno
									
								
								echo '</td><td class="text-right">';
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
		<div id="loading">
			<img src="images/loading.gif" alt="loading">
			<!--<progress id="pbvalue" value="0" max="100" ></progress>
			<div id="pbtext" align="center">Υπογραφή Έγγράφου σε Εξέλιξη</div>-->
		</div>
		<div id="my-container" title="Προεπισκόπηση Εγγράφου"></div>
		
	</body>
</html>