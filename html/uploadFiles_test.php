
	<!--<button class="btn btn-default" data-bs-toggle="collapse" data-bs-target="#uploadDiv" id="neoSxedio">Ανέβασμα νέου Σχεδίου (doc, xls, pdf) &nbsp<i class="fas fa-external-link-alt"></i></button>-->
	<div id="uploadDiv" class="collapse" style="padding:0em;background-color:rgba(76, 76, 76, 0.1);">
		</br>
		<div class="col-md-12" style="padding-left:1em;">
			<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
		</div>
		<div class="col-md-12" id="viewSelectedFiles" style="padding-bottom:1em;"></div>
		<div class="form-group" style="padding:1em;">
			<label for="authorComment">Σχόλια: </label>
			<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
			
			<input type="button" disabled style="margin-top : 5px;" class="btn btn-primary ektos" id="uploadFileButton"  value="Μεταφόρτωση Αρχείου"/>

			
		</div>

	</div>
