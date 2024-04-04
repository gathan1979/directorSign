import refreshToken from "./RefreshToken.js";
import getFromLocalStorage from "./LocalStorage.js";
import {getPage, Pages, getChargesAndFill, getProtocolAndFill} from "./UI_test.js";
import { getFilteredData } from "./ProtocolData.js";

let filter = {};
export let pagingStart = 0; 
export let pagingSize = 100; 

if (localStorage.getItem("filter") !== null){
	try{
		filter = JSON.parse(localStorage.getItem("filter"));	
	}
	catch(e){
		resetFilterStorage();
	}
}
else{
	resetFilterStorage();
}

function resetFilterStorage(){
	console.log("resetting filter")
	filter = {
		showForArchive : 0,
		selectedDate : null,
		selectedDateDep : null,
		isAssigned : 0,
		isAssignedToDep : 0,
		isAssignedLast :0,
		noNotifications : 0,
		hideArchieved : 0,
		selectedFolder : 0
	};
	localStorage.setItem("filter", JSON.stringify(filter));
}
//updateFilterStorage();
export const FILTERS = {
	PROTOCOL: ["selectedFolder", "selectedDate"],
	CHARGES: ["hideArchieved", "isAssigned", "isAssignedLast", "isAssignedToDep", "noNotifications", "selectedDate", "selectedDateDep", "showForArchive"]
}
	
	
export async function filterTable (tableName, searchObject){   	// searchObject example {dataKeys :{author : "Αθανασιάδης Γιάννης", diff : 0}, searchString : "καλημέρα"}
	// diff = 0 είναι για υπογραφή στο τμήμα
	//console.log("filterTable running", searchObject);
	let table = null;
	const page = getPage();
	if (page == Pages.SIGNATURE || page == Pages.SIGNED){	
		//console.log(page)						//Η διάκριση ανάλογα με σελίδα θα σταματήσει μόλις γίνουν και υπογραφές χωρίς χρήση πίνακα
		table = document.querySelectorAll("#"+tableName+">tbody>tr");
		//console.log(Array.from(table))
		for (const tempRow of Array.from(table)){  
			//console.log(page)			 
			let hide = false;
			for(const [key,value] of Object.entries(searchObject.dataKeys)){
				//console.log(key,value,tempRow.dataset[key] );
				if (value != null){
					if (tempRow.dataset[key] !== undefined){
						if (tempRow.dataset[key].toUpperCase() != value.toUpperCase()){
							hide = true;
						}
					}
				}
			}
			let findTextInRow = true;
			//console.log(searchObject)
			if ((searchObject.searchString !== "") && (searchObject.searchString !==null)){
				//console.log(searchObject)
				findTextInRow = false; 
				for (const cell of tempRow.cells){
					//console.log(cell)
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
	else{
		if (+localStorage.getItem("globalSearch") === 0){	
			//console.log(searchObject)
			table = document.querySelectorAll("#"+tableName+">div");
			//console.log(table);
			for (const tempRow of Array.from(table)){   
				//console.log(tempRow)                    			// π.χ. <tr data-diff="0" data-author="ΖΗΚΟΣ ΑΘΑΝΑΣΙΟΣ">
				let hide = false;
				for(const [key,value] of Object.entries(searchObject.dataKeys)){
					//console.log(key,value,tempRow.dataset[key] );
					if (value != null){
						if (tempRow.dataset[key] !== undefined){
							if (tempRow.dataset[key].toUpperCase() != value.toUpperCase()){
								hide = true;
							}
						}
					}
				}
				let findTextInRow = true;
				//console.log("test",searchObject.searchString)
				if (searchObject.searchString !== "" && searchObject.searchString !==null){
					findTextInRow = false;
					for (const cell of tempRow.children){
						if (cell.textContent.toUpperCase().indexOf(searchObject.searchString.toUpperCase()) !== -1){
							findTextInRow = true;
							//console.log("το κείμενο βρέθηκε στη γραμμή ")
						}
						else{
							//console.log("not found")
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
		else{
			//Έλεγχος μετά από κλήση 
		}
	}
}

export function createSearch(event) {
	//console.log("creating search ...");
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const department = loginData.user.roles[currentRole].department;
	const user = loginData.user.user;

	const page = getPage();
	let  filterObject = null;
	filterObject = {dataKeys : {author :null , currentDep : null} , searchString : null};
	const tableSearchInput = document.getElementById('tableSearchInput');

	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		const showToSignOnlyBtn = document.getElementById('showToSignOnlyBtn');
		const showEmployeesBtn = document.getElementById('showEmployeesBtn');
		console.log(event);
		if (event !== undefined){
			console.log("in")
			if(event.target.dataset.active == "0"){
				event.target.classList.remove('dismiss');
				event.target.classList.add('active');
				event.target.dataset.active = "1";
			}
			else if(event.target.dataset.active == "1"){
				event.target.classList.remove('active');
				event.target.classList.add('dismiss');
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
	else{
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
	console.log("creating filter")
	const userData = JSON.parse(localStorage.getItem("loginData")).user;	
	const currentRole = localStorage.getItem("currentRole");
	//console.log(userData.roles[currentRole].protocolAccessLevel);
	let parentElementContent = "";
	const page = getPage();
	if (page == Pages.PROTOCOL){	
		parentElementContent =`
			<div class="flexHorizontal" style="padding-top:0.3em;">
					<div><i class="fas fa-filter"></i><b> Ημερ.: </b></div>
					<div>
						<input type="date" id="datefilter"  title="Φιλτράρισμα εγγραφών με ημερομηνία"/>
					</div>
			</div>
			<div class="flexHorizontal" style="padding-top:0.3em;">
					<div><i class="fas fa-filter"></i><b> Φάκελος: </b></div>
					<div>
						<select id="filterFolderSelection" ></select>
					</div>
			</div>
			`;		
	}
	else if (userData.roles[currentRole].protocolAccessLevel == 1){
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
	parentElement.innerHTML = `<div id="upperToolBar" class="flexVertical" style="flex-wrap : wrap; padding: 1em; gap: 1.5em;">${parentElementContent}</div>`;	
	if (document.querySelector("#filterFolderSelection")){
		if (localStorage.getItem("folders") !== null){
			try{
				const folderList = JSON.parse(localStorage.getItem("folders"));
				//document.querySelector("#filterFolderSelection")
				document.querySelector("#filterFolderSelection").innerHTML += `<option value="0"></option>`
				folderList.forEach( elem => {
					//console.log(elem)
					const template = document.createElement('template');
					template.innerHTML = elem;
					const btn = template.content.querySelector("button");
					document.querySelector("#filterFolderSelection").innerHTML += `<option value="${btn.dataset.folderAa}">${btn.textContent}</option>`
				})
			}
			catch(e){
				document.querySelector("#filterFolderSelection").setAttribute("disabled", true);
			}
		}
		else{
			document.querySelector("#filterFolderSelection").setAttribute("disabled", true);
		}	
	}
	addListeners();
}

export function updateBtnsFromFilter(){
	let filter = null;
	let userData = null;
	if (localStorage.getItem("filter")){
		try{
			filter = JSON.parse(localStorage.getItem("filter"));
		}
		catch(e){
			resetFilterStorage();
			filter = JSON.parse(localStorage.getItem("filter"));
		}
	}
	else{
		resetFilterStorage();
		filter = JSON.parse(localStorage.getItem("filter"));
	}
	
	try{
		userData = JSON.parse(localStorage.getItem("loginData")).user;
	}
	catch(e){
		alert("Αποτυχία ενημέρωσης κατάστασης υπαλλήλου")
		return;
	}
	const currentRole = localStorage.getItem("currentRole");
	//console.log(filter);
	const archiveBtn = document.querySelector('#showForArchive');
	const hideArchieved = document.querySelector('#hideArchieved');
	const dateBtn = document.querySelector('#datefilter');
	const notAssignedBtn = document.querySelector('#noAssignmentfilter');
	const lastAssignedBtn = document.querySelector('#lastAssignedFilter');
	const hideNotificationsBtn = document.querySelector('#hideNotificationsFilter');
	const filterFolderBtn = document.querySelector("#filterFolderSelection")
	
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
	if (filterFolderBtn !==null){
		filterFolderBtn.value = +filter.selectedFolder;
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

	//Να γίνει έλεγχος ανάλογα με τα φίλτρα της σελίδας που είμαστε, ώστε να εμφανίζεται αν υπάρχει ενεργό φίλτρο που αφορά τη σελίδα και όχι γενικά


	//ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΙΝΑΚΑ  filter as array
	const CFAA = Object.entries(filter);

	//ΦΙΛΤΡΑΡΙΣΜΑ ΑΝΕΝΕΡΓΩΝ ΦΙΛΤΡΩΝ current filter as array filter emptry
	const CFAAFE = CFAA.filter(([key, value]) => !(value==0 || value=="" || value==null));

	let CFAAFEFC = null;
	const page = getPage();
	if (page == Pages.CHARGES){	
		//ΦΙΛΤΡΑΡΙΣΜΑ - ΦΙΛΤΡΑ ΧΡΕΩΣΕΩΝ ΜΟΝΟ current filter as array filter emptry filter charges filters
		CFAAFEFC = CFAAFE.filter( ([key, value]) => (FILTERS.CHARGES.includes(key)?1:0) );
	}
	if (page == Pages.PROTOCOL){	
		//ΦΙΛΤΡΑΡΙΣΜΑ - ΦΙΛΤΡΑ ΧΡΕΩΣΕΩΝ ΜΟΝΟ current filter as array filter emptry filter charges filters
		CFAAFEFC = CFAAFE.filter( ([key, value]) => (FILTERS.PROTOCOL.includes(key)?1:0) );
	}

	if (CFAAFEFC.length > 0){
		filterBtn.classList.remove('primary');
		filterBtn.classList.add('active');	
	}
	else{
		filterBtn.classList.remove('active');
		filterBtn.classList.add('primary');	
	}
	//console.log(filter);
}

export function updateFilterStorage(){
	try{
		let filter = JSON.parse(localStorage.getItem("filter"));
	}
	catch(e){
		alert("Πρόβημα ανάγνωσης φίλτρου εγγραφών");
		return;
	}
	const archiveBtn = document.querySelector('#showForArchive');
	const hideArchieved = document.querySelector('#hideArchieved');
	const dateBtn = document.querySelector('#datefilter');
	const notAssignedBtn = document.querySelector('#noAssignmentfilter');
	const lastAssignedBtn = document.querySelector('#lastAssignedFilter');
	const hideNotificationsBtn = document.querySelector('#hideNotificationsFilter');
	const filterFolderBtn = document.querySelector("#filterFolderSelection")
	
	let userData = null;
	let currentRole = null;

	try{
		userData = JSON.parse(localStorage.getItem("loginData")).user;
		currentRole = localStorage.getItem("currentRole");
	}
	catch(e){
		alert("Πρόβημα ανάγνωσης στοιχείων χρήστη"+ e);
		return;
	}
	//Ελέγχω την κατάσταση των επιλογών στο UI και ενημερώνω τη μεταβλητή filter και στη συνέχεια το localStorage
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

	if (filterFolderBtn!==null){
		(+filterFolderBtn.value?filter.selectedFolder=+filterFolderBtn.value:filter.selectedFolder =0);	
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

	document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;
	document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("change",()=> {updateFilterStorage(); getChargesAndFill();}):null;

	document.querySelector("#filterFolderSelection")?document.querySelector("#filterFolderSelection").addEventListener("change", ()=>{updateFilterStorage(); getProtocolAndFill();}):null;
}


// Filters ----
