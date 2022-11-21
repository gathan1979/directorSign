<!DOCTYPE html>

<html>
	<head>
	
	
		<?php
			header('Content-Type: text/html; charset=UTF-8');
			session_start();
			//phpinfo();
			//exit;
			//if(!extension_loaded('wfio')){echo 'error load exten';};
			//include 'login.php';
			if (!isset($_SESSION['user'])){
				if ($_SESSION['privilege']!="1") {
					header('Location: index.php');
				}
				//else{
				//	echo "Access restricted";
				//}
			}
			$_SESSION['time'] = date("Y-m-d H-i-s");
			$page = $_SERVER['PHP_SELF'];
			$sec = "3600";
			include 'connection1.php';	
			mysqli_query($con,"set names utf8");	
			//if (isset($_SESSION['loginTime']) && (time() - $_SESSION['loginTime'] > 600)) {
				// last request was more than 30 minutes ago
				//include 'logout.php';
			//}
		?>
	
		<meta http-equiv="Content-Type" content="text/html; charset=Greek">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονικές Υπηρεσίες</title>
		
		<!-- Bootstrap core CSS -->
		<!-- <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />
		
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/dataTables.bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="DataTables-1.10.16/css/buttons.bootstrap.min.css" >
		
		<!--<link rel="stylesheet" type="text/css" href="css/jquery-ui.min.css" />-->
		<link rel="stylesheet" type="text/css" href="css/styleNew.css" />

		<!--<script src="js/jquery-2.1.4.min.js"></script>

		<script src="js/bootstrap.min.js"></script>	

		
		<script src="DataTables-1.10.16/js/jquery.dataTables.js"></script>
		<script src="DataTables-1.10.16/js/dataTables.bootstrap.js"></script>
		
		<script src="DataTables-1.10.16/js/dataTables.buttons.min.js"></script>
		<script src="DataTables-1.10.16/js/buttons.bootstrap.min.js"></script>
		

		<script src="js/hopscotch.js"></script>	
		<script src="js/pdfobject.min.js"></script>	-->
		
		<link href="css/all.css" rel="stylesheet">
		<!--<script defer src="js/fontawesome-all.js"></script>
		
		<script src="js/jquery-ui.min.js"></script>-->
		<script src="js/toggle.js" defer></script>
		<script type="text/javascript" src="js/customfunctions.js"></script>  
		
		<script type="text/javascript">

			
		</script>	

		<!--  <meta http-equiv="refresh" content="<?php echo $sec?>;URL='<?php echo $page?>'">  -->
	</head>
	<body > 
		<?php include 'html/startPageMenuNew.php';?> 
<!--		

-->		
	</body>

</html>