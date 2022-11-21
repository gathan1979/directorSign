<!DOCTYPE html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html lang="el">
	<head>
	<?php
		session_start();
		if (!isset($_SESSION['user'])){
			header('Location: index.php');
		}
	?>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		<!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
		<title>Ηλεκτρονική εφαρμογή καταχώρησης αδειών προσωπικού</title>
		
		 <!-- Bootstrap core CSS -->
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >
		<link rel="stylesheet" type="text/css" href="style.css" />
		<link rel="stylesheet" type="text/css" href="hopscotch.css" />
		<script src="js/jquery-2.1.4.min.js"></script>
		<script src="js/bootstrap.min.js"></script>	
		<script src="js/hopscotch.js"></script>	
		<script type="text/javascript">	
		
		// Define the tour!
				var tour = {
				  id: "hello-hopscotch",
				   i18n: {
					nextBtn: "Επόμενο",
					prevBtn: "Προηγούμενο",
					doneBtn: "Τέλος",
					skipBtn: "Παράβλεψη",
					closeTooltip: "Κλείσιμο",
					stepNums : ["1", "2", "3"]
				  },
				  steps: [
					{
					  title: "Μενού Προβολή",
					  content: "Αναζητήστε τη συγκεντρωτική κατάσταση των αδειών του προσωπικού καθώς και τις άδειες κάθε υπαλλήλου αναλυτικά",
					  target: "provoliAdeias",
					  placement: "bottom"
					},
					{
					  title: "Μενού Εισαγωγή",
					  content: "Εισάγετε τις άδειες του προσωπικού καθώς και τις δίωρες αποχωρήσεις",
					  target: "eisagogiAdeias",
					  placement: "bottom"
					},
					{
					  title: "Μενού Παρουσίες",
					  content: "Εμφανίστε την ώρα προσέλευσης και αποχώρησης των υπαλλήλων ανά ημέρα καθώς και εκτεταμένα στατιστικά στοιχεία",
					  target: "provoliParousias",
					  placement: "bottom"
					},
					{
					  title: "Μενού Διαχείριση",
					  content: "Προσθέστε και διαγράψτε προσωπικό",
					  target: "diaxeirisiXriston",
					  placement: "bottom"
					},
					{
					  title: "Μενού Αποσύνδεση",
					  content: "Αποσυνδεθείτε από την εφαρμογή",
					  target: "aposindesiEfarmogis",
					  placement: "bottom"
					}
				  ]
				};
				
			function runHelp(){
				hopscotch.startTour(tour);
			}
			
				
		</script>
		
	</head>
	<body>
		
		<nav class="navbar navbar-default">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					  </button>
					<a class="navbar-brand" href="#">
						<img alt="Brand" src="images/logo.png" width="30" height="30" class="img-responsive">
					 </a>
				</div>
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<input class="hidden" name="xristis" id="xristis" value="<?php echo $_SESSION['aa_user']; ?>"/>
					<ul class="nav navbar-nav">
						<li class="active text-center" id="provoliAdeias"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/ektiposiOlaTrexousaXroniaMetafores1.php"?>">Προβολή<br><span class="glyphicon glyphicon-search" aria-hidden="true"> <span class="sr-only">(current)</span></a></li>
						<li class="text-center" id="eisagogiAdeias"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/adeies.php"?>">Εισαγωγή<br><span class="glyphicon glyphicon-plus" aria-hidden="true"></a></li>		
						<li class="text-center" id="provoliParousias"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/connectAccess.php"?>">Παρουσίες<br><span class="glyphicon glyphicon-user" aria-hidden="true"></a></li>
						<li class="text-center" id="diaxeirisiXriston"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/xristes.php"?>">Διαχείριση<br><span class="glyphicon glyphicon-wrench" aria-hidden="true"></a></li>
						<li class="text-center"><a href="#" onclick="runHelp()">Βοήθεια<br><span class="glyphicon glyphicon-education" aria-hidden="true"></a></li>
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση<br><span class="glyphicon glyphicon-off" aria-hidden="true"></a></li>
					</ul>
					<!--<input id="ektiposi" class="btn btn-default navbar-btn" value="Συγκεντρωτική κατάσταση" onclick="window.location='<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/ektiposiOlaTrexousaXroniaMetafores1.php"?>'";/>
					<input id="ektiposi" class="btn btn-default navbar-btn" value="Διαχείριση χρηστών" onclick="window.location='<?php echo "http://".$_SERVER['SERVER_ADDR']."/adeies/xristes.php"?>'";/>
					<input name="xristis" id="xristis" value="<?php echo $_SESSION['aa_user']; ?>"/>
					<input  id="aposindesi" class="btn btn-default navbar-btn" value="Αποσύνδεση <?php echo $_SESSION['user']?>" />-->
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>
		

		<div id="soma" class="container-fluid">
		
		</div>
	</body>
</html>
