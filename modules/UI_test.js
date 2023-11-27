import {uploadFileTest, uploadComponents,enableFileLoadButton} from "./Upload.js";
import {createActionsTemplate,getSigRecords, getSignedRecords}  from "./Records_test.js";
import getFromLocalStorage from "./LocalStorage.js";
import createFilter,{updateBtnsFromFilter, createSearch, pagingStart, pagingSize} from "./Filter.js";
import {getFilteredData, getProtocolData,openProtocolRecord, printChangedRecords} from "./ProtocolData.js";
import refreshToken,{refreshTokenTest} from "./RefreshToken.js";
import runFetch from "./CustomFetch.js";

let loginData = null;
let page = null;
export let Pages = {CHARGES : 'charges' , SIGNATURE : 'signature', SIGNED : 'signed', PROTOCOL : "protocol"};
Object.freeze(Pages);       
const adeiesBtn = '<div><a target="_blank" href="/adeies/index.php">Άδειες</a></div>';
const pwdBtn = '<button class="isButton" id="changePwdBtn" style="background-color: var(--bs-yellow);color:black;" title="αλλαγή κωδικού"><i class="fas fa-key" id="changePwdBtnIcon"></i></button>';
const logoutBtn = '<div><button class="isButton" style="background-color: var(--bs-yellow);color:black;" id="logoutBtn" title="αποσύνδεση"><i class="fas fa-sign-out-alt"></i></button></div>';

let interPeddingReqs = null;
let interCharges = null;
let interToSign = null;
let interSigned = null;
let timer = null;
export let abortControllers = {};
export let signals = {};


const passwordModalDiv =
`
<dialog id="passwordModal" class="customDialog" style="width:70%;"> 
	<div class="customDialogContentTitle">
		<span style="font-weight:bold;">Αλλαγή κωδικού</span>
		<div class="topButtons" style="display:flex;gap: 7px;">
			<button id="setPwd" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
			<button class="isButton " name="closePasswordModalBtn" id="closePasswordModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
		</div>
	</div>
	<div class="customDialogContent" style="margin-top:10px;">
		<form id="passwordModalForm">
			<div id="passwordForm">
				<div class="formRow">    
					<label class="formItem" for="oldPwd">Παλιός Κωδικός Πρόσβασης*</label>
					<input class="formInput" required=""  type="text"  id="oldPwd" ></input>
					<i id="showOldPassBtn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
				<div class="formRow">    
					<label class="formItem" for="newPwd" >Νέος Κωδικός Πρόσβασης*</label>
					<input class="formInput" required=""  type="text"  id="newPwd">
					<i id="showNewPass1Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
				<div class="formRow">   
					<label class="formItem" for="newPwd2">Επανεισαγωγή Νέου Κωδικού Πρόσβασης*</label>
					<input class="formInput" required=""  type="text"  id="newPwd2">
					<i id="showNewPass2Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i>
				</div>
			</div>
		</form>
	</div>
</dialog>`;

const addProtocolModal = 
	`<dialog id="addProtocolRequestDialog" style="min-width:60%;max-width:80%;">
		<record-request></record-request>
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

const navBarDiv = `<div id="myNavBar">
	<div  id="prosIpografi" ><a>Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a>Διεκπεραιωμένα</a></div>
		
	<div id="xreoseis"><a><span id="protocolAppText">Χρεώσεις</span></a></div>	
	<div id="protocolBookBtn"><a>Πρωτόκολλο</a></div>
	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->
	<!--<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>-->
	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
	</div><!-- /.container-fluid -->`;



const signTable = `<table id="dataToSignTable" class="table" style="font-size:0.9em;">
	<thead>
	<tr>
		<th id="filename" class="text-right">Έγγραφο</th>
		<th id="date" class="text-right">Εισαγωγή</th>
		<th id="author" class="text-right">Συντάκτης</th>
		<th id="status" class="text-right">Κατάσταση</th>
		<th id="fileActions" class="text-right">Ενέργειες</th>
	</tr>
	</thead>
	<tbody>

	</tbody>
	</table>`;

const chargesTable = `<div id="chargesTable" style="font-size:0.9em;">
						<div id="chargesTableHeader">
							<div class="flexHorizontal" style="background: linear-gradient(90deg, white, lightgray);font-weight: bold;">
								<span id="chargesTableAA"  style="width:5%;text-align:center;">AA</span>
								<span style="width:20%; text-align:center;" id="chargesTableApostoleas" >Αποστολέας</span>
								<span style="width:20%;text-align:center;" id="chargesTableThema">Θέμα</span>
								<span style="width:10%text-align:center;" id="chargesTableImParal" >Ημ.Παραλ.</span>
								<span style="width:10%;text-align:center;" id="chargesTableArEiserx" ">Αρ.Εισερχ.</span>
								<span style="width:10%;text-align:center;" id="chargesTablePros" >Προς</span>
								<span style="width:10%;text-align:center;" id="chargesTableThemaEkserx" >Θέμα Εξερχ.</span>
								<span style="width:10%;text-align:center;" id="chargesTableImEkserx" >Ημ.Εξερχ.</span>
								<span style="width:5%;text-align:center;" id="chargesTableKatast" >Κατάστ.</span>
							</div>
						</div>
						<div id="chargesTableContent" class="flexVertical" style="background-color:white;margin-top:2em;overflow-y:scroll; max-height: 60vh;">
						</div>
					</div>`;

const protocolRecordModal = 
	`<dialog id="protocolRecordDialog">
	</dialog>`;

export function getPage(){
	return page;
}

export function startUp(){
	

	
	console.log("common page code executing...");
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

	document.querySelector("#prosIpografi>a").addEventListener("click",createUIstartUp);
	document.querySelector("#ipogegrammena>a").addEventListener("click",createSignedUIstartUp);	
	document.querySelector("#xreoseis>a").addEventListener("click",createChargesUIstartUp);	
	document.querySelector("#protocolBookBtn>a").addEventListener("click",createProtocolUIstartUp);		

	createUIstartUp();
}

function pagesCommonCode(){
	loginData = localStorage.getItem("loginData");
	let cRole = null;
	if (loginData === null){
		window.location.href = "index.php";
		alert("Δεν υπάρχουν στοιχεία χρήστη");
		return;
	}
	else{
		loginData = JSON.parse(loginData);
		//Πρόσβαση στο Πρωτόκολλο λεκτικό
		cRole = localStorage.getItem("currentRole");
	}
	
	//--------- Μεταφέρθηκαν στο starUp()

	const extraMenuDiv = `<div id="headmasterExtraMenuDiv">
		<button id="syncRecords" title="Ανανέωση εγγραφών" type="button" class="isButton primary"><i class="fas fa-sync"></i></button>
		<div class="flexVertical" id="uploadBtnDiv">
		</div>
		<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->
		<div id="outerFilterDiv" class="flexHorizontal smallPadding">
			<div id="generalFilterDiv" class="flexHorizontal ">
				<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
				<button data-active="0" class="btn btn-danger btn-sm" id="showEmployeesBtn">Προσωπικά</button>
				<button data-active="0" class="btn btn-danger btn-sm" id="showToSignOnlyBtn">Πορεία Εγγρ.</button>
			</div>
		</div>
		
		<div id="recentProtocolsDiv"></div>
	</div>`;

	if (document.body.querySelector("#headmasterExtraMenuDiv")){
		document.body.querySelector("#headmasterExtraMenuDiv").remove();
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
	if (+loginData.user.roles[cRole].privilege){
		const adeiesBtn = '<div><a target="_blank" href="/adeies/index.php">Άδειες</a></div>';
		document.querySelector("#protocolBookBtn").insertAdjacentHTML("afterend",adeiesBtn);
	}
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
		
		


	//create Roles UI	

	// document.querySelector("#userRoles").innerHTML = "";
	// loginData.user.roles.forEach((role,index)=>{
	// 	let newRole;
	// 	if(index == cRole){
	// 		newRole = `<div><button id="role_${index}_btn"  type="button" class="isButton active extraSmall">${role.roleName}</button></div>`;
	// 	}
	// 	else{
	// 		newRole = `<div><button id="role_${index}_btn"  type="button" class="isButton extraSmall">${role.roleName}</button></div>`;
	// 	}
	// 	document.querySelector('#userRoles').innerHTML += newRole;
	// });  
	// loginData.user.roles.forEach((role,index)=>{
	// 		document.querySelector('#role_'+index+'_btn').addEventListener("click",()=>{setRole(index);}); 
	// })

	document.querySelector("#showOldPassBtn").addEventListener("click", ()=>showPass('oldPwd'));
	document.querySelector("#showNewPass1Btn").addEventListener("click", ()=>showPass('newPwd'));
	document.querySelector("#showNewPass2Btn").addEventListener("click",()=>showPass('newPwd2'));

	document.querySelector("#passwordModal").addEventListener("show.bs.modal",(e)=> {
		document.getElementById('oldPwd').value= "";
		document.getElementById('newPwd').value= "";
		document.getElementById('newPwd2').value= "";
    });

	document.querySelector("#setPwd").addEventListener("click",changePassword);	

	document.querySelector('#tableSearchInput').addEventListener("keyup", async ()=>{
		if (page == Pages.CHARGES || page == Pages.PROTOCOL){
			if(+localStorage.getItem("globalSearch") === 1){
				let debounceFunc = debounce( async () =>  {
					const chargesRes = await getChargesAndFill(); 
				});
				debounceFunc();
			}
			else{
				createSearch();
			}
		}
		createSearch();
	});
	//console.log("keyup listener added");
	if (page == Pages.SIGNATURE || page == Pages.SIGNED){
		if (document.querySelector('#showEmployeesBtn')){
			document.querySelector('#showEmployeesBtn').addEventListener("click", createSearch);
		}
		if (document.querySelector('#showToSignOnlyBtn')){
			document.querySelector('#showToSignOnlyBtn').addEventListener("click", createSearch);
		}
	}
	

	document.querySelector("#syncRecords").addEventListener("click", async ()=>  { 
		
		switch (getPage()){
			case Pages.SIGNATURE :
				const res = await getToSignRecordsAndFill();
				break;
			case Pages.SIGNED :
				res = await getSignedRecordsAndFill();
				break;
			case Pages.CHARGES :
				await getChargesAndFill();
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
}


async function createChargesUIstartUp(){
	removeIntervals();
	console.log("charges");
	page = Pages.CHARGES;
	pagesCommonCode();
	document.querySelector('#showEmployeesBtn').style.display = "none"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "none"; 
	let cRole = localStorage.getItem("currentRole");
	
	const yearSelector = `<year-selector id="yearSelectorDiv"></year-selector>`;

	const protocolExtraBtns = 
		`<div id="topMenuNewProtocolBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch;">	
			${
				+loginData.user.roles[cRole].protocolAccessLevel?
				`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Νέα Πρωτόκολλα</div>
				<div class="flexHorizontal" style="padding:0px 5px;">
					<div><button id="addProtocolBtn" title="Νέο πρωτόκολλο" class="isButton small primary" > <i class="fas fa-plus-square"></i></button></div>
					<div><button class="isButton small" style="background-color: var(--bs-red);"> 
						<span id="peddingRequestsNo" name="peddingRequestsNo" style="background-color:red; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span></button>
					</div>
					<div>
						<button id="refreshPeddingReqsBtn" title="Ανανέωση Αιτημάτων" type="button" class="isButton small"><i class="fas fa-sync"></i></button>
					</div>
				</div>`:
				`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Νέα Πρωτόκολλα</div>
				<div class="flexHorizontal" style="padding:0px 5px;">
					<button id="reqProtocolBtn" name="reqProtocolBtn" class="isButton small" title="Aίτηση νέου πρωτοκόλλου" style="background-color:lightseagreen"><i class="fas fa-phone-volume"></i></button>
					<div><button class="isButton small" style="background-color: var(--bs-red);"> 
						<span id="peddingRequestsNo" name="peddingRequestsNo" style="background-color:red; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span></button>
					</div>
				</div>`
			}
		</div>

		<div id="topMenuProtocolAccessBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch;">	
		${
			+loginData.user.roles[cRole].protocolAccessLevel?
			`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Αιτήματα Πρόσβασης</div>
			<div class="flexHorizontal" style="padding:0px 5px;">
					<button class="isButton small" style="background-color: var(--bs-orange);"> 
						<span id="peddingAccessRequestsNo" name="peddingAccessRequestsNo" style="background-color:orange; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span>
					</button>
					<div>
						<button id="refreshPeddingAccessReqsBtn" title="Ανανέωση Αιτημάτων Πρόσβασης" type="button" class="isButton small"><i class="fas fa-sync"></i></button>
					</div>
			</div>`:``
		}
		</div>	

		<div id="topMenuAdminBtnsDiv" class="flexVertical" style="align-items: center;align-self: stretch;">	
			${
				+loginData.user.roles[cRole].protocolAccessLevel?
				`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Άλλες εφαρμογές</div>
				<div class="flexHorizontal">
					<div><a rel="opener"  title="Άνοιγμα αλληλογραφίας" rel="referer" target="_blank" href="/nocc-1.9.8/mich_login.php"><span style="font-weight: bold;
						border-radius: 5px; border-style: solid; 
						border-width: 1px;padding: 2px 6px;color: white; background-color:lightseagreen;border-color:lightseagreen;"><i style="color:white" class="fas fa-mail-bulk  fa-lg"></i></span></a>
					</div>
					<div><a rel="opener"  title="Εφαρμογή ΚΣΗΔΕ" rel="referer" target="_blank" href="/nocc-1.9.8/kside/index.php"><span style="font-size: 0.7rem;font-weight: bold;
															border-radius: 5px; border-style: solid; 
															border-width: 1px;padding: 0px 2px;color: white; background-color:lightseagreen;border-color:lightseagreen;">ΚΣΗΔΕ</span></a>
					</div>
				</div>`:``
			}
		</div>`;

	const addRecordDialog =
		`<dialog id="addRecordModal" class="customDialog" style="max-width: 80%; min-width: 50%;">
			<record-add  style="display:flex; flex-direction:column; gap: 10px;"></record-add>
    	</dialog>`;

	const chargesFilterMenuDiv = 
	`<div id="chargesFilterMenu" class="flexVertical ">
		<div id="topSettingsDiv" class="flexHorizontal" >	
			<div id="globalSearchBtnDiv" >
				<button class="isButton small primary" name="globalSearchBtn" id="globalSearchBtn" data-toggle="tooltip" title="Αναζήτηση στο σύνολο των εγγραφών">
					<i class="fas fa-globe-europe"></i>
				</button>
			</div>
			<div id="recordChangesBtnDiv" >
				<button class="isButton small primary" type="button" id="openChangesBtn" data-toggle="tooltip" title="Αλλαγές σε πρωτόκολλα">
					<i class="fas fa-info"></i>
				</button>
				
			</div>
			<div id="filterBtnDiv" >
				<button class="isButton small primary" type="button" id="openFilterBtn" data-toggle="tooltip" title="Φίλτρο">
					<i class="fas fa-filter"></i>
				</button>
				
			</div>
			${
				+loginData.user.roles[cRole].protocolAccessLevel?
					``:
					`<div id="removeNotificationsBtnDiv" >
						<button class="btn btn-primary btn-sm" name="removeNotifications" id="removeNotifications" data-toggle="tooltip" title="" data-original-title="Αποχρέωση Κοινοποιήσεων">
						<i class="fab fa-stack-overflow"></i>
						</button>
					</div>`}

		</div>
		<div id="recentProtocolsDiv" class="col-lg-5 col-sm-12" >	
		</div>
	</div>`;

	const changesFilterDiv= `<dialog id="changesDiv" class="customModal" style="width: 80%;">
								<div id="changesTitle" class="customDialogContentTitle">
									<div>Τελευταίες αλλαγές</div>
									<div class="topButtons" style="display:flex;gap: 7px;">
										<div id="changesDatesDiv"> 
											<button type="button" data-days="1" class="isButton  small">1ημ.</button>
											<button type="button" data-days="7" class="isButton  small">7ημ.</button>
											<button type="button" data-days="30" class="isButton  small">30ημ.</button>
										</div>
										<div id="changesCloseButtonDiv">
											<button id="changesCloseButton" type="button"  class="btn btn-danger btn-sm">Χ</button>
										</div>
									</div>
								</div>
								<div id="changesContent"></div>
								<div id="changesDetailsContent" style="margin-top:1em;"></div>
							</dialog>

							<dialog id="filterDiv" class="customModal" style="position: absolute; top :0">
								<div id="filterTitle" class="customDialogContentTitle">
									<div>Φίλτρο αναζήτησης</div>
									<div class="topButtons" style="display:flex;gap: 7px;">
										<div id="filterCloseButtonDiv">
											<button id="filterCloseButton" type="button"  class="btn btn-danger btn-sm">Χ</button>
										</div>
									</div>
								</div>
								<div id="filterContent" ></div>
								<div id="filterApplyDiv"></div>
							</dialog>`;

	const peddingRequestsDiv= `<dialog id="peddingRequestsModal" class="customModal">
			<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white;">
				<span style="font-weight:bold;">Αιτήματα πρωτοκόλλου</span>
				<div class="topButtons" style="display:flex;gap: 7px;">
					<button class="isButton " name="peddingReqsCloseBtn" id="peddingReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
				</div>
			</div>
			<div id="peddingReqsRecords" style="display:grid;gap:10px; grid-template-columns:repeat(6, 1fr);align-items:center; justify-items: center; font-size: 0.85em;"></div>
		</dialog>`;

	const peddingAccessequestsDiv= `<dialog id="peddingAccessRequestsModal" class="customModal">
		<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white;">
			<span style="font-weight:bold;">Αιτήματα πρόσβασης</span>
			<div class="topButtons" style="display:flex;gap: 7px;">
				<button class="isButton " name="peddingAccessReqsCloseBtn" id="peddingAccessReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
			</div>
		</div>
		<div id="peddingAccessReqsRecords" style="display:grid;gap:10px; grid-template-columns:repeat(5, 1fr);align-items:center; justify-items: center; font-size: 0.85em;"></div>
	</dialog>`;

	document.body.insertAdjacentHTML("afterend",peddingAccessequestsDiv);
	document.body.insertAdjacentHTML("afterend",changesFilterDiv);
	document.body.insertAdjacentHTML("afterend",peddingRequestsDiv);
	document.body.insertAdjacentHTML("afterend",addRecordDialog);

	if (document.querySelector("#roleSelectorDiv") !== null){
		document.querySelector("#roleSelectorDiv").insertAdjacentHTML("afterend",yearSelector);
	}

	if (document.querySelector("#topMenuNewProtocolBtnsDiv") == null){
		document.querySelector("#headmasterExtraMenuDiv").insertAdjacentHTML("beforeend",protocolExtraBtns);
	}
	if (document.querySelector("#chargesFilterMenu") == null){
		document.querySelector("#generalFilterDiv").insertAdjacentHTML("afterend",chargesFilterMenuDiv);	
	}


	if (document.querySelector('#reqProtocolBtn')){
		document.querySelector('#reqProtocolBtn').addEventListener("click", ()=>{
			document.querySelector('#addProtocolRequestDialog').showModal();
		});
	}
	
	if (document.querySelector('#addProtocolBtn')){
		document.querySelector('#addProtocolBtn').addEventListener("click", ()=>{
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

	createFilter(document.querySelector("#filterContent"));
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
	const filterButton  = document.querySelector("#openFilterBtn");
	const changesCloseButton  = document.querySelector("#changesCloseButton");
	const filterCloseButton  = document.querySelector("#filterCloseButton");
	const changesDatesBtns = document.querySelectorAll("#changesDatesDiv button");
	const globalSearchBtn  = document.querySelector("#globalSearchBtn");

	changesButton.addEventListener("click", () => {
		const changesDiv  = document.querySelector("#changesDiv").showModal();
	});

	filterButton.addEventListener("click", () => {
		const filterDiv  = document.querySelector("#filterDiv").show();
	});

	changesCloseButton.addEventListener("click", () => {
		const changesDiv  = document.querySelector("#changesDiv").close();
	});

	filterCloseButton.addEventListener("click", () => {
		const filterDiv  = document.querySelector("#filterDiv").close();
	});

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
			console.log(item.dataset.dates);
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

	const chargesRes = await getChargesAndFill(); 
	interCharges = setInterval(async ()=>{
		const chargesRes = await getChargesAndFill(); 
	},60000)

	if (document.querySelector('#peddingAccessRequestsNo')){
		document.querySelector('#peddingAccessRequestsNo').parentElement.addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').showModal();
		});
		document.querySelector('#peddingAccessReqsCloseBtn').addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').close();
		});
	}

	if (+loginData.user.roles[cRole].protocolAccessLevel === 1){
		const peddingAccessReqs = await getPeddingAccessProtocolReqs();
	}
}



async function createProtocolUIstartUp(){
	removeIntervals();
	console.log("protocol");
	page = Pages.PROTOCOL;
	pagesCommonCode();
	document.querySelector('#showEmployeesBtn').style.display = "none"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "none"; 
	let cRole = localStorage.getItem("currentRole");

	const protocolExtraBtns = 
		`<div id="topMenuNewProtocolBtnsDiv" class="flexVertical" style="align-items: center; align-self: stretch;">	
		${
			+loginData.user.roles[cRole].protocolAccessLevel?
			``:
			`<div style="font-size:0.7em;font-weight:bold;padding:0px 5px;" >Αίτημα Πρόσβασης</div>
			<div class="flexHorizontal" style="padding:0px 5px;">
				<button id="reqProtocolAccessBtn" name="reqProtocolAccessBtn" class="isButton small" title="Aίτηση πρόσβασης" style="background-color:lightseagreen"><i class="fas fa-eye"></i></button>
				<div>
					<button class="isButton small" style="background-color: var(--bs-orange);"> 
						<span id="peddingAccessRequestsNo" name="peddingAccessRequestsNo" style="background-color:orange; color: white; font-weight:bold; border-radius: 10px; padding: 1px 4px;"></span>
					</button>
				</div>
				
			</div>`
		}
		</div>	
		<year-selector id="yearSelectorDiv"></year-selector>`;
	
	const chargesFilterMenuDiv = 
	`<div id="chargesFilterMenu" class="flexVertical ">
		<div id="topSettingsDiv" class="flexHorizontal" >	
			<div id="filterBtnDiv" >
				<button class="btn btn-primary btn-sm" type="button" id="openFilterBtn" data-toggle="tooltip" data-original-title="Φίλτρο">
					<i class="fas fa-filter"></i>
				</button>
				
			</div>

		</div>
		<div id="recentProtocolsDiv" class="col-lg-5 col-sm-12" >	
		</div>
	</div>`;

	const changesFilterDiv= `<dialog id="changesDiv" class="customModal" style="width: 80%;">
						<div id="changesTitle" class="customTitle">
							<div>Τελευταίες αλλαγές</div>
							<div id="changesDatesDiv"> 
								<button type="button" data-days="1" class="btn btn-warning btn-sm">1ημ.</button>
								<button type="button" data-days="7" class="btn btn-warning btn-sm">7ημ.</button>
								<button type="button" data-days="30" class="btn btn-warning btn-sm">30ημ.</button>
							</div>
							<div id="changesCloseButtonDiv">
								<button id="changesCloseButton" type="button"  class="btn btn-danger btn-sm">Χ</button>
							</div>
						</div>
						<div id="changesContent"></div>
						<div id="changesDetailsContent" style="margin-top:1em;"></div>
					</dialog>

					<dialog id="filterDiv" class="customModal" style="position: absolute; top :0">
						<div id="filterTitle" class="customDialogContentTitle">
							<div>Φίλτρο αναζήτησης</div>
							<div class="topButtons" style="display:flex;gap: 7px;">
								<div id="filterCloseButtonDiv">
									<button id="filterCloseButton" type="button"  class="btn btn-danger btn-sm">Χ</button>
								</div>
							</div>
						</div>
						<div id="filterContent"></div>
						<div id="filterApplyDiv"></div>
					</dialog>`;



	const peddingAccessequestsDiv= `<dialog id="peddingAccessRequestsModal" class="customModal">
		<div class="customDialogContentTitle"  style="background:gray;border-radius:0px;padding: 10px;color: white;">
			<span style="font-weight:bold;">Αιτήματα πρόσβασης</span>
			<div class="topButtons" style="display:flex;gap: 7px;">
				<button class="isButton " name="peddingAccessReqsCloseBtn" id="peddingAccessReqsCloseBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
			</div>
		</div>
		<div id="peddingAccessReqsRecords" style="max-height: 80vh;overflow-y: scroll;display:grid;gap:10px; grid-template-columns:repeat(5, 1fr);align-items:center; justify-items:center;font-size: 0.85em;"></div>
	</dialog>`;
			

	document.body.insertAdjacentHTML("afterend",changesFilterDiv);
	document.body.insertAdjacentHTML("afterend",peddingAccessequestsDiv);


	
	
	document.querySelector("#headmasterExtraMenuDiv").insertAdjacentHTML("beforeend",protocolExtraBtns);
	document.querySelector("#outerFilterDiv").innerHTML += chargesFilterMenuDiv;	

	const filterButton  = document.querySelector("#openFilterBtn");	
	const filterCloseButton  = document.querySelector("#filterCloseButton");	

	filterButton.addEventListener("click", () => {
		const filterDiv  = document.querySelector("#filterDiv").show();
	});

	filterCloseButton.addEventListener("click", () => {
		const filterDiv  = document.querySelector("#filterDiv").close();
	});

	createFilter(document.querySelector("#filterContent"));
	updateBtnsFromFilter();


	if(document.querySelector("#reqProtocolAccessBtn")){
		document.querySelector("#reqProtocolAccessBtn").addEventListener("click", ()=>{
			document.querySelector("#requestProtocolAccessDialog").showModal();
		})
	}

	if (document.querySelector('#peddingAccessRequestsNo')){
		document.querySelector('#peddingAccessRequestsNo').parentElement.addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').showModal();
		});
		document.querySelector('#peddingAccessReqsCloseBtn').addEventListener("click", ()=>{
			document.querySelector('#peddingAccessRequestsModal').close();
		});
	}

	document.querySelector("#yearSelectorDiv").addEventListener("yearChangeEvent", async ()=>{
		let debounceFunc = debounce( async () =>  {
			const chargesRes = await getProtocolAndFill(); 
		});
		debounceFunc();
	})

	if (+loginData.user.roles[cRole].protocolAccessLevel !== 1){
		const peddingAccessReqs = await getPeddingAccessProtocolReqs();
	}

	const chargesRes = await getProtocolAndFill(); 
	interCharges = setInterval(async ()=>{
		const chargesRes = await getProtocolAndFill(); 
	},60000)
}


export async function createUIstartUp(){
	removeIntervals();
	console.log("signature");
    page = Pages.SIGNATURE;
	pagesCommonCode();

	document.querySelector('#showEmployeesBtn').style.display = "inline-block"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "inline-block"; 

	const uploadBtn=`<button class="isButton isGreen " title="Προσθήκη νέου έγγραφο"><i class="far fa-plus-square"></i></button>`;
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
	if (+JSON.parse(localStorage.getItem("loginData")).user.roles[0].accessLevel){
		//$('#example1').DataTable().columns(4).search("#sign#").draw();
	}
	else{
		const tempUserElement= document.getElementById('showToSignOnlyBtn');
		tempUserElement.classList.remove('btn-danger');
		tempUserElement.classList.add('btn-success');
		tempUserElement.dataset.active=1;
	}
	createActionsTemplate();
	//Γέμισμα πίνακα με εγγραφές χρήστη
   
	const toSignRes = await getToSignRecordsAndFill(); 
	interToSign = setInterval(async ()=>{
		const toSignRes = await getToSignRecordsAndFill(); 
	},60000)

}

export async function createSignedUIstartUp(){
	removeIntervals();
    console.log("signed");
    page = Pages.SIGNED;
	pagesCommonCode();

	document.querySelector('#showEmployeesBtn').style.display = "inline-block"; 
	document.querySelector('#showToSignOnlyBtn').style.display = "inline-block"; 

	//Γέμισμα πίνακα με εγγραφές χρήστη
	const signedRes = await getSignedRecordsAndFill();
	interSigned = setInterval(async ()=>{
		const signedRes = await getSignedRecordsAndFill();
	},60000)

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
			console.log("ο ρόλος δεν έχει αλλάξει");
		}
		else {
			window.location.reload();
			console.log("επιτυχής αλλαγή ιδιότητας στο SESSION. Θα καταργηθεί σύντομα!");	
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
			document.querySelector("#protocolBookBtn").insertAdjacentHTML("afterend",adeiesBtn);
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
	const records = getSignedRecords(signals.signed, getControllers()).then( res => {
		//createSearch();
	}, rej => {});			
}

export async function getChargesAndFill(){
	abortControllers.charges = new AbortController();
	signals.charges = abortControllers.charges.signal;

	const recordsNo = await getFilteredData(pagingStart,pagingSize, signals.charges, getControllers())
		//.then( res => {
			//createSearch();
		//}, rej => {});	
	if(!document.querySelector("#pageSelectorDiv")){
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector style="" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}
	else{
		document.querySelector("#pageSelectorDiv").remove();
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector style="margin-top:1em;" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);

	}	
	document.querySelector("#pageSelectorDiv").addEventListener("pageChangeEvent", async (event)=>{
		console.log("page to render:", event.currentPage);
		const recordsNo = await getFilteredData(event.currentPage -1,pagingSize, signals.charges, getControllers());
	})		
}

export async function getProtocolAndFill(){
	abortControllers.protocol = new AbortController();
	signals.protocol = abortControllers.protocol.signal;

	const recordsNo = await getProtocolData(pagingStart,pagingSize, signals.protocol, getControllers());
		//.then( res => {
			//createSearch();
		//}, rej => {});
	if(!document.querySelector("#pageSelectorDiv")){
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector style="" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);
	}
	else{
		document.querySelector("#pageSelectorDiv").remove();
		document.querySelector("#chargesTable").insertAdjacentHTML("beforebegin",`<page-selector style="margin-top:1em;" id="pageSelectorDiv" paggingStart="${pagingStart}" paggingSize="${pagingSize}" totalRecords="${recordsNo}"></page-selector>`);

	}	
	document.querySelector("#pageSelectorDiv").addEventListener("pageChangeEvent", async (event)=>{
		//console.log(event.currentPage);
		const recordsNo = await getProtocolData(event.currentPage -1,pagingSize, signals.protocol, getControllers());
	})							
}



function logout(){
	localStorage.clear();
	location.href = "/api/logout.php";
}

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
		}
		else{
			let countActive = 0;
			document.querySelector("#peddingRequestsNo").parentElement.style.backgroundColor = "red";
			document.querySelector("#peddingRequestsNo").style.backgroundColor = "red";
			document.querySelector("#peddingReqsRecords").innerHTML = `<div><b>Αίτημα από</b></div><div><b>Θέμα</b></div><div><b>Προς</b></div><div><b>Θέμα Εξερχομένου</b></div><div>Ημερ.</div><div><b>Ενέργειες</b></div>`;
			resdec.requests.forEach(elem => {
					const rejectReqBtn = '<button data-req="'+elem.aa+'" data-action="dismissReq" class="isButton dismiss" style="margin-left:0.25rem;"><i class="far fa-window-close"></i></button>';
					const acceptReqBtn = '<button data-req="'+elem.aa+'" data-action="acceptReq" class="isButton active" style="margin-left:0.25rem;"><i class="far fa-plus-square"></i></button>';
					document.querySelector("#peddingReqsRecords").innerHTML+= 
						`<div data-req="${elem.aa}" data-name="requestFromNameField" >${elem.requestFromNameField}</div>
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
					document.querySelector('[data-action="dismissReq"][data-req="'+elem.aa+'"]').addEventListener("click", (event) => rejectPeddingReq(event.currentTarget.dataset.req));	
					document.querySelector('[data-action="acceptReq"][data-req="'+elem.aa+'"]').addEventListener("click", (event) => acceptPeddingReq(event.currentTarget.dataset.req));	
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
			document.querySelector("#peddingAccessRequestsNo").parentElement.style.backgroundColor = "gray";
			document.querySelector("#peddingAccessRequestsNo").style.backgroundColor = "gray";
		}
		else{
			let countActive = 0;
			document.querySelector("#peddingAccessRequestsNo").parentElement.style.backgroundColor = "orange";
			document.querySelector("#peddingAccessRequestsNo").style.backgroundColor = "orange";
			document.querySelector("#peddingAccessReqsRecords").innerHTML = `<div><b>Αίτημα από</div><div>Αρ.Πρωτ.</div><div>Θέμα</b></div><div>Ημερ.</div><div>Ενέργειες</div>`;
			resdec.requests.forEach(elem => {
					const rejectReqBtn = '<button data-req="'+elem.aa+'" data-action="dismissReq" data-protocol="'+elem.protocolField+'" class="isButton dismiss" style="margin-left:0.25rem;"><i class="far fa-window-close"></i></button>';
					const acceptReqBtn = '<button data-req="'+elem.aa+'" data-action="acceptReq" data-protocol="'+elem.protocolField+'" class="isButton active" style="margin-left:0.25rem;"><i class="far fa-check-square"></i></button>';
					document.querySelector("#peddingAccessReqsRecords").innerHTML+= 
						`<div data-req="${elem.aa}" data-name="requestFromNameField" >${elem.requestFromNameField}</div>
						<div data-req="${elem.aa}" data-name="protocolField">${elem.protocolField}</div>
						<div data-req="${elem.aa}" data-name="causeField" >${elem.causeField}</div>
						<div data-req="${elem.aa}" data-name="insertDate" >${elem.insertDate}</div>`;
					let statusText = "";
					if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
						document.querySelector("#peddingAccessReqsRecords").innerHTML+=`<div data-req="${elem.aa}" data-name="actionsField">${acceptReqBtn+rejectReqBtn}</div>`;
					}
					else{
						switch(+elem.active){
							case -1 : statusText= `<button class="isButton dismiss" disabled="disabled" data-req="${elem.aa}" data-access="-1" data-protocol="${elem.protocolField}"><i class="fas fa-lock"></i></button>`;break;;
							case 0 : statusText= `<button class="isButton active" data-req="${elem.aa}" data-access="0" data-protocol="${elem.protocolField}"><i class="fas fa-lock-open"></i></button>`;break;
							case 1 : statusText= `<button class="isButton warning" disabled="disabled" data-req="${elem.aa}" data-access="1"><i class="fas fa-key"></i></button>`;break;
						}
						document.querySelector("#peddingAccessReqsRecords").innerHTML+=`<div data-req="${elem.aa}" data-name="actionsField">${statusText}</div>`;
					}
					const protDiv=document.querySelector(`[data-name="protocolField"][data-req="${elem.aa}"]`);
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
			document.querySelectorAll(`#peddingAccessRequestsModal [data-access="0"]`).forEach( elem=>{
				elem.addEventListener("click", ()=>{
					openProtocolRecord("test",elem.dataset.protocol, localStorage.getItem("currentYear"));
				})
			})

			if(+loginData.user.roles[cRole].protocolAccessLevel == 1){
				resdec.requests.forEach(elem => {
					document.querySelector(`[data-action="dismissReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => rejectPeddingAccessReq(event.currentTarget.dataset.req, event.currentTarget.dataset.protocol));	
					document.querySelector(`[data-action="acceptReq"][data-req="${elem.aa}"]`).addEventListener("click", (event) => acceptPeddingAccessReq(event.currentTarget.dataset.req, event.currentTarget.dataset.protocol));	
				})
			}
			document.querySelector("#peddingAccessRequestsNo").innerText = countActive;
		}
	}
}

async function rejectPeddingReq(aa){
	
	const formData = new FormData();
	formData.append("aa", aa);

	const res = await runFetch("/api/rejectPeddingReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		getPeddingProtocolReqs();
		const reqItems = document.querySelectorAll('[data-req="'+aa+'"]');
		reqItems.forEach((elem) => {
			elem.remove();
		})
		alert("Το αίτημα πρωτοκόλου έχει απορριφθεί");
	}
}

async function acceptPeddingReq(aa){
	if (!confirm("Εισαγωγή στο βιβλίο πρωτοκόλλο;")){
		return;
	}

	const name = document.querySelector(('[data-name="subjectField"][data-req="'+aa+'"]')).innerText;
	const formData = new FormData();
	formData.append("aa", aa);
	formData.append("name", name);

	const res = await runFetch("/api/acceptPeddingReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const chargesRes = await getChargesAndFill(); 
	}
}

async function rejectPeddingAccessReq(aa, protocol){
	if (!confirm(`Πρόκειται να απορριφθεί πρόσβαση στο πρωτόκολλο ${protocol};`)){
		return;
	}

	const formData = new FormData();
	formData.append("aa", aa);

	const res = await runFetch("/api/rejectPeddingAccessReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//return res;
		const resdec =  res.result;
		getPeddingAccessProtocolReqs();
		// const reqItems = document.querySelectorAll('[data-req="'+aa+'"]');
		// reqItems.forEach((elem) => {
		// 	elem.remove();
		// })
		alert("Το αίτημα πρόσβασης έχει απορριφθεί");
	}
}

async function acceptPeddingAccessReq(aa, protocol){
	if (!confirm(`Πρόκειται να δοθεί πρόσβαση στο πρωτόκολλο ${protocol};`)){
		return;
	}

	const formData = new FormData();
	formData.append("aa", aa);

	const res = await runFetch("/api/acceptPeddingAccessReq.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		//const chargesRes = await getChargesAndFill(); 
		getPeddingAccessProtocolReqs();
	}
}

function debounce(func, timeout = 1000){
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}