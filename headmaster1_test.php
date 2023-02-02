<!DOCTYPE html>

<html>
	<head>
	
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονικές Υπηρεσίες</title>
		
		<!-- Bootstrap core CSS -->
		
		<script src="js/jquery-3.6.3.min.js"></script>
		<script src="js/popper.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="style.css" />

		<!--fontawesome-->
		<link href="css/all.css" rel="stylesheet">
		<!--fontawesome-->
				
		<script type="text/javascript" src="js/customfunctions.js"></script>  
		<script type="module" src="./modules/signatureRecords.js"></script>
		<script type="module" src="./modules/createUI.js"></script>
		
		<script type="module" >
			import {getSigRecords,fillTable}  from "./modules/signatureRecords.js";
			
			const user = getSigRecords().then( res => {
				//const table = $('#example1').DataTable();
				fillTable(res);
			});
		</script>  
		
		<script type="text/javascript" defer>
			
		

		
		
		
		function enableRejectButton(){
			if(document.getElementById("rejectText").value != "") {
				document.getElementById("rejectButton").disabled = false;
			}
			else{
				document.getElementById("rejectButton").disabled = true;
			}
		}
		
		
			
</script>		

	</head>
	<body > 
		<table id="dataToSignTable">
			<thead>
			  <tr>
				<th id="filename" class="text-right">Έγγραφο προς Υπογραφή</th>
				<th id="date" class="text-right">Εισαγωγή</th>
				<th id="author" class="text-right">Συντάκτης</th>
				<th id="status" class="text-right">Κατάσταση</th>
				<th id="fileActions" class="text-right">Ενέργειες</th>
			  </tr>
			</thead>
			<tbody>

			</tbody>
		</table>
		
		<div style="padding:0.2em;background-color:#cadfc0;width :90%;position:absolute;bottom:0;" id="emailsContainer">

		</div>
	
		<?php
			//if ($messagesExist){
				//echo '<script type="text/javascript">notifyMe("Έχετε '.$messagesExist.' Μηνύματα για υπογραφή");</script>';
			//}				
		?>
		
		
		<div id="loading">
			<img src="images/loading.gif" alt="loading">
		</div>

		<div id="signing">
			<img src="images/sign.gif" alt="signing">
		</div>
		<div id="rejecting">
			<img src="images/reject.gif" alt="rejecting">
		</div>
		<div id="my-container" title="Προεπισκόπηση Εγγράφου"></div>
		

		
		<div class="modal fade" id="emailConnectModal" tabindex="-1" role="dialog" aria-labelledby="emailConnectModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-lg" role="document" >
				<div class="modal-content">
				  <div class="modal-body" id="schForm">
					<img style="margin-bottom:1em;" src="images/sch.png"/>
					<div>	
						<div class="input-group mb-3">
						  <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">Όνομα Χρήστη SCH</span>
						  </div>
						  <input id="userSch" type="text" class="form-control" placeholder="keyword" aria-label="keyword" aria-describedby="basic-addon1">
						</div>
						<div class="input-group mb-3">
						  <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">Κωδικός Χρήστη SCH</span>
						  </div>
						  <input id="passSch" type="password" class="form-control" placeholder="keyword" aria-label="keyword" aria-describedby="basic-addon1">
						</div>
					</div>
				  <div class="modal-footer">
					<button type="button" class="btn btn-warning trn" onclick="connectToEmail();">Σύνδεση</button>
					<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
				  </div>
				</div>
			  </div>
			</div>
		</div>
	
		<div class="modal fade" id="mindigitalConnectModal" tabindex="-1" role="dialog" aria-labelledby="mindigitalConnectModalLabel" aria-hidden="true">
		  <div class="modal-dialog modal-lg" role="document" >
				<div class="modal-content">
				  <div class="modal-body" id="mindigitalForm">
					<div>
						<img style="margin-bottom:1em;" src="images/websign.jpg"/>
						<div class="input-group mb-3">
						  <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">Όνομα Χρήστη mindigital</span>
						  </div>
						  <input id="userMindigital" type="text" class="form-control" placeholder="keyword" aria-label="keyword" aria-describedby="basic-addon1">
						</div>
						<div class="input-group mb-3">
						  <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">Κωδικός Χρήστη mindigital</span>
						  </div>
						  <input id="passMindigital" type="password" class="form-control" placeholder="keyword" aria-label="keyword" aria-describedby="basic-addon1">
						</div>
					</div>
				  <div class="modal-footer">
					<button type="button" class="btn btn-warning trn" onclick="connectToMindigital();">Σύνδεση</button>
					<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
				  </div>
				</div>
			  </div>
			</div>
		</div>
	
	
		<?php 
			//echo '<pre>' . print_r($_SESSION, TRUE) . '</pre>';
			//var_dump($_SESSION);
			//echo $_SESSION['canSignAsLast'].'φφφ';
			//echo $_SESSION['codePage'];

		?>
		
	</body>
</html>