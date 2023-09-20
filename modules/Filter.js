import refreshToken from "./RefreshToken.js";
import getFromLocalStorage from "./LocalStorage.js";
import {getPage, Pages} from "./UI_test.js";

let filter = {};
export let pagingStart = 0; 
export let pagingSize = 100; 

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
	
	
export function filterTable (tableName, searchObject){   	// searchObject example {dataKeys :{author : "Αθανασιάδης Γιάννης", diff : 0}, searchString : "καλημέρα"}
		// diff = 0 είναι για υπογραφή στο τμήμα
	const table = document.querySelector("#"+tableName);

	//console.log(searchObject)
	for (const tempRow of Array.from(table.rows)){                       			// π.χ. <tr data-diff="0" data-author="ΖΗΚΟΣ ΑΘΑΝΑΣΙΟΣ">
		if (tempRow.dataset.author && tempRow.dataset.diff){   	// απορρίπτει γραμμές του header, footer
			let hide = false;
			for(const [key,value] of Object.entries(searchObject.dataKeys)){
				console.log(key,value,tempRow.dataset[key] );
				if (value != null){
					if (tempRow.dataset[key] != value){
						hide = true;
					}
				}
			}
			let findTextInRow = true;
			if (searchObject.searchString !== "" && searchObject.searchString !==null){
				findTextInRow = false;
				for (const cell of tempRow.cells){
					if (cell.textContent.indexOf(searchObject.searchString) !== -1){
						findTextInRow = true;
						console.log("το κείμενο βρέθηκε στη γραμμή ")
					}
				}
			}
			if (hide || !findTextInRow){
				tempRow.setAttribute("hidden","hidden");
			}
			else{
				tempRow.removeAttribute("hidden");
			}
		}
	}
}

export function createSearch(event) {
	console.log("creating search ...");
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const department = loginData.user.roles[currentRole].department;
	const user = loginData.user.user;

	const showToSignOnlyBtn = document.getElementById('showToSignOnlyBtn');
	const showEmployeesBtn = document.getElementById('showEmployeesBtn');
	const tableSearchInput = document.getElementById('tableSearchInput');

	let  filterObject = {dataKeys : {author :null , currentDep : null} , searchString : null};

	if (event !== undefined){
		if(event.target.dataset.active == "0"){
			event.target.classList.remove('btn-danger');
			event.target.classList.add('btn-success');
			event.target.dataset.active = "1";
		}
		else if(event.target.dataset.active == "1"){
			event.target.classList.remove('btn-success');
			event.target.classList.add('btn-danger');
			event.target.dataset.active = "0";
		}
	}

	if (showToSignOnlyBtn.dataset.active == 1){
		filterObject.dataKeys.currentDep = null;
	}
	else{
		filterObject.dataKeys.currentDep = department;
	}
	if (showEmployeesBtn.dataset.active == 1){
		filterObject.dataKeys.author = user;
	}
	else{
		filterObject.dataKeys.author = null;
	}
	if (tableSearchInput.value != ""){
		filterObject.searchString = tableSearchInput.value;
	}
	else{
		filterObject.searchString = null;
	}
	console.log(filterObject);
	let debouncedFilter = null;
	const page = getPage();
	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		 debouncedFilter = debounce( () => filterTable("dataToSignTable",filterObject));
	}
	else if (page == Pages.CHARGES){
		 debouncedFilter = debounce( () => filterTable("chargesTable",filterObject));
	}
	debouncedFilter();
}

var timer;

function debounce(func, timeout = 500){
	return (...args) => {
	clearTimeout(timer);
	timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}


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
	const vals = Object.values(filter);
	let filterActive = 0;
	vals.forEach( val => {
		if (val!==0	&& val!==null && val!==""){
			filterActive = 1;
		}
	});
	if (filterActive){
		filterBtn.classList.remove('btn-primary');
		filterBtn.classList.add('btn-warning');	
	}
	else{
		filterBtn.classList.remove('btn-warning');
		filterBtn.classList.add('btn-primary');	
	}
	console.log(filter);
	localStorage.setItem('filter', JSON.stringify(filter));
}

function addListeners(){
	const userData = JSON.parse(localStorage.getItem("loginData")).user;
	const currentRole = localStorage.getItem("currentRole");
	//administrator
	document.getElementById("showForArchive")?document.getElementById("showForArchive").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
	document.getElementById("hideArchieved")?document.getElementById("hideArchieved").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
	//user
	//head
	if (userData.roles[currentRole].protocolAccessLevel == 1){
		console.log("event listener if protocolAccessLevel");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
	}
	else if (userData.roles[currentRole].accessLevel == 1){
		console.log("event listener else if");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
	}
	else{
		console.log("event listener else");
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=> getFilteredData(pagingStart, pagingSize)):null;
	}
}

// Filters ----

export async function getFilteredData(customPagingStart = pagingStart, customPagingSize = pagingSize){   											//εγγραφές χρεώσεων πρωτοκόλλου
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	document.querySelector("#myNavBar").classList.add("disabledDiv");
	updateFilterStorage();
	const {jwt,role} = getFromLocalStorage();
	//const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	const currentFilterAsArray = Object.entries(currentFilter);
	const filtered = currentFilterAsArray.filter(([key, value]) => !(value==0 || value=="" || value==null));
	console.log(filtered);
	const filteredObject = Object.fromEntries(filtered);

	const  completeOblect= Object.assign({
		role,
		customPagingStart,
		customPagingSize,
		//role : loginData.user.roles[localStorage.getItem("currentRole")].aa_role,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	},filteredObject);
	const urlpar = new URLSearchParams(completeOblect);
	//const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	
	const res = await fetch("/api/showTableData_test.php?"+urlpar,init); 
	if (!res.ok){
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		if (res.status == 401){
			const refRes = await refreshToken();
			if (refRes !==1){
				alert("Σφάλμα ανανέωσης εξουσιοδότησης");
			}
			else{
				getFilteredData(customPagingStart, customPagingSize);
			}
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;	
		}
	}
	else{
		const response = await res.json();
		fillChargesTable(response);
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
	}
}

export function fillChargesTable(response){
	const table = document.querySelector('#chargesTable>tbody');
	table.innerHTML="";
	const result = response.data;
	let tableContent = "";
	for (const record of result){
		tableContent +='<tr data-record="'+record.aaField+'">';
		for (const [key, value] of Object.entries(record)){
			if((key == "linkField") || (key=="insertDateField")){
				continue;
			}
			tableContent +="<td "
			if(record["isRead"]==1){
				tableContent += 'style="font-weight :normal" ';
			}
			else{
				tableContent += 'style="font-weight :bold" ';
			}
			if(record["status"]==1){ //Προς αρχείο
				tableContent += 'style="background-color : DarkOrange" ';
			}
			else if(record["status"]==2){ // Αρχείο
				tableContent += 'style="background-color : Gray" ';
			}
			else if(record["status"]==0){ //Εκκρεμ.
				tableContent += 'style="font-weight :bold" ';
			}
			
			tableContent +=">"+value+"</td>"	
		}
		tableContent +="</tr>"
	}
	document.querySelector("#chargesTable>tbody").innerHTML = tableContent;
	for (const record of result){
		document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => openProtocolRecord(record["subjectField"], record["aaField"], record["insertDateField"], event));
	}
	createSearch();
}

function openProtocolRecord(subject,record,recordDate, event){
	console.log("record no ..."+record)
	const protocolWindowContent = 
	`<div id="bottomSection">
		<div class="" name="bottomSectionTitleBar" id="bottomSectionTitleBar" >
			<div style="padding-right:10px;display:flex;gap:10px;" name="bottomSectionTitle" id="bottomSectionTitle">
			</div>
			<div style="display:flex; gap:0.2em;" name="bottomSectionButtons" id="bottomSectionButtons">
				
			</div>
		</div>
		
		<div id="bottomSectionBody">
			<div style="flex-basis: 50%;" class="firstBottomSectionColumn">

				<record-attachments style="max-height:40%;" protocolDate="${recordDate}" protocolNo="${record}"></record-attachments>
				<record-relative style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-relative>
				<record-comment style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-comment>
				<record-history style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-history>

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

				<!-- <?php include 'html/tags.php'?> -->
			</div>	

			<record-folders style="flex-basis: 20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-folders>
			<record-assignments style="flex-basis: 30%;" protocolDate="${recordDate}" protocolNo="${record}"></record-assignments>

		</div>
	</div>
	
	<dialog id="editRecordModal" class="customDialog" style="max-width: 80%; min-width: 50%;">
		<record-edit protocolDate="${recordDate}" protocolNo="${record}" style="display:flex; flex-direction:column; gap: 10px;"></record-edit>
    </dialog>`;

	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
	const currentYear = (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear());

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
	document.querySelector("#bottomSectionTitle").innerHTML = `<button title=="Επεξεργασία Πρωτοκόλλου" id="editRecord" class="btn btn-info"><i class="fas fa-edit"></i></button>`+'<span style="font-weight:bold;">'+record+"/"+currentYear+" | "+subject+"</span>";
	document.querySelector("#editRecord").addEventListener("click", ()=> document.querySelector("#editRecordModal").showModal());

	document.querySelector("#bottomSectionButtons").innerHTML +=`<button style="margin-left:20px;" class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>`;
	document.querySelector("#closeModalBtn").addEventListener("click", ()=> document.querySelector("#protocolRecordDialog").close());
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