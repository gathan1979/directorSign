
	<div style="padding-top:10px; padding-left : 1em;padding-bottom:10px;" >
		<div class="row col-12">	
			<div class="col-6" style="margin-left : 1em;">
				<!--<button  id="saveAssignmentButton" type="button" class="btn btn-outline-success trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="saveAssignments();"><i class="far fa-save"></i></button>-->
				<button  id="addNotificationButton" type="button" class="btn btn-info trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="selectAll();"><i class="far fa-bell"></i></button>
				<button  id="deselectUsersButton" type="button" class="btn btn-danger trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="deselectAll();"><i class="fas fa-user-slash"></i></button>
			
			</div>
		</div>
		<hr>
		<div  id="assignments" name="assignments" class="row col-12">
			<?php
					include 'connection1.php';
					mysqli_query($con,"SET NAMES 'UTF8'");
					//$erotima = "select aa,fullname from staff where signatureActive=1 order by fullname asc";
					$erotima = "select  staff.aa,fullname,department,accessLevel from staff left join (select * from signpasswords where (protocolAccessLevel=0 or protocolAccessLevel=1) and prime=1) as t on attendanceNumber=t.attendanceId where signatureActive=1 order by fullname asc";
					
					$result1 = mysqli_query($con,$erotima) or die ("database read error - show table attachments");
					$i = 0;
					$countStaff = mysqli_num_rows($result1);
					//echo $countStaff;
					$rowsPerCol = 12;
					$cols = ($countStaff - $countStaff % $rowsPerCol) / $rowsPerCol;
					if ($countStaff%$rowsPerCol == 0){
						
					}
					else{
						$cols=$cols +1; 
					}
					//echo $cols;
					for ($j=0;$j<$cols;$j++){
						echo '<div class="col-xl-'.$cols.' col-lg-4 col-md-4 col-4 col-sm-4" >';
						for ($i=0;$i<$rowsPerCol;$i++){
								if (($j*$rowsPerCol+$i+1)>$countStaff){
									break;
								}
								$row1 = mysqli_fetch_array($result1, MYSQLI_BOTH);	
								echo '<button style="margin:1px;" class="btn btn-secondary btn-sm" id="user'.$row1['aa'].'" onclick="changeAssignmentStatus(\'user'.$row1['aa'].'\')" >'.$row1['fullname'].'</button></br>';
						}
						echo '</div>';
					}
					
				?>
					
		</div>
	</div>
