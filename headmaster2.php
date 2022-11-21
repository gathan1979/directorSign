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
			$sec = "180";
			include 'connection1.php';	
			mysqli_query($con,"set names utf8");	
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
		
		<script type="text/javascript">	
		
				<?php
					if (isset($_GET['rmsg'])){
						echo 'alert("'.$_GET['rmsg'].'");';
					}
				?>	
			//+++30-07-2020 i sinartisi uploadfileold prepei na svistei se ligo kairo metaferthike sto js/customfunctions.js
			function uploadfileOld(){
				var files = document.getElementById('selectedFile').files;
				const numFiles = files.length;
				var data = new FormData();
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
				$('#showEmployees').click(function() {
					tempUserElement= document.getElementById('showEmployees');
					if(tempUserElement.classList.contains('btn-danger')){
						tempUserElement.classList.remove('btn-danger');
						tempUserElement.classList.add('btn-success');
						$('#example1').DataTable().search("").draw();
					}
					else if(tempUserElement.classList.contains('btn-success')){
						tempUserElement.classList.remove('btn-success');
						tempUserElement.classList.add('btn-danger');
						$('#example1').DataTable().search($('#connectedUser').text()).draw();
					}
					//$('#textbox1').val(this.checked);        
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
			
			<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>
				<br>-->
			<?php include 'html/headmasterExtraMenu.php';?> 	
				
			<div class="table-responsive" id="soma"><br>
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
					  $sql = "select * from filestobesigned where aa in (select revisionId from `filestobesigned` where aa in ( SELECT max(aa) FROM `filestobesigned` 
								WHERE `revisionId`!=0 group by revisionId order by `aa` asc) and nextLevel=2)
								union
								select * from filestobesigned where nextLevel=2 and `revisionId`=0 and aa not in (select revisionId from `filestobesigned` where aa in 
								( SELECT max(aa) FROM `filestobesigned` WHERE `revisionId`!=0 group by revisionId order by `aa` asc) )
								";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
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
						  
							$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId']." limit 1";
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 2".mysql_error()); 
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							
							$file_extension = pathinfo($row['filename'], PATHINFO_EXTENSION);
							$file_without_extension = pathinfo($row['filename'], PATHINFO_FILENAME);
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file = $row['filename'];
							}
							else{
								$preview_file = $file_without_extension.".pdf";
							}
							if ($file_extension=="pdf" || $file_extension=="PDF"){
								$preview_file_signed = $row['filename'];
							}
							else{
								$preview_file_signed = $file_without_extension.".pdf";
							}
							//preview last upload
								$sql3 = "SELECT * from filestobesigned where aa=(select max(aa) from 
								filestobesigned where filename<>'' and revisionId=".$row['aa'].")";
								//echo $sql3;
								$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 2".mysql_error()); 
								$row3 = mysqli_fetch_array($rslt3, MYSQLI_BOTH);
								
								$file_extension = pathinfo($row3['filename'], PATHINFO_EXTENSION);
								$file_without_extension = pathinfo($row3['filename'], PATHINFO_FILENAME);
								if ($file_extension=="pdf" || $file_extension=="PDF"){
									$preview_file_last = $file_without_extension.".pdf";
								}
								else{
									$preview_file_last = $file_without_extension.".pdf";
								}
							
								echo '<tr class="success"><td class="text-right">';										
								echo '<button class="btn btn-success btn-sm" onclick="preview_file_by_name(\''.$row['filename'].'\')">'.$row['filename'].'</button>&nbsp<i  class="fas fa-search-plus" title="προεπισκόπηση τελευταίας τροποποίησης εγγράφου" onclick="preview_PDF(\''.$preview_file_last.'\','.$row['aa'].');"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i  class="fas fa-book" title="προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\');"></i>'.$relevantDocsElement.'</td><td class="text-right">';
								echo $row['date'].'</td><td class="text-right">';
								echo $row2['fullName'].'</td><td class="text-right">';
								echo $row['comments'].'</td><td class="text-right">';
								echo "<a class='btn btn-primary btn-sm ' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/history.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-inbox' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Προβολή Ιστορικού'></a>&nbsp&nbsp";
								if ($_SESSION['accessLevel']>="1"){	
									echo "<a class='btn btn-success btn-sm showModal' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/forward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-tag' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Προώθηση - Ψηφιακή Υπογραφή Εγγράφου'></a>&nbsp&nbsp";
									echo "<a class='btn btn-warning btn-sm ' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/backward.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-download' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Αυτόματη Επιστροφή'></a>&nbsp&nbsp";
									echo "<a class='btn btn-danger btn-sm ' href='http://".$_SERVER['SERVER_ADDR']."/directorSign/reject.php?aa=".$row['aa']."'><span class='glyphicon glyphicon-ban-circle' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip' title='Οριστική Απόρριψη'></a></td></tr>";
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
		
		<div class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-hidden="true">
		  <div class="modal-dialog" role="document">
			<div class="modal-content">
			  <div class="modal-header">
				<h5 class="modal-title">Επιλογή συσκευής</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
				  <span aria-hidden="true">&times;</span>
				</button>
			  </div>
			  <div class="modal-body">
				<?php
					include "findDevices.php";
				
				?>
			  </div>
			  <div class="modal-footer">
				<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
		
		
	</body>
</html>