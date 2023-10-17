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
		<script type="module" src="components/Attachment.js"></script>
		<script type="module" src="components/Relative.js"></script>
		<script type="module" src="components/Comment.js"></script>
		<script type="module" src="components/History.js"></script>
		<script type="module" src="components/Folders.js"></script>
		<script type="module" src="components/Assignments.js"></script>
		<script type="module" src="components/EditRecord.js"></script>
		<script type="module" src="components/AddRecord.js"></script>
		<script type="module" src="components/RequestRecord.js"></script>
		<script type="module" src="components/Tags.js"></script>
		<script type="module" src="components/YearSelector.js"></script>
		
		<link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="css/custom.css" />

		<!--fontawesome-->
		<link href="css/all.css" rel="stylesheet">
		<!--fontawesome-->
				
		<script type="module" >
			import {createUIstartUp, getPage, getToSignRecordsAndFill, getSignedRecordsAndFill, getChargesAndFill} from "./modules/UI_test.js";
			createUIstartUp();
			document.querySelector("#syncRecords").addEventListener("click", ()=>  { switch (getPage()){
					case "signature" :
						getToSignRecordsAndFill();
						break;
					case "signed" :
						getSignedRecordsAndFill();
						break;
					case "charges" :
						getChargesAndFill();
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
		
		
	</body>
</html>