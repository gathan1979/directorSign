		<nav class="navbar navbar-default" style="background-color:#cbead2">
			<div class="container-fluid">
				<div class="navbar-header">
					<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
						<span class="sr-only">Toggle navigation</span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
						<span class="icon-bar"></span>
					  </button>
					<!--<a class="navbar-brand" href="#">
						<img alt="Brand" src="images/logo.png" width="60" height="60" class="img-responsive">
						<i class="fas fa-tags fa-3x"></i>-->
					 </a>
				</div>
				<?php	  
						//@include '../connection1.php';	
						//mysqli_query($con,"set names utf8");	
						/* $newDocs = 0;	//---------------------------------------------- allagi 18-10-2018
						$sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
						//echo $sql;
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysqli_error($con));
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
							$sql1 = "SELECT * from filestobesigned where userId!=".$_SESSION['aa_user']." and viewed=0 and 
							(SELECT nextLevel from filestobesigned where 
							aa=(select max(aa)from filestobesigned where revisionId=".$row['aa']."))!=4 
							and revisionId=".$row['aa'];
							//echo $sql1."<br>";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							if (mysqli_num_rows($rslt1) >0){
								//echo $sql1."<br>";
							}
							$newDocs += mysqli_num_rows($rslt1);
							//echo $newDocs;
						} */
				?>	  
				
				<?php	  
						//include 'connection1.php';	
						//mysqli_query($con,"set names utf8");	
						$signedDocs = 0;	
						/* $sql = "SELECT * from filestobesigned where userId=".$_SESSION['aa_user']." and revisionId=0";
						//echo $sql."<br>";
						$rslt= mysqli_query($con,$sql) or die ("apotyxia erotimatas 1".mysql_error());
						while ($row = mysqli_fetch_array($rslt, MYSQLI_BOTH)){   //emfanizei to noumero ton allagon sto badge
							$sql1 = "SELECT * from filestobesigned where  viewed=0 and 
							nextLevel=4 and revisionId=".$row['aa'];
							//echo $sql1."<br>";
							$rslt1= mysqli_query($con,$sql1) or die ("apotyxia erotimatas 3 ".mysqli_error($con)); 
							$signedDocs += mysqli_num_rows($rslt1);
							//echo $signedDocs;
						} */
				?>	
				 <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
					<ul class="nav navbar-nav">
						<?php $url = substr($_SERVER['REQUEST_URI'], strrpos( $_SERVER['REQUEST_URI'], '/' )+1);?>
						<li id="prosIpografi" class="<?php if($url=='headmaster1.php'){echo 'active';} ?> text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign"?>"><span class="label label-warning">Προς Υπογραφή</span></br></br><i class="far fa-file fa-lg"></i></a></li>
						<li id="ipogegrammena" class="<?php if($url=='signed.php'){echo 'active';} ?> text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/signed.php"?>"><span class="label label-success">Διεκπεραιωμένα</span></br></br><i class="far fa-file-pdf fa-lg"></i></a></li>
						<!--<li id="aporrifthenta" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>"><span class="label label-danger">Απορριφθέντα</span></br></br><i class="far fa-file-excel fa-lg"></i></a></li>-->
						<?php 
							//Διαχειριστής των Emails του Πρωτοκόλλου
							if ($_SESSION['protocolAccessLevel'] == 1){
								//echo '<li class="text-center"><a target="_blank" href="http://'.$_SERVER['SERVER_ADDR'].'/nocc-1.9.8/index.php"><span class="label label-primary">Emails</span></br></br><i class="fas fa-envelope  fa-lg"></i></a></li>';
							}
							
							//Πρόσβαση στο Παρουσιολόγιο
							if ($_SESSION['privilege'] == 1){
								echo '<li class="text-center"><a target="_blank" href="http://'.$_SERVER['SERVER_ADDR'].'/'.$_SESSION['applicationFolderAdeies'].'/index.php"><span class="label label-info">Άδειες</span></br></br><i class="far fa-calendar-alt  fa-lg"></i></a></li>';
							}
							
						?>
							
						<li class="text-center"><a target="_blank" rel="opener" href="
						<?php 
								echo "https://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/editTable1.php?tn=book";
							
						?>"><span class="label label-primary">
						
						<?php
						//Πρόσβαση στο Πρωτόκολλο λεκτικό
						if ($_SESSION['protocolAccessLevel'] == 1){
							echo "Διαχειριστής";
						}
						else {
							echo "Χρεώσεις Μου";
						}
						?>
						</span></br></br><i class="fas fa-book fa-lg"></i></a></li>
						
						

						
						<li class="text-center"><a target="_blank" href="
						<?php 
						
								echo "https://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/protocolBook.php?tn=book";
							
						
						?>"><span class="label label-primary">
						Πρωτόκολλο</span></br></br><i class="fab fa-readme fa-lg"></i></a></li>
						
						<div style="display:none;">
							<form name="heskForm" id="heskForm" action="../hesk/admin/index.php" method="post"  target="_blank">
							  <input type="text" name="user" id="user" value="<?php echo $_SESSION['aa_user'] ?>"></input>
							  <input type="text" name="pass" id="pass" value="1Q2w3e$"></input>
							  <input type="text" name="remember_user" id="remember_user" value="NOTHANKS"></input>
							  <input type="text" name="a" id="a" value="do_login"></input>
							  <input type="submit"  value="Submit form">
							</form>
						</div>

						
						<!--<li class="text-center" style="cursor: pointer;"><a target="_blank" onclick="loginHesk();"><span class="label label-info">
						Υποστήριξη</span></br></br><i class="fas fa-headset fa-lg"></i></a></li>-->
						
						<!--<li class="text-center" style="cursor: pointer;"><a target="_blank" onclick="getPresent();"><span class="label label-danger">
						Ειδική Εφαρμογή</span></br></br><i class="fas fa-gifts fa-lg"></i></a></li>-->
						<?php
							$sqlM = "select messages.* from messages left join assignments on messages.aa=assignments.record where closed=0 and assignedToUser=".$_SESSION['aa_staff']."  union select * from messages where closed=0 and userId=".$_SESSION['aa_staff']." order by `closed` asc ,`date` desc";
							//echo $sql;
							$rsltM= mysqli_query($con,$sqlM) or die ("apotyxia erotimatas 1".mysql_error());
							$openMessages = mysqli_num_rows($rsltM); 
						?>
						<li id="minimata" class="<?php if($url=='messages.php'){echo 'active';} ?> text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/messages.php"?>"><span class="label label-success">Μηνύματα</span></br></br><i class="fas fa-envelope-open fa-lg"></i><span class="badge badge-warning"><?php echo $openMessages;?></span></a></li>

						<li class="<?php if($url=='settings.php'){echo 'active';} ?>  text-center" id="rithmiseis" ><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/settings.php"?>"><span class="label label-danger">Ρυθμίσεις</span></br></br><i class="fas fa-cog fa-lg"></i></a></li>

						<!--<li class="text-center"><a href="#" onclick="runHelp()"><span class="label label-default">Βοήθεια</span></br></br><i class="fas fa-question fa-lg"></i></a></li>
						
						<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php"><span class="label label-default">Αποσύνδεση</span></br></br><i class="fas fa-power-off fa-lg"></i></a></li>
						<li class="text-center" id="emfanisiOnomatos" style="padding-left:50px;padding:15px;"><b id="connectedUser"><?php echo $_SESSION['user']."</b><br><p style='font-size:1rem;margin-bottom:0px;'>".$_SESSION['roleName'];?></p><a  href="changePasswordForm.php?aa=<?php echo $_SESSION['aa_staff'];?>&aaP=<?php echo $_SESSION['aa_user'];?>">Αλλαγή Κωδικού</a></li>
						-->
						<?php 
						//	if (isset($_SESSION['accessLevel1'])){
								echo '<li class="text-center"><div class="dropdown" style="padding-top:20px">';
								echo  '<button class="btn btn-success dropdown-toggle" data-toggle="dropdown">';

								//echo 'Αλλαγή Ρόλου';
								echo '<span class="caret"></span></button>';
								
								echo '<ul class="dropdown-menu">';
								echo '<li><b style="margin-left:0.5em;" id="connectedUser">'.$_SESSION['user'].'</span></b>';
								echo '<li class="disabled" style="background-color : lightgreen;"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=1">'.$_SESSION['roleName'].'</a></li>';	
								if (isset($_SESSION['accessLevel1'])){
									echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=2">'.$_SESSION['roleName1'].'</a></li>';
								}
								if (isset($_SESSION['accessLevel2'])){
									echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=3">'.$_SESSION['roleName2'].'</a></li>';
								}
								echo '<li role="separator" class="divider"></li>';
								echo '<li><a  href="changePasswordForm.php?aa='.$_SESSION['aa_staff'].'&aaP='.$_SESSION['aa_user'].'">Αλλαγή Κωδικού</a></li>';
								echo '<li role="separator" class="divider"></li>';
								echo '<li id="aposindesiEfarmogis"><div style="padding-left:20px;" class="dropdownMenuDiv"><button onclick="logout();" class="btn-danger btn-sm" id="logoutBtn">Αποσύνδεση</button></div></li>';
								echo '</ul></div></li>';
						//	}

						?>
						<!--<li class="text-center" id="protActive" style="padding-left:10px;"><a><b>Αποσύνδεση σε</br><div id="time"></div></br></a></b></li>
						<!--<li class="text-center" id="presenceActive" style="padding-left:10px;"><a><b>Διαχειριστής</br>Παρουσιολoγίου</br><?php $msg = ($_SESSION['privilege'] == 1 ?'<i class="far fa-check-square" style="color:green">' :'<i class="far fa-minus-square" style="color:red">'); echo $msg;?></i></a></br></b></li>
						<li class="text-center" id="presenceActive" style="padding-left:10px;"><a><b>Προϊστάμενος</br>Τμήματος</br><?php $msg = ($_SESSION['accessLevel'] >= 1 ?'<i class="far fa-check-square" style="color:green">' :'<i class="far fa-minus-square" style="color:red">'); echo $msg;?></i></a></br></b></li>-->
					</ul>
				</div><!-- /.navbar-collapse -->
			</div><!-- /.container-fluid -->
		</nav>