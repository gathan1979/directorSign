<nav class="myNavbar">

		<a href="#" class="toggle-button">
			<span class="bar"></span>
			<span class="bar"></span>
			<span class="bar"></span>
		</a>
		<div class="myNavbarBody">
			<ul class="nav">
				<!--<?php $url = substr($_SERVER['REQUEST_URI'], strrpos( $_SERVER['REQUEST_URI'], '/' )+1);?>-->
				<li>
					<div class="myNavbarTitle">
						ΑΙΑΝΟΣ
					</div>
				</li>
				<li id="prosIpografi" class=" text-center"><a href="index.php"><div class="buttonWithIcon"><div>Προς Υπογραφή</div><div><i class="fas fa-file fa-lg"></i></div></div></a></li>
				<li id="ipogegrammena" class=" text-center"><a href="signed.php"><div class="buttonWithIcon"><div>Διεκπεραιωμένα</div><div><i class="fas fa-file-pdf fa-lg"></i></div></div></a></li>
				<!--<li id="aporrifthenta" class="text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/rejected.php"?>"><span class="label label-danger">Απορριφθέντα</span></br></br><i class="far fa-file-excel fa-lg"></i></a></li>-->
				<?php 			
					//Πρόσβαση στο Παρουσιολόγιο
					if ($_SESSION['privilege'] == 1){
						echo '<li class="text-center"><a target="_blank" href="http://'.$_SERVER['SERVER_ADDR'].'/'.$_SESSION['applicationFolderAdeies'].'/index.php">Άδειες</a></li>';
					}
					
				?>
					
				<li class="text-center"><a target="_blank" rel="opener" href="
				<?php 
						echo "https://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/editTable1.php?tn=book";
					
				?>"><div class="buttonWithIcon"><div>
				
				<?php
				//Πρόσβαση στο Πρωτόκολλο λεκτικό
				if ($_SESSION['protocolAccessLevel'] == 1){
					echo "Διαχειριστής";
				}
				else {
					echo "Χρεώσεις Μου";
				}
				?>
				</div><div><i class="fas fa-book fa-lg"></i></div></div></a></li>
				
				

				
				<li class="text-center"><a target="_blank" href="
				<?php 
				
						echo "https://".$_SERVER['SERVER_ADDR']."/nocc-1.9.8/protocol/protocolBook.php?tn=book";
					
				
				?>"><div class="buttonWithIcon"><div>
				Πρωτόκολλο</div><div><i class="fab fa-readme fa-lg"></i></div></div></a></li>
				
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
				<li id="minimata" class="<?php if($url=='messages.php'){echo 'active';} ?> text-center"><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/messages.php"?>"><div class="buttonWithIcon"><div>Μηνύματα (<?php echo $openMessages;?>)</div><div><i class="fas fa-envelope-open fa-lg"></i></div></div> </a></li>

				<!--<li class="<?php if($url=='settings.php'){echo 'active';} ?>  text-center" id="rithmiseis" ><a href="<?php echo "http://".$_SERVER['SERVER_ADDR']."/directorSign/settings.php"?>"><div class="buttonWithIcon"><div>Ρυθμίσεις</div><div><i class="fas fa-cog fa-lg"></i></div></div></a></li>

				<li class="text-center"><a href="#" onclick="runHelp()"><span class="label label-default">Βοήθεια</span></br></br><i class="fas fa-question fa-lg"></i></a></li>
				
				<li class="text-center" id="aposindesiEfarmogis"><a href="logout.php"><span class="label label-default">Αποσύνδεση</span></br></br><i class="fas fa-power-off fa-lg"></i></a></li>
				<li class="text-center" id="emfanisiOnomatos" style="padding-left:50px;padding:15px;"><b id="connectedUser"><?php echo $_SESSION['user']."</b><br><p style='font-size:1rem;margin-bottom:0px;'>".$_SESSION['roleName'];?></p><a  href="changePasswordForm.php?aa=<?php echo $_SESSION['aa_staff'];?>&aaP=<?php echo $_SESSION['aa_user'];?>">Αλλαγή Κωδικού</a></li>
				-->
				
				<?php 
					//	if (isset($_SESSION['accessLevel1'])){
						// echo '<ul class="dropdown-menu">';
						// echo '<li><b style="margin-left:0.5em;" id="connectedUser">'.$_SESSION['user'].'</span></b>';
						// echo '<li class="disabled" style="background-color : lightgreen;"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=1">'.$_SESSION['roleName'].'</a></li>';	
						// if (isset($_SESSION['accessLevel1'])){
							// echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=2">'.$_SESSION['roleName1'].'</a></li>';
						// }
						// if (isset($_SESSION['accessLevel2'])){
							// echo '<li><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=3">'.$_SESSION['roleName2'].'</a></li>';
						// }
						// echo '<li role="separator" class="divider"></li>';
						// echo '<li><a  href="changePasswordForm.php?aa='.$_SESSION['aa_staff'].'&aaP='.$_SESSION['aa_user'].'">Αλλαγή Κωδικού</a></li>';
						// echo '<li role="separator" class="divider"></li>';
						// echo '<li id="aposindesiEfarmogis"><div class="dropdownMenuDiv"><i class="fas fa-power-off fa-lg"></i><a href="logout.php">Αποσύνδεση</a></div></li>';
						//echo '</div></li>';
				//	}

				?>
					
				<!--<li class="text-center" id="protActive" style="padding-left:10px;"><a><b>Αποσύνδεση σε</br><div id="time"></div></br></a></b></li>
				<!--<li class="text-center" id="presenceActive" style="padding-left:10px;"><a><b>Διαχειριστής</br>Παρουσιολoγίου</br><?php $msg = ($_SESSION['privilege'] == 1 ?'<i class="far fa-check-square" style="color:green">' :'<i class="far fa-minus-square" style="color:red">'); echo $msg;?></i></a></br></b></li>
				<li class="text-center" id="presenceActive" style="padding-left:10px;"><a><b>Προϊστάμενος</br>Τμήματος</br><?php $msg = ($_SESSION['accessLevel'] >= 1 ?'<i class="far fa-check-square" style="color:green">' :'<i class="far fa-minus-square" style="color:red">'); echo $msg;?></i></a></br></b></li>-->
			</ul>
		</div>
		<!--<div class="myNavbarBody" style="padding:0px 1em 0px 1em">-->
		<div class="dropdown" id="dropdownButton">
			<div  class="dropdownIcon buttonWithIcon">
				<div>
					
				</div>
				<div>
					<i class="fas fa-user fa-lg"></i></button>
				</div>
			</div>
			<div class="dropdownContent">
				<ul class="dropdownContentUl">
					<li>
					<?php 
							echo '<li class="dropdownContentHeader"><b style="margin-left:0.5em;" id="connectedUser">'.$_SESSION['user'].'</span></b></li>';
							echo '<li class="userDepartmentBox">';
								echo '<li class="dropdownContentItem btn selected"  style="background-color : lightgreen;"><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=1">'.$_SESSION['roleName'].'</a></li>';	
								if (isset($_SESSION['accessLevel1'])){
									echo '<li  class="dropdownContentItem btn" ><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=2">'.$_SESSION['roleName1'].'</a></li>';
								}
								if (isset($_SESSION['accessLevel2'])){
									echo '<li  class="dropdownContentItem btn" ><a href="http://'.$_SERVER['SERVER_ADDR'].'/directorSign/changeProperty.php?role=3">'.$_SESSION['roleName2'].'</a></li>';
								}
							echo '</li>';
							echo '<li  class="dropdownContentItem" ><a  href="changePasswordForm.php?aa='.$_SESSION['aa_staff'].'&aaP='.$_SESSION['aa_user'].'">Αλλαγή Κωδικού</a></li>';
							echo '<li class="dropdownContentItem id="rithmiseis1" ><a href="settings.php">Ρυθμίσεις</a></li>';
							echo '<li class="dropdownContentItem" id="aposindesiEfarmogis"><a href="logout.php">Αποσύνδεση</a></li>';
					?>
				</ul>
			</div>
		</div>
		<!--</div>-->
</nav>