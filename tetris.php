<!DOCTYPE html>
<html>
		<script src="js/jquery-2.1.4.min.js"></script>
		<link rel="stylesheet" type="text/css" href="style.css" />
		<link rel="stylesheet" href="tetris/blockrain.css">
		<link rel="stylesheet" type="text/css" href="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/css/bootstrap.min.css" >

		<!-- jQuery and Blockrain.js
		<script src="tetris/jquery.js"></script> -->
		<script src="tetris/blockrain.jquery.min.js"></script>
		<script src="bootstrap-3.3.5-dist/bootstrap-3.3.5-dist/js/bootstrap.min.js"></script>
<head>
	<meta charset="UTF-8">
	<title>Δωράκι</title>
	
	<script type="text/javascript">
		
				$( document ).ready(function() {
					$('.game').blockrain(
						{
							  autoplay: false, // Let a bot play the game
							  autoplayRestart: true, // Restart the game automatically once a bot loses
							  showFieldOnStart: true, // Show a bunch of random blocks on the start screen (it looks nice)
							  theme: 'candy', // The theme name or a theme object
							  blockWidth: 12, // How many blocks wide the field is (The standard is 10 blocks)
							  autoBlockWidth: false, // The blockWidth is dinamically calculated based on the autoBlockSize. Disabled blockWidth. Useful for responsive backgrounds
							  autoBlockSize: 18, // The max size of a block for autowidth mode
							  difficulty: 'normal', // Difficulty (normal|nice|evil).
							  speed: 20, // The speed of the game. The higher, the faster the pieces go.

							  // Copy
							  playText: 'Let\'s play some Tetris',
							  playButtonText: 'Play',
							  gameOverText: 'Game Over',
							  restartButtonText: 'Play Again',
							  scoreText: 'Score',

							  // Basic Callbacks
							  onStart: function(){},
							  onRestart: function(){},
							  onGameOver: function(score){
									$.ajax({
										   type: "post",
										   data: {"score": score },
										   url: "saveScores.php",
										   success: function(msg){
												//alert(msg); 
										   }
									});	
							  },

							  // When a line is made. Returns the number of lines, score assigned and total score
							  onLine: function(lines, scoreIncrement, score){}
						
						}
					);
					$('.game').blockrain('controls', true);
				});
				
				function pauseGame(){
					if ($("#pauseButton").text()=="ΠΑΥΣΗ"){
						$('.game').blockrain('pause');
						$("#pauseButton").html("ΣΥΝΕΧΙΣΗ");
					}
					else{
						$('.game').blockrain('resume');
						$("#pauseButton").html("ΠΑΥΣΗ");
					}
				}
				
	</script>
</head>

<body>
	
		<label class="titlos">Merry Christmas</label>
		<div class="container-fluid">
			<div style="float:left"><div class="game" style="width:400px;height:600px; padding:auto;float:left"></div><button id="pauseButton" type="button" class="btn btn-primary" onclick="pauseGame();">ΠΑΥΣΗ</button></div>
			<div style="float:right;text-align:left;">
		<?php
			include 'connection.php';	
			mysqli_query($con,"set names utf8");	
			$sql = "SELECT * from games where game='tetris' order by score desc limit 5";
			//echo $sql;
			$i = 1;
			$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysqli_error($con));
			while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
				echo "<label class='titlosMikros'>".$i.".".$row['user']."-".$row['score']."</label></br>";
				$i++;
			} 
		?>
			</div>
		</div>
</body>
</html>