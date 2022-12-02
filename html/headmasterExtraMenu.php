<button class="btn btn-success" id="showEmployees">Έγγραφα Υφισταμένων</button>
<button class="btn btn-success" id="showToSignOnly">Προς Υπογραφή</button>
<button class="btn btn-primary" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>

<?php
	if (isset($_SESSION['userSch'])){
		echo '<button id="emailButton" style="margin-left : 2em;" class="btn btn-success" data-toggle="tooltip" title="Λήψη μηνυμάτων" onclick="connectToEmail();"><i id="faMail" class="far fa-envelope-open"></i></button>';
	}
	else{
		echo '<button id="emailButton" style="margin-left : 2em;" class="btn btn-danger" data-toggle="tooltip" title="Σύνδεση sch email" onclick="showEmailModal();"><i id="faMail" class="far fa-envelope"></i></button>';
	}
	if (isset($_SESSION['userMindigital'])){
		echo '<button id="mindigitalButton" style="margin-left : 0.2em;" class="btn btn-success" data-toggle="tooltip" title="Σύνδεση στο mindigital" onclick="showMindigitalModal();"><i class="fas fa-file-signature"></i></button>';
	}
	else{
		echo '<button id="mindigitalButton" style="margin-left : 0.2em;" class="btn btn-danger" data-toggle="tooltip" title="Σύνδεση στο mindigital" onclick="showMindigitalModal();"><i class="fas fa-file-signature"></i></button>';
	}
	
?>

<br>