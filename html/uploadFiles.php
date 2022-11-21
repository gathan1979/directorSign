<button class="btn btn-default" data-toggle="collapse" data-target="#demo" id="neoSxedio">Ανέβασμα νέου Σχεδίου (doc, xls, pdf) &nbsp<i class="fas fa-external-link-alt"></i></button>
<div id="demo" class="collapse" style="padding:0em;background-color:rgba(76, 76, 76, 0.1);">
	</br>
	<div class="col-md-12" style="padding-left:1em;">
		<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
	</div>
	<div class="col-md-12" id="viewSelectedFiles" style="padding-bottom:1em;"></div>
	<div class="form-group" style="padding:1em;">
		<label for="authorComment">Σχόλια: </label>
		<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
		<!--  -----23-08-2021                                           -->
		<label class="checkbox-inline"><input type="checkbox" class="form-check-input" id="apedCheckButton" disabled>Απαιτείται Υπογραφή της ΑΠΕΔ</label>
		<!--  +++++23-08-2021                                           -->
		<label class="checkbox-inline"><input type="checkbox" class="form-check-input" id="mindigitalCheckButton">Υπογραφή Mindigital</label>
		<div id="exactCopySignature"><br><br><b>Υπογραφή Ακριβούς Αντιγράφου Από :</b>
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
		
		?>
		</div>
		<br><br>
		<input type="button" disabled class="btn btn-primary ektos" id="uploadFileButton" onclick="uploadfile()" value="Μεταφόρτωση Αρχείου"/>

		
	</div>

</div>
<hr>