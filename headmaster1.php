<!DOCTYPE html>

<html>
	<head>
	
	
		<?php
			header('Content-Type: text/html; charset=UTF-8');
			session_start();
			//phpinfo();
			//exit;
			//if(!extension_loaded('wfio')){echo 'error load exten';};
			//include 'login.php';
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
			$sec = "3600";
			include 'connection1.php';	
			mysqli_query($con,"set names utf8");	
			//if (isset($_SESSION['loginTime']) && (time() - $_SESSION['loginTime'] > 600)) {
				// last request was more than 30 minutes ago
				//include 'logout.php';
			//}
		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονικές Υπηρεσίες</title>
		
		<!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />
		
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/buttons.bootstrap.min.css" >
		
		<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css" />
		<link rel="stylesheet" type="text/css" href="style.css" />

		<script src="js/jquery-2.1.4.min.js"></script>

		<script src="js/bootstrap.min.js"></script>	

		
		<script src="DataTables-1.10.16/js/jquery.dataTables.js"></script>
		<script src="DataTables-1.10.16/js/dataTables.bootstrap.js"></script>
		
		<script src="DataTables-1.10.16/js/dataTables.buttons.min.js"></script>
		<script src="DataTables-1.10.16/js/buttons.bootstrap.min.js"></script>
		

		<script src="js/hopscotch.js"></script>	
		<script src="js/pdfobject.min.js"></script>	
		
		<link href="css/all.css" rel="stylesheet">
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script src="js/jquery-ui.min.js"></script>
		<script type="text/javascript" src="js/customfunctions.js"></script>  
		<script type="module" src="./modules/getDBData.js"></script>
		
		<script type="module" >
			import {getUserData}  from "./modules/getDBData.js";
			if (localStorage.getItem("userData") == null){
				console.log("Λήψη δεδομένων χρήστη");
				const user = getUserData().then( res => {
					console.log(res);
					localStorage.setItem("userData", JSON.stringify(res));
					return res;
				});
			}
			else{
				console.log("Ήδη συνδεδεμένος");
			}
			
		</script>  
		
		<script type="text/javascript" defer>
		
				<?php
					if (isset($_GET['rmsg'])){
						echo 'alert("'.$_GET['rmsg'].'");';
					}
				?>	
			
			
			function logout(){
				const url = JSON.parse(localStorage.getItem("userData")).server_address;
				console.log(url);
				localStorage.clear();
				location.href = "https://"+url+"/directorSign/logout.php";
				
			}
			
			function signDocument(aa){
				$('#signModal').modal('hide');
				$("#signing").fadeIn();
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
						var response = xmlhttp.responseText;
						//console.log(response);
						location.reload();
						
					}
				}
				var comment = document.getElementById('signText').value;
				xmlhttp.open("GET","forward.php?aa="+aa+"&comment="+comment);
				xmlhttp.send();	
				
			}
			
			function showOTP(aa , isLast = 0){
				const button = document.getElementById("createExCopyButton1");
				button.dataset.whatever = aa;
				button.onclick = function(){signDocumentMindigital(aa ,isLast);};
				$('#signModal').modal('hide');
				$('#otpModal1').modal('show');
			}
			
			function signDocumentMindigital(aa , isLast = 0){
				let otp = $('#otpText1').val();
				console.log("entering signDocumentMindigital "+aa+" with OTP "+otp);
				$('#otpModal1').modal('hide');
				$("#signing").fadeIn();
				let xmlhttp;
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
						let response = xmlhttp.responseText;
						console.log(response);
						location.reload();	
					}
				}
				let comment = document.getElementById('signText').value;
				xmlhttp.open("GET","forward.php?aa="+aa+"&comment="+comment+"&mindigital=1&otp="+otp+"&isLast="+isLast);
				xmlhttp.send();	
			}
			
			function signAsLast(aa){
				$('#signModal').modal('hide');
				$("#signing").fadeIn();
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
						var response = xmlhttp.responseText;
						//console.log(response);
						location.reload();
						
					}
				}
				var comment = document.getElementById('signText').value;
				xmlhttp.open("GET","forward.php?aa="+aa+"&comment="+comment+"&isLast=1");
				xmlhttp.send();	
				
			}
			
			function signWithObjectionDocument(aa){
				$('#signModal').modal('hide');
				$("#signing").fadeIn();
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
						var response = xmlhttp.responseText;
						//console.log(response);
						location.reload();
						
					}
				}
				var comment = document.getElementById('signText').value;
				xmlhttp.open("GET","forward.php?aa="+aa+"&objectionComment="+comment);
				xmlhttp.send();	
				
			}
			
			
			function rejectDocument(aa){
				$('#rejectModal').modal('hide');
				$("#rejecting").fadeIn();
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
						//var response = xmlhttp.responseText;
						location.reload();
						
					}
				}
				var comment = document.getElementById('rejectText').value;
				xmlhttp.open("GET","reject.php?aa="+aa+"&comment="+comment);
				xmlhttp.send();	
				
			}
			
			//+++30-07-2020 i sinartisi uploadfileold prepei na svistei se ligo kairo metaferthike sto js/customfunctions.js

			function uploadfileold(){
				var files = document.getElementById('selectedFile').files;
				const numFiles = files.length;
				var data = new FormData();
				var k=0;
				var aped = document.getElementById("apedCheckButton").checked;
				if(aped){
					aped=1;
				}else{
					aped=0;
				}
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
				 "order": [[ 4, "desc" ]],
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
				
				//$('#showEmployees').change(function() {
					//if(this.checked) {
					//	
					//}
					//else{
					//	
					//}
					//
				//});
				$('#showEmployees').click(function() {
					var user = $('#connectedUser').text();
					tempUserElement= document.getElementById('showEmployees');
					if(tempUserElement.classList.contains('btn-danger')){
						tempUserElement.classList.remove('btn-danger');
						tempUserElement.classList.add('btn-success');
						$('#example1').DataTable().columns(2).search('').draw();
					}
					else if(tempUserElement.classList.contains('btn-success')){
						tempUserElement.classList.remove('btn-success');
						tempUserElement.classList.add('btn-danger');
						$('#example1').DataTable().columns(2).search(user).draw();
					}
					tempUserElement1= document.getElementById('showToSignOnly');
					if(tempUserElement1.classList.contains('btn-danger')){
						$('#example1').DataTable().columns(4).search('').draw();
					}
					else{
						$('#example1').DataTable().columns(4).search('#sign#').draw();
					}
					//$('#textbox1').val(this.checked);        
				});
				
				$('#rejectModal').on('show.bs.modal', function (e) {
					var aa = e.relatedTarget.getAttribute('data-whatever');
					$('#rejectButton').click(function(){rejectDocument(aa);}); 
					
				});
				
				$('#signModal').on('show.bs.modal', function (e) {
					var aa = e.relatedTarget.getAttribute('data-whatever');
					$('#signButton').click(function(){signDocument(aa);});
					$('#signWithObjectionButton').click(function(){signWithObjectionDocument(aa);});
					$('#signAsLast').click(function(){signAsLast(aa);});
					$('#signWithMindigital').click(function(){showOTP(aa);});
					$('#signAsLastMindigital').click(function(){showOTP(aa, 1);});
					$('#signWithObjectionButtonMindigital').click(function(){signWithObjectionDocument(aa);});
					
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
						$('#example1').DataTable().columns(4).search("#sign#").draw();
					}
					else if(tempUserElement.classList.contains('btn-success')){
						tempUserElement.classList.remove('btn-success');
						tempUserElement.classList.add('btn-danger');
						$('#example1').DataTable().columns(4).search('').draw();
					}
					tempUserElement1= document.getElementById('showEmployees');
					if(tempUserElement1.classList.contains('btn-danger')){
						$('#example1').DataTable().columns(2).search(user).draw();
					}
					else{
						$('#example1').DataTable().columns(2).search('').draw();
					}
					//$('#textbox1').val(this.checked);        
				});
				
				
				$( "#saveButtonModal" ).click(function() {
					 //var interest = $('ul#alldevices').find('li.active').;
					
				});
				//tempUserElement.classList.remove('btn-danger');
				//tempUserElement.classList.add('btn-success');
				if (<?php echo $_SESSION['accessLevel'];?>){
					$('#example1').DataTable().columns(4).search("#sign#").draw();
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
			   
			   $(".cancelModal").click(function(e) {
					e.preventDefault();
					//$("#loading").fadeIn();
					var url=$(this).attr("href");
					setTimeout(function() {
						setTimeout(function() {$("#canceling").fadeIn();},90);
						window.location=url;
					},0);

			   });
			});

			
			function preview_PDF_old(file,id){
				
				 //$( "#my-container").dialog({width : 800, height : 800, modal :true});
				  //var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
				  window.open("pdfjs/web/viewer.php?file=../../uploads/"+file+"&id="+id+"#zoom=page-fit");
			}
			
			
			
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
		  
		  function loginHesk(){
			document.getElementById("heskForm").submit();
		};
		
		function getPresent(){
			window.open("tetris.php");
		}
		
		function selectDevice(dev){
			var ulElements = document.getElementById("alldevices").childNodes;
			for (var i = 0 ; i < ulElements.length; i++) {
				ulElements[i].classList.remove('active');
			}
			var element = document.getElementById("device"+dev);
			element.classList.add('active');
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
					var response = xmlhttp.responseText;
					//alert(response);
				}
			}
			//alert(dev);
			var params = "id="+dev;
			xmlhttp.open("GET","selectDevice.php?"+params);
			xmlhttp.send();	
			
		}
		
		
		
		
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
			#loader {
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
			#signing {
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
			#rejecting {
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
			
			#canceling {
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

		<!--  <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">  -->
	</head>
	<body > 
		<?php include 'html/startPageMenu.php';?> 
		
		<div id="container" class="container-fluid" style="background-color:#cadfc0;padding-bottom: 2em;">
			<h4 class="text-center">
			
			<br><span class="label label-default">Έγγραφα για ψηφιακή υπογραφή</span><br><br>
			</h4>
				<?php include 'html/uploadFiles.php';?> 
				<!--<button class="btn btn-default" data-toggle="collapse" data-target="#demo" id="neoSxedio">Ανέβασμα νέου Σχεδίου (doc, xls, pdf) &nbsp<i class="fas fa-external-link-alt"></i></button>
				<div id="demo" class="collapse" style="padding:0em;background-color:rgba(76, 76, 76, 0.1);">
					</br>
					<div class="col-md-12" style="padding-left:1em;">
						<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
					</div>
					<div class="col-md-12" id="viewSelectedFiles" style="padding-bottom:1em;"></div>
					<div class="form-group" style="padding:1em;">
						<label for="authorComment">Σχόλια: </label>
						<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
						<label class="checkbox-inline"><input type="checkbox" class="form-check-input" id="apedCheckButton">Απαιτείται Υπογραφή της ΑΠΕΔ</label>
						<br><br>
						<input type="button" disabled class="btn btn-primary ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Αρχείου"/>
					</div>

				</div><hr>-->
			
			<!--<label class="checkbox-inline"><input type="checkbox" checked class="form-check-input" id="showEmployees">Εμφάνιση Εγγράφων Υφισταμένων</label>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>
			<button class="btn btn-success" id="showEmployees">Εμφάνιση Εγγράφων Υφισταμένων</button>
			<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>
			-->
			<?php include 'html/headmasterExtraMenu.php';?> 
			
			<div class="table-responsive" id="soma">
				<table class="table table-striped" id="example1">
					<thead>
					  <tr>
						<th class="text-right">Έγγραφο προς Υπογραφή</th>
						<th class="text-right">Εισαγωγή</th>
						<th class="text-right">Συντάκτης</th>
						<th class="text-right">Κατάσταση</th>
						<th class="text-right">Ενέργειες</th>
					  </tr>
					</thead>
					<tbody>
				<?php	
						include 'findLevels.php';		
						include 'connection1.php';	
						mysqli_query($con,"set names utf8");					 
						//$sql = "SELECT * from filestobesigned where revisionId=0 and userId in
						  // (select attendanceId from signpasswords where prime=1 and department=".$_SESSION['department'].") order by date desc";
						//$sql = "SELECT * from filestobesigned where revisionId=0 and nextlevel!=2 and userId in
						 //  (select attendanceId from signpasswords where department=".$_SESSION['department'].") order by date desc";
						$deps = array();
						if ($_SESSION['accessLevel']=="1"){
							$deps = relevantDepsDown($_SESSION['department']);
						}
						else{
							array_push($deps,$_SESSION['department']);// to teleutaio stoixeio tou deps einai to tmima tou ipallilou
						}
						//var_dump($deps);
						$sql = "";
						for ($i=0;$i<sizeof($deps);$i++){
							if ($i>0) { $sql.=" union ";};
							$sql .="SELECT * from filestobesigned where 
							revisionId=0";
							if ($_SESSION['accessLevel']=="1"){
								$sql .=" and dep=".$deps[$i];
							}
							else{
								$sql .=" and userId=".$_SESSION['aa_user'];
							}
							$sql .=" and aa not in ( select revisionId from `filestobesigned` 
							where aa in ( SELECT max(aa) FROM `filestobesigned` WHERE `revisionId`!=0 
							group by revisionId order by `aa` asc) and nextLevel<=0)";
						}
						//echo $sql;
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".$sql);
						$messagesExist = 0;
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
							$messagesExist =mysqli_num_rows($rslt);
							/* $newDocs = 0;
							$sql11 = "SELECT * from filestobesigned where userId!=".$_SESSION['aa_user']." and 
								revisionId=".$row['aa']." and viewedHeadmaster1=0 and 
								(SELECT nextLevel from filestobesigned where 
								aa=(select max(aa)from filestobesigned where revisionId=".$row['aa']."))=1";
							//echo $sql11.'<br>';
							$rslt11= mysqli_query($con,$sql11) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$newDocs = mysqli_num_rows($rslt11);
							//echo $newDocs.'<br>'; */
							$relevantDocs = $row['relevantDocs'];
							$relevantDocsArray = explode("*", $relevantDocs);
							$relevantDocsElement = "&nbsp&nbsp&nbsp";
							if (count($relevantDocsArray)==1 && $relevantDocsArray[0]==""){
								//den periexei tipota to pedio tis vasis
							}
							else{
								for ($l=0;$l<count($relevantDocsArray);$l++){
									//$relevantDocsElement .='<a href="\directorSign\uploads\\'.$relevantDocsArray[$l].'" target="_blank"><i class="fas fa-paperclip" title="'.$relevantDocsArray[$l].'"></i></a>&nbsp';
									$relevantDocsElement .='<i class="fas fa-paperclip" onclick="preview_file_by_name(\''.$relevantDocsArray[$l].'\');" title="'.$relevantDocsArray[$l].'"></i>&nbsp';		
								}
							}							
							$file_extension = pathinfo($row['filename'], PATHINFO_EXTENSION);
							$file_without_extension = pathinfo($row['filename'], PATHINFO_FILENAME);
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file = $row['filename'];
							}
							else{
								$preview_file = $file_without_extension.".pdf";
							}
							
							//erotima $sql1 vrisko teleutaia sxetiki eggrafi
							$sql1 = "SELECT * from filestobesigned where aa=(select max(aa)from 
							filestobesigned where revisionId=".$row['aa'].")";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							$numRows1 = mysqli_num_rows($rslt1);
							if ($numRows1>0){
								$currDep = $row1['nextLevel'];
							}
							else{
								$currDep = $row['nextLevel'];
							}
							//-->erotima $sql1
							
							//erotima $sql2 gia onoma xristi
							$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							//-->erotima $sql2
							//erotima $sql5 gia accessLevel
							$sql5 = "SELECT accessLevel from signpasswords where attendanceId=".$row['userId']." and department=".$row['dep']." limit 1";
							$rslt5= mysqli_query($con,$sql5) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row5 = mysqli_fetch_array($rslt5, MYSQLI_BOTH);
							
							$sql3 = "SELECT * from filestobesigned where aa=(select max(aa) from 
							filestobesigned where filename<>'' and comments<>'Αυτόματη Προώθηση. Το έγγραφο έχει υπογραφεί ψηφιακά' and revisionId=".$row['aa'].")";
							//echo $sql3;
							$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 22".mysql_error()); 
							$row3 = mysqli_fetch_array($rslt3, MYSQLI_BOTH);
							//-->erotima $sql3
							$numRows3 = mysqli_num_rows($rslt3);
							$preview_file_last="";
							if ($numRows3>0){
								$file_extension = pathinfo($row3['filename'], PATHINFO_EXTENSION);
								$file_without_extension = pathinfo($row3['filename'], PATHINFO_FILENAME);
								if ($file_extension=="pdf" || $file_extension=="PDF"){
									$preview_file_last = $file_without_extension.".pdf";
								}
								else{
									$preview_file_last = $file_without_extension.".pdf";
								}
							}
							echo '<tr class="success"><td  class="text-right">';
							if ($preview_file_last==""){
								echo '<button class="btn btn-success" onclick="preview_file_by_name(\''.$row['filename'].'\')">'.$row['filename'].'</button>&nbsp<i class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" onclick="preview_PDF(\''.$preview_file.'\','.$row['aa'].');"></i>'.$relevantDocsElement.'</td><td class="text-right">';
							}
							else{
								echo '<button class="btn btn-success" onclick="preview_file_by_name(\''.$row['filename'].'\')">'.$row['filename'].'</button>&nbsp<i  class="fas fa-search-plus" title="Προεπισκόπηση τελευταίας τροποποίησης" onclick="preview_PDF(\''.$preview_file_last.'\','.$row['aa'].');"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" onclick="preview_PDF(\''.$preview_file.'\');"></i>'.$relevantDocsElement.'</td><td class="text-right">';
							}
							echo $row['date'].'</td><td class="text-right">';
							echo $row2['fullName'].'</td><td class="text-right">';
							//echo "sinartisi : ".allLevelsUp($row['dep'])." orisma:".$row['dep']." - ";
							$levels = 1+allLevelsUp($row['dep']);
							//if ($row5[0] == 0 ){
								//$levels +=1;
							//}
							//echo "aa grammis pros emfanisi ".$row['aa'];
							//echo "levels apo arxiko :".$levels;
							$diff = levelsDiff($row['dep'],$currDep);
								
							//echo "diff = ".$diff;
							//echo '<i class="btn btn-success btn-sm  fas fa-calendar-check fa-2x" ></i>&nbsp';
							for ($i=0;$i<$levels;$i++){
								if ($i <$diff){
									echo '<i class=" btn btn-success btn-sm fas fa-calendar-check " ></i>&nbsp';
								}
								else{
									echo '<i class="btn btn-danger btn-sm  fas fa-calendar-times " ></i>&nbsp';
								}	
							}
							echo '</td><td class="text-right">';
							//var_dump(depsDown($_SESSION['department']));
							//echo $lastDep." lastdep   ---  user dep".$_SESSION['department'];
							if ($currDep == $_SESSION['department'] and $_SESSION['accessLevel']==1){	
								
								// ------ 23-08-2021 afairethike to if kai emeino to else xoris sinthiki
								
								//if ($_SESSION['device']=="" && $row['aped']){
									//echo "<a class='btn btn-success btn-sm ' href='' onclick=\"alert('Δεν έχετε επιλέξει συσκευή!')\"><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'></a>&nbsp&nbsp";
								//}
								//else{
									//echo "<a class='btn btn-success btn-sm showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'></span><span style='display:none;'>#sign#</span></a>&nbsp&nbsp";
									echo '<button id="showSignModal" type="button" class="btn btn-success trn" data-toggle="modal" data-target="#signModal" data-whatever="'.$row['aa'].'">'."<span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'></span><span style='display:none;'>#sign#</span></button>&nbsp&nbsp";
								//}
								//echo "<a class='btn btn-warning btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."&dep=".$row['dep']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp";
							}
							else{
								
							}
							
							$sql10 = "SELECT * from objections where documentId=".$row['aa'];
							$rslt10= mysqli_query($con,$sql10) or die ("apotyxia erotimatas 24".mysql_error()); 
							$row10 = mysqli_fetch_array($rslt10, MYSQLI_BOTH);
							$numRows10 = mysqli_num_rows($rslt10);
							if ($numRows10>0){
								echo "&nbsp<a class='btn btn-primary btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'><span class='glyphicon glyphicon-flash' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip'></a>&nbsp&nbsp";
							}
							else{
								echo "&nbsp<a class='btn btn-primary btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
							}
							//echo "&nbsp<a class='btn btn-primary btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
							//echo "<a class='btn btn-danger btn-sm' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a>&nbsp&nbsp</td>";
							//echo "<button class='btn btn-danger btn-sm' onclick='showRejectModal(".$row['aa'].")'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></button>&nbsp&nbsp";
							echo '<button id="showRejectModal" type="button" class="btn btn-danger trn" data-toggle="modal" data-target="#rejectModal" data-whatever="'.$row['aa'].'">'."<span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></button></td></tr>";
						}
						if ($_SESSION['accessLevel']){
							$queryMDSign = "select tmpexactcopy.aa as tmpAA,filename,filestobesigned.aa,filestobesigned.date from tmpexactcopy left join filestobesigned on filestobesigned.aa=tmpexactcopy.revisionId where status=0 and dep=".$_SESSION['department'];
							$rsltMDSign= mysqli_query($con,$queryMDSign) or die ("apotyxia erotimatas 30".$queryMDSign);
							while ($row = mysqli_fetch_array($rsltMDSign, MYSQLI_BOTH)){
								echo '<tr class="info"><td  class="text-right">';
								echo '<button class="btn btn-info" onclick="preview_file_by_name(\''.$row['filename'].'\')">'.$row['filename'].'</button></td><td class="text-right">';
								echo $row['date'].'</td><td class="text-right"></td><td class="text-right"><strong>Αίτημα Α.Α. Mindigital</strong></td>';
								echo '<td class="text-right"><button id="signMD" type="button" class="btn btn-info trn"   data-toggle="modal" data-target="#otpModal" data-whatever="'.$row['aa'].'">'."<span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή Mindigital'></span><span style='display:none;'>#sign#</span></button>&nbsp&nbsp";
								echo '<button id="rejectExactCopyButton" onclick="rejectMD('.$row['tmpAA'].');" type="button" class="btn btn-danger trn" >'."<span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Απόρριψη ΑΑ'></button></td></tr>";
							}
							//echo $queryMDSign;
						}
						
						mysqli_close($con);
				?>	  
					</tbody>
			  </table>
			</div>
			
			<div style="padding:0.2em;background-color:#cadfc0;width :90%;position:absolute;bottom:0;" id="emailsContainer">

			</div>
		</div>	
		<?php
			if ($messagesExist){
				echo '<script type="text/javascript">notifyMe("Έχετε '.$messagesExist.' Μηνύματα για υπογραφή");</script>';
			}				
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
	
	<div class="modal fade" id="signModal" tabindex="-1" role="dialog" aria-labelledby="signModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div class="input-group-prepend" style="margin-bottom:2em;"><b>
					<button id="closeButtonModal" type="button" class="btn btn-primary trn" data-dismiss="modal">Χ</button>
					<span class="input-group-text" id="basic-addon1" >Υπογραφή Εγγράφου</span></b>
					<span class="input-group-text" id="basic-addon1" ><br><br><u>Επισήμανση</u><br>
					    Ν.2693/1999. αρ.25 παρ.5<i>
						Οι προιστάμενοι όλων των βαθμίδων οφείλουν να προσυπογράφουν τα έγγραφα που ανήκουν στην 
						αρμοδιότητά τους και εκδίδονται με την υπογραφή του προϊσταμένου τους. Αν διαφωνούν, οφείλουν 
						να διατυπώσουν εγγράφως τις τυχόν αντιρρήσεις τους. Αν παραλείψουν να προσυπογράψουν το 
						έγγραφο, θεωρείται ότι το προσυπέγραψαν.</i>
					</span>
				  </div>
				  <textarea id="signText" cols="100" rows="3" size="200" class="form-control" placeholder="Το σχόλιο είναι προαιρετικό" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
					<div style="margin-top : 0.2em;" class="btn-group" role="group" aria-label="Basic example">
					  <button type="button" id="selectMiniditalButtons" onclick="mindigitalButtons();" class="btn btn-primary">Mindigital</button>
					  <button type="button" id="selectSchButtons" onclick="schButtons();" class="btn btn-secondary">sch</button>
					</div>
				</div>
				
			  <div class="modal-footer">
				<div style="margin-top:1em;" id="mindigitalBtngroup" class="btn-group" role="group" aria-label="mindigitalGroup">
					<button id="signWithObjectionButtonMindigital" type="button" class="btn btn-danger trn" style="margin-left:3em;">Έγγραφη αντίρρηση<i style="margin-left:0.2em;" class="fas fa-thumbs-down"></i></button>
					<?php
						
						if ($_SESSION['canSignAsLast']=="1"){
							echo '<button  style="margin-left:0.5em;" id="signAsLastMindigital" type="button" class="btn btn-warning trn">Τελικός υπογράφων<i style="margin-left:0.2em;" class="fas fa-stamp"></i></button>';
						}
					?>
					<button id="signWithMindigital" type="button" class="btn btn-success trn" style="margin-left:1.5em;">Mindigital<i style="margin-left:0.2em;" class="fas fa-signature"></i></button>
				</div>
				<div style="margin-top:1em;" id="schBtngroup" class="btn-group" role="group" aria-label="schGroup">
					<button id="signWithObjectionButton" type="button" class="btn btn-danger trn" style="margin-left:3em;">Έγγραφη αντίρρηση<i style="margin-left:0.2em;" class="fas fa-thumbs-down"></i></button>
					<?php
						
						if ($_SESSION['canSignAsLast']=="1"){
							echo '<button style="margin-left:0.5em;" id="signAsLast" type="button" class="btn btn-warning trn">Τελικός υπογράφων<i style="margin-left:0.2em;" class="fas fa-stamp"></i></button>';
						}
					?>
					<button id="signButton" type="button" class="btn btn-success trn" style="margin-left:1.5em;">Sch<i style="margin-left:0.2em;" class="fas fa-signature"></i></button>
				</div>
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