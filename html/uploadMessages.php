<button class="btn btn-default" data-toggle="collapse" data-target="#demo" id="neoSxedio">Νέο Μήνυμα &nbsp<i class="fas fa-external-link-alt"></i></button>
<div id="demo" class="collapse" style="padding:0em;background-color:rgba(76, 76, 76, 0.1);">
	</br>
	<div class="col-12" >
		<div class="row col-12" style="padding-left:1em;">
			<div style="margin-left : 1em;">
				<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="fileLoadButton();"/>
			</div>
			
		</div>
	</div>
	<div class="col-md-12" id="viewSelectedFiles" style="padding-bottom:1em;"></div>
	<div class="form-group" style="padding:1em;">
		<label for="authorComment">Σώμα Μηνύματος: </label>
		<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Μήνυμα" onKeyUp="enableSendButton();"></textarea>
		
	</div>
	<?php include 'html\assignmentsOld.php';?>	
	<div class="col-6" style="margin-left : 1em;">
		<input type="button" disabled class="btn btn-primary ektos" id="uploadMessageButton" onclick="uploadMessage()" value="Αποστολή"/>
	</div>

</div>
<hr>