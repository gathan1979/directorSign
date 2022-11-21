<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html lang="el">
	<head>
	
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		


		<script src="js/jquery-2.1.4.min.js"></script>
		
			
		<script type="text/javascript">	
			
			
				requestOTP();
				//getCertificates();
				//sendHash();
				
				function requestOTP (){
					$.ajax({
						type: "post",
						data: {"Username" : 'gathan1979', "Password" : 'Gia@0!8!'},
						url: "requestOTP.php",
						success: function(msg){
							var mydata = JSON.parse(msg);
							if (mydata.Outcome ==0){
								alert("επιτυχία "+mydata.Description );		
							}
							else if (mydata.Outcome ==1){
								alert("επιτυχία ");		
							}
							else {
								 alert("Αποτυχία λήψης OTP");	
							}
						}
					});
				}
				
					
		</script>
	
	</head>


<body>


</body>
</html>