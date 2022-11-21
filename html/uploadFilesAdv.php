

<button class="btn btn-default" data-toggle="collapse" data-target="#demo" id="neoSxedio">Ανέβασμα Αρχείου Διόρθωσης &nbsp <i class="fas fa-external-link-alt"></i></button>
<div id="demo" class="collapse" style="padding:0em;background-color:rgba(76, 76, 76, 0.1);">
	</br>
	<div class="col-md-12" style="padding-left:1em;">
		<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
	</div>
	<div class="col-md-12" id="viewSelectedFiles" style="padding-bottom:1em;"></div>
	<div class="form-group" style="padding:1em;">
		<input type="hidden" class="btn btn-default ektos" name="aa" id="aa" value="<?php echo $_GET['aa'];?>"/>
		<label for="authorComment">Σχόλια: </label>
		<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
		<label class="checkbox-inline"><input type="checkbox" class="form-check-input" id="apedCheckButton">Υπογραφή Websign</label>
		<br>
		<div class="radio">
			<label><input type="radio" name="optradio" id="optradio" value="1" checked>Προώθηση Εγγράφου</label>
		</div>
		<div class="radio">
		<?php 
		if ($_SESSION['accessLevel']=="0"){
			echo '<label><input type="radio" name="optradio" id="optradio" value="0" disabled>Επιστροφή Εγγράφου</label>';
		}
		else{
			echo '<label><input type="radio" name="optradio" id="optradio" value="0">Επιστροφή</label>';
		}
		?>
		</div>
		<br><br>
		<input type="button" disabled class="btn btn-primary ektos" id="uploadFileButton" onclick="uploadfileAdv()" value="Μεταφόρτωση Αρχείου"/>
	</div>

</div>
<hr>