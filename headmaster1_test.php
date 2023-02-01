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
			
			$(document).ready(function(){
				
				$('#rejectModal').on('show.bs.modal', function (e) {
					var aa = e.relatedTarget.getAttribute('data-whatever');
					$('#rejectButton').click(function(){rejectDocument(aa);}); 
					
				});
				
				
				
				$('#otpModal').on('shown.bs.modal', function (e) {
					$('#createExCopyButton').prop('disabled', false);
					$('#otpText').val("");
					var otpRes = requestOTP();
					console.log(otpRes);
					if (otpRes[0] == 0){
						$('#otpText').val(otpRes[1]);
						$('#otpStatus').text("Εισαγωγή OTP από email");
						var aa = e.relatedTarget.getAttribute('data-whatever');
						$('#createExCopyButton').click(function(){signMD(aa);}); 
					}
					else if (otpRes[0] == 1){
						$('#otpStatus').text(otpRes[1]);
						$('#otpText').val('Eχει δηλωθεί η χρήση κινητού για λήψη OTP. Eισάγετε το OTP.');
						var aa = e.relatedTarget.getAttribute('data-whatever');
						$('#createExCopyButton').click(function(){signMD(aa);}); 	
					}
					else {
						$('#otpStatus').text(otpRes[1]);
						$('#createExCopyButton').prop('disabled', true);
					}
				});
				
				$('#otpModal1').on('shown.bs.modal', function (e) {
					//console.log(e);
					$('#createExCopyButton1').prop('disabled', false);
					$('#otpText1').val("");
					var otpRes = requestOTP();
					console.log(otpRes);
					if (otpRes[0] == 0){
						$('#otpText1').val(otpRes[1]);
						$('#otpStatus1').text("Εισαγωγή OTP από email");
					}
					else if (otpRes[0] == 1){
						$('#otpStatus1').text(otpRes[1]);
						//$('#otpText1').val('Eχει δηλωθεί η χρήση κινητού για λήψη OTP. Eισάγετε το OTP.');
						//var aa = e.relatedTarget.getAttribute('data-whatever'); 	
					}
					else {
						$('#otpStatus1').text(otpRes[1]);
						$('#createExCopyButton1').prop('disabled', true);
					}
				});
				
				
				$('#showToSignOnly').click(function() {
					var user = $('#connectedUser').text();
					tempUserElement= document.getElementById('showToSignOnly');
					if(tempUserElement.classList.contains('btn-danger')){
						tempUserElement.classList.remove('btn-danger');
						tempUserElement.classList.add('btn-success');
						//$('#example1').DataTable().columns(4).search("#sign#").draw();
					}
					else if(tempUserElement.classList.contains('btn-success')){
						tempUserElement.classList.remove('btn-success');
						tempUserElement.classList.add('btn-danger');
						//$('#example1').DataTable().columns(4).search('').draw();
					}
					tempUserElement1= document.getElementById('showEmployees');
					if(tempUserElement1.classList.contains('btn-danger')){
						//$('#example1').DataTable().columns(2).search(user).draw();
					}
					else{
						//$('#example1').DataTable().columns(2).search('').draw();
					}
					//$('#textbox1').val(this.checked);        
				});
				
				
				$( "#saveButtonModal" ).click(function() {
					 //var interest = $('ul#alldevices').find('li.active').;
					
				});
				//tempUserElement.classList.remove('btn-danger');
				//tempUserElement.classList.add('btn-success');
				if (+JSON.parse(localStorage.getItem("loginData")).user.roles[0].accessLevel){
					//$('#example1').DataTable().columns(4).search("#sign#").draw();
				}
				else{
					tempUserElement= document.getElementById('showToSignOnly');
					tempUserElement.classList.remove('btn-success');
					tempUserElement.classList.add('btn-danger');
				}
				var element1 = document.getElementById("selectSchButtons");
				var element2 = document.getElementById("schBtngroup");	
				var element3 = document.getElementById("mindigitalBtngroup");
				if (element1.classList.contains('btn-secondary')){
					element2.style.display = "none";
					element3.style.display = "block";
				} else {
					element2.style.display = "block";
					element3.style.display = "none";
				}
				
				
			});
			
			
			
		function enableFileLoadButton(){
			if(document.getElementById("selectedFile").value != "") {
				document.getElementById("uploadFileButton").disabled = false;
				var files = document.getElementById('selectedFile').files;
				const numFiles = files.length;
				var well = document.getElementById("viewSelectedFiles");
				$( "#viewSelectedFiles" ).empty();
				for (i = 0; i < numFiles; i++) {
					  var element = document.createElement("BUTTON");
					  //Assign different attributes to the element. 
					  element.innerHTML  = files[i].name;
					  element.id = "filebutton_"+i;
					  element.className="btn-xs btn-primary";
					  element.setAttribute("style","margin-right:15px;");
					  element.addEventListener("click", changeFileState);
					  if (numFiles ==1){
						element.classList.remove('btn-primary');
						element.classList.add('btn-success');
					  }
					  //Append the element in page (in span).  
					  well.appendChild(element);
				}
				
			}
			else{
				document.getElementById("uploadFileButton").disabled = true;
			}
		}	

		function changeFileState(event) { // Note this is a function
			var element = event.target;
			if (element.classList.contains('btn-primary')){
				element.classList.remove('btn-primary');
				element.classList.add('btn-success');
			}
			else{
				element.classList.remove('btn-success');
				element.classList.add('btn-primary');
			}
		};
		
		
		function enableRejectButton(){
			if(document.getElementById("rejectText").value != "") {
				document.getElementById("rejectButton").disabled = false;
			}
			else{
				document.getElementById("rejectButton").disabled = true;
			}
		}
		
		function mindigitalButtons(){
			var element = document.getElementById("selectMiniditalButtons");
			var element1 = document.getElementById("selectSchButtons");
			if (element.classList.contains('btn-secondary')){
				element.classList.remove('btn-secondary');
				element.classList.add('btn-primary');
				element1.classList.remove('btn-primary');
				element1.classList.add('btn-secondary');
			}
			var element2 = document.getElementById("schBtngroup");	
			var element3 = document.getElementById("mindigitalBtngroup");
			if (element1.classList.contains('btn-secondary')){
				element2.style.display = "none";
				element3.style.display = "block";
			} else {
				element2.style.display = "block";
				element3.style.display = "none";
			}
		}
		
		function schButtons(){
			var element = document.getElementById("selectMiniditalButtons");
			var element1 = document.getElementById("selectSchButtons");
			if (element1.classList.contains('btn-secondary')){
				element1.classList.remove('btn-secondary');
				element1.classList.add('btn-primary');
				element.classList.remove('btn-primary');
				element.classList.add('btn-secondary');
			}
			var element2 = document.getElementById("schBtngroup");	
			var element3 = document.getElementById("mindigitalBtngroup");
			if (element1.classList.contains('btn-secondary')){
				element2.style.display = "none";
				element3.style.display = "block";
			} else {
				element2.style.display = "block";
				element3.style.display = "none";
			}
		}
			
</script>		

	</head>
	<body > 
		<!--<?php include 'html/startPageMenu_test.php';?> -->
		

			
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
		
		<div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
		  <div class="modal-dialog" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title">Επιλογή συσκευής</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body" id="devicesDiv">
				<?php			
					//include "findDevices.php";
				?>
			  </div>
			  <div class="modal-footer">
			  	<button type="button" class="btn btn-warning trn" onclick="connectToUsb();">Σύνδεση</button>
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
		
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
	
	<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-labelledby="rejectModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon1" >Οριστική Απόρριψη Εγγράφου</span></b>
					<span class="input-group-text" id="basic-addon1" ><br><br><u>Επισήμανση</u><br>
					    Ν.2693/1999. αρ.25 παρ.5<i>
						Οι προιστάμενοι όλων των βαθμίδων οφείλουν να προσυπογράφουν τα έγγραφα που ανήκουν στην 
						αρμοδιότητά τους και εκδίδονται με την υπογραφή του προϊσταμένου τους. Αν διαφωνούν, οφείλουν 
						να διατυπώσουν εγγράφως τις τυχόν αντιρρήσεις τους. Αν παραλείψουν να προσυπογράψουν το 
						έγγραφο, θεωρείται ότι το προσυπέγραψαν.</i>
					</span>
				  </div>
				  <textarea onKeyUp="enableRejectButton();" id="rejectText" cols="100" rows="3" size="200" class="form-control" placeholder="Η απόρριψη δεν αφορά σε διαφωνία ως προς το περιεχόμενο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
			  	<button id="rejectButton" type="button" class="btn btn-warning trn" disabled>Απόρριψη</button>
				<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
	</div>
	

	
	<div class="modal fade" id="otpModal" tabindex="-1" role="dialog" aria-labelledby="otpModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div  class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon2" >Εισαγωγή OTP</span></b><div id="otpTitle"></div>
					<span class="input-group-text" id="basic-addon2" ><br><br><u>Επισήμανση</u><br>
						<span id="otpStatus">το ΟTP λαμβάνεται αυτόματα από το email, εφόσον έχετε δηλώσει αυτό τον τρόπο λήψης στο mindigital.</span>
					</span>
				  </div>
				  <textarea id="otpText" cols="100" rows="3" size="200" class="form-control" placeholder="Εισαγωγή OTP" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
				<button id="checkEmailButton" type="button" class="btn btn-secondary trn"  style="margin-right:2em;">Επανέλεγχος Email</button>
				<button id="createExCopyButton" type="button" class="btn btn-warning trn" >Δημιουργία Αντιγράφου</button>
				<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
	</div>
	
	<div class="modal fade" id="otpModal1" tabindex="-1" role="dialog" aria-labelledby="otpModalLabel1" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div  class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon21" >Εισαγωγή OTP</span></b><div id="otpTitle"></div>
					<span class="input-group-text" id="basic-addon21" ><br><br><u>Επισήμανση</u><br>
						<span id="otpStatus1">το ΟTP λαμβάνεται αυτόματα από το email, εφόσον έχετε δηλώσει αυτό τον τρόπο λήψης στο mindigital.</span>
					</span>
				  </div>
				  <textarea id="otpText1" cols="100" rows="3" size="200" class="form-control" placeholder="Εισαγωγή OTP" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
				<button id="checkEmailButton1" type="button" class="btn btn-secondary trn"  style="margin-right:2em;">Επανέλεγχος Email</button>
				<button id="createExCopyButton1" type="button" class="btn btn-warning trn" >Υπογραφή Εγγράφου</button>
				<button id="closeButtonModal1" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
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