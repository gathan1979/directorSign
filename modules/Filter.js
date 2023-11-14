import refreshToken from "./RefreshToken.js";
import getFromLocalStorage from "./LocalStorage.js";
import {getPage, Pages, getChargesAndFill} from "./UI_test.js";
import { getFilteredData } from "./ProtocolData.js";

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
	console.log("filterTable running");
	let table = null;
	const page = getPage();
	if (page == Pages.SIGNATURE || page == Pages.SIGNED){							//Η διάκριση ανάλογα με σελίδα θα σταματήσει μόλις γίνουν και υπογραφές χωρίς χρήση πίνακα
		table = document.querySelectorAll("#"+tableName+">tbody>tr");
		for (const tempRow of Array.from(table)){   
			console.log(tempRow)                    			// π.χ. <tr data-diff="0" data-author="ΖΗΚΟΣ ΑΘΑΝΑΣΙΟΣ">
			if (tempRow.dataset.author && tempRow.dataset.diff){   	// απορρίπτει γραμμές του header, footer
				let hide = false;
				for(const [key,value] of Object.entries(searchObject.dataKeys)){
					//console.log(key,value,tempRow.dataset[key] );
					if (value != null){
						if (tempRow.dataset[key].toUpperCase() != value.toUpperCase()){
							hide = true;
						}
					}
				}
				let findTextInRow = true;
				if (searchObject.searchString !== "" && searchObject.searchString !==null){
					findTextInRow = false;
					for (const cell of tempRow.cells){
						if (cell.textContent.toUpperCase().indexOf(searchObject.searchString.toUpperCase()) !== -1){
							findTextInRow = true;
							//console.log("το κείμενο βρέθηκε στη γραμμή ")
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
	else{
		table = document.querySelector("#"+tableName+">div");
		for (const tempRow of Array.from(table)){   
			console.log(tempRow)                    			// π.χ. <tr data-diff="0" data-author="ΖΗΚΟΣ ΑΘΑΝΑΣΙΟΣ">
			let hide = false;
			for(const [key,value] of Object.entries(searchObject.dataKeys)){
				//console.log(key,value,tempRow.dataset[key] );
				if (value != null){
					if (tempRow.dataset[key].toUpperCase() != value.toUpperCase()){
						hide = true;
					}
				}
			}
			let findTextInRow = true;
			if (searchObject.searchString !== "" && searchObject.searchString !==null){
				findTextInRow = false;
				for (const cell of tempRow.cells){
					if (cell.textContent.toUpperCase().indexOf(searchObject.searchString.toUpperCase()) !== -1){
						findTextInRow = true;
						//console.log("το κείμενο βρέθηκε στη γραμμή ")
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

	const page = getPage();
	let  filterObject = null;

	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		const showToSignOnlyBtn = document.getElementById('showToSignOnlyBtn');
		const showEmployeesBtn = document.getElementById('showEmployeesBtn');
		const tableSearchInput = document.getElementById('tableSearchInput');

		filterObject = {dataKeys : {author :null , currentDep : null} , searchString : null};

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
	}
	
	//console.log(filterObject);
	let debouncedFilter = null;
	
	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		 debouncedFilter = debounce( () => filterTable("dataToSignTable",filterObject));
	}
	else if (page == Pages.CHARGES || Pages.PROTOCOL){
		 debouncedFilter = debounce( () => filterTable("chargesTableContent",filterObject));
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
			parentElementContent =`
					<div class="flexHorizontal" style="padding-top:0.3em;">
							<div ><i class="fas fa-filter"></i><b> Αχρέωτα : </b></div>
							<div >
								<select id="noAssignmentfilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών χωρίς καμιά χρέωση">
									<option value="0"></option>
									<option value="1">ΝΑΙ</option>
								</select>
							</div>
					</div>
					<div class="flexHorizontal" style="padding-top:0.3em;">
							<div ><i class="fas fa-filter"></i><b> Ημερ. : </b></div>
							<div >
								<input type="date" id="datefilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών με ημερομηνία"/>
							</div>
					</div>
					<div class="flexHorizontal" style="padding-top:0.3em;">
							<div ><i  class="fas fa-filter" ></i><b> Προς Αρχείο : </b></div>
							<div >
								<input  type="checkbox"  id="showForArchive" />
							</div>
					</div>
					<div class="flexHorizontal" style="padding-top:0.3em;">
							<div ><i  class="fas fa-filter" ></i><b> Απόκρυψη αρχειοθετημένων : </b></div>
							<div >
								<input  type="checkbox"  id="hideArchieved" />
							</div>
					</div>`;		
 	}
	else if (userData.roles[currentRole].accessLevel ==1){
			parentElementContent =`
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Αχρέωτα : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="noAssignmentfilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών χωρίς καμιά χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Ημερ. : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<input type="date" id="datefilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα εγγραφών με ημερομηνία"/>
					</div>
				</div>
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Τελευταίες Χρεώσεις : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="lastAssignedFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα με βάση τη χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>	
				</div>
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Απόκρυψη Κοινοποιήσεων : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="hideNotificationsFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα κοινοποιήσεων">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>`;	
	}	
	else{ 
		parentElementContent =`
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Τελευταίες Χρεώσεις : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="lastAssignedFilter" class="form-control-sm" data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα με βάση τη χρέωση">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>	
				</div>
				<div class="flexHorizontal" style="padding-top:0.3em;">
					<div  style="padding-top:0.3em;"><i class="fas fa-filter"></i><b> Απόκρυψη Κοινοποιήσεων : </b></div>
					<div  style="padding-bottom:0.3em;padding-top:0.3em;">
						<select id="hideNotificationsFilter" class="form-control-sm"  data-toggle="tooltip" data-placement="top" title="Φιλτράρισμα κοινοποιήσεων">
							<option value="0"></option>
							<option value="1">ΝΑΙ</option>
						</select>
					</div>
				</div>`;	
	}  
	parentElement.innerHTML = `<div id="upperToolBar" class="flexHorizontal" style="flex-wrap : wrap; padding: 1em; gap: 1.5em;">${parentElementContent}</div>`;	
	addListeners();
}

export function updateBtnsFromFilter(){
	const filter = JSON.parse(localStorage.getItem("filter"));
	const userData = JSON.parse(localStorage.getItem("loginData")).user;
	const currentRole = localStorage.getItem("currentRole");
	console.log(filter);
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
		if (userData.roles[currentRole].protocolAccessLevel == 1){
			if (filter.selectedDate !==""){
				dateBtn.value = filter.selectedDate;
			}
		}
		else{
			if (filter.selectedDateDep !==""){
				dateBtn.value = filter.selectedDateDep;
			}
		}
	}
	if (notAssignedBtn!==null){
		//notAssignedBtn.value = +filter.showNotAssigned;
		if (userData.roles[currentRole].protocolAccessLevel == 1){
			notAssignedBtn.value = +filter.isAssigned;
		}
		else if (userData.roles[currentRole].accessLevel == 1){
			notAssignedBtn.value = +filter.isAssignedToDep;
		}
	}
	if (lastAssignedBtn!==null){
		lastAssignedBtn.value = +filter.isAssignedLast;
	}
	if (hideNotificationsBtn!==null){
		hideNotificationsBtn.value = +filter.noNotifications;
	}

	const filterBtn = document.querySelector('#openFilterBtn');
	const vals = Object.values(filter);
	let filterActive = 0;
	return;
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
	//console.log(filter);
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
	
	localStorage.setItem('filter', JSON.stringify(filter));
	updateBtnsFromFilter();
	
}

function addListeners(){
	const userData = JSON.parse(localStorage.getItem("loginData")).user;
	if (userData == null){
		console.log("Δε βρέθηκαν δεδομένα χρήστη κατά την προσθήκη listeners")
		return;
	}
	const currentRole = localStorage.getItem("currentRole");
	if (currentRole == null){
		console.log("Δε βρέθηκε ρόλος χρήστη");
		return;
	}
	//administrator
	document.getElementById("showForArchive")?document.getElementById("showForArchive").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	document.getElementById("hideArchieved")?document.getElementById("hideArchieved").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	//user
	//head
	if (userData.roles[currentRole].protocolAccessLevel == 1){
		//console.log("event listener if protocolAccessLevel");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	}
	else if (userData.roles[currentRole].accessLevel == 1){
		//console.log("event listener else if");
		document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
		document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	}
	else{
		//console.log("event listener else");
		document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
		document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	}
}


// Filters ----
