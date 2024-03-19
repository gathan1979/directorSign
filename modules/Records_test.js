import {uploadFileTest} from "./Upload.js";
import { createSearch } from "./Filter.js";
import {signals, abortControllers, getControllers} from "./UI_test.js";
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

let timer = null;

const signatureController = {};
const signatureSignal = {};

const entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
  };

function escapeHtml (string) {
	return String(string).replace(/[&<>"'`=\/]/g, function (s) {
		return entityMap[s];
	});
}



let MINDIGITAL = {
					name : "MINDIGITAL",
					middleware : () => mindigitallMiddleware(),
					params : {
						otp : {value: null, type : "number", persist : false, errorMsg : "Απαιτείται OTP"},
						token :{value : null, type : "string", persist : true, errorMsg : "Απαιτείται σύνδεση στο mindigital"}
					}
				};
let SCH	= 		{
					name : "SCH",
					middleware : () => schMiddleware(),
					params : {
						signature : {value: null, type : "string", persist : false, errorMsg : "Απαιτείται όνομα υπογραφής sch"}
					}
				};
let FF = 		{
					name : "FF",
					middleware : () => FFMiddleware(),
					params : {}
				};
let UPLOAD = 	{
					name : "UPLOAD",
					middleware : () => uploadMiddleware(),
					params : {
						selectedSignedFile : {field: "selectedSignedFile", type : "file", persist : false, errorMsg : "Απαιτείται επιλογή αρχείου"}
					}
				};

const signProviders = { MINDIGITAL, UPLOAD, FF, SCH};
Object.freeze(signProviders);

export function createActionsTemplate(){
    const signModalDiv =
        `<dialog class="customDialog" id="signModal" style="width: 90%;">
			<div class="customDialogContentTitle">
				<span style="font-weight:bold;" id="signDialogTitle">Υπογραφή Εγγράφου</span>
				<div class="topButtons" style="display:flex;gap: 7px;">
					<div class="topActionButtons"></div>
					<button class="isButton " name="closeSignModalBtn" id="closeSignModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
				</div>
			</div>
			<div class="customDialogContent">
				<div class="modal-body" id="signForm">
					<div id="attentionTextDiv"></div>
					<textarea id="signText" cols="100" rows="3" size="200" class="form-control" placeholder="Το σχόλιο είναι προαιρετικό" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
					<div id="providers" >
						<div id="signProvidersBtns" class="btn-group" role="group" aria-label="Basic example"></div>
						<div id="providerMiddleware" class="flexHorizontal" ></div>
					</div>
				</div>
			</div>

			<div class="contentFooter"></div>
		</dialog>`;
			

    const rejectModalDiv =
        `<dialog class="customDialog" id="rejectModal">
			<div class="customDialogContentTitle">
				<span style="font-weight:bold;" id="rejectDialogTitle">Οριστική Απόρριψη Εγγράφου</span>
				<div class="topButtons" style="display:flex;gap: 7px;">
					<div class="topActionButtons"></div>
					<button class="isButton " name="closeRejectModalBtn" id="closeRejectModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
				</div>
			</div>
			<div class="customDialogContent">
				<div class="modal-body" id="rejectForm">
					<textarea id="rejectText" cols="100" rows="3" size="200" class="form-control" placeholder="το κείμενο είναι απαραίτητο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
			</div>
			<div class="modal-footer"></div>
        </dialog>`;

	const returnModalDiv =
        `<dialog class="customDialog" id="returnModal">
			<div class="customDialogContentTitle">
				<span style="font-weight:bold;" id="returnDialogTitle">Επιστροφή Εγγράφου</span>
				<div class="topButtons" style="display:flex;gap: 7px;">
					<div class="topActionButtons"></div>
					<button class="isButton " name="closeReturnModalBtn" id="closeReturnModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
				</div>
			</div>
			<div class="customDialogContent">
				<div class="modal-body" id="returnForm">
					<textarea id="returnText" cols="100" rows="3" size="200" class="form-control" placeholder="το κείμενο είναι απαραίτητο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
			</div>
			<div class="modal-footer"></div>
        </dialog>`;


    const historyModalDiv =
        `<dialog class="customDialog" id="historyModal">
			<div class="customDialogContentTitle">
					<span style="font-weight:bold;" id="rejectDialogTitle">Ιστορικό Εγγράφου</span>
					<div class="topButtons" style="display:flex;gap: 7px;">
						<div class="topActionButtons"></div>
						<button class="isButton " name="closeHistoryModalBtn" id="closeHistoryModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
					</div>
			</div>
			<div class="customDialogContent">	
				<div id="historyBody" class="flexVertical" style="background-color: white;gap : 1em;"></div>
			</div>
			<div class="modal-footer"></div>
        </dialog>`;  

	if (document.querySelector("#signModal") !== null){
 		document.querySelector("#signModal").remove();
	}
	if (document.querySelector("#rejectModal") !== null){
		document.querySelector("#rejectModal").remove();
	}
	if (document.querySelector("#returnModal") !== null){
		document.querySelector("#returnModal").remove();
	}
	if (document.querySelector("#historyModal") !== null){
		document.querySelector("#historyModal").remove();
	}

	document.body.insertAdjacentHTML("beforeend",signModalDiv);
	document.body.insertAdjacentHTML("beforeend",rejectModalDiv);
	document.body.insertAdjacentHTML("beforeend",returnModalDiv);
	document.body.insertAdjacentHTML("beforeend",historyModalDiv);

    const loginData = JSON.parse(localStorage.getItem("loginData"));
    const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
    signProviders.SCH.params.signature.value = loginData?.user.roles[currentRole]?.signature;

    //Δημιουργία επιλογών παρόχου υπογραφής στο modal
    for (const [key, value] of Object.entries(signProviders)) {
        const btnId = "select"+value['name']+"Btn";
        const providerBtn = '<button type="button" id="'+btnId+'" class="btn btn-secondary" data-provider="'+value['name']+'">'+value['name']+'</button>';
        document.querySelector("#signProvidersBtns").innerHTML += providerBtn;
    }
    Array.from(document.querySelectorAll("#signProvidersBtns>button")).forEach( btn =>{
        btn.addEventListener("click",() => selectSignProvider(btn.dataset.provider));
    })

    //let signDocumentRef ;
    //let signDocumentWithObjRef;
    //let signDocumentAsLastRef;
    //let signExactCopyRef;
    //let rejectDocumentRef;
    //let returnDocumentRef;

    //Ενέργειες κατά την εμφάνιση και εξαφάνιση του modal
    document.querySelector("#signModal").addEventListener("show.bs.modal",(e)=> {
        
    });

    document.querySelector("#signModal").addEventListener("hide.bs.modal",(e)=> {
        const isExactCopy = e.target.dataset.isexactcopy;
        // if (+isExactCopy){
        // 	document.querySelector('#signExactCopyBtn').removeEventListener("click",signExactCopyRef);
        // }
        // else{
        // 	document.querySelector('#signBtn').removeEventListener("click",signDocumentRef);
        // 	document.querySelector('#signWithObjectionBtn').removeEventListener("click",signDocumentWithObjRef);
        // 	document.querySelector('#signAsLastBtn').removeEventListener("click",signDocumentAsLastRef);
        // }
        // if (localStorage.getItem("signProvider")!==null){
        // 	const provider = localStorage.getItem("signProvider");
        // 	switch (provider){
        // 		case "MINDIGITAL" :
        // 			document.querySelector("#otpText").removeEventListener("keyup",checkOTPLength);
        // 			break;
        // 		case "UPLOAD" :
        // 			document.querySelector("#selectedSignedFile").removeEventListener("change",selectFile);
        // 			break;
        // 	}
        // }
    })

}

//------------------------------------------------------ΑΠΟ ΕΔΩ ΚΑΙ ΚΑΤΩ ΜΕΘΟΔΟΙ ---------------------------------------------------------------------------------

// export async function getUserData(){
// 	const myHeaders = new Headers();
// 	myHeaders.append('Authorization', jwt);
// 	let init = {method: 'POST', headers : myHeaders};
// 	console.log(init);
// 	const res = await fetch("/api/getUserData.php",init);
// 	if (!res.ok){
// 		if (res.status>=400 && res.status <= 499){
// 			refreshToken();
// 			getUserData();
// 		}
// 		else{
// 			const error = new Error("unauthorized")
// 			error.code = "400"
// 			throw error;
// 		}
// 	}
// 	else{
// 		return res.json();
// 	}
// }

async function getRecordHistory(aa){
	const params = new URLSearchParams({
		aa
	});
	const res = await runFetch("/api/getRecordHistory.php", "GET", params);
	if (!res.success){
		alert(res.msg);
	}
	else{
		return res.result;
	}
}


export async function getSigRecords(signal, controllers) {
	document.querySelector("#syncRecords>i").classList.add('faa-circle');
	
	for (const [key, value] of Object.entries(controllers)) {
		if (key !== "toSign"){
			value.abort();
		}
	}

	const res = await runFetch("/api/getSigRecords.php", "GET", null, undefined, signal);
	if (!res.success){
		alert(res.msg);
	}
	else{
		document.querySelector("#syncRecords>i").classList.remove('faa-circle');
		fillTableToBeSigned(res.result);	
		return 1;
	}
}

function fillHistoryModal(result){
	//console.log("filling history");
	document.querySelector("#historyBody").innerHTML ="";
	let insertDate = result[0]['date'];
	for (let key=0;key<result.length;key++) {
		let tmpElement = "";
		if (+result[key]['nextLevel'] == -2){
			tmpElement = `<div class="flexHorizontal" style="background-color: tomato;">`;
		}
		else if (+result[key]['nextLevel'] == 0){
			tmpElement = `<div class="flexHorizontal" style="background-color: lightgreen;">`;
		}
		else{
			tmpElement = `<div class="flexHorizontal">`;
		}
		
		if (+result[key]['dep'] !== 0){
			tmpElement += '<div style="font-size:0.8em;margin:1em; flex-basis: 20%;"><i style="margin-right:0.5em;" class="fas fa-arrow-circle-down"></i>'+result[key]['depName']+'</div>';
		}
		else{
			tmpElement += '<div style="font-size:0.8em;margin:1em; flex-basis: 20%;"><i style="margin-right:0.5em;" class="fas fa-arrow-circle-down"></i>'+result[key-1]['nextLevelName']+'</div>';
		}
		if (result[key]['hasObjection'] ==1){
			tmpElement += '<span style="align-self: center;margin-left:3px;background-color :darkorange!important" class="badge rounded-pill bg-warning " title="έγγραφη αντίρρηση"><i class="fas fa-exclamation-circle"></i></span>';
		}
		let openfileBtn = "";
		if ( result[key]['filename'] !==""){
			openfileBtn = `<button  id="historyRecord_${result[key]['aa']}" class="btn btn-success btn-sm" >${result[key]['filename']}</button>`;

		}  
		tmpElement += '<div style="width:30%;" class="filenameDiv">'+openfileBtn+"</div><div style='width:30%;text-align:center;'>"+
										result[key]['fullname']+"</div><div style='width:20%;text-align:center;'>"+
										result[key]['comments']+"</div><div style='width:20%;text-align:center;'>"+result[key]['date']+"</div>";
		tmpElement +="<div>";
		
        //console.log(tmpElement);
        document.querySelector("#historyBody").innerHTML += tmpElement;
	}
	for (let key=0;key<result.length;key++) {
		if ( result[key]['filename'] !==""){
			document.querySelector("#historyRecord_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['filename'],insertDate));
		}
	}
}

export function fillTableToBeSigned(result){
	//const table = $('#example1').DataTable();
	//table.clear().draw();
	const table = document.querySelector("#dataToSignTable>tbody");
	table.innerHTML = "";

	if (localStorage.getItem("loginData") == null){
		alert("Δεν υπάρχουν πληροφορίες σύνδεσης");
		return null;
	}
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const department = loginData.user.roles[currentRole].department;
	if (department === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες ιδιότητας χρήστη");
		return null;
	}
	const accessLevel = loginData.user.roles[currentRole].accessLevel;
	if (accessLevel === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες ιδιότητας χρήστη");
		return null;
	}

	for (let key=0;key<result.length;key++) {
		//document.querySelector("#"+tableName+">tr")
		let row = table.insertRow(-1); // We are adding at the end
		let c1 = row.insertCell(0);
		let c2 = row.insertCell(1);
		let c3 = row.insertCell(2);
		let c4 = row.insertCell(3);
		let c5 = row.insertCell(4);

		row.dataset.diff = result[key].diff;
		row.dataset.author = result[key].fullName;
		row.dataset.currentDep = result[key].currentDep;
		row.dataset.isExactCopy = result[key].isExactCopy;
		row.dataset.isReturned = result[key].isReturned;

		let temp1=[];
		let filenameBtn = "";

		let relevantDocs = result[key].relevantDocs;
		let relevantDocsArray = relevantDocs.split("*");
		let relevantDocsElement = "";
		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")){
			for (let l=0;l<relevantDocsArray.length;l++){
				relevantDocsElement +='<i style="cursor : pointer;" id="rel_btn_'+result[key]['aa']+'_'+l+'" class="fas fa-paperclip" title="'+relevantDocsArray[l]+'"></i>';
			}
		}
		
		if (!result[key].isExactCopy){
			filenameBtn = '<div class="filenameDiv"><button style="width:70%;" id="btn_'+result[key]['aa']+'" class="btn btn-warning btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton outline fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+'</div>';
		}
		else{
			filenameBtn = '<div class="filenameDiv"><button style="width:70%;" id="btn_'+result[key]['aa']+'" class="btn btn-info btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton outline fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+'</div>';
		}

		let attention = ""
		if (result[key].objection>0){
			attention = '<span style="margin-left:3px;background-color :darkorange!important" class="badge rounded-pill bg-warning " title="έγγραφη αντίρρηση"><i class="fas fa-exclamation-circle"></i></span>';
			//attention = '<button  class="btn btn-warning btn-sm" type="button" disabled style="margin-left:3px;"  title="έγγραφη αντίρρηση"><i class="fas fa-exclamation-circle"></i></button>';
		}

		temp1[0] = filenameBtn;
		temp1[1] = result[key].date;
		temp1[2] = result[key].fullName;

		let recordStatus = "";
		if (!result[key].isExactCopy){
			for (let i=0;i<result[key].levels;i++){
				if (i<result[key].diff){
					recordStatus += '<span style="margin-left:3px;" class="badge rounded-pill bg-success "><i class="fas fa-calendar-check"></i></span>';
					//recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-success btn-sm"><i class="fas fa-calendar-check"></i></button>';
				}
				else{
					recordStatus += '<span style="margin-left:3px;" class="badge rounded-pill bg-secondary "><i class="fas fa-calendar-times"></i></span>';
					//recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-secondary btn-sm"><i class="fas fa-calendar-times"></i></button>';
				}
			}
			if(result[key].isReturned){
				recordStatus += '<span style="margin-left:3px;" class="badge rounded-pill bg-warning "><i class="fas fa-undo"></i></span>';
				//recordStatus += '<button  class="btn btn-warning btn-sm" type="button" disabled style="margin-left:3px;" title="από επιστροφή"><i class="fas fa-undo"></i></button>';
			}
			recordStatus += attention;
		}
		else{
			recordStatus = "Ακριβές Αντίγραφο";
		}
		temp1[3] =  recordStatus;

		let signModalBtn = "";
		let historyBtn = "";
		let rejectBtn = "";
		let returnBtn = "";
		let reuploadFile = "";
		if (result[key].currentDep == department){  // το τρέχον τμήμα του εγγράφου είναι ίδιο με το τμήμα του χρήστη
			if (result[key].isExactCopy){
				signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="isButton active"  data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
			}
			
			if (result[key].isReturned){   // πρόκειται για επιστροφή
				if(result[key].dep == department){  // το αρχικό τμήμα του εγγράφου είναι ίδιο με το τμήμα του χρήστη (το έγγραφο επέστρεψε στο τμήμα του)
					if (result[key].lastFileRecord ==""){ // το έγγραφο είναι σε κάθοδο
						if(result[key].userId == loginData.user.aa_user){ // o χρήστης είναι αυτός που ανέβασε το έγγραφο αρχικά	
							reuploadFile = `<div class="uploadBtns" forRecord="${result[key]['aa']}"><button class="isButton primary " title="Προσθήκη νέου εγγράφου"><i class="far fa-plus-square"></i></button></div>`;
						}
						//if(result[key].lastUserDepartment !== department){ // ο τελευταίος που επεξεργάστηκε το αρχείο δεν ανήκει στο τμήμα οπότε επιστρέφει στον προϊστάμενο
							//if (loginData.user.roles[currentRole].accessLevel == 1){ //ο χρήστης είναι ο προϊστάμενος του τμήματος
								
							//}
						//}
							
					}
					else{ // Το έγγραφο είναι στο τμήμα και είναι σε άνοδο
						if (loginData.user.roles[currentRole].accessLevel == 1){ //ο χρήστης είναι ο προϊστάμενος του τμήματος
							signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="isButton active"  data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
						}
					}
					
				}
				else{  // Το τμήμα είναι διαφορετικό από το τρέχον τμήμα του εγγράφου
                   // signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="isButton active"  data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
				}
			}
			else{
				if (accessLevel==1){
					signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="isButton active"  data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
					if (!result[key].isExactCopy){
						returnBtn = '<button id="showReturnModal'+result[key]['aa']+'" type="button" class="isButton warning"  data-whatever="'+result[key].aa+'">'+'<i class="fas fa-arrow-down" data-toggle="tooltip" title="Επιστροφή Εγγράφου"></i>'+"</button>";
					}
				}
			}
		}	
		historyBtn = '<button id="showHistoryModal'+result[key]['aa']+'" class="isButton small primary" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i></button>';
		rejectBtn = '<button id="showRejectModal'+result[key]['aa']+'"  class="isButton small dismiss" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-ban" data-toggle="tooltip" title="Οριστική Απόρριψη"></i>'+"</button>";
		temp1[4] = 	'<div class="recordButtons">'+reuploadFile+signModalBtn+returnBtn+historyBtn+rejectBtn+'</div>';

		c1.innerHTML = temp1[0];
		c2.innerHTML = temp1[1];
		c3.innerHTML = temp1[2];
		c4.innerHTML = temp1[3];
		c5.innerHTML = temp1[4];

		

		if(document.querySelector("#showSignModalBtn"+result[key]['aa'])){
			document.querySelector("#showSignModalBtn"+result[key]['aa']).addEventListener("click", (event) => {
				const modalButtonsDivContent = `<div id="signBtngroup" class="flexHorizontal" aria-label="signBtnGroup">
                                <button id="signWithObjectionBtn"  type="button" class="btn btn-danger btn-sm" >Έγγραφη αντίρρηση</button>
                                <button id="signAsLastBtn"  type="button" class="btn btn-warning btn-sm">Τελικός υπογράφων</button>
                                <button id="signBtn"  type="button" class="btn btn-success btn-sm">Υπογραφή</button>
                                <button id="signExactCopyBtn"  type="button" class="btn btn-success btn-sm">Υπογραφή Aκριβούς Aντιγράφου</button>
                                <div id="signSpinner" class="spinner-border text-success" role="status">
                                    <span class="visually-hidden">Loading...</span>
                                </div>
                            </div>`;
        
				document.querySelector("#signModal .contentFooter").innerHTML = modalButtonsDivContent;
				document.querySelector("#signSpinner").style.display = 'none';
				
				const recordAA = event.currentTarget.getAttribute('data-whatever');
				const isExactCopy = event.currentTarget.getAttribute('data-isExactCopy');
				document.querySelector("#signModal").dataset.isexactcopy = isExactCopy;
				
				if (+isExactCopy){
					document.querySelector("#signDialogTitle").innerText ="Υπογραφή Ακριβούς Αντιγράφου";
					document.querySelector("#attentionTextDiv").style.display = "none";
					document.querySelector("#signText").style.display = "none";
					document.querySelector('#signAsLastBtn').style.display = "none";
					document.querySelector('#signWithObjectionBtn').style.display = "none";
					document.getElementById("signBtn").style.display = "none";
					document.querySelector('#signExactCopyBtn').style.display = "inline-block";
				}
				else{
					document.querySelector("#signDialogTitle").innerText ="Υπογραφή Εγγράφου";
					//Εξέταση αν υπάρχει στην τοπική μνήμη provider, αν όχι ορισμός mindigital

					if (+loginData.user.roles[localStorage.getItem("currentRole")].canSignAsLast){
						document.querySelector('#signAsLastBtn').style.display = "inline-block";
					}else{
						document.querySelector('#signAsLastBtn').style.display = "none";
					}
					document.querySelector('#signWithObjectionBtn').style.display = "inline-block";
					document.getElementById("signBtn").style.display = "inline-block";
					document.querySelector("#attentionTextDiv").style.display = "block";
					document.querySelector("#signText").style.display = "block";
					document.querySelector('#signExactCopyBtn').style.display = "none";

				}
				document.querySelector('#signSpinner').style.display = "none";
				
				(localStorage.getItem("signProvider")==null?localStorage.setItem("signProvider",signProviders.MINDIGITAL.name):localStorage.getItem("signProvider"));
				//Εξέταση αν οι απαραίτητες τιμές του middleware του provider έχουν οριστεί
				let signProvider = localStorage.getItem("signProvider");
				selectSignProvider(signProvider);
				//Υπογραφή signDocument(aa, isLast=0, objection=0, isExactCopy=0)

				if (+isExactCopy){
					//signExactCopyRef = () => signExactCopy(+recordAA);
					document.querySelector('#signExactCopyBtn').addEventListener("click",() => signExactCopy(+recordAA));
				}
				else{
					//signDocumentRef = () => signDocument(+recordAA);
					//signDocumentWithObjRef = () => signDocument(+recordAA, 0, 1);
					//signDocumentAsLastRef = () => signDocument(+recordAA, 1, 0);
					document.querySelector('#signBtn').addEventListener("click",() => signDocument(+recordAA));
					document.querySelector('#signWithObjectionBtn').addEventListener("click",() => signDocument(+recordAA, 0, 1));
					document.querySelector('#signAsLastBtn').addEventListener("click",() => signDocument(+recordAA, 1, 0));
				}	

				document.querySelector("#signModal").showModal();
			})
		}

		if(document.querySelector("#showRejectModal"+result[key]['aa'])){
			document.querySelector("#showRejectModal"+result[key]['aa']).addEventListener("click", (event) => {
				document.querySelector("#rejectModal .topActionButtons").innerHTML = `<button id="rejectButton" type="button" class="btn btn-danger" disabled>Απόρριψη</button>`;
				const recordAA = event.currentTarget.getAttribute('data-whatever');
				const isExactCopy = event.currentTarget.getAttribute('data-isExactCopy');
				//console.log(recordAA, isExactCopy);
				const relevantBtn = document.querySelector("#rejectButton");
				const relevantText = document.querySelector("#rejectText");
				relevantText.value = "";
				relevantText.addEventListener("keyup",()=> {if(relevantText.value != ""){relevantBtn.removeAttribute("disabled")}else{relevantBtn.setAttribute("disabled",true)} });
				relevantBtn.addEventListener("click", async () => {
					const res = await rejectDocument(+recordAA, isExactCopy);
					document.querySelector("#rejectModal").close();
				});
				document.querySelector("#rejectModal").showModal();
			})
		}


		if(document.querySelector("#showReturnModal"+result[key]['aa'])){
			document.querySelector("#showReturnModal"+result[key]['aa']).addEventListener("click", (event) => {
				document.querySelector("#returnModal .topActionButtons").innerHTML = `<button id="returnButton" type="button" class="btn btn-danger" disabled>Επιστροφή Εγγράφου</button>`;
				const recordAA = event.currentTarget.getAttribute('data-whatever');
				//console.log(recordAA, isExactCopy);
				const relevantBtn = document.querySelector("#returnButton");
				const relevantText = document.querySelector("#returnText");
				relevantText.value = "";
				relevantText.addEventListener("keyup",()=> {if(relevantText.value != ""){relevantBtn.removeAttribute("disabled")}else{relevantBtn.setAttribute("disabled",true)} });
				relevantBtn.addEventListener("click", async () => {
					const res = await returnDocument(+recordAA);
					document.querySelector("#returnModal").close();
				});
				document.querySelector("#returnModal").showModal();
			})
		}

		if(document.querySelector("#showHistoryModal"+result[key]['aa'])){
			document.querySelector("#showHistoryModal"+result[key]['aa']).addEventListener("click", async (event) => {
				const recordAA = event.currentTarget.getAttribute('data-whatever');
				const resDecoded = await getRecordHistory(recordAA);
				fillHistoryModal(resDecoded);
				document.querySelector("#historyModal").showModal();
			})
		}

		document.querySelector("#btn_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['filename'],result[key].date));
		// result[key].preview_file_last  Τελευταίο αρχείο που υπάρχει στον πίνακα για αυτό το αα
		document.querySelector("#btn_"+result[key]['aa']+"_position").addEventListener("click",()=> window.open("pdfjs-3.4.120-dist/web/viewer.html?file="+result[key]['preview_file_last']+"&insertDate="+result[key].date+"&id="+result[key].aa+"#zoom=page-fit"));

		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				document.querySelector("#rel_btn_"+result[key]['aa']+"_"+l).addEventListener("click",()=>viewFile(relevantDocsArray[l],result[key].date));
			}
		}
	}

	[...document.querySelectorAll(".uploadBtns")].forEach( btn => {
		btn.addEventListener("click",(event) =>{
			document.querySelector("#uploadModal").showModal();
			document.querySelector("#fileUploadDiv").setAttribute("forrecord",event.currentTarget.getAttribute("forrecord"));
		})
	})

	document.querySelector("#closeSignModalBtn").addEventListener("click", () => {document.querySelector("#signModal").close();});
	document.querySelector("#closeRejectModalBtn").addEventListener("click", () => {document.querySelector("#rejectModal").close();});
	document.querySelector("#closeReturnModalBtn").addEventListener("click", () => {document.querySelector("#returnModal").close();});
	document.querySelector("#closeHistoryModalBtn").addEventListener("click", () => {document.querySelector("#historyModal").close();});
	createSearch();
}

function openMoveToProtocolDialog(filename, folder="",relevantDocs){   // filename το όνομα αρχείου, folder η ημερομηνία
	if (document.querySelector("#fileMoveDialog")){
		document.querySelector("#fileMoveDialog").innerHTML =
		`
		<div class="customDialogContentTitle">
			<span>${filename}</span>
			<button class="btn btn-secondary" name="closeFileMoveModalBtn" id="closeFileMoveModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
		</div>
		<div class="customDialogContent">	
			<div>
				<form>
					<div class="flexVertical" style="padding:5px;">
						<span >Μεταφορά σε Πρωτόκολλο</span>
						<div class="flexHorizontal">
							<input type="number" class="form-control form-control-sm" id="linkRelativeField" placeholder="αρ.πρωτ" value="">&nbsp/&nbsp
							<input type="number" class="form-control form-control-sm" id="linkRelativeYearField" value="${localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear()}">
						</div>
						<button id="saveFileMoveDialogBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
					</div>
				</form>
			</div>
			<div id="searchProtocolResultDiv" style="font-style:italic;"></div>
		<div>`;
		document.querySelector("#linkRelativeField").addEventListener("keyup",() => prepareFindProtocolDebounce());
		//document.querySelector("#linkRelativeYearField").addEventListener("keyup",() => prepareFindProtocolDebounce());
		document.querySelector("#linkRelativeYearField").addEventListener("input",() => prepareFindProtocolDebounce());
		document.querySelector("#saveFileMoveDialogBtn").addEventListener("click",() =>prepeareMoveSignedToProtocol(filename, folder,relevantDocs));
		document.querySelector("#closeFileMoveModalBtn").addEventListener("click",() => closeFileMoveDialog());		
		document.querySelector("#fileMoveDialog").showModal();
	}
} 

function prepeareMoveSignedToProtocol(filename, folder, relevantDocs){
	if(filename === ""){
		alert("Δεν έχει οριστεί όνομα αρχείου. Επικοινωνήστε με το διαχειριστή");
		return;
	}
	if(folder === ""){
		alert("Δεν έχει οριστεί ημερομηνία αρχείου. Επικοινωνήστε με το διαχειριστή");
		return;
	}
	else if(document.querySelector("#linkRelativeField").value == ""){
		alert("Δεν έχει οριστεί σχετικό πρωτόκολλο για μεταφορά");
		return;
	}
	else if(document.querySelector("#linkRelativeYearField").value == ""){
		alert("Δεν έχει οριστεί σχετικό έτος πρωτοκόλλου για μεταφορά");
		return;
	}
	moveSignedToProtocol(filename,folder, relevantDocs, document.querySelector("#linkRelativeField").value,document.querySelector("#linkRelativeYearField").value);
}

function prepareFindProtocolDebounce(){
	const debouncedFilter = debounce( () => findLinkProtocol(document.querySelector("#linkRelativeField").value,document.querySelector("#linkRelativeYearField").value));
	debouncedFilter();
}

function debounce(func, timeout = 1000){
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}

async function findLinkProtocol(protocolNo, currentYear){
	if(protocolNo == ""){
		document.querySelector("#searchProtocolResultDiv").innerHTML = "";
		return;
	}
	else if(currentYear == ""){
		document.querySelector("#searchProtocolResultDiv").innerHTML = "";
		return;
	}
	let urlParams = new URLSearchParams({protocolNo});

	const res = await runFetch("/api/getLinkProtocol.php", "GET", urlParams);
	if (!res.success){
		alert(res.msg);
	}
	else{
		document.querySelector("#searchProtocolResultDiv").innerHTML = res.result;
	}
}

function closeFileMoveDialog(){
	document.querySelector("#fileMoveDialog").close();
}

async function moveSignedToProtocol(filename, folder="",relevantDocs, protocolNo, year){
	const formdata = new FormData();
	formdata.append("filename", filename);
	formdata.append("folder",folder);
	formdata.append("relevantDocs",relevantDocs);
	formdata.append("protocolNo",protocolNo);
	formdata.append("year",year);

	const res = await runFetch("/api/moveSignedToProtocol.php", "POST", formdata);
	if (!res.success){
		alert(res.msg);
	}
	else{
		alert("Το αρχείο μεταφέρθηκε με επιτυχία");
		document.querySelector("#fileMoveDialog").close();
	}
}

export async function viewFile(filename, folder=""){
	if(filename === ""){
		alert("Δεν έχει οριστεί όνομα αρχείου");
		return;
	}
	const urlpar = new URLSearchParams({filename : encodeURIComponent(filename), folder});

	const res = await runFetch("/api/viewFile.php", "GET", urlpar, FetchResponseType.blob);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const dispHeader = res.responseHeaders.get('Content-Disposition');
		if (dispHeader !== null){
			const parts = dispHeader.split(';');
			filename = parts[1].split('=')[1];
			filename = filename.replaceAll('"',"");
		}
		else{
			filename = "tempfile.tmp";
		}
		const fileExtension = filename.split('.').pop();
		const blob = res.result;
		const href = URL.createObjectURL(blob);
		const inBrowser = ['pdf','PDF','html','htm','jpg','png'];

		if (inBrowser.includes(fileExtension)){
			if (document.querySelector("#fileOpenDialog")){
				document.querySelector("#fileOpenDialog").innerHTML =
				`<div><div style="margin-bottom:10px;">Χρήση του αρχείου για : </div><div>
				<button class="btn btn-primary" id="fileOpenFromDialogBtn">Άνοιγμα</button>
				<button class="btn btn-success" id="fileSaveFromDialogBtn">Αποθήκευση</button>
				<button class="btn btn-secondary" id="fileCloseDialog">Κλείσιμο</button></div></div>`;
				document.querySelector("#fileOpenFromDialogBtn").addEventListener("click",() => openFromDialog(href, filename));
				document.querySelector("#fileSaveFromDialogBtn").addEventListener("click",() => saveFromDialog(href, filename));
				document.querySelector("#fileCloseDialog").addEventListener("click",() => closeFromDialog());
				document.querySelector("#fileOpenDialog").showModal();
			}
			return;
		}
		else{
			const aElement = document.createElement('a');
			aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
			Object.assign(aElement, {
			href,
			download: decodeURI(filename)
			}).click();
		}
	}
}

function openFromDialog(href,filename){
	const pdfWin = window.open(href);
	//pdfWin.document.title = decodeURI(filename);
	setTimeout(()=>{pdfWin.document.title = decodeURI(filename)},1000);
	closeFromDialog();
}

function saveFromDialog(href,filename){
	const aElement = document.createElement('a');
	aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
	Object.assign(aElement, {
	href,
	download: decodeURI(filename)
	}).click();
	closeFromDialog();
}

function closeFromDialog(){
	document.querySelector("#fileOpenDialog").close();
}


//-------------------------------------------------------ΥΠΟΓΡΑΦΗ ΑΚΡΙΒΟΥΣ ΑΝΤΙΓΡΑΦΟΥ-------------------------------------------------------------------------

export async function signExactCopy(aa){
	if (signatureController.controller !== undefined){
		try{
			signatureController.controller.abort();
		}
		catch(e){
			console.log("aborted")
		}
	}

	//document.querySelector('#signExactCopyBtn').setAttribute("disabled",true);
	document.querySelector('#signSpinner').style.display = "inline-block";
	document.querySelector('#signExactCopyBtn').setAttribute("disabled", true);

	let providerExists = 0;
	let providerName = "";
	let params = {};
	//Έλεγχος αν υπάρχει πάροχος στη μνήμη
	if (localStorage.getItem("signProvider")!==null){
		providerName = localStorage.getItem("signProvider");
	}
	else{
		alert("Δεν υπάρχει πάροχος υπογραφής αποθηκευμένος");
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}

	//Έλεγχος αν ο πάροχος στη μνήμη ανήκει στους διαθέσιμους (signProviders)
	providerExists = Object.values(signProviders).reduce((accum, current) =>{
		if (providerName === current.name){
			accum+=1;
			params = current.params;
		}
		return accum;
	},0);
	if (providerExists === 0){
		alert("Ο συγκεκριμένος πάροχος υπογραφής δε βρέθηκε");
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}

		//Έλεγχος αν οι παράμετροι που πρέπει να είναι στη μνήμη υπάρχουν και φόρτωσή τους
		//Έλεγχος αν οι παράμετροι όλες έχουν τιμές, όπως πρέπει
	const keys = Object.keys(params);

	let errorMsgs = keys.reduce((prev,key, index) =>
		{
			if (params[key].persist){
				if(localStorage.getItem(providerName+"_"+key)!==null){
					signProviders[providerName]["params"][key].value = localStorage.getItem(providerName+"_"+key);
					return prev;
				}
				else{
					return prev+signProviders[providerName]["params"][key].errorMsg+". ";
				}
			}
			if (params[key].value === null || params[key].value === ""){
				return prev+signProviders[providerName]["params"][key].errorMsg+". ";
			}
			return prev;

		},"");
	if (errorMsgs !==""){
		alert("Δεν έχουν οριστεί οι παράμετροι της υπογραφής. "+ errorMsgs);
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}
		//----------------------------------------------------------------------------------------------------
	signatureController.controller = new AbortController();
	signatureSignal.signal = signatureController.controller.signal;

	//const comment = document.getElementById('signText').value;
	let formData = new FormData();
	// signDocument(aa, isLast=0, objection=0)
	formData.append("aa", aa);
	//formData.append("comment", comment);
	//formData.append("objection", objection);
	//formData.append("isLast", isLast);
	formData.append("provider", providerName);
	const extraFieldsStatus =keys.every( key => {
		if (params[key].type === "file"){
			const fileInput = document.querySelector("#"+signProviders[providerName]["params"][key].field);
			if (fileInput.files.length !==0){
				formData.append(key, fileInput.files[0]);
				return true;
			}
			else{
				alert("επιλέξτε υπογεγραμμένο αρχείο");
				return false;
			}
		}
		else{
			formData.append(key, signProviders[providerName]["params"][key].value);
			return true;
		}
	});
	if (!extraFieldsStatus){
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	};

	const res = await runFetch("/api/signSendFile.php", "POST", formData, undefined, signatureSignal.signal);
	if (!res.success){
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		alert (res.msg);
	}
	else{
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";

		if(providerName === "MINDIGITAL"){
			document.querySelector("#otpText").value = "";
		}
		document.querySelector("#signModal").close();

		abortControllers.toSign = new AbortController();
		signals.toSign = abortControllers.toSign.signal;
		const records = getSigRecords(signals.toSign, getControllers()).then( res => {
			//createSearch();
			alert("Το έγγραφο έχει υπογραφεί! Μάλλον...");
		}, rej => {});	

		// alert("Το έγγραφο έχει υπογραφεί! Μάλλον...");
		// const records = getSigRecords().then( res => {
		// 	createSearch();
		// }, rej => {});
	}
	console.log(signatureController);
}

//-----------------------------------------------------ΥΠΟΓΡΑΦΗ ΕΓΓΡΑΦΟΥ ΚΑΙ ΛΟΙΠΑ------------------------------------------------------------------------------

export async function signDocument(aa, isLast=0, objection=0){
	document.querySelector('#signBtn').setAttribute("disabled",true);
	document.querySelector('#signSpinner').style.display = "inline-block";

	let providerExists = 0;
	let providerName = "";
	let params = {};
	//Έλεγχος αν υπάρχει πάροχος στη μνήμη
	if (localStorage.getItem("signProvider")!==null){
		providerName = localStorage.getItem("signProvider");
	}
	else{
		alert("Δεν υπάρχει πάροχος υπογραφής αποθηκευμένος");
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}

	//Έλεγχος αν ο πάροχος στη μνήμη ανήκει στους διαθέσιμους (signProviders)
	providerExists = Object.values(signProviders).reduce((accum, current) =>{
		if (providerName === current.name){
			accum+=1;
			params = current.params;
		}
		return accum;
	},0);
	if (providerExists === 0){
		alert("Ο συγκεκριμένος πάροχος υπογραφής δε βρέθηκε");
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}

	//Έλεγχος αν οι παράμετροι που πρέπει να είναι στη μνήμη υπάρχουν και φόρτωσή τους
	//Έλεγχος αν οι παράμετροι όλες έχουν τιμές, όπως πρέπει
	const keys = Object.keys(params);

	let errorMsgs = keys.reduce((prev,key, index) =>
		{
			if (params[key].persist){
				if(localStorage.getItem(providerName+"_"+key)!==null){
					signProviders[providerName]["params"][key].value = localStorage.getItem(providerName+"_"+key);
					return prev;
				}
				else{
					return prev+signProviders[providerName]["params"][key].errorMsg+". ";
				}
			}
			if (params[key].value === null || params[key].value === ""){
				return prev+signProviders[providerName]["params"][key].errorMsg+". ";
			}
			return prev;

		},"");
	if (errorMsgs !==""){
		alert("Δεν έχουν οριστεί οι παράμετροι της υπογραφής. "+ errorMsgs);
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	}

	const comment = document.getElementById('signText').value;
	let formData = new FormData();
	// signDocument(aa, isLast=0, objection=0)
	formData.append("aa", aa);
	formData.append("comment", comment);
	formData.append("objection", objection);
	formData.append("isLast", isLast);
	formData.append("provider", providerName);
	const extraFieldsStatus =keys.every( key => {
		if (params[key].type === "file"){
			const fileInput = document.querySelector("#"+signProviders[providerName]["params"][key].field);
			if (fileInput.files.length !==0){
				formData.append(key, fileInput.files[0]);
				return true;
			}
			else{
				alert("επιλέξτε υπογεγραμμένο αρχείο");
				return false;
			}
		}
		else{
			formData.append(key, signProviders[providerName]["params"][key].value);
			return true;
		}
	});
	if (!extraFieldsStatus){
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		return;
	};


	const res = await runFetch("/api/signDoc.php", "POST", formData, undefined);

	if (!res.success){
		document.querySelector('#signSpinner').style.display = "none";
		document.querySelector('#signBtn').removeAttribute("disabled");
		alert (res.msg);
	}
	else {
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		if(providerName === "MINDIGITAL"){
			document.querySelector("#otpText").value = "";
		}
		document.querySelector("#signModal").close();
		// const records = getSigRecords().then( res => {
		// 	createSearch();
		// }, rej => {});
		// alert(res.msg);
		abortControllers.toSign = new AbortController();
		signals.toSign = abortControllers.toSign.signal;
		const records = getSigRecords(signals.toSign, getControllers()).then( res => {
			createSearch();
			alert("Το έγγραφο έχει υπογραφεί. Μάλλον ...");
		}, rej => {});	
	}
}


export async function rejectDocument(aa, isExactCopy=0){
	const comment = document.getElementById('rejectText').value;
	let formData = new FormData();
	formData.append("aa",aa);
	formData.append("comment", comment);
	formData.append("isExactCopy", isExactCopy);
	const res = await runFetch("/api/rejectDoc.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const resdec = res.result;
		const rejectDialog = document.querySelector("#rejectModal");
		rejectDialog.close();

		abortControllers.toSign = new AbortController();
		signals.toSign = abortControllers.toSign.signal;
		const records = getSigRecords(signals.toSign, getControllers()).then( res => {
			//createSearch();
			alert("Το έγγραφο έχει διαγραφεί! Μάλλον...");
		}, rej => {});	
	}
}

export async function returnDocument(aa){

	const comment = document.getElementById('returnText').value;
	let formData = new FormData();
	formData.append("aa",aa);
	formData.append("comment", comment);

	const res = await runFetch("/api/returnDoc.php","POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const resdec = res.result;
		document.querySelector("#returnModal").close();
		alert("Το έγγραφο έχει επιστραφεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			//createSearch();
		}, rej => {});
	}
}

function selectSignProvider(providerName){
	let middleware = null;
	let params = null;
	//Έλεγχος αν υπάρχει ο συγκεκριμένος provider στη λίστα, αν όχι ορισμός mindigital
	const providerExists = Object.values(signProviders).reduce((accum, current) =>{
		if (providerName === current.name){
			accum+=1;
			middleware = current.middleware;
			params= current.params;
		}
		return accum;
	},0);
	if (providerExists === 0){
		providerName = signProviders.MINDIGITAL.name;
		middleware = signProviders.MINDIGITAL.middleware;
		params = signProviders.MINDIGITAL.params;
	}
	//-----------------------------------------------------------
	//Update UI --------------------
	//Ανανέωση εμφάνισης κουμπιών παρόχων εντός του modal
	const providersBtns = document.querySelectorAll("#signProvidersBtns>button");
	Array.from(providersBtns).forEach( btn => {
		if (providerName === btn.dataset.provider){
			if (btn.classList.contains('btn-secondary')){
				btn.classList.remove('btn-secondary');
				btn.classList.add('btn-primary');
			}
		}
		else{
			btn.classList.remove('btn-primary');
			btn.classList.add('btn-secondary');
		}
	});
	//---------------------------------------------------------------
	//const signBtn = document.getElementById("signBtn");
	//const signAsLastBtn = document.getElementById("signAsLastBtn");
	//const signWithObjectionBtn = document.getElementById("signWithObjectionBtn");

	//signBtn.innerHTML = 'Υπογραφή '+providerName+'<i style="margin-left:0.2em;" class="fas fa-signature"></i>';

	const otpBtn = document.getElementById("requestOTPBtn");
	const otpText = document.getElementById("otpText");
	const providerDiv = document.getElementById("providerMiddleware");
	providerDiv.innerHTML = "";
	//Εμφάνιση κουμπιών παρόχου
	if (middleware !== null){  //απαιτείται ενδιάμεσο βήμα
		signProviders[providerName].middleware();
	}

	// φόρτωση μεταβλητών από μνήμη, όπου απαιτείται και αν υπάρχουν. Μορφή πάροχος_παράμετρος
	const keys = Object.keys(params);
	keys.forEach( key =>
	{
		if (params[key].persist){
			if (localStorage.getItem(providerName+"_"+key)!==null){
				signProviders[providerName]["params"][key].value = localStorage.getItem(providerName+"_"+key)
			}
			else{
				//alert(params[key].errorMsg);
			}
		}
	})

	if (localStorage.getItem("signProvider") !==providerName){
		localStorage.setItem("signProvider",providerName);
	}
}


function enableRejectButton(){
	if(document.getElementById("rejectText").value != "") {
		document.getElementById("rejectButton").removeAttribute("disabled");
	}
	else{
		document.getElementById("rejectButton").setAttribute("disabled",true);
	}
}

function enableReturnButton(){
	if(document.getElementById("returnText").value != "") {
		document.getElementById("returnButton").removeAttribute("disabled");
	}
	else{
		document.getElementById("returnButton").setAttribute("disabled",true);
	}
}

function checkOTPLength(event){
	signProviders.MINDIGITAL.params.otp.value = event.target.value;
	//console.log(signProviders.MINDIGITAL);
}

function checkSchName(event){
	signProviders.SCH.params.signature.value = event.target.value;
	//console.log(signProviders.SCH);
}

function selectFile(event){
	signProviders.UPLOAD.params.selectedSignedFile.value = event.target.value;
	//console.log(signProviders.UPLOAD);
}

function mindigitallMiddleware(){
	//console.log(MINDIGITAL);
	MINDIGITAL.params.otp.value = null;
	const providerDiv = document.querySelector("#providerMiddleware");
	providerDiv.innerHTML =
		`<div class="providerHeader flexHorizontal">
			<div id="mindigitalConnection" class="flexVertical">
				<div id="mindigitalTitle" style="font-weight:bold; text-align:center;">
					Mindigital
					<div id="mindigitalSpinner" class="spinner-border spinner-border-sm" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
				<div id="mindigitalConnectionDiv" class="flexHorizontal">
					<div id="mindigitalStatusDiv"  class="flexVertical">
						<button id="mindigitalConnectionButton" class="btn btn-danger btn-sm" data-toggle="tooltip" title="Σύνδεση στο mindigital"><i class="fas fa-file-signature"></i></button>
					</div>
					<div id="mindigitalConnectionBtns"  class="flexVertical">
						<input class="form-control form-control-sm" type="text" id="mindigitalUsername" placeholder="mindigital username"/>
						<input class="form-control form-control-sm" type="password" id="mindigitalPassword" placeholder="mindigital password"/>
					</div>
				</div>
			</div>
			<div id="emailConnection" class="flexVertical" style="display:none;">
				<div id="emailTitle"  style="font-weight:bold;text-align:center;">
					@Email
					<div id="emailSpinner" class="spinner-border spinner-border-sm" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
				<div id="emailConnectionDiv" class="flexHorizontal">
					<div id="emailStatusDiv"  class="flexVertical">
						<button id="emailConnectionButton" class="btn btn-danger btn-sm" data-toggle="tooltip" title="Σύνδεση στο email"><i id="faMail" class="far fa-envelope-open"></i></button>
					</div>
					<div id="emailConnectionBtns"  class="flexVertical">
						<input class="form-control form-control-sm" type="text" id="emailUsername" placeholder="email username"/>
						<input class="form-control form-control-sm" type="password" id="emailPassword" placeholder="email password"/>
					</div>
				</div>
			</div>
		</div>
		<div class="providerContent flexHorizontal" style="width : 40%;flex-basis: auto; align-items : flex-start; margin: auto 1em;">
			<button  disabled id="requestOTPBtn" style="display:none;" type="button" class="btn btn-info btn-sm">OTP</button>
			<div id="otpDiv"  class="flexHorizontal">
				<input   id="otpText" cols="10" rows="1" type="number"  min="100000" max="999999" placeholder="εξαψήφιο OTP" size="200" class="form-control form-control-sm" style="display:none;"></input>
			</div>
		</div>`;
	document.querySelector("#otpText").addEventListener("keyup",checkOTPLength);
	document.querySelector("#mindigitalConnectionButton").addEventListener("click",() =>
								connectToMindigital(escapeHtml(document.querySelector("#mindigitalUsername").value),escapeHtml(document.querySelector("#mindigitalPassword").value))
	);
	document.querySelector("#emailConnectionButton").addEventListener("click",() =>
								connectToEmail(escapeHtml(document.querySelector("#emailUsername").value),escapeHtml(document.querySelector("#emailPassword").value))
	);
	document.querySelector("#requestOTPBtn").addEventListener("click",() =>
								requestOTP()
	);

	if (localStorage.getItem("MINDIGITAL_token")!==null){
		document.querySelector("#mindigitalConnectionButton").classList.remove('btn-danger');
		document.querySelector("#mindigitalConnectionButton").classList.add('btn-success');
		document.querySelector("#mindigitalUsername").value ="";
		document.querySelector("#mindigitalPassword").value ="";
		document.querySelector("#mindigitalUsername").style.display = "none";
		document.querySelector("#mindigitalPassword").style.display = "none";
		if (localStorage.getItem("otp_method")!==null){
			showOTPProperFields(localStorage.getItem("otp_method"));
		}
	}

	if (localStorage.getItem("EMAIL_token")!==null){
		document.querySelector("#emailConnectionButton").classList.remove('btn-danger');
		document.querySelector("#emailConnectionButton").classList.add('btn-success');
		document.querySelector("#emailUsername").value ="";
		document.querySelector("#emailPassword").value ="";
		document.querySelector("#emailUsername").style.display = "none";
		document.querySelector("#emailPassword").style.display = "none";
		document.querySelector("#requestOTPBtn").removeAttribute("disabled");
	}
	document.querySelector("#emailSpinner").style.display = 'none';
	document.querySelector("#mindigitalSpinner").style.display = 'none';
	//document.getElementById("signBtn").innerHTML = 'Υπογραφή '+'Mindigital'+'<i style="margin-left:0.2em;" class="fas fa-signature"></i>'; 
}

function schMiddleware(){
	const providerDiv = document.getElementById("providerMiddleware");
	providerDiv.innerHTML = 
		`<div class="providerHeader flexHorizontal" style="width : 40%;flex-basis: auto; align-items : flex-start;">
			<div id="schNameDiv"  class="flexHorizontal">
				<input   id="schNameText" cols="20" rows="1" type="text"  placeholder="ονομασία υπογραφής" size="200" class="form-control form-control-sm"></input>
			</div>
		</div>
		<div class="providerContent">
		</div>`;
	document.querySelector("#schNameText").addEventListener("keyup",checkSchName);
	document.querySelector("#schNameText").value = signProviders.SCH.params.signature.value;
	//document.getElementById("signBtn").innerHTML = 'Υπογραφή '+'SCH'+'<i style="margin-left:0.2em;" class="fas fa-signature"></i>'; 
}

function uploadMiddleware(){
	const providerDiv = document.getElementById("providerMiddleware");
	providerDiv.innerHTML =
		`<div class="providerHeader">
		</div>
		<div class="providerContent">
			<input type="file" class="form-control-file" name="selectedSignedFile" id="selectedSignedFile"  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" />
		</div>`;
	document.querySelector("#selectedSignedFile").addEventListener("change",selectFile);
	//document.getElementById("signBtn").innerHTML = 'Υπογραφή '+' Αρχείου'+'<i style="margin-left:0.2em;" class="fas fa-signature"></i>'; 
}

function FFMiddleware(){
	//document.getElementById("signBtn").innerHTML = 'Χωρίς Υπογραφή<i style="margin-left:0.2em;" class="fas fa-signature"></i>'; 
}


async function connectToEmail(username,password){
	document.querySelector("#emailSpinner").style.display = 'inline-block';
	const emailConnectionButton = document.getElementById("emailConnectionButton");

	if(localStorage.getItem("EMAIL_token") !==null){
		let ans = confirm("Αποσύνδεση;");
		if(ans){
			disconnectEmail();
			return;
		}
	}
	if (username === "" || password ===""){
		alert("Συμπληρώστε τα πεδία σύνδεσης");
		document.querySelector("#emailSpinner").style.display = 'none';
		return;
	}

	let formData = new FormData();
	formData.append("username",username);
	formData.append("password", password);

	const res = await runFetch("/api/getEmailCred.php", "POST", formData);
	if (!res.success){
		document.querySelector("#emailSpinner").style.display = 'none';
		emailConnectionButton.classList.remove('btn-success');
		emailConnectionButton.classList.add('btn-danger');
		alert(res.msg);
	}
	else{
		const token =  res.result;
		localStorage.setItem("EMAIL_token", token);
		emailConnectionButton.classList.remove('btn-danger');
		emailConnectionButton.classList.add('btn-success');
		document.querySelector("#emailUsername").value ="";
		document.querySelector("#emailPassword").value ="";
		document.querySelector("#emailUsername").style.display = "none";
		document.querySelector("#emailPassword").style.display = "none";
		document.querySelector("#requestOTPBtn").removeAttribute("disabled");
		alert("Επιτυχής σύνδεση");
		document.querySelector("#emailSpinner").style.display = 'none';
	}
}

function disconnectEmail(){
	const emailConnectionButton = document.getElementById("emailConnectionButton");
	localStorage.removeItem("EMAIL_token");
	emailConnectionButton.classList.remove('btn-success');
	emailConnectionButton.classList.add('btn-danger');
	document.querySelector("#emailUsername").value ="";
	document.querySelector("#emailPassword").value ="";
	document.querySelector("#emailUsername").style.display = "inline-block";
	document.querySelector("#emailPassword").style.display = "inline-block";
	document.querySelector("#requestOTPBtn").setAttribute("disabled",true);
	document.querySelector("#emailSpinner").style.display = 'none';
}

function disconnectMindigital(){
	disconnectEmail();
	const mindigitalStatusBtn = document.getElementById("mindigitalConnectionButton");
	localStorage.removeItem("MINDIGITAL_token");
	localStorage.removeItem("otp_method");
	mindigitalStatusBtn.classList.remove('btn-success');
	mindigitalStatusBtn.classList.add('btn-danger');
	document.querySelector("#mindigitalUsername").value ="";
	document.querySelector("#mindigitalPassword").value ="";
	document.querySelector("#mindigitalUsername").style.display = "inline-block";
	document.querySelector("#mindigitalPassword").style.display = "inline-block";
	document.querySelector("#mindigitalSpinner").style.display = 'none';
	document.querySelector("#emailConnection").style.display = "none";
	document.querySelector("#providerMiddleware .providerContent").style.display = "none";
}

async function connectToMindigital(username, password){
	document.querySelector("#mindigitalSpinner").style.display = 'inline-block';
	const mindigitalStatusBtn = document.getElementById("mindigitalConnectionButton");

	if(localStorage.getItem("MINDIGITAL_token") !==null){
		let ans = confirm("Αποσύνδεση;");
		if(ans){
			disconnectMindigital();
			return;
		}
	}
	if (username === "" || password ===""){
		alert("Συμπληρώστε τα πεδία σύνδεσης");
		document.querySelector("#mindigitalSpinner").style.display = 'none';
		return;
	}

	let formData = new FormData();
	formData.append("username",username);
	formData.append("password", password);

	const res = await runFetch("/api/getMindigitalCred.php", "POST", formData);
	if (!res.success){
		document.querySelector("#mindigitalSpinner").style.display = 'none';
		mindigitalConnectionButton.classList.remove('btn-success');
		mindigitalConnectionButton.classList.add('btn-danger');
		alert(res.msg);
	}
	else{
		const token = await res.result;
		localStorage.setItem("MINDIGITAL_token", token);
		if (localStorage.getItem("otp_method") === null){
			const otpMethod = await requestOTP();
			localStorage.setItem("otpMethod", otpMethod);
		}
		showOTPProperFields(localStorage.getItem("otp_method"));
		mindigitalConnectionButton.classList.remove('btn-danger');
		mindigitalConnectionButton.classList.add('btn-success');
		document.querySelector("#mindigitalUsername").value ="";
		document.querySelector("#mindigitalPassword").value ="";
		document.querySelector("#mindigitalUsername").style.display = "none";
		document.querySelector("#mindigitalPassword").style.display = "none";
		document.querySelector("#mindigitalSpinner").style.display = 'none';
		//alert("Επιτυχής σύνδεση");
	}
}

function showOTPProperFields(otpMethod){
	document.querySelector("#providerMiddleware .providerContent").style.display = "flex";
	switch (+otpMethod){
		case 0 :{
			console.log("show otp fields");
			document.querySelector("#requestOTPBtn").style.display ="inline-block";
			document.querySelector("#otpText").style.display = "inline-block";
			document.querySelector("#emailConnection").style.display = "flex";
			break;
		}
		case 1 :{
			document.querySelector("#otpText").style.display = "inline-block";
			document.querySelector("#requestOTPBtn").style.display ="none";
			document.querySelector("#emailConnection").style.display = "none";
			break;
		}
		case 9 :{
			document.querySelector("#requestOTPBtn").style.display ="none";
			document.querySelector("#otpText").style.display ="none";
			break;
		}
	}
}

async function requestOTP(){
	//document.querySelector("#emailSpinner").style.display = 'inline-block';
	document.querySelector('#otpText').value = "";
	document.querySelector('#requestOTPBtn').setAttribute('disabled',true);

	let formData = new FormData();
	if (localStorage.getItem("MINDIGITAL_token")==null){
		//document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		alert("Δεν υπάρχουν διαπιστευτήρια mindigital");
		return;
	}
	if (localStorage.getItem("EMAIL_token")!==null){
		formData.append("EMAIL_token",localStorage.getItem("EMAIL_token"));
	}
	formData.append("MINDIGITAL_token", localStorage.getItem("MINDIGITAL_token"));

	const res = await runFetch("/api/getLastOTP.php", "POST", formData);
	if (!res.success){
		//document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		alert(res.message);
	}
	else {
		const resDec = res.result;
		//document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		localStorage.setItem("otp_method", resDec["otpMethod"]);
		if (Object.hasOwn(resDec,"otpMethod") && Object.hasOwn(resDec,"otpResultDesc")){
			if(resDec["otpMethod"]===0){
				if (resDec["otpResultDesc"] == -1){
					alert("Συνδεθείτε στο email σας, για να λάβετε το OTP");
				}
				else{
					document.querySelector("#otpText").value = resDec["otpResultDesc"];
					MINDIGITAL.params.otp.value = resDec["otpResultDesc"];
				}
			}
			else if(resDec["otpMethod"]===1){
				alert("Το OTP λαμβάνεται μέσω κινητού");
			}
			else{
				alert(resDec["nextuid"]);
			}
			return resDec["otpMethod"];
		}
		else{
			alert("Σφάλμα στον έλεγχο διαδικασιών λήψης OTP");
		}
	}
}


export async function getSignedRecords(signal,controllers){

	document.querySelector("#syncRecords>i").classList.add('faa-circle');
	
	for (const [key, value] of Object.entries(controllers)) {
		if (key !== "signed"){
			value.abort();
		}
	}

	const res = await runFetch("/api/getSignedRecords.php", "GET", null, undefined, signal);
	if (!res.success){
		alert(res.msg);
	}
	else{
		document.querySelector("#syncRecords>i").classList.remove('faa-circle');
		fillTableWithSigned(res.result);	
		return 1;
	}
}

export function fillTableWithSigned(result){
	//const table = $('#example1').DataTable();
	//table.clear().draw();
	const table = document.querySelector("#dataToSignTable>tbody");
	table.innerHTML = "";
	
	if (localStorage.getItem("loginData") == null){
		alert("Δεν υπάρχουν πληροφορίες σύνδεσης");
		return null;
	}
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const department = loginData.user.roles[currentRole].department;
	if (department === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες ιδιότητας χρήστη");
		return null;
	}
	const accessLevel = loginData.user.roles[currentRole].accessLevel;
	if (accessLevel === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες ιδιότητας χρήστη");
		return null;
	}
	
	for (let key=0;key<result.length;key++) {
		let row = table.insertRow(-1); // We are adding at the end
		let c1 = row.insertCell(0);
		let c2 = row.insertCell(1);
		let c3 = row.insertCell(2);
		let c4 = row.insertCell(3);
		let c5 = row.insertCell(4);

		const rejected =(result[key].nextLevel == -2?1:0);
		row.dataset.rejected = rejected;
	

		row.dataset.author = result[key].fullName;
		let temp1=[];
		let filenameBtn = "";
		
		let relevantDocs = result[key].relevantDocs;
		let relevantDocsArray = relevantDocs.split("*");
		let relevantDocsElement = "&nbsp&nbsp&nbsp";
		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				relevantDocsElement +='<i id="rel_btn_'+result[key]['revisionId']+'_'+l+'" class="isButton fas fa-paperclip" title="'+relevantDocsArray[l]+'"></i>&nbsp';		
			}
		}						
		
		if (!rejected){
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['revisionId']+'" class="btn btn-success btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton outline fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+"</div>";
		}
		else{
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['revisionId']+'" class="btn btn-danger btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton outline fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+"</div>";
		}
		
		temp1[0] = filenameBtn;
		temp1[1] = result[key].date;
		temp1[2] = result[key].fullName;
		
		let recordStatus = '<button id="signedBtn_'+result[key]['aa']+'" type="button" class="btn btn-warning btn-sm" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-download" data-toggle="tooltip" title="Υπογεγραμμένο για αρχειοθέτηση" data-whatever="'+result[key].aa+'"></i>'+"</button>";
		let exactCopyBtn = '<button id="excopyBtn_'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-paper-plane" data-toggle="tooltip" title="Υπογεγραμμένο για αποστολή" data-whatever="'+result[key].aa+'"></i>'+"</button>";
		let moveSignedToProtocolBtn = '<button id="moveSignedBtn_'+result[key]['aa']+'" type="button" class="btn btn-warning btn-sm" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-link" data-toggle="tooltip" title="Μεταφορά σε πρωτόκολλο" data-whatever="'+result[key].aa+'"></i>'+"</button>";

		if (!rejected){
			temp1[3] =  '<div class="filenameDiv">'+recordStatus+exactCopyBtn+moveSignedToProtocolBtn+'</div>';
		}
		else{
			temp1[3] ="";
		}
		
		let historyBtn = "";
		let reqExactCopyBtn = "";
		historyBtn = '<button id="showHistoryModal'+result[key]['aa']+'" class="isButton small primary" data-whatever="'+result[key].revisionId+'">'+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i></button>';

		//if (result[key].objection>0){
			//historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].revisionId+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i>'+"<span class='glyphicon glyphicon-flash' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip'></span></a>";
		//}
		//else{
			//historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].revisionId+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού">'+"</i></a>";
		//}
		if (!rejected){
			reqExactCopyBtn = '<button id="reqExactCopyBtn_'+result[key]['revisionId']+'" type="button" class="btn btn-info btn-sm" data-lastExCopyDate="'+result[key].exactCopyDate+'" data-whatever="'+result[key].revisionId+'">'+'<i class="fas fa-bell" data-toggle="tooltip" title="Αίτημα Ακριβούς Αντιγράφου, '+(result[key].exactCopyDate===""?"":"Τελευταίο αντίγραφο "+result[key].exactCopyDate)+'" data-whatever="'+result[key].revisionId+'"></i>'+"</button>";
		}
		temp1[4] = 	'<div class="recordButtons">'+reqExactCopyBtn+historyBtn+'</div>';	
		
		c1.innerHTML = temp1[0];
		c2.innerHTML = temp1[1];
		c3.innerHTML = temp1[2];
		c4.innerHTML = temp1[3];
		c5.innerHTML = temp1[4];		
		
		if (!rejected){
			document.querySelector("#reqExactCopyBtn_"+result[key]['revisionId']).addEventListener("click",(event)=>{
				requestExactCopy(event).then((msg)=>{alert(msg)},(msg)=>{alert(msg)})
			});
			document.querySelector("#signedBtn_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['lastFilename'],result[key].date));
			document.querySelector("#moveSignedBtn_"+result[key]['aa']).addEventListener("click",()=> openMoveToProtocolDialog(result[key]['lastFilename'],result[key].date,result[key].relevantDocs));
			//document.querySelector("#moveSignedBtn_"+result[key]['aa']).addEventListener("click",()=>moveSignedToProtocol(result[key]['lastFilename'],result[key].date));
            if (result[key]['exactCopyStatus'] == -1){
                document.querySelector("#excopyBtn_"+result[key]['aa']).addEventListener("click",()=>alert("Δεν έχετε αιτηθεί ακριβές αντίγραφο. Πατήστε το καμπανάκι ..."));
            }
            else if (result[key]['exactCopyStatus'] == 0){
                document.querySelector("#excopyBtn_"+result[key]['aa']).addEventListener("click",()=>alert("Το αίτημα σας είναι σε αναμονή..."));
            }
            else if (result[key]['exactCopyStatus'] == 1){
				if (result[key]['exactCopyFilename'] == ""){
					result[key]['exactCopyFilename'] = result[key]['filename'].split('.').slice(0, -1).join('.')+"_MD_Exact_Copy.pdf";
				}
                document.querySelector("#excopyBtn_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['exactCopyFilename'],result[key].date));
            }
		}

		document.querySelector("#showHistoryModal"+result[key]['aa']).addEventListener("click", async (event) => {
			const recordAA = event.currentTarget.getAttribute('data-whatever');
			const resDecoded = await getRecordHistory(recordAA);
			fillHistoryModal(resDecoded);
			document.querySelector("#historyModal").showModal();
		})


		document.querySelector("#btn_"+result[key]['revisionId']).addEventListener("click",()=>viewFile(result[key]['filename'],result[key].date));
		document.querySelector("#btn_"+result[key]['aa']+"_position").addEventListener("click",()=> window.open("pdfjs-3.4.120-dist/web/viewer.html?file="+result[key]['lastFilename']+"&insertDate="+result[key].date+"&id="+result[key].revisionId+"#zoom=page-fit"));

		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				document.querySelector("#rel_btn_"+result[key]['revisionId']+"_"+l).addEventListener("click",()=>viewFile(relevantDocsArray[l],result[key].date));
			}
		}						
	}
	createSearch();
}

async function requestExactCopy(event){
	event.preventDefault();
	//console.log(event.currentTarget)
	const lastExCopyDate = event.currentTarget.dataset.lastexcopydate;
	if (lastExCopyDate !==""){
		if (!confirm("Υπάρχει ακριβές αντίγραφο με ημερομηνία "+lastExCopyDate+", Θέλετε να εκδόσετε νέο;")){
			return "Το αίτημα δεν καταχωρήθηκε";
		}
	}
	//console.log(filename);
	let formData = new FormData();
	formData.append("record",event.target.dataset.whatever);

	const res = await runFetch("/api/requestExactCopy.php", "POST", formData);
	if (!res.success){
		alert(res.msg);
	}
	else{
		return("Το αίτημα έχει καταχωρηθεί");
	}
}