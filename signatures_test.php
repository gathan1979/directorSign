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
		<script src="components/Attachment.js"></script>
		
		<link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<script src="bootstrap-5.1.3-dist/js/bootstrap.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="css/custom.css" />

		<!--fontawesome-->
		<link href="css/all.css" rel="stylesheet">
		<!--fontawesome-->
				
		<script type="module" >
			import {createUIstartUp, page, getToSignRecordsAndFill, getSignedRecordsAndFill, getChargesAndFill} from "./modules/UI_test.js";
			createUIstartUp();
			document.querySelector("#syncRecords").addEventListener("click", ()=>  { switch (page){
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