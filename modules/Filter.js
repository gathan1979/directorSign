import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";
import {getPage, Pages, getChargesAndFill, getProtocolAndFill} from "./UI_test.js";
import { getFilteredData } from "./ProtocolData.js";

let filter = {};
export let pagingStart = 0; 
export let pagingSize = 100; 


//Object Φίλτρα που θα αποθηκευθούν στο LocalStorage με το filterName τους
const showForArchiveFilter = {filterName : "showForArchive", type: "boolean", extension : false, description:"Προς Αρχείο"};
const hideArchievedFilter = {filterName : "hideArchieved", type: "boolean", extension : false, description:"Aρχειοθετημένα"};
const accessRequestsFilter = {filterName : "accessRequests", type: "boolean", extension : false, description:"Αιτήματα πρόσβασης"};
const selectedDateFilter = {filterName : "selectedDate", type: "date", extension : false, description:"Φιλτράρισμα εγγραφών με ημερομηνία"};
const selectedDateDepFilter = {filterName : "selectedDateDep", type: "date", extension : false, description:"Φιλτράρισμα εγγραφών με ημερομηνία"};
const isAssignedFilter = {filterName : "isAssigned", type: "boolean", extension : false, description:"Αχρέωτα"};
const isAssignedLastFilter = {filterName : "isAssignedLast", type: "boolean", extension : false, description:"Τελευταίες Χρεώσεις"};
const isAssignedToDepFilter = {filterName : "isAssignedToDep", type: "boolean", extension : false, description:"Αχρέωτα"};
const noNotificationsFilter = {filterName : "noNotifications", type: "boolean", extension : false, description:"Απόκρυψη κοινοποιήσεων"};
const selectedFolderFilter = {filterName : "selectedFolder", type: "list", extension : false, description:"Λίστα φακέλων", dataSource: getFoldersFromLS};
const extendedViewFilter = {filterName : "extendedView", type: "boolean", extension : true, description:"Εκτεταμένα στοιχεία"};
const selectedUserFilter = {filterName : "selectedUser", type: "list", extension : false, description:"Εμφάνιση χρηστών", dataSource: getDepUsers};
const extendedActiveFilter = {filterName : "activeStatus", type: "boolean", extension : true, description:"Ενεργά πρωτόκολλα"};

//Αντιστοίχιση id κουμπιού φίλτρου με το αντίστοιχο φίλτρο object	
const mapBtnsToLSFilter = new Map();
mapBtnsToLSFilter.set(showForArchiveFilter, "showForArchive");
mapBtnsToLSFilter.set(hideArchievedFilter, "hideArchieved");
mapBtnsToLSFilter.set(accessRequestsFilter, "accessRequests");
mapBtnsToLSFilter.set(selectedDateFilter, "datefilter"); 
mapBtnsToLSFilter.set(selectedDateDepFilter, "datefilterDep");
mapBtnsToLSFilter.set(isAssignedFilter, "noAssignmentfilter");
mapBtnsToLSFilter.set(isAssignedToDepFilter, "noAssignmentfilterDep");
mapBtnsToLSFilter.set(isAssignedLastFilter, "lastAssignedFilter");
mapBtnsToLSFilter.set(noNotificationsFilter, "hideNotificationsFilter");
mapBtnsToLSFilter.set(selectedFolderFilter, "filterFolderSelection");
mapBtnsToLSFilter.set(extendedViewFilter, "extendedView");
mapBtnsToLSFilter.set(extendedActiveFilter, "activeStatus");
mapBtnsToLSFilter.set(selectedUserFilter, "selectedUser");

export const FILTERS = {};

export const FILTERS_GROUPS = {
	PROTOCOL: [selectedFolderFilter, selectedDateFilter, extendedViewFilter],
	CHARGES_USER: [hideArchievedFilter, isAssignedLastFilter, noNotificationsFilter, accessRequestsFilter, extendedViewFilter],
	CHARGES_PROTOCOL: [hideArchievedFilter, isAssignedFilter, selectedDateFilter, showForArchiveFilter, extendedViewFilter],
	CHARGES_DEP_DIRECTOR: [hideArchievedFilter, isAssignedLastFilter, isAssignedToDepFilter, noNotificationsFilter, selectedDateDepFilter, accessRequestsFilter, extendedViewFilter]
}

//extensions=true Κάνει επαναφορά και τα extension Filters
export function resetFilterStorage(extensions = true, saveToLS = true){
	//Προσθέτω το φίλτρο των ενεργών πρωτοκόλλων αν απαιτείται
	const userData = JSON.parse(localStorage.getItem("loginData")).user;	
	const currentRole = localStorage.getItem("currentRole");
	const page = getPage();
	//ΕΠΙΠΡΟΣΘΕΤΑ ΦΙΛΤΡΑ ΠΟΥ ΜΠΑΙΝΟΥΝ ΥΠΟ ΠΡΟΥΠΟΘΕΣΕΙΣ

	if (page == Pages.PROTOCOL){
		const indexSelectedUser = FILTERS_GROUPS.PROTOCOL.indexOf(selectedUserFilter);
		const indexActiveFilter = FILTERS_GROUPS.PROTOCOL.indexOf(extendedActiveFilter);

		if ( userData.roles[currentRole].accessLevel ==1){
			
			if ( indexSelectedUser === -1){
				FILTERS_GROUPS.PROTOCOL.unshift(selectedUserFilter);
			}	
			if ( indexActiveFilter === -1){
				FILTERS_GROUPS.PROTOCOL.unshift(extendedActiveFilter);
			}
		}
		else{
			if (indexSelectedUser !== -1){
				FILTERS_GROUPS.PROTOCOL.splice(indexSelectedUser,1);
			}
			if (indexActiveFilter !== -1){
				FILTERS_GROUPS.PROTOCOL.splice(extendedActiveFilter,1);
			}
		}
	}
	//console.log("protocol filters updated from reset",FILTERS_GROUPS.PROTOCOL)

	let allfilters = [];
	for (const filter_group  in FILTERS_GROUPS){
		allfilters = allfilters.concat(FILTERS_GROUPS[filter_group]);
	}
	const uniqueFilters = new Set(allfilters.flat());
	const filter = {};
	let filterFromLS = null;
	if (extensions===false){
		//Λαμβάνουμε τιμές από localStorage, για να μη σβηστούν από τα extension Filters
		if (localStorage.getItem('filter')){
			filterFromLS = JSON.parse(localStorage.getItem('filter'));
		} 
	}
	uniqueFilters.forEach( elem =>{
		//console.log(elem)
		if(elem.extension === true && extensions===false){
			filter[elem.filterName] = filterFromLS[elem.filterName];
		}
		else{
			switch (elem.type){
				case "date": 
					filter[elem.filterName] = "";
					break;
				case "list": 
					filter[elem.filterName] = "";
					break;
				case "boolean": 
					filter[elem.filterName] = 0;
					break;
				case "list": 
					filter[elem.filterName] = 0;
					break;
			}
		}
	})
	if (saveToLS){
		localStorage.setItem("filter", JSON.stringify(filter));
	}
	return filter;
}


// if (localStorage.getItem("filter") !== null){
// 	try{
// 		filter = JSON.parse(localStorage.getItem("filter"));	
// 	}
// 	catch(e){
// 		resetFilterStorage();
// 	}
// }
// else{
// 	resetFilterStorage();
// }

async function getDepUsers(type=1){
	const urlparams = new URLSearchParams({type});
	const res = await runFetch("/api/getProtocolFilterUsers.php", "GET", urlparams);
	if (!res.success){
		return null;
	}
	else{  
		let temp = `<option value="0" selected>Χρήστης</option>`
		res.result.users.forEach( elem => {
			//console.log(elem)
			// const template = document.createElement('template');
			// template.innerHTML = elem;
			// const btn = template.content.querySelector("button");
			temp += `<option value="${elem.aa}">${elem.fullName}</option>`
		})
		return temp;
	}
}

function getFoldersFromLS(that){
	if (localStorage.getItem("folders") !== null){
		try{
			const folderList = JSON.parse(localStorage.getItem("folders"));
			//document.querySelector("#filterFolderSelection")
			let temp = `<option value="0">Φάκελος</option>`
			folderList.forEach( elem => {
				//console.log(elem)
				// const template = document.createElement('template');
				// template.innerHTML = elem;
				// const btn = template.content.querySelector("button");
				temp += `<option value="${elem[0]}">${elem[1]}</option>`
			})
			return temp;
		}
		catch(e){
			return `<option value="-1">Αδυναμία λήψης δεδομένων </option>`;
		}
	}
	else{
		return `<option value="-1">Αδυναμία λήψης δεδομένων 2</option>`;
	}	
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
		//console.log(event);
		if (event !== undefined){
			//console.log("in")
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

//Δημιουργεί τα κουμπιά του φίλτρου χωρίς καμία ενημέρωση με το localStorage
export default async function createFilter(parentElement){
	//console.log("protocol filters",FILTERS_GROUPS.PROTOCOL)
	resetFilterStorage();
	//console.log("creating filter")
	const userData = JSON.parse(localStorage.getItem("loginData")).user;	
	const currentRole = localStorage.getItem("currentRole");
	//console.log(userData.roles[currentRole].protocolAccessLevel);
	let parentElementContent = "";
	let parentElementExtendedContent = "";
	const page = getPage();
	let tempFiltersArray = []
	if (page == Pages.PROTOCOL){
		// if ( userData.roles[currentRole].accessLevel ==1){
		// 	if (FILTERS_GROUPS.PROTOCOL.indexOf(selectedUserFilter) === -1){
		// 		FILTERS_GROUPS.PROTOCOL.unshift(selectedUserFilter);
		// 	}	
		// 	console.log(FILTERS_GROUPS.PROTOCOL)
		// 	if (FILTERS_GROUPS.PROTOCOL.indexOf(extendedActiveFilter) === -1){
		// 		FILTERS_GROUPS.PROTOCOL.unshift(extendedActiveFilter);
		// 	}
		// 	console.log(FILTERS_GROUPS.PROTOCOL)
		// }
		// else{
		// 	const indexSelectedUser = FILTERS_GROUPS.PROTOCOL.indexOf(selectedUserFilter);
		// 	console.log(FILTERS_GROUPS.PROTOCOL)
		// 	if ( indexSelectedUser === 1){
				
		// 		FILTERS_GROUPS.PROTOCOL.splice(indexSelectedUser, 1);
		// 	}
		// 	const indexActiveFilter = FILTERS_GROUPS.PROTOCOL.indexOf(extendedActiveFilter);
		// 	console.log(FILTERS_GROUPS.PROTOCOL)
		// 	if ( indexActiveFilter === 1){
				
		// 		FILTERS_GROUPS.PROTOCOL.splice(indexActiveFilter, 1);
		// 	}
		// }
		//console.log("protocol filters updated",FILTERS_GROUPS.PROTOCOL)
		tempFiltersArray = FILTERS_GROUPS.PROTOCOL;
	}
	else if (userData.roles[currentRole].protocolAccessLevel == 1){
		tempFiltersArray = FILTERS_GROUPS.CHARGES_PROTOCOL;
 	}
	else if (userData.roles[currentRole].accessLevel ==1){
		tempFiltersArray = FILTERS_GROUPS.CHARGES_DEP_DIRECTOR;
	}	
	else{ 
		tempFiltersArray = FILTERS_GROUPS.CHARGES_USER;
	}  

	for ( const filter of tempFiltersArray){
		let temp = `<div class="flexHorizontal" >`;
		switch (filter.type){
			case "date": 
				temp += `<input type="date" class="isButton" id="${mapBtnsToLSFilter.get(filter)}"  title="${filter.description}"/>`;
				break;
			case "list": 
				const data = await filter.dataSource();
				temp +=`<select id="${mapBtnsToLSFilter.get(filter)}" >${data}</select>`;
				break
			case "boolean": 
				temp += `<button id="${mapBtnsToLSFilter.get(filter)}" class="isButton" title="${filter.description}" data-value="0">${filter.description}</button>`;
				break;
		}
		temp += `</div>`;
		filter.extension? parentElementExtendedContent +=temp : parentElementContent += temp;
		//console.log(parentElementContent)
	}	

	parentElement.innerHTML = `<div id="upperToolBar" class="flexHorizontal" style=" justify-content: center; flex-wrap : wrap; padding: 5px; gap: 5px; font-size: 0.8em;">${parentElementContent}</div>
								<i class="fas fa-plus"></i>							
								<div id="filterExtensions" class="flexHorizontal" style=" justify-content: center; flex-wrap : wrap; padding: 5px; gap: 5px; font-size: 0.8em;">${parentElementExtendedContent}</div>`;	
	
	addListeners(tempFiltersArray, page);						

}

export function getActiveFilters(){
	//ΛΗΨΗ ΦΙΛΤΡΩΝ από LocalStorage
	let currentFilterFromLS = null;
	if (localStorage.getItem("filter")){
		currentFilterFromLS = JSON.parse(localStorage.getItem("filter"));
	}

	const userData = JSON.parse(localStorage.getItem("loginData")).user;	
	const currentRole = localStorage.getItem("currentRole");
	//console.log(userData.roles[currentRole].protocolAccessLevel);
	//ΦΙΛΤΡΟ ΠΟΥ ΑΝΤΙΣΤΟΙΧΕΙ ΣΤΗΝ ΠΕΡΙΠΤΩΣΗ ΣΕΛΙΔΑΣ ΚΑΙ ΧΡΗΣΤΗ
	const page = getPage();
	let pageRelevantFiltersArray = []
	if (page == Pages.PROTOCOL){
		pageRelevantFiltersArray = FILTERS_GROUPS.PROTOCOL;
	}
	else if (userData.roles[currentRole].protocolAccessLevel == 1){
		pageRelevantFiltersArray = FILTERS_GROUPS.CHARGES_PROTOCOL;
 	}
	else if (userData.roles[currentRole].accessLevel ==1){
		pageRelevantFiltersArray = FILTERS_GROUPS.CHARGES_DEP_DIRECTOR;
	}	
	else{ 
		pageRelevantFiltersArray = FILTERS_GROUPS.CHARGES_USER;
	} 
	const filteredObject = {};
	//ΛΗΨΗ ΜΗ ΚΕΝΩΝ ΦΙΛΤΡΩΝ
	pageRelevantFiltersArray.forEach( pageFilter =>{
		//console.log(currentFilterFromLS[pageFilter.filterName]);
		if (currentFilterFromLS[pageFilter.filterName] !== "" && +currentFilterFromLS[pageFilter.filterName] !== 0 && currentFilterFromLS[pageFilter.filterName] !== undefined){
			filteredObject[pageFilter.filterName] = currentFilterFromLS[pageFilter.filterName] ;
		}
	})
	return filteredObject;
}


export function updateBtnsFromFilter(){
	let filterFromLS = null;
	let userData = null;
	let currentRole;
	try{
		userData = JSON.parse(localStorage.getItem("loginData")).user;
		currentRole = localStorage.getItem("currentRole");
	}
	catch(e){
		alert("Πρόβημα ανάγνωσης στοιχείων χρήστη. ");
		return;
	}

	if (localStorage.getItem("filter")){
		try{
			filterFromLS = JSON.parse(localStorage.getItem("filter"));
		}
		catch(e){
			resetFilterStorage();
			filterFromLS = JSON.parse(localStorage.getItem("filter"));
		}
	}
	else{
		resetFilterStorage();
		try{
			filterFromLS = JSON.parse(localStorage.getItem("filter"));
		}
		catch(e){
			resetFilterStorage();
			filterFromLS = JSON.parse(localStorage.getItem("filter"));
		}
	}

	const page = getPage();
	let tempFiltersArray = [];
	if (page == Pages.PROTOCOL){
		tempFiltersArray = FILTERS_GROUPS.PROTOCOL;
	}
	else if (userData.roles[currentRole].protocolAccessLevel == 1){
		tempFiltersArray = FILTERS_GROUPS.CHARGES_PROTOCOL;
 	}
	else if (userData.roles[currentRole].accessLevel ==1){
		tempFiltersArray = FILTERS_GROUPS.CHARGES_DEP_DIRECTOR;
	}	
	else{ 
		tempFiltersArray = FILTERS_GROUPS.CHARGES_USER;
	}  

	tempFiltersArray.forEach( itemFilter => {
		//console.log(itemFilter)
		const lsValue = filterFromLS[itemFilter.filterName];
		let  customElement = document.querySelector(`#${mapBtnsToLSFilter.get(itemFilter)}`);
		if (lsValue !== null){
			customElement.dataset.value = lsValue;
			if (itemFilter.type === "date"){
				customElement.value = lsValue;
			}
			if (itemFilter.type === "list"){
				lsValue == "" ? customElement.value = 0: customElement.value = lsValue;
			}
			if (lsValue !== "" && lsValue !==0){
				customElement.classList.add("active");
			}
			else{
				customElement.classList.remove("active");
			}
		}
	})

}

export function updateFilterStorage(event = null){
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
	//console.log(event.target)
	let associatedFilter = null;
	for (let [key, value] of mapBtnsToLSFilter.entries()) {
		if (value === event.target.id){
			associatedFilter = key;
			break;
		}
	}

	//console.log("σχετικό φίλτρο",associatedFilter)

	//Ανάγνωση φίλτρου χωρίς αποθήκευση, χωρίς extension filters
	let filter;
	if (associatedFilter.extension !== true){
		//console.log("reseting filter")
		filter = resetFilterStorage(false , false);
	}
	else{
		if(localStorage.getItem("filter")){
			try{
				filter = JSON.parse(localStorage.getItem("filter"));
			}
			catch(e){
				resetFilterStorage(false, true);
			}
		}	
	}
	console.log(filter);
	let nextValue = null;
	//Ελέγχω την κατάσταση των επιλογών στο UI και ενημερώνω τη μεταβλητή filter και στη συνέχεια το localStorage
	if (event.target.tagName === "BUTTON"){
		//console.log(event.target.dataset.value)
		if(+event.target.dataset.value===1){
			nextValue=0;
			//console.log(event.target.dataset.value)
		}
		else{
			nextValue=1;
			//console.log(event.target.dataset.value)
		}
	}
	else if (event.target.tagName === "INPUT"){
		nextValue = event.target.value;
	}
	else{
		nextValue = event.target.value;
	}

	filter[associatedFilter.filterName] = associatedFilter.type=="boolean"?+nextValue: nextValue;
	localStorage.setItem('filter', JSON.stringify(filter));
	updateBtnsFromFilter();
}

function addListeners(filterArray, page){
	filterArray.forEach(itemFilter => {
		if (document.querySelector(`#${mapBtnsToLSFilter.get(itemFilter)}`)){
			if(page === Pages.PROTOCOL || page === Pages.CHARGES){
				document.querySelector(`#${mapBtnsToLSFilter.get(itemFilter)}`).addEventListener((itemFilter.type==="boolean"?"click":"change"),(event)=> {
					updateFilterStorage(event); 
					page === Pages.PROTOCOL?getProtocolAndFill():getChargesAndFill();
				});
			}
		}
	} )
	// document.getElementById("showForArchive")?document.getElementById("showForArchive").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("hideArchieved")?document.getElementById("hideArchieved").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("accessRequests")?document.getElementById("accessRequests").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("extendedView")?document.getElementById("extendedView").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("noAssignmentfilter")?document.getElementById("noAssignmentfilter").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("datefilter")?document.getElementById("datefilter").addEventListener("change",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("lastAssignedFilter")?document.getElementById("lastAssignedFilter").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.getElementById("hideNotificationsFilter")?document.getElementById("hideNotificationsFilter").addEventListener("click",(event)=> {updateFilterStorage(event); getChargesAndFill();}):null;
	// document.querySelector("#filterFolderSelection")?document.querySelector("#filterFolderSelection").addEventListener("change", (event)=>{updateFilterStorage(event); getProtocolAndFill();}):null;
}


// Filters ----