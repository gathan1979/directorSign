import {updateFilterStorage,createSearch, getActiveFilters, pagingSize, pagingStart, FILTERS, FILTERS_GROUPS} from "./Filter.js"
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";
import { Pages, getPage, createHashDatalist, paggingPage, signals, getControllers } from "./UI_test.js";

export async function getFilteredData(customPagingStart = pagingStart, customPagingSize = pagingSize, signal, controllers, orderField = null , orderType = null){   		//εγγραφές χρεώσεων
	document.querySelector("#syncRecords>i").classList.add('faa-circle');
	document.querySelector("#chargesTableContent").innerHTML = "";
	//updateFilterStorage();

	const filteredObject = getActiveFilters();
	 
	let customObject ={
		customPagingStart,
		customPagingSize,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	}

	if (orderField !== null && orderType !== null){
		customObject.orderField = orderField;
		customObject.orderType = orderType;
	}

	if (+localStorage.getItem("globalSearch") === 1){
		const searchText = document.querySelector("#tableSearchInput").value;
		customObject.searchText = searchText;
	} 

	const  completeOblect= Object.assign(filteredObject, customObject);

	const urlpar = new URLSearchParams(completeOblect);
	const promises = [runFetch("/api/showTableData_test.php", "GET", urlpar, undefined, signal),getUserActiveEvents()];
	const res = await Promise.allSettled(promises);
	if (res[0].status === "rejected" || res[0].value.success === false){
		console.log(res.value.msg);
		return;
	}
	else{
		
		const response = res[0].value.result;
		const protocolsArray = fillChargesTable(response);
		if (res[1].status !== "rejected" && res[1].value.success === true){
			res[1].value.events.forEach( userEvent => {
				if (document.querySelector(`#chargesTableContent [data-record="${userEvent}"]`)){
					document.querySelector(`#chargesTableContent [data-record="${userEvent}"] [data-colname="aaField"]`).innerHTML += ` <i style="color:red;" class="fas fa-exclamation"></i>`;
				}
			})
		}

		document.querySelector("#syncRecords>i").classList.remove('faa-circle');
		return response.totalRecords;
	}
}



export async function getProtocolData(customPagingStart = pagingStart, customPagingSize = pagingSize, signal, controllers){   		//εγγραφές χρεώσεων πρωτοκόλλου
	document.querySelector("#syncRecords>i").classList.add('faa-circle');

	let customObject ={
		customPagingStart,
		customPagingSize,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	}

	//if (orderField !== null && orderType !== null){
		//customObject.orderField = orderField;
		//customObject.orderType = orderType;
	//}

	if (+localStorage.getItem("globalSearch") === 1){
		const searchText = document.querySelector("#tableSearchInput").value;
		customObject.searchText = searchText;
	} 

	const filteredObject = getActiveFilters();



	let  completeOblect= Object.assign(filteredObject, customObject);
	completeOblect= Object.assign(completeOblect, {allRecords : true});

	const urlpar = new URLSearchParams(completeOblect);
	const res = await runFetch("/api/showTableData_test.php", "GET", urlpar, undefined, signal);
	if (!res.success){
		console.log(res.msg);
		//document.querySelector("#recordsSpinner").style.display = 'none';
	}
	else{
		const response = res.result;
		//console.log("εκτέλεση λήψης χρεώσεων 1");
		document.querySelector("#syncRecords>i").classList.remove('faa-circle');
		fillChargesTable(response, true);
		return response.totalRecords;
	}
}

export function fillChargesTable(response, protocol = false, rangeEvents = [] ){  
	
	//const table = document.querySelector("#chargesTableHeader");
	//table.innerHTML=
	const result = response.data;
	let tableContent="";
	document.querySelector("#chargesTableUsers").style.display = "none"; 
	document.querySelector("#chargesTableFolders").style.display = "none";

	let protocols = [];

	for (const record of result){
		let recordColor = "#B6EACB";
		if (protocol){
			recordColor = "#e9f1d4";
		}
		else if(record["statusField"]=="1"){ //Προς αρχείο
			recordColor = "DarkOrange";		
		}
		else if(record["statusField"]=="2"){ // Αρχείο
			recordColor = "Gray";				
		}

		
		
		tableContent += `<div class="flexHorizontal" style="cursor:pointer; border-bottom: 2px solid lightgray; background: linear-gradient(-90deg, white, ${recordColor}); padding:10px;" data-isRead="${record["isRead"]==0?0:1}" data-statusField="`+record["statusField"]+'" data-record="'+record.aaField+'">';

		for (let [key, value] of Object.entries(record)){
			
			let customWidth = 0;
			switch (key){
				case "aaField" : customWidth= "10%";break;
				case "fromField" : customWidth= "15%";break;
				case "subjectField" :customWidth= "20%";break;
				case "docDate" : customWidth= "10%";break;
				case "docNumber" :customWidth= "10%";break;
				case "toField" :customWidth= "10%";break;
				case "outSubjectField" : customWidth= "10%";break;
				case "outDocDate" : customWidth= "10%";break;
				case "statusField" : customWidth= "5%";break;
				case "extended" : customWidth= "10%";break;
				case "extendedUsers" : customWidth= "10%";break;
			}		
			if((key == "linkField") || (key=="insertDateField") || (key== "isRead")){
				continue;
			}
			if (key== "extended"){
				document.querySelector("#chargesTableUsers").style.display = "block"; 
				document.querySelector("#chargesTableFolders").style.display = "block";
			}

			if( key == "statusField"){
				switch (+value){
					case 0 : value= "Εκρ. "; break;
					case 1 : value= "Προς Αρχ. "; break;
					case 2 : value= "Αρχ. "; break;
				}
				//console.log((record['extended']?record['extended']:''))
				//console.log(value)
			}
			if( key == "aaField"){
				value = "<b>"+value+"</b> "+new Date(record['insertDateField']).toLocaleDateString('en-GB');
			}
			tableContent +=`<span style="width:${customWidth};"`;
			tableContent +=`" data-colname="`+key+'">'+value+"</span>"	
		}
		tableContent +="</div>";
		protocols.push(record["aaField"]);
	}
	document.querySelector("#chargesTableContent").innerHTML = tableContent;
	
	
	//if(!protocol){	
	//for (const record of result){
		//document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => openProtocolRecord(record["aaField"], record["insertDateField"], protocol));
	//}
	
	document.querySelector(`#chargesTableContent`).addEventListener("click", (event) => {
		if (event.target.parentNode.dataset.record && localStorage.getItem("currentYear")){
			openProtocolRecord(event.target.parentNode.dataset.record, localStorage.getItem("currentYear"), protocol);
		}
		//openProtocolRecord(record["aaField"], record["insertDateField"], protocol)
	})

	createSearch();
	return protocols;
}



async function getUserActiveEvents(){
  
	const res = await runFetch("/api/getUserActiveEvents.php", "GET");
	if (!res.success){
		
	}
	else{
		return  res.result;
		//<i title="${eventStringForInfo}" style="color:red;" class="fas fa-exclamation">
	}
}

async function getRecord(year, protocolNo){
	const urlData = new URLSearchParams();

	urlData.append("year", year);
	urlData.append("protocolNo", protocolNo);

	const res = await runFetch("/api/getRecord.php", "GET", urlData);
	if (!res.success){
		alert(res.msg);
		return false;
	}
	else{  
	   return res.result;
	}
} 

export async function openProtocolRecord(record, recordDate, protocol){
	if (recordDate.match(/\d{4}-\d{2}-\d{2}/i) !==null){
		recordDate = recordDate.split("-")[0];
	}
	//console.log(record, recordDate)
	const recordFields = await getRecord(recordDate, record);
	const subject  = recordFields.subjectField;
	const outSubjectField = recordFields.outSubjectField;
	const status = recordFields. statusField;

	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
	const currentYear = (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear());
	
	const protocolWindowContent = 
	`<div id="bottomSection">
		<div class="" name="bottomSectionTitleBar" id="bottomSectionTitleBar" >
			<div style="padding-right:10px;display:flex;gap:10px;" name="bottomSectionTitle" id="bottomSectionTitle">
			</div>
			<div style="display:flex; gap:0.2em; align-items: flex-start;" name="bottomSectionButtons" id="bottomSectionButtons">
				
			</div>
		</div>
		<div id="bottomSectionInfoBar">
			<div id="ksideInfo" style="display:flex;gap:2px;"><span class="isButton secondary" style="font-size: 10px;">Αρ.ΚΣΗΔΕ </span><span id="ksideInfoNo"></span></div>
			<div id="tagsInfo" style="display:flex;gap:2px;"></div>
			<div id="eventsInfo" style="display:flex;gap:2px;"></div>
		</div>
		<div id="bottomSectionBody">
			<div style="flex-basis: 50%;" class="firstBottomSectionColumn">
				<record-attachments data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:40%;" protocolDate="${recordDate}" protocolNo="${record}"></record-attachments>
				<record-relative data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-relative>
				<record-comment data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-comment>
			
				<record-tags data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-tags>

				<record-events data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-events>

				<record-kside data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-kside>

				<record-history style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-history>
			</div>	

			<record-folders data-locked="${(protocol===true)?1:0}" style="flex-basis: 20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-folders>
			<record-assignments data-locked="${(status>0 || protocol===true)?1:0}"  style="flex-basis: 30%;" protocolDate="${recordDate}" protocolNo="${record}"></record-assignments>

		</div>
	</div>
	
	<dialog id="editRecordModal" class="customDialog" style="max-width: 80%; min-width: 50%;">
		<record-edit protocolDate="${recordDate}" protocolNo="${record}" style="display:flex; flex-direction:column; gap: 10px;"></record-edit>
    </dialog>`;

	

	document.querySelector("#protocolRecordDialog").showModal();
	//event.currentTarget.style.backgroundColor = "green";
	document.querySelector("#protocolRecordDialog").innerHTML = protocolWindowContent;

	document.querySelector("record-tags").addEventListener("RefreshTagsDatalistEvent", async event => {
		await createHashDatalist();
	})	
	
	
	//Fill protocolWindowContent 
	if (currentRoleObject.protocolAccessLevel ==1){
		document.querySelector("#bottomSectionButtons").innerHTML += (getPage()==Pages.CHARGES)?
		`<button class="isButton primary" name="copyProtocolBtn" id="copyProtocolBtn" onclick="copyProtocol();" data-toggle="tooltip" title="Αντίγραφο Πρωτοκόλλου"><i class="far fa-copy"></i></button>&nbsp`:``;
	}
	else{
		document.querySelector("#bottomSectionButtons").innerHTML += (getPage()==Pages.CHARGES)?`<button class="isButton primary" name="makeUnread" id="makeUnread" data-toggle="tooltip" title="Σήμανση ως μη αναγνωσμένο"><i class="fas fa-book"></i></button>`:``;
	}
	if (currentRoleObject.protocolAccessLevel ==1 || currentRoleObject.accessLevel ==1){
		document.querySelector("#bottomSectionButtons").innerHTML += (getPage()==Pages.CHARGES)?
		`<button class="isButton info" name="publishToSiteBtn" id="publishToSiteBtn" title="Αίτημα Ανάρτησης στη Σελίδα"><i class="fas fa-cloud-upload-alt"></i></button>`:``;
	}
	let bottomTitleDiv = document.querySelector("#bottomSectionTitle") ;
	bottomTitleDiv.innerHTML	= (getPage()==Pages.CHARGES)?`<button title="Επεξεργασία Πρωτοκόλλου" id="editRecordBtn" class="isButton info"><i class="fas fa-edit"></i></button>`:``;
	
	 // Προσθήκη κουμπιών ενεργειών με βάση την ιδιότητα
	 if (currentRoleObject.protocolAccessLevel == 1){
		if (+status < 2){
			bottomTitleDiv.innerHTML += '<button id="archiveRecordBtn" title="Αρχειοθέτηση" type="button" class="isButton warning" ><i class="fas fa-archive"></i></button>';	
		}
		if (+status !== 0){
			bottomTitleDiv.innerHTML += '<button id="restoreRecordBtn" title="Επαναφορά" type="button" class="isButton warning" ><i class="fas fa-trash-restore"></i></button>';
		}	
	 }
	 else{
		bottomTitleDiv.innerHTML += '<button id="dischargeRecordBtn" title="Αποχρέωση" type="button" class="isButton warning" ><i class="fas fa-archive"></i></button>';
	 }
	
	 bottomTitleDiv.innerHTML += `<span style="font-weight:bold;">${record}/${currentYear} | ${subject} | ${outSubjectField}</span>`;

	document.querySelector("#bottomSectionButtons").innerHTML +=`<button style="margin-left:20px;" class="isButton danger" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>`;
	
	document.querySelector("#closeModalBtn").addEventListener("click", ()=> document.querySelector("#protocolRecordDialog").close());
	
	if (document.querySelector("#dischargeRecordBtn")){
		document.querySelector("#dischargeRecordBtn").addEventListener("click", async ()=> {
			if (confirm("Πρόκειται να αλλάξετε την κατάσταση της εγγραφής")){
				await changeStatus(record, 1);
			}
		});
	}
	if (document.querySelector("#archiveRecordBtn")){
		document.querySelector("#archiveRecordBtn").addEventListener("click", async ()=> {
			if (+status == 1){
				if (confirm("Πρόκειται να αλλάξετε την κατάσταση της εγγραφής")){
					await changeStatus(record, 2);
				}
			}
			else if (+status == 0){
				if (confirm("Πρόκειται να αρχειοθετήσετε εγγραφή που δεν έχει αποχρεωθεί από το χρήστη")){
					await changeStatus(record, 2);
				}
			}
		});
	}
	if (document.querySelector("#restoreRecordBtn")){
		document.querySelector("#restoreRecordBtn").addEventListener("click", async ()=> {
			if (confirm("Πρόκειται να αλλάξετε την κατάσταση της εγγραφής")){
				await changeStatus(record, 0);
			}
		});
	}
	
	if (document.querySelector("#editRecordBtn")){
		document.querySelector("#editRecordBtn").addEventListener("click", ()=> document.querySelector("#editRecordModal").showModal());
	}
	if (document.querySelector("#publishToSiteBtn")){
		document.querySelector("#publishToSiteBtn").addEventListener("click", async () => await publishToSite(record, recordDate));
	}
	if (document.querySelector("#copyProtocolBtn")){
		document.querySelector("#copyProtocolBtn").addEventListener("click", () => copyProtocol());
	}
	if (document.querySelector("#makeUnread")){
		document.querySelector("#makeUnread").addEventListener("click", async () => makeMessageUnread(record, recordDate.split("-")[0]));
	}

	document.querySelector("#bottomSectionBody").addEventListener("historyRefreshEvent", async (event)=>{
		//console.log("event catched");
		event.stopPropagation();
		document.querySelector("record-history").setAttribute("timestamp", Date.now());
		//this.loadHistory(this.protocolNo);
	})
	document.querySelector("#bottomSectionButtons").addEventListener("assignmentsRefreshEvent", async (event)=>{
		console.log("event catched - assignments");
		event.stopPropagation();
		document.querySelector("record-assignments").setAttribute("timestamp", Date.now());
		//this.loadHistory(this.protocolNo);
	})
	document.querySelector("#bottomSectionButtons").addEventListener("commentsRefreshEvent", async (event)=>{
		console.log("event catched - comments");
		event.stopPropagation();
		document.querySelector("record-comment").setAttribute("timestamp", Date.now());
		//this.loadHistory(this.protocolNo);
	})
}

async function makeMessageUnread(protocolNo, protocolYear){
	const formdata = new FormData();
	formdata.append('protocolNo', protocolNo);
	formdata.append('currentYear', protocolYear);

	const res = await runFetch("/api/makeMessageUnRead.php", "POST", formdata);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		document.querySelector(`div [data-record="${this.protocolNo}"]`).dataset.isread = 0;
	}
}

async function publishToSite(protocolNo, protocolYear){
	const formdata = new FormData();
	formdata.append('protocolNo',protocolNo);
	formdata.append('protocolYear',protocolYear);

	const res = await runFetch("/api/publishToSite.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const commentsRefreshEvent = new CustomEvent("commentsRefreshEvent",  { bubbles: true, cancelable: false});
		document.querySelector("#publishToSiteBtn").dispatchEvent(commentsRefreshEvent);
		const assignmentsRefreshEvent = new CustomEvent("assignmentsRefreshEvent",  { bubbles: true, cancelable: false});
		document.querySelector("#publishToSiteBtn").dispatchEvent(assignmentsRefreshEvent);
		//console.log("events dispatched");
		//alert(res.msg);
	}
}

async function changeStatus(protocolNo, newStatus){
	const formdata = new FormData();
	formdata.append('protocolNo', protocolNo);
	formdata.append('newStatus', newStatus);
	const res = await runFetch("/api/changeStatus.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//await getFilteredData(event.currentPage -1, pagingSize, signals.charges, getControllers(), orderField, orderType);
		let sibling  = null;
		if (document.querySelector(`[data-record="${protocolNo}"] + div`)){
			sibling = document.querySelector(`[data-record="${protocolNo}"] + div`).dataset.record;
		}
		else{
			sibling = document.querySelector(`div:has(+ [data-record="${protocolNo}"])`).dataset.record;
		}
		await getFilteredData((paggingPage-1)<0?0:(paggingPage-1), pagingSize, signals.charges, getControllers());
		document.querySelector(`[data-record="${sibling}"]`).scrollIntoView({behavior: 'smooth'});
		alert(res.msg);
	}
}

async function copyProtocol(){
	const formdata = new FormData();
	formdata.append('protocolNo',protocolNo);
	formdata.append('protocolYear',protocolYear);

	const res = await runFetch("/api/copyProtocol.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const formdata2 = new FormData();
        formdata2.append('protocolNo',res.baseProtocol);
        formdata2.append('protocolYear', res.year);
        formdata2.append('relativeNo', res.newProtocol);
        formdata2.append('relativeYear', res.year);

        const res2 = await runFetch("/api/saveRelative.php", "POST", formdata2);
        if (!res2.success){
            alert(res.msg+", "+res2.msg);
        }
        else{
			alert(res.msg+", "+res2.msg);
        }
	}
}

//---------------------------------------------------Αλλαγές σε πρωτόκολλα για εμφάνιση -------------------------------------------------------------------------

async function getChangedRecords(days=1){
	//console.log(node);
	const urlpar = new URLSearchParams({ days});
	const res = await runFetch("/api/getChangedRecords.php", "GET", urlpar);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		return  res.result;
	}
}

export async function printChangedRecords(days=1){
	document.querySelector("#changesContent").innerHTML = "";
	let changedRecords = [];
	if (days == 0){
		changedRecords = (await getUserActiveEvents()).events;
	}
	else{
		changedRecords = (await getChangedRecords(days)).changes;
	}
	console.log(changedRecords)
	const changesContent  = document.querySelector("#changesContent");
	const changesDetailsContent  = document.querySelector("#changesDetailsContent");
	changedRecords.forEach(item => {
		if (localStorage.getItem("currentYear")){
			document.querySelector("#changesContent").innerHTML += `<protocol-btn small protocolno="${item}" protocoldate="${localStorage.getItem("currentYear")}"></protocol-btn>`;
		}
	});


}

async function showChangesDetails(e){
	//console.log(e);
	const protocol = e.target.dataset.protocol;
	const urlpar = new URLSearchParams({postData : protocol});
	const res = await runFetch("/api/getChangedRecordsAnalytics.php", "GET", urlpar);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		return  res.result;
	}
}

//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------