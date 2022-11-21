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
			$sec = "180";
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
		<title>Ηλεκτρονικές Υπηρεσίες</title>
		
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
		
		<!--prosthiki stis 11-05-2020 gia na ginei epilogi simeiou ipografis -->
		<script src="pdfjs/build/pdf.js"></script>	
		<!-- ------------------------------------------------------------ -->	
		
		<link href="css/all.css" rel="stylesheet">
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script src="js/jquery-ui.min.js"></script>
		
		<script type="text/javascript" src="js/customfunctions.js"></script>  
		
		<script type="text/javascript">	
				
			
			 //checkNotifications();
			 //let instance = new minitoast();
			
			
			//+++++ i sinartisi uploadfileold prepei na svistei emeine gia logous prostasias apo lathi 
			function uploadfileold(){
				
				var files = document.getElementById('selectedFile').files;
				const numFiles = files.length;
				var data = new FormData();
				var aped = document.getElementById("apedCheckButton").checked;
				if(aped){
					aped=1;
				}else{
					aped=0;
				}
				var k=0;
				for (i = 0; i < numFiles; i++) {
					//const file = files[i];
					data.append('selectedFile'+i, document.getElementById('selectedFile').files[i]);
					var element = document.getElementById('filebutton_'+i);
					if (element.classList.contains('btn-success')){
						data.append('tobeSigned',i);
						k+=1;
					}
				}
				if (k>1){
						alert("Έχετε επιλέξει περισσότερα από ένα έγγραφα προς υπογραφή");
						return;
				}
				else if (k==0){
						alert("Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά");
						return;
				}
				$("#loading").fadeIn();
				data.append('authorComment', document.getElementById('authorComment').value);
				data.append('numFiles',numFiles);
				data.append('aped',aped);
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
			
			
			
		
			
			
			$(document).ready(function(){
				$('[data-toggle="tooltip"]').tooltip(); 
				$('#example1').DataTable( {
				"bFilter": true,
				"paging":   true,
				"ordering": true,
				"info":     false,
				"lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
				responsive : true,
				"columnDefs": [
				{ "width": "70%", "targets": 0 }
				],
				 "order": [[ 2, "desc" ]],
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
				if (!getCookie("toured")) {
					//hopscotch.startTour(tour1);
				}
				if(PDFObject.supportsPDFs){
				    
				} else {
				   //alert("Η προεπισκόπηση PDF δεν υποστηρίζεται από τον browser σας");
				}
			});
			
			function runHelp(){
				hopscotch.startTour(tour);
			}
			
			function setCookie(key, value) {
				var expires = new Date();
				expires.setTime(expires.getTime() + (1 * 24 * 60 * 60 * 1000));
				document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();;
			};

			function getCookie(key) {
				var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
				return keyValue ? keyValue[2] : null;
			};
			
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
				  target: "uploadMessageButton",
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
			
			var tour1 = {
				
			  id: "hello-hopscotch",
			   i18n: {
				nextBtn: "Επόμενο",
				prevBtn: "Προηγούμενο",
				doneBtn: "Τέλος",
				skipBtn: "Παράβλεψη",
				closeTooltip: "Κλείσιμο",
				stepNums : ["1", "2", "3"]
			  },
				onEnd: function() {
					setCookie("toured", "toured");
				},
				onClose: function() {
					setCookie("toured", "toured");
				},
			  steps: [
				{
				  title: "<u>Νέες Δυνατότητες!!</u>",
				  content: "Πλέον μπορείτε να προσθέσετε συνημμένα έγγραφα μαζί με το έγγραφο προς υπογραφή.Κρατήστε το πλήκτρο <b>control</b> πατημένο και επιλέξτε το αρχείο που θα υπογραφεί και τα συνημμένα του",
				  target: "prosIpografi",
				  placement: "bottom"
				},
				{
				  title: "Ανέβασμα Νέου Σχεδίου",
				  content: "Πιέστε έδω για να εμφανιστούν οι επιλογές μεταφόρτωσης νέου σχεδίου.<br><br><b> Κάντε κλικ για να συνεχίσει η επίδειξη...</b>",
				  target: "neoSxedio",
				  placement: "bottom",
				  nextOnTargetClick: true,
				  showNextButton: false,
				},
				{
				  title: "Μενού Επιλογή Αρχείων",
				  content: "Επιλέξτε ένα <b> ή και περισσότερα αρχεία. </b> Στη συνέχεια μαρκάρετε το αρχείο που θέλετε να υπογραφεί(κάνοντας κλικ γίνεται πράσινο)",
				  target: "selectedFile",
				  placement: "bottom",
				  delay: 500
				}]
			};
			
		function fileLoadButton(){
			if(document.getElementById("selectedFile").value != "") {
				//document.getElementById("uploadMessageButton").disabled = false;
				var files = document.getElementById('selectedFile').files;
				const numFiles = files.length;
				var well = document.getElementById("viewSelectedFiles");
				$( "#viewSelectedFiles" ).empty();
				for (i = 0; i < numFiles; i++) {
					  var element = document.createElement("BUTTON");
					  //Assign different attributes to the element. 
					  element.innerHTML  = files[i].name;
					  element.id = "filebutton_"+i;
					  element.className="btn-xs btn-success";
					  element.setAttribute("style","margin-right:15px;");
					  //element.addEventListener("click", changeFileState);
					  //if (numFiles ==1){
						//element.classList.remove('btn-primary');
						//element.classList.add('btn-success');
					 // }
					  //Append the element in page (in span).  
					  well.appendChild(element);
				}
				
			}
			else{
				document.getElementById("uploadMessageButton").disabled = true;
			}
		}	

		function enableSendButton(){
			if(document.getElementById("authorComment").value != "") {
				document.getElementById("uploadMessageButton").disabled = false;
			}
			else{
				document.getElementById("uploadMessageButton").disabled = true;
			}
		}

			
		function loginHesk(){
			document.getElementById("heskForm").submit();
		};
		
		function getPresent(){
			window.open("tetris.php");
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
	<body >
	
		<?php include 'html/startPageMenu.php';?> 
		
		<div id="container" class="container-fluid" style="background-color:#36a0d2 ;padding-bottom: 2em;">
			<h4 class="text-center">
			<span class="label label-default">Μηνύματα</span><br><br>
			</h4>
				<?php include 'html/uploadMessages.php';?> 
				
			
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
						<div class="table-responsive" id="soma">
				<table class="table table-hover" id="example1" style="background-color:#92bbd2">
					<thead>
					  <tr>
						<th class="text-right" id="tableCol1">Μήνυμα</th>
						<th class="text-right" id="tableCol2">Συνημμένα</th>
						<th class="text-right" id="tableCol3">Ημερομηνία Εισαγωγής</th>
						<th class="text-right" id="tableCol4">Αποστολέας</th>
						<th class="text-right" id="tableCol5">Κλείσιμο Μηνύματος</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");					 
						$sql = "select messages.* from messages left join assignments on messages.aa=assignments.record where assignedToUser=".$_SESSION['aa_staff']."  union select * from messages where userId=".$_SESSION['aa_staff']." order by `closed` asc ,`date` desc";
						//echo $sql;
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							
							$sql2 = "select fullname from staff where aa=".$row['userId'];
							//echo $sql;
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 1".mysql_error());
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							
							$relevantDocs = $row['relevantDocs'];
							$relevantDocsArray = explode("*", $relevantDocs);
							$relevantDocsElement = "&nbsp&nbsp&nbsp";
							if (count($relevantDocsArray)==1 && $relevantDocsArray[0]==""){
								//den periexei tipota to pedio tis vasis
							}
							else{
								for ($l=0;$l<count($relevantDocsArray);$l++){
									//$relevantDocsElement .='<a href="\directorSign\uploads\\'.$relevantDocsArray[$l].'" target="_blank"><i class="fas fa-paperclip" title="'.$relevantDocsArray[$l].'"></i></a>&nbsp';
									//<i  class="fas fa-search" title="Προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\','.$row['aa'].');"></i>'
									$relevantDocsElement .='<i class="fas fa-paperclip fa-3x" onclick="preview_message_by_name(\''.$relevantDocsArray[$l].'\');" title="'.$relevantDocsArray[$l].'"></i>&nbsp';		
								}
							}
							if ($row['userId']==$_SESSION['aa_staff']){
								echo '<tr style="background-color:LightGrey;"><td class="text-right">';
							}
							else{
								echo '<tr style="background-color:BurlyWood;"><td class="text-right">';
							}
							echo $row['comments'].'</td><td class="text-right"> &nbsp&nbsp '.$relevantDocsElement.'</td><td class="text-right">';
							echo $row['date'].'</td><td class="text-right">';
							
							echo $row2[0].'</td><td class="text-right">';
							if ($row['closed']){ 
								echo "<a class='btn btn-danger btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/closeMessage.php?aa=".$row['aa'];;
							}
							else{
								echo "<a class='btn btn-success btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/closeMessage.php?aa=".$row['aa'];;
							}
							if ($row['closed']) 
							{ 
								echo "'><i class='fas fa-lock'></i></a>";
							}
							else{
								echo "'><i class='fas fa-lock-open'></i></a>";
							}
							
							echo '</td></tr>';

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
		<div id="my-container" title="Προεπισκόπηση Εγγράφου" onclick="alert('hi');"></div>
		
	</body>
</html>