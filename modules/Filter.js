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
	updateFilterStorage();
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	
	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	const currentFilterAsArray = Object.entries(currentFilter);
	const filtered = currentFilterAsArray.filter(([key, value]) => !(value==0 || value=="" || value==null));
	console.log(filtered);
	const filteredObject = Object.fromEntries(filtered);

	const  completeOblect= Object.assign({
		role : loginData.user.roles[localStorage.getItem("currentRole")].aa_role,
		currentYear : localStorage.getItem("currentYear")
	},filteredObject);
	const urlpar = new URLSearchParams(completeOblect);
	
	const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	
	const res = await fetch("/api/showTableData.php?"+urlpar,init); 
	if (!res.ok){
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
		const result = await res.json();
		fillChargesTable(result);
	}
}

export function fillChargesTable(result){
	const table = document.querySelector('#chargesTable>tbody');
	for (let i = 0; i <= result.length; i++) {
		let tr = document.createElement('tr');
		for (let k = 0; k < 11; k++) {
			console.log(result[k])
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
		table.appendChild(tr);
	}
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

