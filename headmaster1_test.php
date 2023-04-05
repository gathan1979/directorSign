<!DOCTYPE html>

<html>
	<head>
	
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<title>Ηλεκτρονικές Υπηρεσίες</title>
		
		<!-- Bootstrap core CSS
		
		<script src="js/jquery-3.6.3.min.js"></script> -->
		<script src="js/popper.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="css/custom.css" />

		<!--fontawesome-->
		<link href="css/all.css" rel="stylesheet">
		<!--fontawesome-->
				
		<script type="module" src="./modules/signatureRecords.js"></script>
		<script type="module" >
			import {createUIstartUp} from "./modules/createUI.js";
			createUIstartUp();
		</script>
	

	</head>
	<body > 
		<table id="dataToSignTable" class="table">
			<thead>
			  <tr>
				<th id="filename" class="text-right">Έγγραφο προς Υπογραφή <div style="display:none;" id="recordsSpinner" class="spinner-border spinner-border-sm" role="status">
						<span class="visually-hidden">Loading...</span>
					</div></th>
				<th id="date" class="text-right">Εισαγωγή</th>
				<th id="author" class="text-right">Συντάκτης</th>
				<th id="status" class="text-right">Κατάσταση</th>
				<th id="fileActions" class="text-right">Ενέργειες</th>
			  </tr>
			</thead>
			<tbody>

			</tbody>
		</table>
		
	</body>
</html>