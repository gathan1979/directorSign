import {updateFilterStorage,createSearch, pagingSize, pagingStart, FILTERS} from "./Filter.js"
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";
import { Pages, getPage } from "./UI_test.js";

export async function getFilteredData(customPagingStart = pagingStart, customPagingSize = pagingSize, signal, controllers){   		//εγγραφές χρεώσεων
	document.querySelector("#syncRecords>i").classList.add('faa-circle');
	document.querySelector("#chargesTableContent").innerHTML = "";
	//updateFilterStorage();

	//ΛΗΨΗ ΦΙΛΤΡΩΝ
	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	//ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΙΝΑΚΑ  current filter as array
	const CFAA = Object.entries(currentFilter);
	//console.log("CFAA", CFAA);

	//ΦΙΛΤΡΑΡΙΣΜΑ ΑΝΕΝΕΡΓΩΝ ΦΙΛΤΡΩΝ current filter as array filter emptry
	const CFAAFE = CFAA.filter(([key, value]) => !(value==0 || value=="" || value==null));
	//console.log("CFAAFE",CFAAFE);

	//ΦΙΛΤΡΑΡΙΣΜΑ - ΦΙΛΤΡΑ ΧΡΕΩΣΕΩΝ ΜΟΝΟ current filter as array filter emptry filter charges filters
	const CFAAFEFC = CFAAFE.filter( ([key, value]) => (FILTERS.CHARGES.includes(key)?1:0) );
	//console.log("CFAAFEFC", CFAAFEFC);

	//ΜΕΤΑΤΡΟΠΗ ΠΙΝΑΚΑ ΣΕ ΑΝΤΙΚΕΙΜΕΝΟ
	const filteredObject = Object.fromEntries(CFAAFEFC);
	console.log("filteredObject", filteredObject);

	let customObject ={
		customPagingStart,
		customPagingSize,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	}

	if (+localStorage.getItem("globalSearch") === 1){
		const searchText = document.querySelector("#tableSearchInput").value;
		customObject.searchText = searchText;
	} 

	const  completeOblect= Object.assign(filteredObject, customObject);
	//console.log(completeOblect);

	const urlpar = new URLSearchParams(completeOblect);
	const res = await runFetch("/api/showTableData_test.php", "GET", urlpar, undefined, signal);
	if (!res.success){
		console.log(res.msg);
		//document.querySelector("#recordsSpinner").style.display = 'none';
	}
	else{
		const response = res.result;

		fillChargesTable(response);
		document.querySelector("#syncRecords>i").classList.remove('faa-circle');
		return response.totalRecords;
	}
}

export async function getProtocolData(customPagingStart = pagingStart, customPagingSize = pagingSize, signal, controllers){   		//εγγραφές χρεώσεων πρωτοκόλλου
	document.querySelector("#syncRecords>i").classList.add('faa-circle');

	//ΛΗΨΗ ΦΙΛΤΡΩΝ
	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	//ΜΕΤΑΤΡΟΠΗ ΣΕ ΠΙΝΑΚΑ  current filter as array
	const CFAA = Object.entries(currentFilter);
	//console.log("CFAA", CFAA);

	//ΦΙΛΤΡΑΡΙΣΜΑ ΑΝΕΝΕΡΓΩΝ ΦΙΛΤΡΩΝ current filter as array filter emptry
	const CFAAFE = CFAA.filter(([key, value]) => !(value==0 || value=="" || value==null));
	console.log("CFAAFE",CFAAFE);

	//ΦΙΛΤΡΑΡΙΣΜΑ - ΦΙΛΤΡΑ ΧΡΕΩΣΕΩΝ ΜΟΝΟ current filter as array filter emptry filter charges filters
	const CFAAFEFC = CFAAFE.filter( ([key, value]) => (FILTERS.PROTOCOL.includes(key)?1:0) );
	//console.log("CFAAFEFC", CFAAFEFC);

	//ΜΕΤΑΤΡΟΠΗ ΠΙΝΑΚΑ ΣΕ ΑΝΤΙΚΕΙΜΕΝΟ
	const filteredObject = Object.fromEntries(CFAAFEFC);
	console.log("filteredObject", filteredObject);
	
	const customObject ={
		customPagingStart,
		customPagingSize,
		allRecords: true,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear()),
		searchText : document.querySelector("#tableSearchInput").value
	}

	const  completeOblect= Object.assign(filteredObject, customObject);

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

export function fillChargesTable(response, protocol = false){  
	
	//const table = document.querySelector("#chargesTableHeader");
	//table.innerHTML=
	const result = response.data;
	let tableContent="";
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
				case "aaField" : customWidth= "5%";break;
				case "fromField" : customWidth= "20%";break;
				case "subjectField" :customWidth= "20%";break;
				case "docDate" : customWidth= "10%";break;
				case "docNumber" :customWidth= "10%";break;
				case "toField" :customWidth= "10%";break;
				case "outSubjectField" : customWidth= "10%";break;
				case "outDocDate" : customWidth= "10%";break;
				case "statusField" : customWidth= "5%";break;
			}		
			if((key == "linkField") || (key=="insertDateField") || (key== "isRead") || (key== "extended")){
				continue;
			}
			if( key == "statusField"){
				switch (+value){
					case 0 : value= "Εκρ. "+(record['extended']?record['extended']:'');break;
					case 1 : value= "Προς Αρχ. "+(record['extended']?record['extended']:'');break;
					case 2 : value= "Αρχ. "+(record['extended']?record['extended']:'');break;
				}
				//console.log((record['extended']?record['extended']:''))
				//console.log(value)
			}
			tableContent +=`<span style="width:${customWidth};${key=='aaField'?'font-weight:bold;':''}"`;
			tableContent +=`" data-colname="`+key+'">'+value+"</span>"	
		}
		tableContent +="</div>"
	}
	document.querySelector("#chargesTableContent").innerHTML = tableContent;
	

	//if(!protocol){	
	for (const record of result){
		document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => openProtocolRecord(record["subjectField"], record["aaField"], record["insertDateField"], record["statusField"], event, protocol));
	}
	//}
	//else{
		//for (const record of result){
			//document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => openProtocolRecord(record["subjectField"], record["aaField"], record["insertDateField"], record["statusField"], event));
			////document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => document.querySelector('#requestProtocolAccessDialog').showModal());
		//}
	//}
	createSearch();
}

export async function openProtocolRecord(subject,record,recordDate, status, event, protocol){
	//console.log("record no ..."+record)
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
	const currentYear = (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear());
	
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
				<record-attachments data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:40%;" protocolDate="${recordDate}" protocolNo="${record}"></record-attachments>
				<record-relative data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-relative>
				<record-comment data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-comment>
				<record-history style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-history>
				<record-tags data-locked="${(status>0 || protocol===true)?1:0}" style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-tags>

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
	
	 bottomTitleDiv.innerHTML += `<span style="font-weight:bold;">${record}/${currentYear} | ${subject}</span>`;

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
		console.log("events dispatched")
		//alert(res.msg);
	}
}


async function  changeStatus(protocolNo, newStatus){
	const formdata = new FormData();
	formdata.append('protocolNo', protocolNo);
	formdata.append('newStatus', newStatus);

	const res = await runFetch("/api/changeStatus.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
		await getFilteredData();
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
	let changedRecords = await getChangedRecords(days);
	const changesContent  = document.querySelector("#changesContent");
	const changesDetailsContent  = document.querySelector("#changesDetailsContent");
	let changedRecordsMod = changedRecords.changes.map(item => {
		let elem = document.createElement('button');
		elem.setAttribute("type", "button");
		elem.setAttribute("data-protocol", item);
		elem.setAttribute("class", "isButton small");
		elem.setAttribute("style", "margin:3px;");
		elem.innerText = item;
		elem.addEventListener("click", async (e) => {
			const changesContentBtn = document.querySelectorAll("#changesContent button");
			changesContentBtn.forEach(btn => {
				btn.classList.remove("active");		
			});
			e.target.classList.add("active");
			let res = await showChangesDetails(e);
			//console.log(res.join());
			changesDetailsContent.innerHTML = res.changesAnalytics.join('<br>');
		});
		return elem;
		//return  '<button type="button" data-protocol="'+item+'" class="btn btn-warning btn-sm" style="margin:3px;">'+item+'</button>';	
	});
	//console.log(changedRecordsMod);
	changesContent.textContent = "";
	changedRecordsMod.forEach( item => {
		changesContent.appendChild(item);
	});
	const changesContentBtn = document.querySelectorAll("#changesContent button");
	changesContentBtn.forEach(btn => {
		btn.classList.remove("btn-primary");	
		btn.classList.add("btn-warning");	
	});
	
	//changesContent.innerHTML = changedRecordsMod.join('');
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