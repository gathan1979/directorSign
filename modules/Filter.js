import refreshToken from "./RefreshToken.js";
let filter = {};

if (localStorage.getItem("filter") !== null){
	filter = JSON.parse(localStorage.getItem("filter"));	
}
else{
	filter = {
		showForArchive : 0,
		selectedDate : null,
		selectedDateDep : null,
		isAssigned : 0,
		isAssignedToDep : 0,
		isAssignedLast :0,
		noNotifications : 0,
		hideArchieved : 0
	};
}

localStorage.setItem("filter", JSON.stringify(filter));
//updateFilterStorage();
	
	
export default function createFilter(parentElement){
	const userData = JSON.parse(localStorage.getItem("loginData")).user;	
	const currentRole = localStorage.getItem("currentRole");
	console.log(userData.roles[currentRole].protocolAccessLevel);
	let parentElementContent = "";
	if (userData.roles[currentRole].protocolAccessLevel == 1){
			parentElementContent =`<div id="upperToolBar">
					<div style="padding-top:0.3em;">
							<div ><i class="fas fa-filter"></i><b> Αχρέωτα : </b></div>
							<div >
								<select id="noAssignmentfilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών χωρίς καμιά χρέωση">
									<option value="0"></option>
									<option value="1">ΝΑΙ</option>
								</select>
							</div>
					</div>
					<div  style="padding-top:0.3em;">
							<div ><i class="fas fa-filter"></i><b> Ημερ. : </b></div>
							<div >
								<input type="date" id="datefilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών με ημερομηνία"/>
							</div>
					</div>
					<div  style="padding-top:0.3em;">
							<div ><i  class="fas fa-filter" ></i><b> Προς Αρχείο : </b></div>
							<div >
								<input  type="checkbox"  id="showForArchive" />
							</div>
					</div>
					<div  style="padding-top:0.3em;">
							<div ><i  class="fas fa-filter" ></i><b> Απόκρυψη αρχειοθετημένων : </b></div>
							<div >
								<input  type="checkbox"  id="hideArchieved" />
							</div>
					</div>
					

			</div>`;		
 	}
	else if (userData.roles[currentRole].accessLevel ==1){
			parentElementContent =`<div id="upperToolBar" >
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Αχρέωτα : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="noAssignmentfilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών χωρίς καμιά χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Ημερ. : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<input type="date" id="datefilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών με ημερομηνία"/>
					</div>
				</div>
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Τελευταίες Χρεώσεις : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="lastAssignedFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα με βάση τη χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>	
				</div>
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Απόκρυψη Κοινοποιήσεων : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="hideNotificationsFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα κοινοποιήσεων">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>
			</div>`;	
	}	
	else{ 
			parentElementContent =`<div id="upperToolBar" >
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Τελευταίες Χρεώσεις : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="lastAssignedFilter" class="form-control-sm" data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα με βάση τη χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>	
				</div>
				<div style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Απόκρυψη Κοινοποιήσεων : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="hideNotificationsFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα κοινοποιήσεων">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>
			</div>`;	
	}  
	parentElement.innerHTML = parentElementContent;	
	addListeners();
}

export function updateBtnsFromFilter(){
	filter = JSON.parse(localStorage.getItem("filter"));
	const archiveBtn = document.querySelector('#showForArchive');
	const hideArchieved = document.querySelector('#hideArchieved');
	const dateBtn = document.querySelector('#datefilter');
	const notAssignedBtn = document.querySelector('#noAssignmentfilter');
	const lastAssignedBtn = document.querySelector('#lastAssignedFilter');
	const hideNotificationsBtn = document.querySelector('#hideNotificationsFilter');
	
	if (archiveBtn !==null){
		(filter.showForArchive?archiveBtn.checked =true:archiveBtn.checked =false);
	}
	if (hideArchieved !==null){
		(filter.hideArchieved?hideArchieved.checked =true:hideArchieved.checked =false);
	}
	if (dateBtn!==null){
		if (filter.date !==""){
			dateBtn.value = +filter.showSelectedDate;
		}
	}
	if (notAssignedBtn!==null){
		notAssignedBtn.value = +filter.showNotAssigned;
	}
	if (lastAssignedBtn!==null){
		lastAssignedBtn.value = +filter.showLastAssigned;
	}
	if (hideNotificationsBtn!==null){
		hideNotificationsBtn.value = +filter.noNotifications;
	}
}

export function updateFilterStorage(){
	let filter = JSON.parse(localStorage.getItem("filter"));
	const archiveBtn = document.querySelector('#showForArchive');
	const hideArchieved = document.querySelector('#hideArchieved');
	const dateBtn = document.querySelector('#datefilter');
	const notAssignedBtn = document.querySelector('#noAssignmentfilter');
	const lastAssignedBtn = document.querySelector('#lastAssignedFilter');
	const hideNotificationsBtn = document.querySelector('#hideNotificationsFilter');
	
	const userData = JSON.parse(localStorage.getItem("loginData")).user;
	const currentRole = localStorage.getItem("currentRole");
	
	if (archiveBtn !==null){
		(archiveBtn.checked?filter.showForArchive =1:filter.showForArchive =0);
	}
	if (hideArchieved !==null){
		(hideArchieved.checked?filter.hideArchieved =1:filter.hideArchieved =0);
	}
	if (dateBtn!==null){
		if (userData.roles[currentRole].protocolAccessLevel == 1){
			if(dateBtn.value !==""){
				filter.selectedDate =dateBtn.value;
			}
			else{
				filter.selectedDate ="";
			}
		}
		else if (userData.roles[currentRole].accessLevel == 1){
			if(dateBtn.value !==""){
				filter.selectedDateDep =dateBtn.value;
			}
			else{
				filter.selectedDateDep ="";
			}
			
		}
	}
	if (notAssignedBtn!==null){
		if (userData.roles[currentRole].protocolAccessLevel == 1){
			//filter.isAssigned = +notAssignedBtn.options[notAssignedBtn.selectedIndex].value;
			(+notAssignedBtn.value?filter.isAssigned =1:filter.isAssigned =0);	
		}
		else if (userData.roles[currentRole].accessLevel == 1){
			//filter.isAssignedToDep = +notAssignedBtn.options[notAssignedBtn.selectedIndex].value;
			(+notAssignedBtn.value?filter.isAssignedToDep =1:filter.isAssignedToDep =0);	
		}
	}
	if (lastAssignedBtn!==null){
		(+lastAssignedBtn.value?filter.isAssignedLast =1:filter.isAssignedLast =0);	
	}
	if (hideNotificationsBtn!==null){
		(+hideNotificationsBtn.value?filter.noNotifications =1:filter.noNotifications =0);	
	}
	
	const filterBtn = document.querySelector('#openFilterBtn');
	const keys = Object.keys(filter);
	let filterActive = 0;
	keys.forEach( key => {
		if (filter[key]!==0	&& filter[key]!==null && filter[key]!==""){
			filterActive = 1;
		}
	});
	if (filterActive){
		filterBtn.classList.remove('btn-info');
		filterBtn.classList.add('btn-danger');	
	}
	else{
		filterBtn.classList.remove('btn-danger');
		filterBtn.classList.add('btn-info');	
	}
	console.log(filter);
	localStorage.setItem('filter', JSON.stringify(filter));
}

function addListeners(){
	const userData = JSON.parse(localStorage.getItem("loginData")).user;
	const currentRole = localStorage.getItem("currentRole");
	//administrator
	document.getElementById("showForArchive")?document.getElementById("showForArchive").addEventListener("change",()=>getFilteredData()):null;
	document.getElementById("hideArchieved")?document.getElementById("hideArchieved").addEventListener("change",()=>getFilteredData()):null;
	//user
	//head
	
	
	if (userData.roles[currentRole].protocolAccessLevel == 1){
		console.log("event listener if");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=>getFilteredData()):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=>getFilteredData()):null;
	}
	else if (userData.roles[currentRole].accessLevel == 1){
		console.log("event listener else if");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=>getFilteredData()):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=>getFilteredData()):null;
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=>getFilteredData()):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=>getFilteredData()):null;
	}
	else{
		console.log("event listener else");
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=>getFilteredData()):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=>getFilteredData()):null;
	}
}

// Filters ----

export async function getFilteredData(){
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	updateFilterStorage();
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	
	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	const currentFilterAsArray = Object.entries(currentFilter);
	const filtered = currentFilterAsArray.filter(([key, value]) => !(value==0 || value=="" || value==null));
	console.log(filtered);
	const filteredObject = Object.fromEntries(filtered);

	const  completeOblect= Object.assign({
		role : loginData.user.roles[localStorage.getItem("currentRole")].aa_role,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	},filteredObject);
	const urlpar = new URLSearchParams(completeOblect);
	
	const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	
	const res = await fetch("/api/showTableData_test.php?"+urlpar,init); 
	if (!res.ok){
		document.querySelector("#recordsSpinner").style.display = 'none';
		if (res.status == 401){
			const refRes = await refreshToken();
			if (refRes !==1){
				alert("Σφάλμα ανανέωσης εξουσιοδότησης");
			}
			else{
				getFilteredData();
			}
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;	
		}
	}
	else{
		document.querySelector("#recordsSpinner").style.display = 'none';
		const result = await res.json();
		fillChargesTable(result);
		
	}
}

export function fillChargesTable(result){
	const table = document.querySelector('#chargesTable>tbody');
	for (let i = 0; i <= result.length; i++) {
		let tr = document.createElement('tr');
		for (let k = 0; k < 11; k++) {
			//console.log(result[k])
			let td = document.createElement('td');
			td.innerHTML = result[i][k];
			if(result[i]["isRead"]==1){
				td.style.fontWeight = "normal";
			}
			else{
				td.style.fontWeight = "bold";
			}
			if(result[i]["status"]==1){ //Προς αρχείο
				td.style.backgroundColor = "DarkOrange";
			}
			else if(result[i]["status"]==2){ // Αρχείο
				td.style.fontWeight = "gray";
			}
			else if(result[i]["status"]==0){ //Εκκρεμ.
				td.style.fontWeight = "bold";
			}
			if(k>=9){
				td.style.display = "none";
			}
			tr.appendChild(td);
		}
		tr.addEventListener("click", (event) => openProtocolRecord(result[i]["subjectField"], result[i]["aaField"],event));
		table.appendChild(tr);
	}
}

function openProtocolRecord(subject,record,event){
	console.log("record no ..."+record)
	const protocolWindowContent = 
	`<div id="bottomSection">
		<div class="" name="bottomSectionTitleBar" id="bottomSectionTitleBar">
			<div class="" name="bottomSectionTitle" id="bottomSectionTitle">
			</div>
			<div style="display:flex; gap:0.2em;" name="bottomSectionButtons" id="bottomSectionButtons">
			</div>
		</div>
		
		<div id="bottomSectionBody">
			<div  class="firstBottomSectionColumn">

				<record-attachments style="max-height:40%;" protocolNo="${record}"></record-attachments>

				<record-relative style="max-height:20%;" protocolNo="${record}"></record-relative>

				<record-comment style="max-height:20%;" protocolNo="${record}"></record-comment>

				

				<div class="table-responsive mt-2 pt-2" id="kshde" style="background: rgba(122, 160, 126, 0.2)!important;">
					<table class="table" id="kshdeTableInProtocol">
						<thead>
						<tr>
							<th id="kshdeTitle">ΚΣΗΔΕ</th>
						</tr>
						</thead>
						<tbody>
					
						</tbody>
					</table>
				</div>

				<div class="table-responsive mt-2 pt-2" id="history" style="background: rgba(122, 160, 126, 0.2)!important;">
					<table class="table" id="historyTable">
						<thead>
						<tr>
							<th id="historyTitle">Ιστορικό&nbsp<i id="historyArrow" onclick="loadHistory();" class="fas fa-arrow-right"></i></th>
						</tr>
						</thead>
						<tbody>
					
						</tbody>
					</table>
				</div>

				<!-- <?php include 'html/tags.php'?> -->

			</div>	

			<div id="foldersDiv" class="secondBottomSectionColumn" style="background: rgba(86, 86, 136, 0.2)!important;">
				
				<div class="row" style="padding-top:10px">
					<div class="col">
						<button id="saveFoldersButton" type="button" class="btn btn-outline-success"  onclick="saveFolders();" data-toggle="tooltip" data-placement="top" title="Αποθήκευση Αλλαγών στους Φακέλους"><i class="far fa-save"></i></button>
						<span data-toggle="modal" data-target="#foldersModal"><button id="showFoldersButton" type="button"  class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Εμφάνιση λίστας φακέλων με επεξηγήσεις"><i class="fas fa-list-ol"></i></button></span>
						<button data-toggle="modal" data-target="#seachfoldersModal" class="btn btn-info" data-toggle="tooltip" data-placement="top" title="Αναζήτηση φακέλων" id="seachFolderButton"><i class="fas fa-search"></i></button>
						</br></br>
					</div>	
				</div>
				<hr>
				<table id="folders" name="folderList" class="table">

				<thead >
					<tr >
						<th colspan="3">Φάκελοι</th>
					</tr>
				
				</thead>
				<tbody>
					<?php 		
						include 'connection.php';
						mysqli_query($con,"SET NAMES 'UTF8'");
						$erotima = "select * from folders order by aaField asc"; //ARIS
						//$erotima = "select * from folders order by aaField asc";
						$result1 = mysqli_query($con,$erotima) or die ("database read error - show folders");
						$i = 0;
						$rowcount=mysqli_num_rows($result1);
						while ($row1 = mysqli_fetch_array($result1, MYSQLI_BOTH)){	
							if (($i % 3) ==0){
								echo '<tr>';
							}
							if ($row1['subfolderField'] == null){ 
								$fullFolder = $row1['folderField']; 
							} 
							else{ 
								$fullFolder = $row1['folderField'].".".$row1['subfolderField']; 
							} 
							echo '<td style="padding:1px"><button class="btn btn-secondary btn-sm" id="folder'.$row1['aaField'].'" onclick="changeFolderStatus(\'folder'.$row1['aaField'].'\')" >'.$fullFolder.'</button></td>';
							//echo '<td style="padding:1px"><button class="btn btn-secondary btn-sm" id="folder'.$row1['aaField'].'" onclick="changeFolderStatus(\'folder'.$row1['aaField'].'\')" >'.$row1['folderField'].'</button></td>';													
							if (($i % 3) ==2){
								echo '</tr>';
							}
							$i++;
						}
					?>
				</tbody>
				</table>
			</div>

			
			<div class="thirdBottomSectionColumn" id="assignmentsDiv" class="mt-2 mt-sm-0 col-<?php if (($_SESSION['protocolAccessLevel'] == 1) || (strpos($_SERVER['REQUEST_URI'], 'protocolBook.php') == true)){echo '12 col-md-4';}else{echo '12 col-md-4';}?> small" >
				<div class="col-12" style="background: rgba(155, 130, 136, 0.2)!important;">	
					<div class="row" style="padding-top:10px">
						<div class="col-7">
							<button <?php if($_SESSION['accessLevel']||$_SESSION['protocolAccessLevel'] == 1){ echo ''; }else{echo 'disabled';}?>  id="saveAssignmentButton" type="button" class="btn btn-outline-success trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="saveAssignments();"><i class="far fa-save"></i></button>
							<button <?php if($_SESSION['accessLevel']||$_SESSION['protocolAccessLevel'] == 1){ echo ''; }else{echo 'disabled';}?>   id="addNotificationButton" type="button" class="btn btn-info trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="selectAllforNotification();"><i class="far fa-bell"></i></button>
							<button <?php if($_SESSION['accessLevel']||$_SESSION['protocolAccessLevel'] == 1){ echo ''; }else{echo 'disabled';}?>   id="deselectUsersButton" type="button" class="btn btn-danger trn" data-toggle="modal" data-target="#assignmentModal" data-whatever="assign" onclick="deselectAllAssignments();"><i class="fas fa-user-slash"></i></button>
						</div>
						<div>
							<div class="row"><div class="alert alert-success" style="padding:0.5em"></div>&nbspΧρέωση</div>
							<div class="row"><div class="alert alert-info" style="padding:0.5em"></div>&nbspΚοιν.</div>
						</div>
					</div>
					<hr>
						<b>
							<div id="assignmentsTitle" style="color: DarkRed;font-size: 12px;">Χρεώσεις</div>
						</b>
					<hr>
					<br>
				</div>
				<div class="col-12" id="assignments" name="assignments" style="padding-top:10px;background: rgba(155, 130, 136, 0.2)!important;">
				<!--<table id="assignments" name="assignments" class="table">
				<thead>
					<tr>
						<th>Χρεώσεις</th>
					</tr>

				</thead>
				<tbody>-->
				<?php 		
						include 'connectionAdeies.php';
						include 'findLevels.php';
						mysqli_query($con1,"SET NAMES 'UTF8'");
						$erotimadep = "select  aa,departmentName,parent,last_parent from departmentstypes where parent=0"; 
						$resultdep = mysqli_query($con1,$erotimadep) or die ("database read error - show table attachments");
						//sto headDeps apothikeuontai oi arxikoi komvoi. Sinithos einai enas p.x. o Perifereiakos Dieuthintis
						//$headDeps=array();
						//while ($rowdep = mysqli_fetch_array($resultdep, MYSQLI_BOTH)){
							//if ($rowdep['parent'] == 0){
								//$headDeps[] = $rowdep;
							//}	
				//}
						//var_dump($headDeps);
						//echo '<br>----------';
						//$deps = array();
						//$deps = depsOneLevelDown($headDeps[0]['aa'],$deps);
						
						$headDep = mysqli_fetch_array($resultdep, MYSQLI_BOTH);
						
						
						if (strpos($_SERVER['REQUEST_URI'], 'protocolBook.php') == true){
							$html = createTree($headDep,-1);
						}
						else if ($_SESSION['protocolAccessLevel'] == 1){
							$html = createTree($headDep,1);
						}
						else if ($_SESSION['accessLevel']==1){
							$html = createTree($headDep,0);
						}
						else{
							$html = createTree($headDep,-1);
						}
						echo $html;
					
					echo '<div id="assignmentsToAbsent" style="background: rgba(155, 130, 136, 0.2)!important;">';
					echo '</div>';
				?>
				</div>
				<!--</tbody>
				</table>-->
			</div>
				

		</div>
	</div>`;

	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
	document.querySelector("#protocolRecordDialog").showModal();
	//event.currentTarget.style.backgroundColor = "green";
	document.querySelector("#protocolRecordDialog").innerHTML = protocolWindowContent;
	
	//Fill protocolWindowContent 
	if (currentRoleObject.protocolAccessLevel ==1){
		document.querySelector("#bottomSectionButtons").innerHTML += 
		`<span   data-toggle="tooltip" title="Αποστολή ΚΣΗΔΕ"><button style="margin-left : 0.5em;" data-toggle="modal" data-target="#addKsideModal" type="button" class="btn btn-success ektos mr-1" id="sendDoc" ><i class="fas fa-download fa-rotate-180"></i></button></span>
		 <button class="btn btn-warning ektos mr-2" name="copyProtocol" id="copyProtocol" onclick="copyProtocol();" data-toggle="tooltip" title="Αντίγραφο Πρωτοκόλλου"><i class="far fa-copy"></i></button>&nbsp`;
	}
	if (currentRoleObject.protocolAccessLevel ==1 || currentRoleObject.accessLevel ==1){
		document.querySelector("#bottomSectionButtons").innerHTML += 
		`<button class="btn btn-info ektos mr-2" name="publishToSite" id="publishToSite" onclick="publishToSite();" data-toggle="tooltip" title="Αίτημα Ανάρτησης στη Σελίδα"><i class="fas fa-cloud-upload-alt"></i></button>`;
	}
	document.querySelector("#bottomSectionButtons").innerHTML += `<button class="btn btn-warning ektos mr-2" name="makeUnread" id="makeUnread" onclick="makeMessageUnread()" data-toggle="tooltip" title="Σήμανση ως μη αναγνωσμένο"><i class="fas fa-book"></i></button>`;
	document.querySelector("#bottomSectionTitle").innerHTML =subject;

	

}




// if ( aData[8] == 1 )
// {
//   //$('td:eq(8)', nRow).css('background-color', 'orange');
//   $('td:eq(0)', nRow).css('background-color', 'DarkOrange');
//   $('td:eq(8)', nRow).html('Προς Αρχ.');
// }
// else if ( aData[8] == 2 )
// {
//   //$('td:eq(8)', nRow).css('background-color', 'gray');
//   $('td:eq(0)', nRow).css('background-color', 'gray');
//   $('td:eq(8)', nRow).html('Αρχείο');
// }
// else if ( aData[8] == 0 )
// {
//   //$('td:eq(8)', nRow).css('background-color', 'gray');
//   $('td:eq(8)', nRow).html('Εκκρεμ.');
// };
// //aData[0] = aDate[0]+"/"+aDate[10];
//   if(aData[11] == 0){
// 		console.log("unread");	
// 		$(nRow).addClass('unread');
//   }
// },



// table.on( 'select', function ( e, dt, type, indexes ) {
// 	var temp = table.page.info();
// 	currPage = temp.page;
// 	console.log("page="+currPage);
// 	currRow = dt.row({selected: true}).index();
// 	console.log("row="+currRow);
	
// 	$("#historyArrow").removeClass('fa-rotate-90');
// 	$("#bottomSection").removeClass("d-none");
// 	var elmnt = document.getElementById("tableButtonsSection");
// 	elmnt.scrollIntoView(true);
// 	$("#attachments tbody tr").remove(); 
// 	$("#history tbody tr").remove(); 
// 	$("#commentsTable tbody tr").remove();
// 	if ( type === 'row' ) {
// 		//var data = table.rows( indexes ).data().pluck( 'id' );
// 		var sdata = table.cell('.selected', 0).data();
// 		selectedIndex = sdata;	
// 		if (recentProtocols == null){
// 			recentProtocols = [];
// 			recentProtocols.push(selectedIndex);
// 		}
// 		else if (recentProtocols.length >=5){
// 			const check = (element) => element == selectedIndex;
// 			var elementExists = recentProtocols.findIndex(check);
// 			console.log("vrethike sta prosfata :"+elementExists);
// 			if (elementExists == -1){
// 				console.log("tha prostethei");
// 				recentProtocols.shift();
// 				recentProtocols.push(selectedIndex);
// 			}
// 		}
// 		else{
// 			const check = (element) => element == selectedIndex;
// 			var elementExists = recentProtocols.findIndex(check);
// 			console.log("vrethike sta prosfata :"+elementExists);
// 			if (elementExists == -1){
// 				recentProtocols.push(selectedIndex);
// 			}
// 		}
		
// 		localStorage.setItem("recentProtocols", JSON.stringify(recentProtocols));	
// 		loadRecent();						
// 		//alert(sdata);
// 		document.getElementById("editButton").disabled = false;
// 		//document.getElementById("removeButton").disabled = false;
// 		loadAttachments(<?php echo  $_SESSION['protocolAccessLevel'];?>);
// 		loadAssignments();
// 		loadComments(1);
// 		loadFolders();
// 		loadKshde();
// 		if (<?php echo  $_SESSION['protocolAccessLevel'];?>){ 
// 			loadHistory(); 
// 		}
// 		loadRelative(1);
// 		document.getElementById("bottomSectionTitle").innerHTML  = "<b> Πρωτ. : " + table.cell('.selected', 0).data()+"</b>";
// 		document.getElementById("bottomSectionTitle").innerHTML  += " ||  <b> (ΕΙΣ.) </b> " + table.cell('.selected', 2).data();
// 		document.getElementById("bottomSectionTitle").innerHTML  += " || <b> (ΕΞ.)  </b>" + table.cell('.selected', 6).data();
// 		//console.log("ddd"+table.cell('.selected', 11).data());
// 		//if (table.cell('.selected', 11).data() == 0){
// 		messageRead(table.cell('.selected', 0).data(),<?php echo $_SESSION['aa_staff'];?>);
// 			table.$('tr.selected').removeClass('unread');
// 		//}
// 	}
// 	//window.history.pushState("test", "Title", "10.142.49.10/nocc-1.9.8/protocol/editTable1.php?tn=book&page="+currPage);
// } );

// table.on( 'deselect', function ( e, dt, type, indexes ) {
// 	selectedIndex = 0;
// 	if ( type === 'row' ) {
// 		//var data = table.rows( indexes ).data().pluck( 'id' );
// 		document.getElementById("editButton").disabled = true;
// 		//document.getElementById("removeButton").disabled = true;
// 		$("#bottomSection").addClass("d-none");
// 	}
// } );