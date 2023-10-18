import {updateFilterStorage,createSearch} from "./Filter.js"
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

export let pagingStart = 0; 
export let pagingSize = 100; 

export async function getFilteredData(customPagingStart = pagingStart, customPagingSize = pagingSize){   		//εγγραφές χρεώσεων πρωτοκόλλου
	console.log("εκτέλεση λήψης χρεώσεων")
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	document.querySelector("#myNavBar").classList.add("disabledDiv");
	updateFilterStorage();

	const currentFilter = JSON.parse(localStorage.getItem("filter"));
	const currentFilterAsArray = Object.entries(currentFilter);
	const filtered = currentFilterAsArray.filter(([key, value]) => !(value==0 || value=="" || value==null));
	console.log("a");
	console.log(filtered);
	const filteredObject = Object.fromEntries(filtered);
	console.log("b");
	console.log(filteredObject);

	const customObject ={
		customPagingStart,
		customPagingSize,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	}
	const  completeOblect= Object.assign(filteredObject ,customObject);
	console.log("c");
	console.log(completeOblect);
	const urlpar = new URLSearchParams(completeOblect);
	console.log(urlpar)
	const res = await runFetch("/api/showTableData_test.php", "GET", urlpar);
	if (!res.success){
		console.log(res.msg);
		document.querySelector("#recordsSpinner").style.display = 'none';
	}
	else{
		const response = res.result;
		console.log("εκτέλεση λήψης χρεώσεων 1");
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		fillChargesTable(response);
	}
}

export async function getProtocolData(customPagingStart = pagingStart, customPagingSize = pagingSize){   		//εγγραφές χρεώσεων πρωτοκόλλου
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	document.querySelector("#myNavBar").classList.add("disabledDiv");
	updateFilterStorage();
	
	const completeOblect ={
		customPagingStart,
		customPagingSize,
		allRecords: true,
		currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())
	}
	const urlpar = new URLSearchParams(completeOblect);
	const res = await runFetch("/api/showTableData_test.php", "GET", urlpar);
	if (!res.success){
		console.log(res.msg);
		document.querySelector("#recordsSpinner").style.display = 'none';
	}
	else{
		const response = res.result;
		console.log("εκτέλεση λήψης χρεώσεων 1");
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		fillChargesTable(response, true);
		
	}
}

export function fillChargesTable(response, protocol = false){
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
	if(!protocol){
		for (const record of result){
			document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => openProtocolRecord(record["subjectField"], record["aaField"], record["insertDateField"], event));
		}
	}
	else{
		for (const record of result){
			document.querySelector('[data-record="'+record.aaField+'"]').addEventListener("click", (event) => document.querySelector('#requestProtocolAccessDialog').showModal());
		}
	}
	createSearch();
	//
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
				<record-tags style="max-height:20%;" protocolDate="${recordDate}" protocolNo="${record}"></record-tags>

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
		`<button class="btn btn-warning ektos mr-2" name="copyProtocolBtn" id="copyProtocolBtn" onclick="copyProtocol();" data-toggle="tooltip" title="Αντίγραφο Πρωτοκόλλου"><i class="far fa-copy"></i></button>&nbsp`;
	}
	if (currentRoleObject.protocolAccessLevel ==1 || currentRoleObject.accessLevel ==1){
		document.querySelector("#bottomSectionButtons").innerHTML += 
		`<button class="btn btn-info ektos mr-2" name="publishToSiteBtn" id="publishToSiteBtn" title="Αίτημα Ανάρτησης στη Σελίδα"><i class="fas fa-cloud-upload-alt"></i></button>`;
	}
	document.querySelector("#bottomSectionButtons").innerHTML += `<button class="btn btn-warning ektos mr-2" name="makeUnread" id="makeUnread" onclick="makeMessageUnread()" data-toggle="tooltip" title="Σήμανση ως μη αναγνωσμένο"><i class="fas fa-book"></i></button>`;
	document.querySelector("#bottomSectionTitle").innerHTML = `<button title=="Επεξεργασία Πρωτοκόλλου" id="editRecordBtn" class="btn btn-info"><i class="fas fa-edit"></i></button>`+'<span style="font-weight:bold;">'+record+"/"+currentYear+" | "+subject+"</span>";
	document.querySelector("#bottomSectionButtons").innerHTML +=`<button style="margin-left:20px;" class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>`;
	
	document.querySelector("#closeModalBtn").addEventListener("click", ()=> document.querySelector("#protocolRecordDialog").close());
	document.querySelector("#editRecordBtn").addEventListener("click", ()=> document.querySelector("#editRecordModal").showModal());
	document.querySelector("#publishToSiteBtn").addEventListener("click", () => publishToSite());
	document.querySelector("#copyProtocolBtn").addEventListener("click", () => copyProtocol());
}

async function publishToSite(){
	const formdata = new FormData();
	formdata.append('protocolNo',protocolNo);
	formdata.append('protocolYear',protocolYear);

	const res = await runFetch("/api/publishToSite.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
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