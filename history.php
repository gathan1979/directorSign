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
			include 'connection1.php';
			$level = 1;
			$sql1 = "SELECT nextLevel from filestobesigned where aa=(select max(aa)from 
			filestobesigned where revisionId=".$_GET['aa'].")";
			$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
			$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
			if (isset($row1['nextLevel'])){
				$level = $row1['nextLevel'];
			}
			/* switch ($_SESSION['accessLevel']) {
				case 0:
					$sql2 = "update filestobesigned set viewed=1 where revisionId=".$_GET['aa'];
					$sql3 = "update filestobesigned set viewed=1 where aa=".$_GET['aa'];
					break;
				case 1:
					$sql2 = "update filestobesigned set viewedHeadmaster1=1 where revisionId=".$_GET['aa'];
					$sql3 = "update filestobesigned set viewedHeadmaster1=1 where aa=".$_GET['aa'];
					break;
				case 2:
					$sql2 = "update filestobesigned set viewedHeadmaster2=1 where revisionId=".$_GET['aa'];
					$sql3 = "update filestobesigned set viewedHeadmaster2=1 where aa=".$_GET['aa'];
					break;
				case 3:
					$sql2 = "update filestobesigned set viewedDirector=1 where revisionId=".$_GET['aa'];
					$sql3 = "update filestobesigned set viewedDirector=1 where aa=".$_GET['aa'];
					break;
				default :
					break;	
			}
			$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 12".mysqli_error($con)); 
			$rslt3= mysqli_query($con,$sql3) or die ("apotyxia erotimatas 13".mysqli_error($con));  */
			

			//get settings table into variable
			$settings = array();
			$query = mysqli_query($con,"SELECT * FROM settings");
			while($rowS = mysqli_fetch_array($query, MYSQLI_BOTH)){
			  $settings[] = $rowS;
			}
			
			function searchForId($id, $array) {
			   foreach ($array as $key => $val) {
				   if ($val['attribute'] === $id) {
					   return $key;
				   }
			   }
			   return null;
			}

		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />

		<link rel="stylesheet" type="text/css" href="style.css" />

		<script src="js/jquery-2.1.4.min.js"></script>

		<script src="js/bootstrap.min.js"></script>	

		<script src="js/hopscotch.js"></script>	
		
		<link href="css/fontawesome-all.css" rel="stylesheet">
		<!--<script defer src="js/fontawesome-all.js"></script>-->
		
		<script type="text/javascript" src="js/customfunctions.js"></script>  
		
		<script type="text/javascript">	
		
			//++++30-07-2020 na svistei emeine gia logous asfaleias
			function uploadfileAdvOld(){
				$("#loading").fadeIn();
				var data = new FormData();
				var radios = document.getElementsByName('optradio');
				for (var i = 0, length = radios.length; i < length; i++)
				{
				 if (radios[i].checked)
				 {
				  data.append('action',radios[i].value);
				  break;
				 }
				}
				data.append('selectedFile', document.getElementById('selectedFile').files[0]);
				data.append('aa', document.getElementById('aa').value);
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
				
			});
			
			function preview_PDF_old(file,id){
				
				 //$( "#my-container").dialog({width : 800, height : 800, modal :true});
				  //var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
				  window.open("pdfjs/web/viewer.php?file=../../uploads/"+file+"&id="+id+"#zoom=page-fit");
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
			  
			function recreateSendFile() { // Note this is a function
				var signers = document.getElementById("exactCopySignature").getElementsByTagName("button");
				var signerId = 0;
				for (i = 0; i < signers.length; i++) {
					if (signers[i].classList.contains('btn-success')){
						signerId = signers[i].id;
					}
				}
				//for (var pair of data.entries()) {
					//console.log(pair[0]+ ', ' + pair[1]); 
				//}
				$("#loading").fadeIn();
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
						//alert(xmlhttp.responseText);
						location.reload();
					}
				}
				var loc = "recreateSendFile.php?aa="+document.getElementById('aa').value+"&signer="+signerId;
				xmlhttp.open("GET",loc);
				xmlhttp.send();
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
						<!--<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">-->
						<i class="fas fa-tags fa-3x"></i>
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						
						<li class="active text-center"><a href="http://<?php echo $settings[array_search('server_address',array_column($settings, 'attribute'))][1].'/'.$settings[array_search('site_folder_name', array_column($settings, 'attribute'))][1];?>">Αρχική<br><i class="fab fa-adn fa-lg"></i></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><i class="fas fa-power-off fa-lg"></i></a></li>
					</ul>
					
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		<div id="container" class="container-fluid">
			<h4 class="text-center">
			<span class="label label-default">Ιστορικό Εγγράφου</span><br><br>
			</h4>
			
			<?php include 'html/uploadFilesAdv.php';?> 
			
			
			<?php /*
				if ($_SESSION['accessLevel'] == $level){
					echo '<button data-toggle="collapse" data-target="#demo">Ανέβασμα Αρχείου Διόρθωσης</button>';
					echo '<div id="demo" class="collapse">';
					echo '</br>';
					echo '<input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" accept="pdf,PDF,doc,DOC,docx,DOCX"/>';
					echo '<input type="button" class="btn btn-default ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Pdf"/>';
					echo '<input type="hidden" class="btn btn-default ektos" name="aa" id="aa" value="'.$_GET['aa'].'"/>';
					echo '<div class="radio">';
					echo ' <label><input type="radio" name="optradio" id="optradio" value="1" checked>Προώθηση Εγγράφου</label>';
					echo '</div>';
					echo '<div class="radio">';
					if ($_SESSION['accessLevel']=="0"){
						echo '<label><input type="radio" name="optradio" id="optradio" value="0" disabled>Επιστροφή Εγγράφου</label>';
					}
					else{
						echo '<label><input type="radio" name="optradio" id="optradio" value="0">Επιστροφή</label>';
					}	 
				}*/
			?>
				<!--</div>
			</div> -->
			<hr>
			<!--<input  type="date" name="imera" id="imera" required="true" onchange="paronProsopiko();"/>-->
			<div class="table-responsive" id="soma">
				<table class="table table-striped">
					<thead>
					  <tr>
						<th>Έγγραφο</th>
						<th class="col-md-6">Σχόλια</th>
						<th>Ημερομηνία Εισαγωγής</th>
						<th>Αποστολέας</th>
					  </tr>
					</thead>
					<tbody>
				<?php	  
					  include 'connection1.php';	
					  mysqli_query($con,"set names utf8");					 
					  $sql = "SELECT * from filestobesigned where aa=".$_GET['aa']." or revisionId=".$_GET['aa']." order by aa asc";
					  $rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
					  $i=1;
					  $filename = "";
					  while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){
						  	if ($row['revisionId']==0){
								$filename = $row['filename'];
								$aa = $row['aa'];
							}
							//include 'connection1.php';
							//$sql1 = "SELECT nextLevel from filestobesigned where aa=(select max(aa)from 
							//filestobesigned where revisionId=".$row['aa'].")";
							//$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 2".mysql_error()); 
							//$row1 = mysqli_fetch_array($rslt1, MYSQLI_BOTH);
							mysqli_close($con);
							//if ($row1['nextLevel']<4){ 
							include 'connection.php';
							mysqli_query($con,"set names utf8");									
							$sql2 = "SELECT fullName from staff where attendanceNumber=".$row['userId'];
							$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 3".mysql_error()); 
							$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);
							
							$relevantDocs = $row['relevantDocs'];
							$relevantDocsArray = explode("*", $relevantDocs);
							$relevantDocsElement = "&nbsp&nbsp&nbsp";
							if (count($relevantDocsArray)==1 && $relevantDocsArray[0]==""){
							//den periexei tipota to pedio tis vasis
							}
							else{
								for ($l=0;$l<count($relevantDocsArray);$l++){
									//$relevantDocsElement .='<br><a href="\directorSign\uploads\\'.$relevantDocsArray[$l].'" target="_blank" style="margin-left:10px;font-size:x-small;">'.$relevantDocsArray[$l].'</a>&nbsp';
									$relevantDocsElement .='<i class="fas fa-paperclip" onclick="preview_file_by_name(\''.$relevantDocsArray[$l].'\');" title="'.$relevantDocsArray[$l].'"></i>&nbsp';		

								}
							}
							echo '<tr><td>'; 
							
							//echo '<a href="\directorSign\uploads\\'.$row['filename'].'" target="_blank">'.$row['filename']."</a>".$relevantDocsElement.'</td><td>';
							echo '<button class="btn btn-success btn-sm" onclick="preview_file_by_name(\''.$row['filename'].'\')">'.$row['filename'].'</button>'.$relevantDocsElement.'</td><td>';
							echo 'Βήμα '.$i.' <br><span class="glyphicon glyphicon-play" aria-hidden="true"> '.$row2['fullName'].' <span class="glyphicon glyphicon-play" aria-hidden="true">  '.$row['comments'].'</td><td>';
							echo $row['date'].'</td><td>';
							echo $row['fromIP'].'</td><td>';
							//}
							$i++;
					  }
				?>	  
					</tbody>
			    </table>
				
				<?php
					// ----------------------------------  Έλεγχος Αντιρρήσεων -----------------------------------
					$sql10 = "SELECT * from objections where documentId=".$_GET['aa'];
					//echo $sql10;
					$rslt10= mysqli_query($con,$sql10) or die ("apotyxia erotimatas 2"); 
					$numRows10 = mysqli_num_rows($rslt10);
					if ($numRows10>0){
						echo '<br><div style="font-weight: bold;color:white;border-radius : 1em; padding: 1em;background: #34568B"';
					}
					while ($row10 = mysqli_fetch_array($rslt10, MYSQLI_BOTH)){	
						$sql2 = "SELECT fullName from staff where attendanceNumber=".$row10['userId'];
						$rslt2= mysqli_query($con,$sql2) or die ("apotyxia erotimatas 3"); 
						$row2 = mysqli_fetch_array($rslt2, MYSQLI_BOTH);					
						echo "<p>Ο/Η ".$row2[0]." υπέγραψε το έγγραφο διατυπώνοντας αντιρρήσεις - ".$row10['comment'].'</p>';
					}
					if ($numRows10>0){					
						echo '</div><br><br>';
					}
					// ----------------------------------  Έλεγχος Υπογραφής Sch -----------------------------------
				  $sql5 = "SELECT filename from filestobesigned where revisionId=".$_GET['aa']." and nextLevel=0"; // εύρεση τελικής υπογραφής
				  $rslt5= mysqli_query($con,$sql5) or die ("apotyxia erotimatas 1".mysqli_error());
				  $numRows5 = mysqli_num_rows($rslt5);
				  if ($numRows5>0){
					  $row5 = mysqli_fetch_array($rslt5, MYSQLI_BOTH);
					  $lastFilename = $row5[0];
					  $path_parts = pathinfo($lastFilename);
					  $sch_lastFilename= $path_parts['filename']."_sch.".$path_parts['extension'];
					  echo '<br><div style="font-weight: bold;color:white;border-radius : 1em; padding: 1em;background: #00B38B"';
					  if (file_exists("uploads//".$sch_lastFilename)){
						  echo "<p>Υπάρχει ηλεκτρονικά υπογεγραμμένη προηγούμενη έκδοση (υπογραφή sch) </p>";
						  echo '<button class="btn btn-success btn-sm" onclick="preview_file_by_name(\''.$sch_lastFilename.'\')">'.$sch_lastFilename.'</button>';
					  }
					  else if (file_exists($_SESSION['externalDiskSignature'].$sch_lastFilename)){
						  echo "<p>Υπάρχει ηλεκτρονικά υπογεγραμμένη προηγούμενη έκδοση (υπογραφή sch) </p>";
						  echo '<button class="btn btn-success btn-sm" onclick="preview_file_by_name(\''.$sch_lastFilename.'\')">'.$sch_lastFilename.'</button>';
					  }
					  echo '</div><br><br>';
				  }
				?>
				
				
				  <!--<div id="exactCopySignature" style="border-radius : 1em; padding: 1em;background: rgba(54, 54, 54, 0.2);">
				  <br><h5><b>Επαναδημιουργία Ακριβούς Αντιγράφου</b></h5><hr>
				  <br><b>Υπογραφή Αντιγράφου Από :</b>
					<?php
						include 'connection1.php';
						mysqli_query($con,"SET NAMES 'UTF8'");
						$sql = "SELECT staff.*, prime FROM `signpasswords` left join staff on signpasswords.attendanceId = staff.attendanceNumber where signpasswords.`department`=".$_SESSION['department']." and `accessLevel`=1 and signatureActive=1";	
						$result = mysqli_query($con,$sql) or die ("database read error - show table attachments");
						while ($row1 = mysqli_fetch_array($result, MYSQLI_BOTH)){	
							if ($row1['prime']){
								echo '&nbsp<button class="btn btn-success btn-sm" id="user'.$row1['attendanceNumber'].'" onclick="changeSignatureState(\'user'.$row1['attendanceNumber'].'\')" >'.$row1['fullName'].'</button>';													
							}
							else{
								echo '&nbsp<button class="btn btn-primary btn-sm" id="user'.$row1['attendanceNumber'].'" onclick="changeSignatureState(\'user'.$row1['attendanceNumber'].'\')" >'.$row1['fullName'].'</button>';													
							}
						}
					?>-->
					
			  <?php
					echo '<br><br>';
					if ($level == 0){
						$file_extension = pathinfo($filename, PATHINFO_EXTENSION);
						$file_without_extension = pathinfo($filename, PATHINFO_FILENAME);
						if ($file_extension=="pdf" || $file_extension=="PDF"){
							$preview_file = $filename;
						}
						else{
							$preview_file = $file_without_extension.".pdf";
						}
						
						
						echo '<i  class="fas fa-search" title="Προεπισκόπηση αρχικού εγγράφου" onclick="preview_PDF(\''.$preview_file.'\','.$_GET['aa'].');"> Προεπισκόπηση</i>';
						echo '<br><br><button class="btn btn-primary btn-sm" onclick="recreateSendFile();">Επαναδημιουργία Ακριβούς Αντιγράφου</button>';
					}
			  ?>
					</div>
			</div>
		</div>
		<div id="loading">
			<img src="images/loading.gif" alt="loading">
		</div>
	</body>
</html>