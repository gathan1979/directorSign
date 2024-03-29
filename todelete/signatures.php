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
				
		<script type="module" >
			import {createUIstartUp, page, getToSignRecordsAndFill, getSignedRecordsAndFill} from "./modules/UI.js";
			createUIstartUp();
			document.querySelector("#syncRecords").addEventListener("click", ()=>  { switch (page){
					case "signature" :
						getToSignRecordsAndFill();
						break;
					case "signed" :
						getSignedRecordsAndFill();
						break;
					default :
						alert("Σελίδα μη διαθέσιμη");
						return;
					}
				}	
			)
		</script>
	

	</head>
	<body > 
		<table id="dataToSignTable" class="table">
			<thead>
			  <tr>
				<th id="filename" class="text-right">Έγγραφο <button id="syncRecords" title="Ανανέωση εγγραφών" type="button" class="btn btn-dark btn-sm"><i class="fas fa-sync"></i></button><div style="margin-left:1em;display:none;" id="recordsSpinner" class="spinner-border spinner-border-sm" role="status">
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