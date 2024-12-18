import {uploadFileTest, uploadComponents,enableFileLoadButton} from "./Upload.js";
import {createActionsTemplate,getSigRecords, getSignedRecords, fillTableWithSigned, signProviders, selectSignProvider, signAllDocuments}  from "./Records_test.js";
import getFromLocalStorage from "./LocalStorage.js";
import createFilter,{updateBtnsFromFilter, createSearch, pagingStart, pagingSize} from "./Filter.js";
import {getFilteredData, getProtocolData,openProtocolRecord, printChangedRecords} from "./ProtocolData.js";
import refreshToken,{refreshTokenTest} from "./RefreshToken.js";
import runFetch from "./CustomFetch.js";

let loginData = null;
let page = null;
export let paggingPage = 0;
export let Pages = {CHARGES : 'charges' , SIGNATURE : 'signature', SIGNED : 'signed', PROTOCOL : "protocol"};
Object.freeze(Pages);       
const adeiesBtn = '<div><a target="_blank" href="/adeies/index.php">Άδειες</a></div>';
const pwdBtn = '<button class="isButton warning" id="changePwdBtn" title="αλλαγή κωδικού"><i class="fas fa-key" id="changePwdBtnIcon"></i></button>';
const logoutBtn = '<div><button class="isButton warning" id="logoutBtn" title="αποσύνδεση"><i class="fas fa-sign-out-alt"></i></button></div>';

let interPeddingReqs = null;
let interPeddingPublishReqs = null;
let interCharges = null;
let interToSign = null;
let interSigned = null;
let timer = null;
export let abortControllers = {};
export let signals = {};


const passwordModalDiv =
`<dialog id="passwordModal" class="customDialog" style="max-width: 800px;; min-width:500px;"> 
	<div class="customDialogContentTitle">
		<span style="font-weight:bold;">Αλλαγή κωδικού πρόσβασης</span>
		<div class="topButtons" style="display:flex;gap: 7px;">
			<button id="setPwd" title="Αποθήκευση αλλαγών" type="button" class="isButton active"><i class="far fa-save"></i></button>
			<button class="isButton " name="closePasswordModalBtn" id="closePasswordModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
		</div>
	</div>
	<div class="customDialogContent" style="margin-top:10px;">
		<form id="passwordModalForm">
			<div id="passwordForm" style="display:flex; flex-direction: column; gap: 5px;">
				<div class="formRow" style="display:flex; align-items: center;">    
					<label class="formItem" for="oldPwd" style="flex-basis:300px;">Παλιός Κωδικός*</label>
					<input class="formInput" required=""  type="text"  id="oldPwd" ></input>
					<i id="showOldPassBtn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
				<div class="formRow" style="display:flex; align-items: center;">    
					<label class="formItem" for="newPwd" style="flex-basis:300px;">Νέος Κωδικός*</label>
					<input class="formInput" required=""  type="text"  id="newPwd">
					<i id="showNewPass1Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
				<div class="formRow" style="display:flex; align-items: center;">   
					<label class="formItem" for="newPwd2" style="flex-basis:300px;">Επανεισαγωγή Νέου Κωδικού*</label>
					<input class="formInput" required=""  type="text"  id="newPwd2">
					<i id="showNewPass2Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
			</div>
		</form>
	</div>
</dialog>`;

const addProtocolModal = 
	`<dialog id="addProtocolRequestDialog" style="min-width:60%;max-width:80%;">
		<record-request "></record-request>
	</dialog>`;

const requestProtocolAccessModal = 
	`<dialog id="requestProtocolAccessDialog" style="min-width:60%;max-width:80%;">
		<record-request-access></record-request-access>
	</dialog>`;

const fileOpenModal = 
	`<dialog id="fileOpenDialog">
	</dialog>`;

const fileMoveModal = 
	`<dialog id="fileMoveDialog" style="width:30%;">
	</dialog>`;

const loadingModal = 
	`<dialog id="loadingDialog">
		<div class="spinner-border" role="status">
			<span class="visually-hidden">Loading...</span>
		</div>
	</dialog>`;

const navBarDiv = `<nav id="myNavBar">
	<div  id="prosIpografi" ><a>Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a>Διεκπεραιωμένα</a></div>
		
	<div id="xreoseis"><a><span id="protocolAppText">Χρεώσεις</span></a></div>	
	<div id="protocolBookBtn"><a>Πρωτόκολλο</a></div>
	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->
	<!--<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>-->
	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
	</nav><!-- /.container-fluid -->`;



const signTable = `<table id="dataToSignTable" class="table" style="font-size:0.9em;">
	<thead>
	<tr>
		<th id="filename" class="text-right">Έγγραφο</th>
		<th id="date" class="text-right">Αρ.Πρωτ.-Εισαγωγή</th>
		<th id="author" class="text-right">Συντάκτης</th>
		<th id="status" class="text-right">Κατάσταση</th>
		<th id="fileActions" class="text-right">
			<div style="display:flex; justify-content: space-between;">
				<span>Ενέργειες</span>
				<button id="signAllModalBtn" class="isButton" style="color:green; background-color: white;" title="Μαζική υπογραφή"><i class="fas fa-tags"></i></button>
			</div>
		</th>
	</tr>
	</thead>
	<tbody>

	</tbody>
	</table>`;

const chargesTable = `<div id="chargesTable" style="font-size:0.9em;">
						<div id="chargesTableHeader">
							<div class="flexHorizontal" style="background: linear-gradient(90deg, white, lightgray);font-weight: bold;">
								<span id="chargesTableAA"  style="width:5%;text-align:center;cursor: pointer;" data-filter="aaField"">AA<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:20%; text-align:center;cursor: pointer;" id="chargesTableApostoleas" data-filter="fromField">Αποστολέας<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:20%;text-align:center;cursor: pointer;" id="chargesTableThema" data-filter="subjectField">Θέμα<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%text-align:center;cursor: pointer;" id="chargesTableImParal" data-filter="docDate">Ημ.Παραλ.<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTableArEiserx" data-filter="docNumber">Αρ.Εισερχ.<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTablePros" data-filter="toField">Προς<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTableThemaEkserx" data-filter="toField"outSubjectField">Θέμα Εξερχ.<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTableImEkserx" data-filter="outDocDate">Ημ.Εξερχ.<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:5%;text-align:center;cursor: pointer;" id="chargesTableKatast" data-filter="statusField">Κατάστ.<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTableFolders" >Φάκελοι<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
								<span style="width:10%;text-align:center;cursor: pointer;" id="chargesTableUsers" >Χρέωση<i style="display:none; margin-left:5px;" class="fas fa-chevron-circle-up"></i></span>
							</div>
						</div>
						<div id="chargesTableContent" class="flexVertical" style="background-color:white;margin-top:2em;overflow-y:scroll; max-height: 60vh; gap:10px;">
						</div>
					</div>`;

const protocolRecordModal = 
	`<dialog id="protocolRecordDialog">
	</dialog>`;


export function getPage(){
	return page;
}

function generateHash(length) {
	const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = ' ';
	const charactersLength = characters.length;
	for ( let i = 0; i < length; i++ ) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	result = "#"+result;	
	return result;
}

async function getProtocolYears(){
	const res = await runFetch("/api/getProtocolYears.php", "GET", null);
	if (!res.success){
		console.log(res.msg);
		return false;
	}
	else{
		return  res.result;
	}
}

function getRoles(){
	let loginData = localStorage.getItem("loginData");
	let cRole = null;
	if (loginData === null){
		alert("Δεν υπάρχουν στοιχεία χρήστη");
		return;
	}
	else{
		loginData = JSON.parse(loginData);
		cRole = localStorage.getItem("currentRole");
		const roles = loginData.user.roles;
		return {currentRole : cRole, roles};
	}
}



export  function startUp(){
	
	window.location.hash = generateHash(8);
	window.addEventListener("storage", async (event) => {
		console.log("storage changed");
		const changeUrl = new URL(event.url);
		if (changeUrl.hash != location.hash){
			//console.log(event.key, changeUrl.hash);
			if (event.key === "currentYear"){
				if (document.querySelector("year-selector")){
					document.querySelector("year-selector").setAttribute("year", event.newValue);
				}
			}
			if (event.key === "currentRole"){
				if (document.querySelector("role-selector")){
					document.querySelector("role-selector").setAttribute("role", event.newValue);
				}
			}
		}
		else{
			console.log("storage changed from this tab");
			if (event.key === "currentYear"){
				console.log("currentYear changed from storage data")
				//Έλεγχος αν το έτος είναι στα διαθέσιμα της βάσης
				const protocolYearsRes = await getProtocolYears();
				if (protocolYearsRes == false){
					//Σφάλμα λήψης διαθέσιμων ετών
					console.log("fetch error")
					localStorage.setItem("currentYear", event.oldValue);
					return;
				}
				const protocolYears = protocolYearsRes.result;
				if (protocolYears.includes(event.newValue)){
					console.log("year is included in database years table")
					if (document.querySelector("year-selector")){
						document.querySelector("year-selector").setAttribute("year", event.newValue);
					}
				}
				else {
					//Το έτος δεν ανήκει στα διαθέσιμα
					console.log("resetting year")
					localStorage.setItem("currentYear", event.oldValue);
					return;
				}
			}
			if (event.key === "currentRole"){
				console.log("currentRole changed from storage data")
				//Έλεγχος αν το έτος είναι στα διαθέσιμα της βάσης
				const {currentRole, roles} =  getRoles();
				console.log(roles)
				if ( (event.newValue >=0) && (event.newValue <= (roles.length-1))){
					console.log("role is included in database roles")
					if (document.querySelector("role-selector")){
						document.querySelector("role-selector").setAttribute("role", event.newValue);
					}
				}
				else {
					//Το έτος δεν ανήκει στα διαθέσιμα
					console.log("resetting role")
					localStorage.setItem("currentRole", event.oldValue);
					return;
				}
			}
		}
	});

	
	//console.log("common page code executing...");
	if (document.querySelector("#myNavBar")!==null){
		document.querySelector("#myNavBar").remove();
	}
	if (document.querySelector("#headmasterExtraMenuDiv")!==null){
		document.querySelector("#headmasterExtraMenuDiv").remove();
	}
	if (document.querySelector("#uploadBtn")!==null){
		document.querySelector("#uploadBtn").remove();
	}
	if (document.querySelector("#uploadModal")!==null){
		document.querySelector("#uploadModal").remove();
	}
	if (document.querySelector("#passwordModal") !== null){
		document.querySelector("#passwordModal").remove();
	}
	if (document.querySelector("#fileOpenDialog") !== null){
		document.querySelector("#fileOpenDialog").remove();
	}

	document.body.insertAdjacentHTML("beforeend", fileOpenModal);
	document.body.insertAdjacentHTML("beforeend", fileMoveModal);
	document.body.insertAdjacentHTML("beforeend", addProtocolModal);
	document.body.insertAdjacentHTML("beforeend", requestProtocolAccessModal);
	
	if (document.querySelector("#loadingDialog")){
		document.querySelector("#loadingDialog").remove();
	}
	document.body.insertAdjacentHTML("beforeend",loadingModal);

	const uploadModal = `<dialog id="uploadModal" class="customDialog"></dialog>`;
	document.body.insertAdjacentHTML("afterbegin",uploadModal);
	//console.log("upload added");

	document.body.insertAdjacentHTML("afterbegin",navBarDiv);
	document.body.insertAdjacentHTML("beforeend",passwordModalDiv);

	document.querySelector("#prosIpografi>a").addEventListener("click",()=>{
		if(!document.startViewTransition){
			createUIstartUp();
		}
		else{
			document.startViewTransition(()=>{
				createUIstartUp();
			})
		}
	});
	document.querySelector("#ipogegrammena>a").addEventListener("click",()=>{
		if(!document.startViewTransition){
			createSignedUIstartUp();
		}
		else{
			document.startViewTransition(()=>{
				createSignedUIstartUp();
			})
		}
	});	
	document.querySelector("#xreoseis>a").addEventListener("click",()=>{
		if(!document.startViewTransition){
			createChargesUIstartUp();
		}
		else{
			document.startViewTransition(()=>{
				createChargesUIstartUp();
			})
		}	
	});	
	document.querySelector("#protocolBookBtn>a").addEventListener("click",()=>{
		if(!document.startViewTransition){
			createProtocolUIstartUp();
		}
		else{
			document.startViewTransition(()=>{
				createProtocolUIstartUp();
			})
		}
	});		

	createUIstartUp();
}

function pagesCommonCode(){
	loginData = localStorage.getItem("loginData");
	let cRole = null;
	if (loginData === null){
		logout();
	}
	else{
		loginData = JSON.parse(loginData);
		//Πρόσβαση στο Πρωτόκολλο λεκτικό
		cRole = localStorage.getItem("currentRole");
	}
	
	//--------- Μεταφέρθηκαν στο starτUp()

	const extraMenuDiv = 	`<div id="headmasterExtraMenuDiv">
								<button id="syncRecords" title="Ανανέωση εγγραφών" type="button" class="isButton primary"><i class="fas fa-sync"></i></button>
								<div class="flexVertical" id="uploadBtnDiv"></div>
								<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->
								<div id="outerFilterDiv" class="flexHorizontal smallPadding" style="align-items: flex-start;">
									<div id="generalFilterDiv" class="flexHorizontal ">
										<input id="tableSearchInput" autocomplete="off" type="text" placeholder="Αναζήτηση" >
										<button data-active="0" class="isButton extraSmall dismiss" id="showEmployeesBtn">Προσωπικά</button>
										<button data-active="0" class="isButton extraSmall dismiss" id="showToSignOnlyBtn">Πορεία Εγγρ.</button>
									</div>
								</div>
								<div id="recentProtocolsDiv"></div>
							</div>
							<div id="filterDownDiv" class="flexHorizontal" style="background-color:#f3ecec; justify-content: center; align-items:center; gap:15px;" ></div>`;

	if (document.body.querySelector("#headmasterExtraMenuDiv")){
		document.body.querySelector("#headmasterExtraMenuDiv").remove();
	}
	if (document.body.querySelector("#filterDownDiv") !== null){
		document.body.querySelector("#filterDownDiv").remove();
	}

	document.querySelector("#myNavBar").insertAdjacentHTML("afterend",extraMenuDiv);


	if (document.querySelector("#chargesTable")!==null){
		document.querySelector("#chargesTable").remove();
	}
	if (document.querySelector("#protocolRecordDialog")!==null){
		document.querySelector("#protocolRecordDialog").remove();
	}
	if (document.querySelector("#dataToSignTable")!==null){
		document.querySelector("#dataToSignTable").remove();
	}
	if(document.querySelector("#pageSelectorDiv")){
		document.querySelector("#pageSelectorDiv").remove();	
	}

	switch (page){
		case Pages.SIGNATURE :
			document.body.insertAdjacentHTML("beforeend",signTable);
			document.querySelector("#ipogegrammena>a").classList.remove("active");
			document.querySelector("#xreoseis>a").classList.remove("active");
			document.querySelector("#protocolBookBtn>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.add("active");
			break;
		case Pages.SIGNED :
			document.body.insertAdjacentHTML("beforeend",signTable);
			document.querySelector("#ipogegrammena>a").classList.add("active");
			document.querySelector("#xreoseis>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.remove("active");
			document.querySelector("#protocolBookBtn>a").classList.remove("active");
			break;
		case Pages.CHARGES :
			document.body.insertAdjacentHTML("beforeend",chargesTable);
			document.body.insertAdjacentHTML("beforeend",protocolRecordModal);
			document.querySelector("#ipogegrammena>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.remove("active");
			document.querySelector("#protocolBookBtn>a").classList.remove("active");
			document.querySelector("#xreoseis>a").classList.add("active");
			break;
		case Pages.PROTOCOL :
			document.body.insertAdjacentHTML("beforeend",chargesTable);
			document.body.insertAdjacentHTML("beforeend",protocolRecordModal);
			document.querySelector("#ipogegrammena>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.remove("active");
			document.querySelector("#xreoseis>a").classList.remove("active");
			document.querySelector("#protocolBookBtn>a").classList.add("active");	
		break;
		default :
			alert("Σελίδα μη διαθέσιμη");
			return;
	}

	//Πρόσβαση στο Πρωτόκολλο λεκτικό
	
	if (cRole !== null){
		if (+loginData.user.roles[cRole].protocolAccessLevel){
			document.querySelector("#protocolAppText").textContent = "Διαχειριστής";
		}
		else{
			document.querySelector("#protocolAppText").textContent = "Χρεώσεις";
		}
	}
	else{
		alert("Δεν υπάρχουν στοιχεία ιδιότητας χρήστη");	
	}

	//Πρόσβαση στο Παρουσιολόγιο
	//if (+loginData.user.roles[cRole].privilege){
		//const adeiesBtn = '<div><a target="_blank" href="/adeies/index.php">Άδειες</a></div>';
		//document.querySelector("#protocolBookBtn").insertAdjacentHTML("afterend",adeiesBtn);
	//}

	//const basicBtns ='<li><a class="dropdown-item" id="changePwdBtn">Αλλαγή Κωδικού</a></li>';
	//document.querySelector("#userRoles").innerHTML = basicBtns;
	document.querySelector("#myNavBarLogoContent").innerHTML = loginData.user.user;
	document.querySelector("#myNavBarLogoContent").innerHTML += pwdBtn;
	document.querySelector("#myNavBarLogoContent").innerHTML += logoutBtn;

	if (document.querySelector("#roleSelectorDiv") == null ){
		document.querySelector("#uploadBtnDiv").insertAdjacentHTML("afterend",`<role-selector id="roleSelectorDiv"></role-selector>`);
	}

	document.querySelector("#roleSelectorDiv").addEventListener("roleChangeEvent", async ()=>{
		let debounceFunc = debounce( async () =>  {
			const res = await roleChanged();  // το await αφορά μόνο το SESSION
		});
		debounceFunc();
	})

	document.querySelector("#logoutBtn").addEventListener("click",logout);	
	document.querySelector("#changePwdBtn").addEventListener("click",()=>{
		document.querySelector("#passwordModal").showModal();
	});	
	document.querySelector("#closePasswordModalBtn").addEventListener("click",()=>{
		document.querySelector("#passwordModal").close();
	});	

	document.querySelector("#showOldPassBtn").addEventListener("click", ()=>showPass('oldPwd'));
	document.querySelector("#showNewPass1Btn").addEventListener("click", ()=>showPass('newPwd'));
	document.querySelector("#showNewPass2Btn").addEventListener("click",()=>showPass('newPwd2'));

	document.querySelector("#setPwd").addEventListener("click",changePassword);	


	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		if (document.querySelector('#showEmployeesBtn')){
			document.querySelector('#showEmployeesBtn').addEventListener("click", createSearch);
		}
		if (document.querySelector('#showToSignOnlyBtn')){
			document.querySelector('#showToSignOnlyBtn').addEventListener("click", createSearch);
		}
	}

	document.querySelector("#filterDownDiv").innerHTML = "";
	

	document.querySelector("#syncRecords").addEventListener("click", async ()=>  { 
		let res = null;
		switch (getPage()){
			
			case Pages.SIGNATURE :
				res = await getToSignRecordsAndFill();
				break;
			case Pages.SIGNED :
				res = await getSignedRecordsAndFill();
				break;
			case Pages.CHARGES :
				res = await getChargesAndFill();
				document.querySelector("#syncRecords>i").classList.remove('faa-circle');
				break;
			case Pages.PROTOCOL :
				res = await getProtocolAndFill();
				//console.log(res)
				document.querySelector("#syncRecords>i").classList.remove('faa-circle');
				break;
			default :
				alert("Σελίδα μη διαθέσιμη");
				document.querySelector("#syncRecords>i").classList.remove('faa-circle');
				break;
		}
	})

	if (interPeddingPublishReqs !== null){
		clearInterval(interPeddingPublishReqs);
	}	
	paggingPage = 0;

}

function removeIntervals(){
	if (interPeddingReqs !==null) {
		clearInterval(interPeddingReqs);
	}
	if (interCharges !==null) {
		clearInterval(interCharges);
	}
	if (interToSign !==null) {
		clearInterval(interToSign);
	}
	if (interSigned !==null) {
		clearInterval(interSigned);
	}
	if (interPeddingPublishReqs !==null) {
		clearInterval(interSigned);
	}
}


async function createChargesUIstartUp(){
	removeIntervals();
//	console.log("charges");
	page = Pages.CHARGES;
	pagesCommonCode();
	document.querySelector('#showEmployeesBtn').style.display = "none"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "none"; 
	let cRole = localStorage.getItem("currentRole");
	
	const yearSelector = `<year-selector id="yearSelectorDiv"></year-selector>`;
		

	const protocolExtraBtns = 
		`<div id="topMenuNewProtocolBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch;padding: 5px;">	
			${
				+loginData.user.roles[cRole].protocolAccessLevel==1?
				`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Νέα Πρωτόκολλα</div>
				<div class="flexHorizontal" style="padding:0px 5px;">
					<div><button id="addProtocolBtn" title="Νέο πρωτόκολλο" class="isButton extraSmall primary" > <i class="fas fa-plus-square"></i></button></div>
					<div><button class="isButton extraSmall" style="background-color: var(--bs-red);"> 
						<span id="peddingRequestsNo" name="peddingRequestsNo" style="background-color:red; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span></button>
					</div>
					<div>
						<button id="refreshPeddingReqsBtn" title="Ανανέωση Αιτημάτων" type="button" class="isButton extraSmall"><i class="fas fa-sync"></i></button>
					</div>
				</div>`:
				`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Νέα Πρωτόκολλα</div>
				<div class="flexHorizontal" style="padding:0px 5px;">
					<button id="reqProtocolBtn" name="reqProtocolBtn" class="isButton extraSmall" title="Aίτηση νέου πρωτοκόλλου" style="background-color:lightseagreen"><i class="fas fa-phone-volume"></i></button>
					<div><button class="isButton extraSmall" style="background-color: var(--bs-red);"> 
						<span id="peddingRequestsNo" name="peddingRequestsNo" style="background-color:red; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span></button>
					</div>
				</div>`
			}
		</div>

		
			${
				+loginData.user.roles[cRole].protocolAccessLevel==1?
				`<div id="topMenuNewAccessBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch; padding: 5px;">
					<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Αιτήματα Πρόσβασης</div>
						<div class="flexHorizontal" style="padding:0px 5px;">
							<button class="isButton extraSmall" style="background-color: var(--bs-orange);"> 
								<span id="peddingAccessRequestsNo" name="peddingAccessRequestsNo" style="background-color:orange; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span>
							</button>
							<div>
								<button id="refreshPeddingAccessReqsBtn" title="Ανανέωση Αιτημάτων Πρόσβασης" type="button" class="isButton extraSmall"><i class="fas fa-sync"></i></button>
							</div>
					</div>
				</div>`:
				`<div id="topMenuNewAccessBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch; padding: 5px;">
					<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Αίτημα Πρόσβασης</div>
						<div class="flexHorizontal" style="padding:0px 5px;">
						<button id="reqProtocolAccessBtn" name="reqProtocolAccessBtn" class="isButton small" title="Aίτηση πρόσβασης" style="background-color:lightseagreen"><i class="fas fa-eye"></i></button>
						<div>
							<button class="isButton small" style="background-color: var(--bs-orange);"> 
								<span id="peddingAccessRequestsNo" name="peddingAccessRequestsNo" style="background-color:orange; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span>
							</button>
						</div>	
					</div>
				</div>`
			}

			${
				+loginData.user.roles[cRole].protocolAccessLevel==1?
				`<div id="topMenuCopyRecsBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch; padding: 5px;">
					<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Μεταφορές</div>
						<div class="flexHorizontal" style="padding:0px 5px;">
							<button id="openCopyChargesDialog" class="isButton primary extraSmall"> 
								<i class="fas fa-copy"></i>
							</button>
							<div>
								<button id="copyHistoryBtn" title="Ιστορικό μεταφορών" type="button" class="isButton extraSmall"><i class="fas fa-list"></i></button>
							</div>
					</div>
				</div>`:``
			}

			
			${
				+loginData.user.roles[cRole].canPublish==1? // Είναι χρήστης με δικαίωμα ανάρτησης
				`<div id="topMenuPublishBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch;padding: 5px;">	
					<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Ανάρτηση</div>
					<div class="flexHorizontal" style="padding:0px 5px;">
						<div>
							<button class="isButton small" style="background-color: var(--bs-orange);"> 
								<span id="peddingPublishRequestsNo" name="peddingPublishRequestsNo" style="background-color:orange; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span>
							</button>
						</div>
						
					</div>
				</div>
				`
				:``
			}

		
			${
				+loginData.user.roles[cRole].protocolAccessLevel==1?
			`<div id="topMenuAdminBtnsDiv" class="flexVertical" style="align-items: center;align-self: stretch;padding: 5px;">	
				<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Άλλες εφαρμογές</div>
				<div class="flexHorizontal">
					<div><a rel="opener"  title="Άνοιγμα αλληλογραφίας" rel="referer" target="_blank" href="/mail/mich_login.html"><span style="font-weight: bold;
						border-radius: 5px; border-style: solid; 
						border-width: 1px;padding: 2px 6px;color: white; background-color:lightseagreen;border-color:lightseagreen;"><i style="color:white" class="fas fa-mail-bulk  fa-lg"></i></span></a>
					</div>
					<div><a rel="opener"  title="Εφαρμογή ΚΣΗΔΕ" rel="referer" target="_blank" href="/kside/"><span style="font-size: 0.7rem;font-weight: bold;
															border-radius: 5px; border-style: solid; 
															border-width: 1px;padding: 0px 2px;color: white; background-color:lightseagreen;border-color:lightseagreen;">ΚΣΗΔΕ</span></a>
					</div>
				</div>
			</div>`:``
			}
		`;

	const addRecordDialog =
		`<dialog id="addRecordModal" class="customDialog" style="max-width: 90%; min-width: 800px;">
			<record-add  style="display:flex; flex-direction:column; gap: 10px;"></record-add>
    	</dialog>`;

	const chargesFilterMenuDiv = 
	`<div id="chargesFilterMenu" class="flexVertical ">
		<div id="topSettingsDiv" class="flexHorizontal" >	
			<div id="globalSearchBtnDiv" >
				<button class="isButton extraSmall primary" name="globalSearchBtn" id="globalSearchBtn" data-toggle="tooltip" title="Αναζήτηση στο σύνολο των εγγραφών">
					<i class="fas fa-globe-europe"></i>
				</button>
			</div>
			<div id="recordChangesBtnDiv" >
				<button class="isButton extraSmall primary" type="button" id="openChangesBtn" data-toggle="tooltip" title="Αλλαγές σε πρωτόκολλα">
					<i class="fas fa-info"></i>
				</button>
				<div style="position:absolute;"></div>
			</div>
			${
				+loginData.user.roles[cRole].protocolAccessLevel?
					``:
					`<div id="removeNotificationsBtnDiv" >
						<button class="isButton extraSmall primary" name="removeNotifications" id="removeNotifications" data-toggle="tooltip" title="" data-original-title="Αποχρέωση Κοινοποιήσεων">
							<i class="fab fa-stack-overflow"></i>
						</button>
					</div>`}

		</div>
	</div>`;

	const changesFilterDiv= `<dialog id="changesDiv" class="customModal" style="width: 600px; margin-top: 50px;">
								<div id="changesTitle" class="customDialogContentTitle" style="align-items: center;">
									<div>Πληροφορίες</div>
									<div class="topButtons" style="display:flex;gap: 7px; align-items: center;">
										<div id="changesDatesDiv" style="display: inline-flex; gap: 10px;"> 
											<button type="button" data-days="0" class="isButton  small">Συμβάντα</button>
											<div style="background-color: bisque; padding:5px;">
												<span>Αλλαγές Χρεώσεων:</span>
												<button type="button" data-days="1" class="isButton  small">1ημ.</button>
												<button type="button" data-days="7" class="isButton  small">7ημ.</button>
												<button type="button" data-days="30" class="isButton  small">30ημ.</button>
											</div>
										</div>
										<div id="changesCloseButtonDiv">
											<button id="changesCloseButton" type="button"  class="btn btn-danger btn-sm"><i class="far fa-times-circle"></i></button>
										</div>
									</div>
								</div>
								<div id="changesContent" style="margin-top:50px;"></div>
								<div id="changesDetailsContent" style="margin-top: 20px;"></div>
							</dialog>`;

	const peddingRequestsDiv= `<dialog id="peddingRequestsModal" class="customModal" style="min-width:80%;">
			<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white;">
				<span style="font-weight:bold;">Αιτήματα πρωτοκόλλου</span>
				<div class="topButtons" style="display:flex;gap: 7px;">
					<button class="isButton " name="peddingReqsCloseBtn" id="peddingReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
				</div>
			</div>
			<div id="peddingReqsRecords" style="display:grid;gap:10px; grid-template-columns:repeat(7, 1fr);align-items:center; justify-items: center; font-size: 0.85em;"></div>
		</dialog>`;

	
	const peddingPublishRequestsDiv= `<dialog id="peddingPublishRequestsModal" class="customModal" style="min-width:80%;">
		<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white; ">
			<span style="font-weight:bold;">Αιτήματα ανάρτησης</span>
			<div class="topButtons" style="display:flex;gap: 7px;">
				<button class="isButton " name="peddingPublishReqsCloseBtn" id="peddingPublishReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
			</div>
		</div>
		<div id="peddingPublishReqsRecords" style="display:grid;gap:10px; grid-template-columns:repeat(5, 1fr);align-items:center; justify-items: center; font-size: 0.85em;"></div>
	</dialog>`;

	const peddingAccessRequestsDiv= `<dialog id="peddingAccessRequestsModal" class="customModal" style="width: 80%;">
		<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white;">
			<span style="font-weight:bold;">Αιτήματα πρόσβασης</span>
			<div class="topButtons" style="display:flex;gap: 7px;">
				<button class="isButton " name="peddingAccessReqsCloseBtn" id="peddingAccessReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
			</div>
		</div>
		<div id="peddingAccessReqsRecords" style="display:grid;gap:10px; grid-template-columns: 2fr 1fr 1fr 1fr 2fr 2fr 3fr;align-items:center; justify-items: center; font-size: 0.85em;"></div>
	</dialog>`;

	const copyChargesDiv= `<dialog id="copyChargesModal" class="customDialog" style="max-width: 80%; min-width: 50%;">
		<charges-move  style="display:flex; flex-direction:column; gap: 10px;"></charges-move>
	</dialog>`;

	const filterDownDiv = `<div id="filterDownDiv"></div>`;

	document.body.insertAdjacentHTML("afterend",peddingPublishRequestsDiv);
	document.body.insertAdjacentHTML("afterend",peddingAccessRequestsDiv);
	document.body.insertAdjacentHTML("afterend",copyChargesDiv);
	document.body.insertAdjacentHTML("afterend",changesFilterDiv);
	document.body.insertAdjacentHTML("afterend",peddingRequestsDiv);
	document.body.insertAdjacentHTML("afterend",addRecordDialog);


	//if (document.querySelector("#headmasterExtraMenuDiv") !== null){
		//document.querySelector("#headmasterExtraMenuDiv").insertAdjacentHTML("afterend",filterDownDiv);
	//}


	if (document.querySelector("#roleSelectorDiv") !== null){
		document.querySelector("#roleSelectorDiv").insertAdjacentHTML("afterend",yearSelector);
	}

	if (document.querySelector("#topMenuNewProtocolBtnsDiv") == null){
		document.querySelector("#headmasterExtraMenuDiv").insertAdjacentHTML("beforeend",protocolExtraBtns);
	}

	if (document.querySelector("#chargesFilterMenu") == null){
		document.querySelector("#generalFilterDiv").insertAdjacentHTML("afterend",chargesFilterMenuDiv);	
	}

	document.querySelectorAll("#chargesTableHeader>div>span>i").forEach( item =>{
		item.style.display = "none";
	})


	// -------------------- ΕΤΙΚΕΤΕΣ --------------------------------------------------------------
	await createHashDatalist();

	document.querySelector('#tableSearchInput').addEventListener("keyup", async ()=>{
		if (  document.querySelector('#tableSearchInput').value.substring(0,1) === "#"){
			document.querySelector('#tableSearchInput').setAttribute("list","hashDataListId");
			document.querySelector('#tableSearchInput').focus();
			document.querySelector('#tableSearchInput').style.color = "darkcyan";
		}
		else{
			document.querySelector('#tableSearchInput').setAttribute("list",null);
			document.querySelector('#tableSearchInput').style.color = "black";
		}
		if(+localStorage.getItem("globalSearch") === 1){
			let debounceFunc = debounce( async () =>  {
				const chargesRes = await getChargesAndFill(); 
			});
			debounceFunc();
		}
		// else{
		// 	createSearch();
		// }
		createSearch();
	});
	// -------------------- /ΕΤΙΚΕΤΕΣ --------------------------------------------------------------	

	if(document.querySelector("#reqProtocolAccessBtn")){
		document.querySelector("#reqProtocolAccessBtn").addEventListener("click", ()=>{
			document.querySelector("#requestProtocolAccessDialog").showModal();
		})
	}

	if (document.querySelector('#reqProtocolBtn')){
		document.querySelector('#reqProtocolBtn').addEventListener("click", ()=>{
			document.querySelector("record-request").setAttribute("timestamp",Date.now());
			document.querySelector('#addProtocolRequestDialog').showModal();
		});
	}

	if (document.querySelector("record-add")){
		document.querySelector("record-add").addEventListener("RefreshProtocolFilesEvent", async ()=>{
			const chargesRes = await getChargesAndFill(); 
		})
	}
	
	if (document.querySelector('#addProtocolBtn')){
		document.querySelector('#addProtocolBtn').addEventListener("click", ()=>{
			document.querySelector("record-add").setAttribute("timestamp", Date.now());
			document.querySelector('#addRecordModal').showModal();
		});
	}

	if (document.querySelector('#peddingRequestsNo')){
		document.querySelector('#peddingRequestsNo').parentElement.addEventListener("click", ()=>{
			document.querySelector('#peddingRequestsModal').showModal();
		});
		document.querySelector('#peddingReqsCloseBtn').addEventListener("click", ()=>{
			document.querySelector('#peddingRequestsModal').close();
		});
		if (+loginData.user.roles[cRole].protocolAccessLevel === 1){
			document.querySelector('#refreshPeddingReqsBtn').addEventListener("click", ()=>{
				{
					getPeddingProtocolReqs();
				}	
			});
			document.querySelector('#refreshPeddingAccessReqsBtn').addEventListener("click", ()=>{
				{
					getPeddingAccessProtocolReqs();
				}	
			});
		}
	}

	if (document.querySelector('#peddingPublishRequestsNo')){
		document.querySelector('#peddingPublishRequestsNo').parentElement.addEventListener("click", ()=>{
			document.querySelector('#peddingPublishRequestsModal').showModal();
		});
		document.querySelector('#peddingPublishReqsCloseBtn').addEventListener("click", ()=>{
			document.querySelector('#peddingPublishRequestsModal').close();
		});
	}

	await createFilter(document.querySelector("#filterDownDiv"));
	updateBtnsFromFilter();

	const lsGlobalSearchValue = localStorage.getItem("globalSearch");
	if (lsGlobalSearchValue === null){
		localStorage.setItem("globalSearch",1);
	}

	if (+localStorage.getItem("globalSearch")){
		document.querySelector("#globalSearchBtn").classList.remove("primary");
		document.querySelector("#globalSearchBtn").classList.add("active");
	}
	else{
		document.querySelector("#globalSearchBtn").classList.remove("active");
		document.querySelector("#globalSearchBtn").classList.add("primary");
	}

	//---------------------------------------------------------------------------------Αλλαγές σε πρωτόκολλα ---------------------------------------------------------------------
	
	const changesButton  = document.querySelector("#openChangesBtn");
	//const filterButton  = document.querySelector("#openFilterBtn");
	const changesCloseButton  = document.querySelector("#changesCloseButton");
	const filterCloseButton  = document.querySelector("#filterCloseButton");
	const changesDatesBtns = document.querySelectorAll("#changesDatesDiv button");
	const globalSearchBtn  = document.querySelector("#globalSearchBtn");

	changesButton.addEventListener("click", () => {
		const changesDiv  = document.querySelector("#changesDiv").showModal();
	});


	const removeNotificationsButton  = document.querySelector("#removeNotifications");
	if (removeNotificationsButton){
		removeNotificationsButton.addEventListener("click", () => removeNotifications());
	}

	changesCloseButton.addEventListener("click", () => {
		const changesDiv  = document.querySelector("#changesDiv").close();
	});

	// filterCloseButton.addEventListener("click", () => {
	// 	const filterDiv  = document.querySelector("#filterDiv").close();
	// });

	globalSearchBtn.addEventListener("click", ()=>{
		const lsGlobalSearchValue = localStorage.getItem("globalSearch");
		if(lsGlobalSearchValue === null || lsGlobalSearchValue>1 || lsGlobalSearchValue<0){
			localStorage.setItem("globalSearch", 1);
		}
		else{
			localStorage.setItem("globalSearch", 1-(+lsGlobalSearchValue));
		}
		if (+localStorage.getItem("globalSearch") === 1){
			document.querySelector("#globalSearchBtn").classList.remove("primary");
			document.querySelector("#globalSearchBtn").classList.add("active");
		}
		else{
			document.querySelector("#globalSearchBtn").classList.remove("active");
			document.querySelector("#globalSearchBtn").classList.add("primary");
		}
	})

	changesDatesBtns.forEach(item => { 
		item.addEventListener("click", () => {
			changesDatesBtns.forEach(btn => {
				btn.classList.remove("active");	
			});
			item.classList.add("active");
			//console.log(item.dataset.dates);
			//console.log("Type :", typeof item.dataset.dates);
			printChangedRecords(+ item.dataset.days); 
		})
	});

	//!!!!-----------------------------------------------------------------------------Αλλαγές σε πρωτόκολλα ---------------------------------------------------------------------

	if (document.querySelector("#yearSelectorDiv")){
		document.querySelector("#yearSelectorDiv").addEventListener("yearChangeEvent", async ()=>{
			let debounceFunc = debounce( async () =>  {
				const chargesRes = await getChargesAndFill(); 
			});
			debounceFunc();
		})
	}

	const peddingReqs = await getPeddingProtocolReqs();

	interPeddingReqs = setInterval(async ()=>{
		const peddingReqs = await getPeddingProtocolReqs();
	},25000)


	if (document.querySelector("#peddingPublishRequestsNo")){
		interPeddingPublishReqs = setInterval(async ()=>{
			const peddingReqs = await getPeddingPublishReqs();
		},60000)
	}
	
	document.querySelectorAll("#chargesTableHeader>div>span").forEach( spanItem =>{
		spanItem.addEventListener("click", async event =>{
			if (event.target.id == "" ){
				return;
			}
			document.querySelectorAll("#chargesTableHeader>div>span>i").forEach( item =>{
				item.style.display = "none";
			})
			//console.log(event.target.dataset.filter);
			document.querySelector("#"+event.target.id+">i").style.display = "inline-block";
			if (document.querySelector("#"+event.target.id+">i").style.rotate == "180deg"){
				document.querySelector("#"+event.target.id+">i").style.rotate = "0deg";
			}
			else{
				document.querySelector("#"+event.target.id+">i").style.rotate = "180deg";
			}
			await getChargesAndFill(event.target.dataset.filter, document.querySelector("#"+event.target.id+">i").style.rotate=="0deg"?"asc":"desc"); 
		})
	})

	const chargesRes = await getChargesAndFill(); 
	//interCharges = setInterval(async ()=>{
		//const chargesRes = await getChargesAndFill(); 
	//},60000)

	if (document.querySelector('#peddingAccessRequestsNo')){
		document.querySelector('#peddingAccessRequestsNo').parentElement.addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').showModal();
		});
		document.querySelector('#peddingAccessReqsCloseBtn').addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').close();
		});
	}

	if (document.querySelector('#openCopyChargesDialog')){
		document.querySelector('#openCopyChargesDialog').addEventListener("click", ()=>{
			document.querySelector("charges-move").setAttribute("timestamp", Date.now());
			document.querySelector('#copyChargesModal').showModal();
		});
	}

	document.querySelector("record-request-access").addEventListener("RefreshAccessToProtocol", async ()=>{
		//console.log("catch event")
		await getPeddingAccessProtocolReqs();
	})

	document.querySelector("record-request").addEventListener("RefreshRequestProtocol", async ()=>{
		console.log("catch event new protocol")
		await getPeddingProtocolReqs();
	})

	//if (+loginData.user.roles[cRole].protocolAccessLevel === 1){
		const peddingAccessReqs = await getPeddingAccessProtocolReqs();
	//}

	if (+loginData.user.roles[cRole].canPublish === 1){ // Είναι χρήστης με δικαίωμα ανάρτησης
		const peddingPublishReqs = await getPeddingPublishReqs();
	}
}



async function createProtocolUIstartUp(){
	removeIntervals();
	//console.log("protocol");
	page = Pages.PROTOCOL;
	pagesCommonCode();
	document.querySelector('#showEmployeesBtn').style.display = "none"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "none"; 
	let cRole = localStorage.getItem("currentRole");
	
	document.querySelector("role-selector").insertAdjacentHTML("afterend", `<year-selector id="yearSelectorDiv"></year-selector>`);

	let folderList = null;
	if (localStorage.getItem("folders") !== null){
		try{
			folderList = JSON.parse(localStorage.getItem("folders"));
		}
		catch(e){
			folderList = await getFoldersList();
		}
	}
	else{
		folderList = await getFoldersList();
	}

	if (folderList !==null){
		localStorage.setItem("folders",JSON.stringify(folderList));
	}

	await createFilter(document.querySelector("#filterDownDiv"));
	updateBtnsFromFilter();

	document.querySelector('#tableSearchInput').addEventListener("keyup", async ()=>{
		let debounceFunc = debounce( async () =>  {
			const chargesRes = await getProtocolAndFill(); 
		});
		debounceFunc();
		createSearch();
	});

	document.querySelector("#yearSelectorDiv").addEventListener("yearChangeEvent", async ()=>{
		let debounceFunc = debounce( async () =>  {
			const chargesRes = await getProtocolAndFill(); 
		});
		debounceFunc();
	})

	const chargesRes = await getProtocolAndFill(); 
	
}

export async function getFoldersList(asList=1){  // 0 ή 1. 1 σε περίπτωση που θέλουμε λίστα μόνο και όχι SSR
	const urlpar = new URLSearchParams({asList});
	const res = await runFetch("/api/getFoldersList.php", "GET", urlpar);
	if (!res.success){
		return null;
	}
	else{
		return res.result.folderList;
	}    
}


export async function createUIstartUp(){
	removeIntervals();
    page = Pages.SIGNATURE;
	pagesCommonCode();

	
	document.querySelector('#showEmployeesBtn').style.display = "inline-block"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "inline-block"; 

	const uploadBtn=`<button class="isButton primary " title="Προσθήκη νέου έγγραφο"><i class="far fa-plus-square"></i></button>`;
	document.querySelector("#uploadBtnDiv").innerHTML =uploadBtn;
	document.querySelector("#uploadBtnDiv").addEventListener("click",()=> document.querySelector("#uploadModal").showModal());
	//create Upload UI
	document.querySelector("#uploadModal").innerHTML = `<file-upload id="fileUploadDiv"></file-upload>`;

	document.querySelector("#fileUploadDiv").addEventListener("uploadEvent", async ()=>{
		const toSignRes = await getToSignRecordsAndFill(); 
	})

	//document.querySelector("#selectedFile").addEventListener("change",() => enableFileLoadButton());
	//document.querySelector("#uploadFileButton").addEventListener("click",()=>uploadFileTest());

	// Να δω τι γίνεται εδώ
	const currentRole = +localStorage.getItem("currentRole");
	const currentUserRole = JSON.parse(localStorage.getItem("loginData")).user.roles[currentRole];
	if (+currentUserRole.accessLevel > 0){
		//console.log("if"+currentUserRole.accessLevel);
	}
	else{
		const tempUserElement= document.getElementById('showToSignOnlyBtn');
		tempUserElement.classList.remove('dismiss');
		tempUserElement.classList.add('active');
		tempUserElement.dataset.active=1;
	}
	createActionsTemplate();
	//Γέμισμα πίνακα με εγγραφές χρήστη
   
	const toSignRes = await getToSignRecordsAndFill(); 
	//interToSign = setInterval(async ()=>{
		//const toSignRes = await getToSignRecordsAndFill(); 
	//},60000)
	document.querySelector('#tableSearchInput').addEventListener("keyup", async ()=>{
		createSearch();
	});

	if (+loginData.user.roles[localStorage.getItem("currentRole")].accessLevel > 0){
		document.querySelector("#signAllModalBtn").addEventListener("click", async ()=>{
			const modalButtonsDivContent = `<div id="signAllBtngroup" class="flexHorizontal">
									<button id="signAllAsLastBtn"  type="button" class="isButton small warning">Τελικός υπογράφων</button>
									<button id="signAllBtn"  type="button" class="isButton small active">Υπογραφή Όλων</button>
									<div id="signAllSpinner" class="spinner-border text-success" role="status">
										<span class="visually-hidden">Loading...</span>
									</div>
								</div>`;
			
			document.querySelector("#signModal .contentFooter").innerHTML = modalButtonsDivContent;
			document.querySelector("#signAllSpinner").style.display = 'none';
			
			//const recordAA = event.currentTarget.getAttribute('data-whatever');
			//const isExactCopy = event.currentTarget.getAttribute('data-isExactCopy');
			//document.querySelector("#signModal").dataset.isexactcopy = isExactCopy;

			if (+loginData.user.roles[localStorage.getItem("currentRole")].canSignAsLast){
				document.querySelector('#signAllAsLastBtn').style.display = "inline-block";
			}else{
				document.querySelector('#signAllAsLastBtn').style.display = "none";
			}
			document.getElementById("signAllBtn").style.display = "inline-block";
	
			document.querySelector('#signAllSpinner').style.display = "none";
			
			(localStorage.getItem("signProvider")==null?localStorage.setItem("signProvider",signProviders.MINDIGITAL.name):localStorage.getItem("signProvider"));
			//Εξέταση αν οι απαραίτητες τιμές του middleware του provider έχουν οριστεί
			let signProvider = localStorage.getItem("signProvider");
			selectSignProvider(signProvider);
			//Υπογραφή signDocument(aa, isLast=0, objection=0, isExactCopy=0)
	
			let records = [];
			document.querySelectorAll("#dataToSignTable tbody tr").forEach( item =>{
				if (item.querySelector('[type="checkbox"]').checked  === true){
					if (!+item.dataset.isExactCopy){
						records.push({aa : +item.dataset.aa , isExactCopy : +item.dataset.isExactCopy});
					}
				}
			})
			document.querySelector("#signDialogTitle").innerText =`Υπογραφή Επιλεγμένων (${records.length} εγγραφές)`;
			document.querySelector("#attentionTextDiv").style.display = "none";
			document.querySelector("#signText").style.display = "none";
	
			document.querySelector('#signAllBtn').addEventListener("click",() => signAllDocuments(records));
			document.querySelector('#signAllAsLastBtn').addEventListener("click",() => signAllDocuments(records, 1, 0));
	
			document.querySelector("#signModal").showModal();
		})
	}
	else{
		document.querySelector('#signAllModalBtn').style.display = "none";
	}
	
} 

export async function createSignedUIstartUp(){
	removeIntervals();
    //console.log("signed");
    page = Pages.SIGNED;
	pagesCommonCode();

	document.querySelector('#showEmployeesBtn').style.display = "inline-block"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "none"; 

	//Γέμισμα πίνακα με εγγραφές χρήστη
	const signedRes = await getSignedRecordsAndFill();
	//interSigned = setInterval(async ()=>{
		//const signedRes = await getSignedRecordsAndFill();
	//},60000)
	
	document.querySelector('#tableSearchInput').addEventListener("keyup", async ()=>{
		let debounceFunc = debounce( async () =>  {
			const chargesRes = await getSignedRecordsAndFill(); 
		});
		debounceFunc();
	});
	//createSearch();
}

function showPass(field) {
	if (field == "newPwd"){
			var x = document.getElementById("newPwd");
	}
	else if (field == "newPwd2"){
		var x = document.getElementById("newPwd2");
	}
	else if (field == "oldPwd"){
		var x = document.getElementById("oldPwd");
	}
	
	if (x.type === "password") {
		x.type = "text";
	} else {
		x.type = "password";
	}
}


async function changePassword(){

	let strongPassword = new RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})')
	const oldPwdInput = document.getElementById('oldPwd');
	const newPwdInput = document.getElementById('newPwd');
	const newPwd2Input = document.getElementById('newPwd2');
	if (newPwdInput.value === "" || newPwd2Input.value === "" || oldPwdInput.value ===""){
		alert("Συμπληρώστε όλα τα πεδία");
		return;
	}
	if (newPwdInput.value !== newPwd2Input.value){
		alert("Οι νέοι κωδικοί δε συμφωνούν");
		return;
	}
	if(!strongPassword.test(newPwdInput.value)){
    	alert("Ο νέος κωδικός πρέπει να έχει 8 χαρακτήρες, πεζούς και κεφαλαίους, νούμερα και ειδικό χαρακτήρα");
		return;
    }

	let formData = new FormData();
	// signDocument(aa, isLast=0, objection=0)
	formData.append("oldPwd", oldPwdInput.value);
	formData.append("newPwd", newPwdInput.value);
	formData.append("newPwd2", newPwd2Input.value);

	const res = await runFetch("/api/changePassword.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		oldPwdInput.value ="";
		newPwdInput.value ="";
		newPwd2Input.value ="";
		document.querySelector("#passwordModal").close();
	}
}


function updateRolesUI(){
	const cRole = localStorage.getItem("currentRole");
	loginData.user.roles.forEach((role,index)=>{
		if(index == cRole){
			//document.querySelector('#role_'+index+'_btn').classList.remove('btn-secondary'); 
			//document.querySelector('#role_'+index+'_btn').classList.add('btn-success'); 
			document.querySelector('#role_'+index+'_btn').classList.add('active'); 
		}
		else{
			//document.querySelector('#role_'+index+'_btn').classList.remove('btn-success'); 
			//document.querySelector('#role_'+index+'_btn').classList.add('btn-secondary');  
			document.querySelector('#role_'+index+'_btn').classList.remove('active'); 
		}
	});   
	return;
}

async function fixRole(){
	const res = await runFetch("/api/fixSessionRoles.php", "POST", null);
	if (!res.success){
		alert(res.msg);
	}
	else{
		if (res.role ==  localStorage.getItem("currentRole")){
			//console.log("ο ρόλος δεν έχει αλλάξει");
		}
		else {
			window.location.reload();
			//console.log("επιτυχής αλλαγή ιδιότητας στο SESSION. Θα καταργηθεί σύντομα!");	
		}
		return  res.result;
	}
}

async function roleChanged(){
	//localStorage.setItem("currentRole",index);	24-10-23
	//Προσοχή να αφαιρεθεί!!!!!!!!!!!!!!
	//await fixRole(); // Θα αφαιρεθεί όταν απαλλαγεί και το πρωτόκολλο από τα  SESSION. Αλλάζει το χρήστη στο SESSION
	// -----------------------------------------------------------								
	//updateRolesUI();								24-10-23

	//document.querySelector("#prosIpografi>a").addEventListener("click",createUIstartUp);
	//document.querySelector("#ipogegrammena>a").addEventListener("click",createSignedUIstartUp);	
	//document.querySelector("#xreoseis>a").addEventListener("click",createChargesUIstartUp);	
	//document.querySelector("#protocolBookBtn>a").addEventListener("click",createProtocolUIstartUp);		

    switch (page){
        case Pages.SIGNATURE :
            createUIstartUp();
            break;
        case Pages.SIGNED :
            createSignedUIstartUp();
            break;
		case Pages.CHARGES :
			createChargesUIstartUp();
			break;
		case Pages.PROTOCOL :
			createProtocolUIstartUp();
			break;
        default :
            alert("Σελίδα μη διαθέσιμη");
            return;
    }

	let cRole = localStorage.getItem("currentRole");
	if (cRole !== null){
		if (+loginData.user.roles[cRole].protocolAccessLevel){
			document.querySelector("#protocolAppText").textContent = "Διαχειριστής";
		}
		else{
			document.querySelector("#protocolAppText").textContent = "Χρεώσεις";
		}
		if (+loginData.user.roles[cRole].privilege){
			//document.querySelector("#protocolBookBtn").insertAdjacentHTML("afterend",adeiesBtn);
		}
		else{
			if(document.querySelector("#leaveBtn") !==null){
				document.querySelector("#leaveBtn").remove();
			}
		}
	}
}

function getSignals(){
	return signals;
}

export function getControllers(){
	return abortControllers;
}

export async function getToSignRecordsAndFill(){
	abortControllers.toSign = new AbortController();
	signals.toSign = abortControllers.toSign.signal;
	const records = getSigRecords(signals.toSign, getControllers()).then( res => {
		//createSearch();
	}, rej => {});		
}


export async function getSignedRecordsAndFill(){
	abortControllers.signed = new AbortController();
	signals.signed = abortControllers.signed.signal;
	console.log(pagingStart,pagingSize);
	const records = await getSignedRecords(pagingStart,pagingSize, signals.signed, getControllers());
	fillTableWithSigned(records.data);
	if(!document.querySelector("#pageSelectorDiv")){
		document.querySelector("#dataToSignTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${records.totalRecords}"></page-selector>`);
	}
	else{
		document.querySelector("#pageSelectorDiv").remove();
		document.querySelector("#dataToSignTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" style="margin-top:1em;" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${records.totalRecords}"></page-selector>`);
	}	
	document.querySelector("#pageSelectorDiv").addEventListener("pageChangeEvent", async (event)=>{
		//console.log("page to render:", event.currentPage);
		paggingPage = event.currentPage;
		const records = await getSignedRecords(event.currentPage -1, pagingSize, signals.charges, getControllers());
		fillTableWithSigned(records.data);
	})				
}

export async function getChargesAndFill(orderField= null, orderType=null){
	//console.log(orderField, orderType);
	abortControllers.charges = new AbortController();
	signals.charges = abortControllers.charges.signal;

	const recordsNo = await getFilteredData(pagingStart,pagingSize, signals.charges, getControllers(), orderField, orderType);
		//.then( res => {
			//createSearch();
		//}, rej => {});	
	if(!document.querySelector("#pageSelectorDiv")){
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" style="" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}
	else{
		document.querySelector("#pageSelectorDiv").remove();
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" style="margin-top:1em;" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}	
	document.querySelector("#pageSelectorDiv").addEventListener("pageChangeEvent", async (event)=>{
		paggingPage = event.currentPage;
		//console.log("page to render:", event.currentPage);
		const recordsNo = await getFilteredData(event.currentPage -1,pagingSize, signals.charges, getControllers(), orderField, orderType);
	})		
}

export async function getProtocolAndFill(){
	abortControllers.protocol = new AbortController();
	signals.protocol = abortControllers.protocol.signal;

	const recordsNo = await getProtocolData(pagingStart,pagingSize, signals.protocol, getControllers());

	if(!document.querySelector("#pageSelectorDiv")){
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" style="" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}
	else{
		document.querySelector("#pageSelectorDiv").remove();
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector data-page="1" style="margin-top:1em;" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}	
	document.querySelector("#pageSelectorDiv").addEventListener("pageChangeEvent", async (event)=>{
		//console.log(event.currentPage);
		paggingPage = event.currentPage;
		const recordsNo = await getProtocolData(event.currentPage -1,pagingSize, signals.protocol, getControllers());
	})							
}



async function logout(){
	const res = await runFetch("/api/logout.php", "POST", null);
	const settingFromStorage = localStorage.getItem("settings")!==null? JSON.parse(localStorage.getItem("settings")): {};
	if (!res.success){
		alert(res.msg);
		localStorage.clear();
		
	}
	else{
		localStorage.clear();
	}
	localStorage.setItem("settings", JSON.stringify(settingFromStorage));
	window.location.href ="/directorSign";
}

//--------------------------------------- ΕΤΙΚΕΤΕΣ -------------------------------------------
async function getAllTags(){
	const res = await runFetch("/api/getAllTags.php", "GET", null);
	if (!res.success){
		alert(res.msg);
	}
	else{
		return res.result.tags;
	}
}

export async function createHashDatalist(){
	if (document.querySelector("#hashDataListId")){
		document.querySelector("#hashDataListId").remove();
	}
	const searchInput = document.querySelector('#tableSearchInput');
	const generalFilter = document.querySelector('#generalFilterDiv');
	const hashDataList =  document.createElement('datalist');
	hashDataList.id = "hashDataListId";
	const tags = await getAllTags();
	tags.forEach(elem => {
		let temp = document.createElement('option');
		temp.value = "#"+elem.tag;
		hashDataList.append(temp);
	})
	generalFilter.insertBefore(hashDataList, searchInput);
}
//--------------------------------------- /ΕΤΙΚΕΤΕΣ -------------------------------------------

async function getPeddingProtocolReqs(){	

	let cRole = localStorage.getItem("currentRole");
			
	const res = await runFetch("/api/getPeddingProtocolReqs.php", "GET", null);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		if(resdec.requests.length == 0){
			document.querySelector("#peddingRequestsNo").parentElement.style.backgroundColor = "gray";
			document.querySelector("#peddingRequestsNo").style.backgroundColor = "gray";
			document.querySelector("#peddingRequestsNo").innerText = 0;
		}
		else{
			let countActive = 0;
			document.querySelector("#peddingRequestsNo").parentElement.style.backgroundColor = "red";
			document.querySelector("#peddingRequestsNo").style.backgroundColor = "red";
			document.querySelector("#peddingReqsRecords").innerHTML = `<div><b>Αίτημα από</b></div><div><b>Αποστολέας</b></div><div><b>Θέμα</b></div><div><b>Προς</b></div><div><b>Θέμα Εξερχομένου</b></div><div>Ημερ.</div><div><b>Ενέργειες</b></div>`;
			resdec.requests.forEach(elem => {
					const rejectReqBtn = '<button data-req="'+elem.aa+'" data-action="dismissReq" class="isButton dismiss" style="margin-left:0.25rem;"><i class="far fa-window-close"></i></button>';
					const acceptReqBtn = '<button data-req="'+elem.aa+'" data-action="acceptReq" class="isButton active" style="margin-left:0.25rem;"><i class="far fa-plus-square"></i></button>';
					document.querySelector("#peddingReqsRecords").innerHTML+= 
						`<div data-req="${elem.aa}" data-name="requestFromNameField" >${elem.requestFromNameField}</div>
						<div data-req="${elem.aa}" data-name="fromField" >${elem.fromField}</div>
						<div data-req="${elem.aa}" data-name="subjectField" >${elem.subjectField}</div>
						<div data-req="${elem.aa}" data-name="toField" >${elem.toField}</div>
						<div data-req="${elem.aa}" data-name="outSubjectField">${elem.outSubjectField}</div>
						<div data-req="${elem.aa}" data-name="insertDate" >${elem.insertDate}</div>`;
						let statusText = "";
						if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
							document.querySelector("#peddingReqsRecords").innerHTML+=`<div data-req="${elem.aa}" data-name="actionsField">${acceptReqBtn+rejectReqBtn}</div>`;
						}
						else{
							switch(+elem.active){
								case -1 : statusText= "Απορρίφθηκε";break;
								case 0 : statusText= "Εγκρίθηκε";break;
								case 1 : statusText= "Εκκρεμότητα";break;
							}
							document.querySelector("#peddingReqsRecords").innerHTML+=`<div data-req="${elem.aa}" data-name="actionsField">${statusText}</div>`;
						}
						const protDiv=document.querySelector(`[data-name="subjectField"][data-req="${elem.aa}"]`);
						protDiv.style.padding = "5px";
						protDiv.style.color = "black";	
						if(elem.active==0){
							protDiv.style.backgroundColor = "green";
							protDiv.style.color = "white";	
						}
						else if(elem.active==1){
							protDiv.style.backgroundColor = "orange";	
							countActive++;	
						}
						else if(elem.active==-1){
							protDiv.style.backgroundColor = "red";		
						}
				}
			);
			if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
				resdec.requests.forEach(elem => {
					document.querySelector('[data-action="dismissReq"][data-req="'+elem.aa+'"]').addEventListener("click", (event) => setPeddingReq(event.currentTarget.dataset.req, 0));	
					document.querySelector('[data-action="acceptReq"][data-req="'+elem.aa+'"]').addEventListener("click", (event) => setPeddingReq(event.currentTarget.dataset.req, 1));	
				})
			}
			document.querySelector("#peddingRequestsNo").innerText = countActive;
		}
	}
}

async function getPeddingAccessProtocolReqs(){	
	let cRole = localStorage.getItem("currentRole");

	const res = await runFetch("/api/getPeddingAccessProtocolReqs.php", "GET", null);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		if(resdec.requests.length == 0){
			if(document.querySelector("#peddingAccessRequestsNo")){
				document.querySelector("#peddingAccessRequestsNo").parentElement.style.backgroundColor = "gray";
			}
			if(document.querySelector("#peddingAccessRequestsNo")){
				document.querySelector("#peddingAccessRequestsNo").style.backgroundColor = "gray";
			}
		}
		else{
			document.querySelector("#peddingAccessRequestsNo").parentElement.style.backgroundColor = "orange";
			document.querySelector("#peddingAccessRequestsNo").style.backgroundColor = "orange";
			document.querySelector("#peddingAccessReqsRecords").innerHTML = `<div><b>Αίτημα από</div><div>Αρ.Πρωτ.</div><div>Φάκελος</div><div>Έτος</div><div>Αιτιολογία</div><div>Ημερ.</div><div>Ενέργειες</b></div>`;
			let tempInnerHTML = "";
			resdec.requests.forEach(elem => {
					const calendarReqBtn = '<input data-field="access" data-req="'+elem.aa+'" data-action="calendarReq" type="date"></input>';
					const rejectReqBtn = '<button data-field="access" data-req="'+elem.aa+'" data-action="dismissReq" data-protocol="'+elem.protocolField+'" class="isButton dismiss" style="margin-left:0.25rem;"><i class="far fa-window-close"></i></button>';
					const acceptReqBtn = '<button data-field="access" data-req="'+elem.aa+'" data-action="acceptReq" data-protocol="'+elem.protocolField+'" class="isButton active" style="margin-left:0.25rem;"><i class="far fa-check-square"></i></button>';
					const removeReqBtn = '<button data-field="access" data-req="'+elem.aa+'" data-action="removeReq" data-protocol="'+elem.protocolField+'" class="isButton active" style="margin-left:0.25rem;"><i class="fas fa-trash-alt"></i></button>';
					//document.querySelector("#peddingAccessReqsRecords").innerHTML+= 
					tempInnerHTML +=
						`<div data-field="access" data-req="${elem.aa}" data-name="requestFromNameField" >${elem.requestFromNameField}</div>
						<div data-field="access" data-req="${elem.aa}" data-name="protocolField">${elem.protocolField==0?"":elem.protocolField}</div>
						<div data-field="access" data-req="${elem.aa}" data-name="folderlField">${elem.folderNameField==0?"":elem.folderNameField}</div>
						<div data-field="access" data-req="${elem.aa}" data-name="causeField" >${elem.yearField==0?"":elem.yearField}</div>
						<div data-field="access" data-req="${elem.aa}" data-name="causeField" >${elem.causeField}</div>
						<div data-field="access" data-req="${elem.aa}" data-name="insertDate" >${elem.insertDate}</div>`;
					let statusText = "";
					if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
						tempInnerHTML += 
						//document.querySelector("#peddingAccessReqsRecords").innerHTML+=
							`<div data-req="${elem.aa}" data-name="actionsField">${calendarReqBtn+acceptReqBtn+rejectReqBtn+removeReqBtn}</div>`;
					}
					else{
						switch(+elem.active){
							case -1 : statusText= `<button class="isButton dismiss" disabled="disabled" data-req="${elem.aa}" data-access="-1" data-protocol="${elem.protocolField}"><i class="fas fa-lock"></i></button>`;break;;
							case 0 : statusText= `<button class="isButton active" data-req="${elem.aa}" data-access="0" data-protocol="${elem.protocolField}"><i class="fas fa-lock-open"></i></button>`;break;
							case 1 : statusText= `<button class="isButton warning" disabled="disabled" data-req="${elem.aa}" data-access="1"><i class="fas fa-key"></i></button>`;break;
						}
						tempInnerHTML += 
						//document.querySelector("#peddingAccessReqsRecords").innerHTML+=
							`<div disabled data-req="${elem.aa}" data-name="actionsField">${calendarReqBtn}</div>`;
					}
					
					
				}
			);
			document.querySelector("#peddingAccessReqsRecords").innerHTML+= tempInnerHTML;
			document.querySelectorAll(`#peddingAccessRequestsModal [data-access="0"]`).forEach( elem=>{
				elem.addEventListener("click", ()=>{
					openProtocolRecord(elem.dataset.protocol, localStorage.getItem("currentYear"));
				})
			})

			if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
				resdec.requests.forEach(elem => {
					if (elem.expiresAtField !== ""){
						document.querySelector(`[data-field="access"][data-action="calendarReq"][data-req="${elem.aa}"]`).value = elem.expiresAtField;
					}
					const protDiv=document.querySelector(`[data-field="access"][data-name="requestFromNameField"][data-req="${elem.aa}"]`);
					protDiv.style.padding = "5px";
					protDiv.style.color = "black";	
					if(elem.acceptedField==1){
						protDiv.style.backgroundColor = "green";
						protDiv.style.color = "white";	
					}
					else if(elem.acceptedField==0){
						protDiv.style.backgroundColor = "red";		
					}
					else{
						protDiv.style.backgroundColor = "orange";		
					}
					document.querySelector(`[data-field="access"][data-action="dismissReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => setPeddingAccessReq(event.currentTarget.dataset.req, 0));	
					document.querySelector(`[data-field="access"][data-action="acceptReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => setPeddingAccessReq(event.currentTarget.dataset.req, 1));
					document.querySelector(`[data-field="access"][data-action="removeReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => setPeddingAccessReq(event.currentTarget.dataset.req, -1));		
				})
			}
			else{
				resdec.requests.forEach(elem => {
					if (elem.expiresAtField !== ""){
						document.querySelector(`[data-field="access"][data-action="calendarReq"][data-req="${elem.aa}"]`).value = elem.expiresAtField;
					}
					const protDiv=document.querySelector(`[data-field="access"][data-name="requestFromNameField"][data-req="${elem.aa}"]`);
					protDiv.style.padding = "5px";
					protDiv.style.color = "black";	
					if(elem.acceptedField==1){
						protDiv.style.backgroundColor = "green";
						protDiv.style.color = "white";	
					}
					else if(elem.acceptedField==0){
						protDiv.style.backgroundColor = "red";		
					}
					else{
						protDiv.style.backgroundColor = "orange";		
					}
					document.querySelector(`[data-field="access"][data-action="calendarReq"][data-req="${elem.aa}"]`).setAttribute("disabled","disabled");
				})
			}
			
			document.querySelector("#peddingAccessRequestsNo").innerText = resdec.pending;
		}
	}
}


async function getPeddingPublishReqs(){	
	let cRole = localStorage.getItem("currentRole");

	const res = await runFetch("/api/getPeddingPublishReqs.php", "GET", null);
	//console.log(res);
	if (!res.success){
		console.log(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		if(resdec.requests.length == 0){
			if(document.querySelector("#peddingPublishRequestsNo")){
				document.querySelector("#peddingPublishRequestsNo").parentElement.style.backgroundColor = "gray";
			}
			if(document.querySelector("#peddingPublishRequestsNo")){
				document.querySelector("#peddingPublishRequestsNo").style.backgroundColor = "gray";
			}
			document.querySelector("#peddingPublishReqsRecords").innerHTML = `<div><b>Αίτημα από</div><div>Αρ.Πρωτ.</div><div>Έτος</div><div>Ημερ.</div><div>Ενέργειες</b></div>`;
		}
		else{
			document.querySelector("#peddingPublishRequestsNo").parentElement.style.backgroundColor = "orange";
			document.querySelector("#peddingPublishRequestsNo").style.backgroundColor = "orange";
			document.querySelector("#peddingPublishReqsRecords").innerHTML = `<div><b>Αίτημα από</div><div>Αρ.Πρωτ.</div><div>Έτος</div><div>Ημερ.</div><div>Ενέργειες</b></div>`;
			resdec.requests.forEach(elem => {
					const rejectReqBtn = '<button data-field="publish" data-req="'+elem.aa+'" data-action="dismissReq" data-protocol="'+elem.protocolField+'" class="isButton dismiss" style="margin-left:0.25rem;"><i class="far fa-window-close"></i></button>';
					const acceptReqBtn = '<button data-field="publish" data-req="'+elem.aa+'" data-action="acceptReq" data-protocol="'+elem.protocolField+'" class="isButton active" style="margin-left:0.25rem;"><i class="far fa-check-square"></i></button>';
					document.querySelector("#peddingPublishReqsRecords").innerHTML+= 
						`<div data-field="publish" data-req="${elem.aa}" data-name="requestFromNameField" >${elem.requestFromNameField}</div>
						<div style="cursor:pointer; color: blue; font-weight:500;" data-field="publish" data-req="${elem.aa}" data-name="protocolField">
							<protocol-btn protocolNo="${elem.protocolField}" protocolDate="${elem.yearField}"></protocol-btn>
						</div>
						<div data-field="publish" data-req="${elem.aa}" data-name="yearField">${elem.yearField}</div>
						<div data-field="publish" data-req="${elem.aa}" data-name="insertDate" >${elem.insertDate}</div>`;
					let statusText = "";
					if(+loginData.user.roles[cRole].canPublish == 1){
						document.querySelector("#peddingPublishReqsRecords").innerHTML+=`<div data-req="${elem.aa}" data-name="actionsField">${acceptReqBtn+rejectReqBtn}</div>`;
					}
				}
			);
			
			// resdec.requests.forEach(elem => {
			// 	if(document.querySelector(`[data-field="publish"][data-name="protocolField"][data-req="${elem.aa}"]`)){
			// 		document.querySelector(`[data-field="publish"][data-name="protocolField"][data-req="${elem.aa}"]`).addEventListener("click", async (event) =>	{
			// 			const urlData = new URLSearchParams();
			// 			urlData.append("protocolNo", elem.protocolField);
			// 			urlData.append("year", elem.yearField);
			// 			const res = await runFetch("/api/getRecord.php", "GET", urlData);
			// 			if (!res.success){
			// 				alert(res.msg);
			// 			}
			// 			else{
			// 				// openProtocolRecord(subject, outSubjectField, record, recordDate, status, event, protocol){
			// 				openProtocolRecord(res.result.aaField,res.result.insertDateField, false)
			// 			}
			// 		})
			// 	}

			// })
				
			if(+loginData.user.roles[cRole].canPublish == 1){
				resdec.requests.forEach(elem => {
					document.querySelector(`[data-field="publish"][data-action="dismissReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => setPeddingPublishReq(event.currentTarget.dataset.req, 0));	
					document.querySelector(`[data-field="publish"][data-action="acceptReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => setPeddingPublishReq(event.currentTarget.dataset.req, 1));
				})
			}
		}
		if (document.querySelector("#peddingPublishRequestsNo")){
			document.querySelector("#peddingPublishRequestsNo").innerText = resdec.requests.length;
		}
	}
}

async function setPeddingReq(aa, status){
	if (status == 1){
		if (!confirm("Εισαγωγή στο βιβλίο πρωτοκόλλου;")){
			return;
		}
	}
	else if (status == 0){
		if (!confirm(`Απόρριψη αιτήματος πρωτοκόλλου;`)){
			return;
		}
	}
	const name = document.querySelector(('[data-name="requestFromNameField"][data-req="'+aa+'"]')).innerText;

	const formData = new FormData();
	formData.append("aa", aa);
	formData.append("status", status);
	formData.append("name", name);

	const res = await runFetch("/api/setPeddingReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const chargesRes = await getChargesAndFill(); 
		const req =  await getPeddingProtocolReqs();
		document.querySelector("#peddingRequestsModal").close();
	}
}

async function setPeddingAccessReq(aa, status){
	if (status == 1){
		if (!confirm(`Πρόσβαση σε πρωτόκολλο ή φάκελο;`)){
			return;
		}
	}
	else if (status == 0){
		if (!confirm(`Απόρριψη πρόσβασης σε πρωτόκολλο ή φάκελο;`)){
			return;
		}
	}
	else if (status == -1){
		if (!confirm(`Διαγραφή αιτήματος;`)){
			return;
		}
	}
	const expireDate = document.querySelector(`[data-action="calendarReq"][data-req="${aa}"]`).value;

	const formData = new FormData();
	formData.append("aa", aa);
	formData.append("status", status);
	formData.append("expireDate", expireDate);

	const res = await runFetch("/api/setPeddingAccessReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		await getPeddingAccessProtocolReqs();
		// const reqItems = document.querySelectorAll('[data-req="'+aa+'"]');
		// reqItems.forEach((elem) => {
		// 	elem.remove();
		// })
		if (status == 1){
			alert("Το αίτημα πρόσβασης έχει εγκριθεί");
		}
		else if (status == 0){
			alert("Το αίτημα πρόσβασης έχει απορριφθεί");
		}
		else if (status == -1){
			alert("Το αίτημα πρόσβασης έχει διαγραφεί");
		}
	}
}


async function setPeddingPublishReq(aa, status){
	if (status == 1){
		if (!confirm(`Η ανάρτηση ολοκληρώθηκε;`)){
			return;
		}
	}
	else if (status == 0){
		if (!confirm(`Η ανάρτηση απορρίφθηκε;`)){
			return;
		}
	}


	const formData = new FormData();
	formData.append("aa", aa);
	formData.append("status", status);

	const res = await runFetch("/api/setPeddingPublishReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		await getPeddingPublishReqs();
		// const reqItems = document.querySelectorAll('[data-req="'+aa+'"]');
		// reqItems.forEach((elem) => {
		// 	elem.remove();
		// })
		if (status == 1){
			alert("Η ανάρτηση έχει ολοκληρωθεί");
		}
		else if (status == 0){
			alert("Το αίτημα ανάρτησης απορρίφθηκε");
		}
	}
}


function debounce(func, timeout = 1000){
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}

async function removeNotifications(){
	if ( !confirm("Διαγραφή των κοινοποιήσεων; Προσοχή. Δεν υπάρχει δυνατότητα αυτόματης επαναφοράς.")){
		return;
	}
	const res = await runFetch("/api/removeNotifications.php", "POST");
	if (!res.success){
		alert(res.msg);
	}
	else{
		res = await getChargesAndFill();
	}
}