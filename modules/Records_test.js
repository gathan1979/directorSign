import refreshToken from "./RefreshToken.js"
import getFromLocalStorage from "./LocalStorage.js"
import {uploadFileTest} from "./Upload.js";
import { createSearch } from "./Filter.js";


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
        `<div class="modal fade" id="signModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body" id="signForm">
                        <div>
                            <div id="attentionTextDiv">
                                <u>Επισήμανση</u>
                                    Ν.2693/1999. αρ.25 παρ.5 <i>
                                    Οι προιστάμενοι όλων των βαθμίδων οφείλουν να προσυπογράφουν τα έγγραφα που ανήκουν στην
                                    αρμοδιότητά τους και εκδίδονται με την υπογραφή του προϊσταμένου τους. Αν διαφωνούν, οφείλουν
                                    να διατυπώσουν εγγράφως τις τυχόν αντιρρήσεις τους. Αν παραλείψουν να προσυπογράψουν το
                                    έγγραφο, θεωρείται ότι το προσυπέγραψαν.</i>
                            </div>
                            <textarea id="signText" cols="100" rows="3" size="200" class="form-control" placeholder="Το σχόλιο είναι προαιρετικό" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
                            <div id="providers" >
                                <div id="signProvidersBtns" class="btn-group" role="group" aria-label="Basic example">

                                </div>
                                <div id="providerMiddleware" class="flexHorizontal" >
                                    
                                </div>
                            </div>
                        </div>

                        <div class="contentFooter">
                            
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;

    const rejectModalDiv =
        `<div class="modal fade" id="rejectModal" tabindex="-1" role="dialog" aria-labelledby="rejectModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document" >
                <div class="modal-content">
                    <div class="modal-header">
                        <b>Οριστική Απόρριψη Εγγράφου</b>
                    </div>
                    <div class="modal-body" id="rejectForm">
                        <textarea id="rejectText" cols="100" rows="3" size="200" class="form-control" placeholder="το κείμενο είναι απαραίτητο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
                    </div>
                    <div class="modal-footer">
                        <div class="otherContentFooter">
                        </div>
                        <button id="closeRejectModalBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>
        </div>`;

    const returnModalDiv =
        `<div class="modal fade" id="returnModal" tabindex="-1" role="dialog" aria-labelledby="returnModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document" >
                <div class="modal-content">
                    <div class="modal-header"> 
                        <b>Επιστροφή Εγγράφου</b>
                    </div>
                    <div class="modal-body" id="returnForm">
                        <textarea id="returnText" cols="100" rows="3" size="200" class="form-control" placeholder="το κείμενο είναι απαραίτητο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
                    </div>
                    <div class="modal-footer">
                        <div class="otherContentFooter">
                        </div>
                        <button id="closeReturnModalBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>
        </div>`;

    const historyModalDiv =
        `<div class="modal fade" id="historyModal" tabindex="-1" role="dialog" aria-labelledby="historyModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document" style="max-width : 80%">
                <div class="modal-content">
                    <div class="modal-header"> 
                        <b>Ιστορικό Εγγράφου</b>
                    </div>
                    <div class="modal-body" id="historyBody">

                    </div>
                    <div class="modal-footer">
                        <div class="otherContentFooter">
                        </div>
                        <button id="closeHistoryModalBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>
        </div>`;  

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
        
        const recordAA = e.relatedTarget.getAttribute('data-whatever');
        const isExactCopy = e.relatedTarget.getAttribute('data-isexactcopy');
        document.querySelector("#signModal").dataset.isexactcopy = isExactCopy;
        
        if (+isExactCopy){
            document.querySelector("#exampleModalLabel").innerText ="Υπογραφή Ακριβούς Αντιγράφου";
            document.querySelector("#attentionTextDiv").style.display = "none";
            document.querySelector("#signText").style.display = "none";
            document.querySelector('#signAsLastBtn').style.display = "none";
            document.querySelector('#signWithObjectionBtn').style.display = "none";
            document.getElementById("signBtn").style.display = "none";
            document.querySelector('#signExactCopyBtn').style.display = "inline-block";
        }
        else{
            document.querySelector("#exampleModalLabel").innerText ="Υπογραφή Εγγράφου";
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

    document.querySelector("#rejectModal").addEventListener("show.bs.modal",(e)=> {
        const contentFooterDivContent = `<button id="rejectButton" type="button" class="btn btn-danger" disabled>Απόρριψη</button>`;
        document.querySelector("#rejectModal .otherContentFooter").innerHTML = contentFooterDivContent;
        const recordAA = e.relatedTarget.getAttribute('data-whatever');
        const isExactCopy = e.relatedTarget.getAttribute('data-isExactCopy');
        const relevantBtn = document.querySelector("#rejectButton");
        const relevantText = document.querySelector("#rejectText");
		relevantText.textContent = "";
        
        relevantText.addEventListener("keyup",()=> {if(relevantText.value != ""){relevantBtn.removeAttribute("disabled")}else{relevantBtn.setAttribute("disabled",true)} });
        relevantBtn.addEventListener("click",() => rejectDocument(+recordAA, isExactCopy));
    });

    document.querySelector("#returnModal").addEventListener("show.bs.modal",(e)=> {
        const contentFooterDivContent = `<button id="returnButton" type="button" class="btn btn-warning" disabled>Επιστροφή</button>`;
        document.querySelector("#returnModal .otherContentFooter").innerHTML = contentFooterDivContent;
        const recordAA = e.relatedTarget.getAttribute('data-whatever');
        const relevantBtn = document.querySelector("#returnButton");
        const relevantText = document.querySelector("#returnText");
        
        relevantText.addEventListener("keyup",()=> {if(relevantText.value != ""){relevantBtn.removeAttribute("disabled")}else{relevantBtn.setAttribute("disabled",true)} });
        relevantBtn.addEventListener("click",() => returnDocument(+recordAA));
    });

    document.querySelector("#historyModal").addEventListener("show.bs.modal",(e)=> {
        const recordAA = e.relatedTarget.getAttribute('data-whatever');
        getRecordHistory(recordAA);
    });

}

//------------------------------------------------------ΑΠΟ ΕΔΩ ΚΑΙ ΚΑΤΩ ΜΕΘΟΔΟΙ ---------------------------------------------------------------------------------

export async function getUserData(){
	// const loginData = JSON.parse(localStorage.getItem("loginData"));
	// const jwt = loginData.jwt;
	// console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders};
	console.log(init);
	const res = await fetch("/api/getUserData.php",init);
	if (!res.ok){
		if (res.status>=400 && res.status <= 499){
			refreshToken();
			getUserData();
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;
		}
	}
	else{
		return res.json();
	}
}

async function getRecordHistory(aa){
	console.log("retrieving history ... !!");
	//document.querySelector("#recordsSpinner").style.display = 'inline-block';
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	//console.log(init);

	const params = new URLSearchParams({
		role: role,
		aa
	});

	const res = await fetch("/api/getRecordHistory.php?"+params,init);
	if (!res.ok){
		document.querySelector("#recordsSpinner").style.display = 'none';
		if (res.status == 401){
			const reqToken = await refreshToken();
			if (reqToken ==1){
				getRecordHistory(aa);
				const error = new Error("token expired")
				error.code = "400"
				throw error;
			}
			else{
				alert('σφάλμα εξουσιοδότησης');
				const error = new Error("token invalid")
				error.code = "400"
				throw error;
			}
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;
		}
	}
	else{
		//return res;
		document.querySelector("#recordsSpinner").style.display = 'none';
		fillHistoryModal(await res.json());
		return "ok";
	}
}


export async function getSigRecords(){
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	document.querySelector("#myNavBar").classList.toggle("disabledDiv");
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	//console.log(init);

	const params = new URLSearchParams({
		role: role
	});

	const res = await fetch("/api/getSigRecords.php?"+params,init);
	if (!res.ok){
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		if (res.status == 401){
			const reqToken = await refreshToken();
			if (reqToken ==1){
				getSigRecords();
				const error = new Error("token expired")
				error.code = "400"
				throw error;
			}
			else{
				alert('σφάλμα εξουσιοδότησης');
				const error = new Error("token invalid")
				error.code = "400"
				throw error;
			}
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;
		}
	}
	else{
		//return res;
		//console.log(res.statusText);
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		fillTableToBeSigned(await res.json());
		return "ok";
	}
}

function fillHistoryModal(result){
	//console.log("filling history");
	document.querySelector("#historyBody").innerHTML ="";
	let insertDate = result[0]['date'];
	for (let key=0;key<result.length;key++) {
		let tmpElement ="";
        if (result[key]['depName'] !=""){
            tmpElement = '<div style="font-size:0.8em;margin:1em;"><i style="margin-right:0.5em;" class="fas fa-arrow-circle-down"></i>'+result[key]['depName']+'</div>';
        }
		if (result[key]['hasObjection'] ==1){
			tmpElement += '<div class="flexHorizontal"><span style="align-self: center;margin-left:3px;background-color :darkorange!important" class="badge rounded-pill bg-warning " title="έγγραφη αντίρρηση"><i class="fas fa-exclamation-circle"></i></span>';
		}
		else{
			tmpElement += "<div class='flexHorizontal' style='margin-left:2em;'>"
		}
		tmpElement += '<div style="width:30%;" class="filenameDiv"><button  id="historyRecord_'+result[key]['aa']+'" class="btn btn-success btn-sm" >'+
										result[key]['filename']+'</button>'+"</div><div style='width:30%;text-align:center;'>"+
										result[key]['fullname']+"</div><div style='width:20%;text-align:center;'>"+
										result[key]['comments']+"</div><div style='width:20%;text-align:center;'>"+result[key]['date']+"</div></div>";
		const arrow = '<div style="font-size:0.8em;margin:1em;"><i style="margin-right:0.5em;" class="fas fa-arrow-circle-down"></i>'+result[key]['nextLevelName']+'</div>';
        tmpElement += arrow;
        //console.log(tmpElement);
        document.querySelector("#historyBody").innerHTML += tmpElement;
	}
	for (let key=0;key<result.length;key++) {
		document.querySelector("#historyRecord_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['filename'],insertDate));
	}
}

export function fillTableToBeSigned(result){
	//const table = $('#example1').DataTable();
	//table.clear().draw();

	const table = document.getElementById("dataToSignTable");
	var rows = table.rows;
	var i = rows.length;
	while (--i) {
		table.deleteRow(i);
	}

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
				signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm"  data-bs-toggle="modal" data-bs-target="#signModal" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
			}
			if (accessLevel==1){
				signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm"  data-bs-toggle="modal" data-bs-target="#signModal" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
				if (!result[key].isExactCopy){
					returnBtn = '<button id="showReturnModal'+result[key]['aa']+'" type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#returnModal" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-arrow-down" data-toggle="tooltip" title="Επιστροφή Εγγράφου"></i>'+"</button>";
				}
			}
			if (result[key].isReturned){   // πρόκειται για επιστροφή
				if(result[key].dep == department){  // το αρχικό τμήμα του εγγράφου είναι ίδιο με το τμήμα του χρήστη (το έγγραφο επέστρεψε στο τμήμα του)
					const currentRoleAA = loginData.user.roles[currentRole].aa_role;
					if((result[key].lastUser != result[key].userId ) || (result[key].lastFileRecord === "")){ // ο τελευταίος χρήστης δεν είναι αυτός που το ανέβασε, οπότε δεν πάει για υπογραφή	
						signModalBtn = "";	
						if(result[key].userId == currentRoleAA){	// ο χρήστης είναι αυτός που το ανέβασε αρχικά και δεν είναι ο τελευταίος που το επεξεργάστηκε
							reuploadFile = ' <input type="file" class="form-control form-control-sm" id="reuploadFileBtn'+result[key]['aa']+'">' ;
						}
					}
					else{
						
					}
				}
				else{
                    signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm"  data-bs-toggle="modal" data-bs-target="#signModal" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
				}
			}
		}	
		historyBtn = '<button  class="btn btn-primary btn-sm" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#historyModal" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i></button>';
		rejectBtn = '<button id="showRejectModal'+result[key]['aa']+'" type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#rejectModal" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-ban" data-toggle="tooltip" title="Οριστική Απόρριψη"></i>'+"</button>";
		temp1[4] = 	'<div class="recordButtons">'+reuploadFile+signModalBtn+returnBtn+historyBtn+rejectBtn+'</div>';

		c1.innerHTML = temp1[0];
		c2.innerHTML = temp1[1];
		c3.innerHTML = temp1[2];
		c4.innerHTML = temp1[3];
		c5.innerHTML = temp1[4];

		if(reuploadFile!==""){
			document.querySelector("#reuploadFileBtn"+result[key]['aa']).addEventListener("change",()=>uploadFileTest(undefined,result[key]['aa']));
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

async function findLinkProtocol(protocolNo, currentYear){
	if(protocolNo == ""){
		document.querySelector("#searchProtocolResultDiv").innerHTML = "";
		return;
	}
	else if(currentYear == ""){
		document.querySelector("#searchProtocolResultDiv").innerHTML = "";
		return;
	}
	//console.log("pass")
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let urlParams = new URLSearchParams({protocolNo, currentYear});

	let init = {method: 'GET', headers : myHeaders};
	const res = await fetch("/api/getLinkProtocol.php?"+urlParams,init);
	if (!res.ok){
		const resdec = await res.json();
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ==1){
				findLinkProtocol(protocolNo, year);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το πρωτόκολλο δε βρέθηκε");
		}
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		const resdec = await res.json();
		document.querySelector("#searchProtocolResultDiv").innerHTML = resdec;
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
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders, body : formdata};
	const res = await fetch("/api/moveSignedToProtocol.php",init);
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				moveSignedToProtocol(filename, folder="",protocolNo, year);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πρωτόκολλο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else if (res.status==500){
			alert("Σφάλμα. Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
		}
		else {
			alert("Σφάλμα");
		}
	}
	else {
		alert("Το αρχείο μεταφέρθηκε με επιτυχία");
		document.querySelector("#fileMoveDialog").close();
	}
}

export async function viewFile(filename, folder=""){
	if(filename === ""){
		alert("Δεν έχει οριστεί όνομα αρχείου");
		return;
	}
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const urlpar = new URLSearchParams({filename : encodeURIComponent(filename), folder});
	const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};

	const res = await fetch("/api/viewFile.php?"+urlpar,init);
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				viewFile(filename, folder);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else if (res.status==500){
			alert("Σφάλμα. Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
		}
		else {
			alert("Σφάλμα");
		}
	}
	else {

		const dispHeader = res.headers.get('Content-Disposition');
		if (dispHeader !== null){
			const parts = dispHeader.split(';');
			filename = parts[1].split('=')[1];
			filename = filename.replaceAll('"',"");
		}
		else{
			filename = "tempfile.tmp";
		}
		const fileExtension = filename.split('.').pop();
		const blob = await res.blob();
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
			let openFileAns = confirm("Ναι για απευθείας άνοιγμα, άκυρο για αποθήκευση");
			if (openFileAns){
				const pdfWin = window.open(href);
				//pdfWin.document.title = decodeURI(filename);
				setTimeout(()=>{pdfWin.document.title = decodeURI(filename)},1000);
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
	document.querySelector('#signExactCopyBtn').setAttribute("disabled",true);
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

	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	//const comment = document.getElementById('signText').value;
	let formData = new FormData();
	// signDocument(aa, isLast=0, objection=0)
	formData.append("role", role);
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

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/signSendFile.php",init);
	if (!res.ok){
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		const resdec = res.json();
		if (res.status ==  401){
			if (resdec === "mindigital"){
				alert("Αποσυνδεθείτε και επανασυνδεθείτε στο σύστημα υπογραφών Mindigital");
			}
			else{
				const resRef = await refreshToken();
				if (resRef ==1){
					signExactCopy(aa);
				}
				else{
					alert("σφάλμα εξουσιοδότησης");
				}
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		document.querySelector('#signExactCopyBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";

		if(providerName === "MINDIGITAL"){
			document.querySelector("#otpText").value = "";
		}
		const myModalEl = document.querySelector("#signModal");
		const modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();
		alert("Το έγγραφο έχει υπογραφεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			createSearch();
		}, rej => {});
	}
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

	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	const comment = document.getElementById('signText').value;
	let formData = new FormData();
	// signDocument(aa, isLast=0, objection=0)
	formData.append("role", role);
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

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/signDoc.php",init);
	if (!res.ok){
		document.querySelector('#signSpinner').style.display = "none";
		document.querySelector('#signBtn').removeAttribute("disabled");
		const resdec = res.json();
		if (res.status ==  401){
			if (resdec == "mindigital"){
				alert("Αποσυνδεθείτε και επανασυνδεθείτε στο σύστημα υπογραφών Mindigital");
			}
			else{
				const resRef = await refreshToken();
				if (resRef ==1){
					signDocument(aa, isLast, objection);
				}
				else{
					alert("σφάλμα εξουσιοδότησης");
				}
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		document.querySelector('#signBtn').removeAttribute("disabled");
		document.querySelector('#signSpinner').style.display = "none";
		if(providerName === "MINDIGITAL"){
			document.querySelector("#otpText").value = "";
		}
		const myModalEl = document.querySelector("#signModal");
		const modal = bootstrap.Modal.getInstance(myModalEl);
		modal.hide();
		alert("Το έγγραφο έχει υπογραφεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			createSearch();
		}, rej => {});
	}
}


export async function rejectDocument(aa, isExactCopy=0){
	//console.log("rejecting ..."+aa);
	//return;
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	const comment = document.getElementById('rejectText').value;
	let formData = new FormData();
	formData.append("aa",aa);
	formData.append("role", role);
	formData.append("comment", comment);
	formData.append("isExactCopy", isExactCopy);

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/rejectDoc.php",init);
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				rejectDocument(aa, isExactCopy);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");
			}
		}
		else if(res.status==400){
			alert("σφάλμα κλήσης");
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else{
			alert("σφάλμα κλήσης");
		}
	}
	else {
		const myModalEl = document.querySelector("#rejectModal");
		const modal = bootstrap.Modal.getInstance(myModalEl)
		modal.hide();
		alert("Το έγγραφο έχει διαγραφεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			createSearch();
		}, rej => {});
	}
}

export async function returnDocument(aa){
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	const comment = document.getElementById('returnText').value;
	let formData = new FormData();
	formData.append("aa",aa);
	formData.append("role", role);
	formData.append("comment", comment);

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/returnDoc.php",init);
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				returnDocument(aa);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");
			}
		}
		else if (res.status==400){
			alert("σφάλμα αιτήματος");
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else{
			alert("γενικό σφάλμα");
		}
	}
	else {
		const myModalEl = document.querySelector("#returnModal");
		const modal = bootstrap.Modal.getInstance(myModalEl);
		modal.hide();
		alert("Το έγγραφο έχει επιστραφεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			createSearch();
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
	const providerDiv = document.querySelector("#providerMiddleware");
	providerDiv.innerHTML =
		`<div class="providerHeader flexHorizontal">
			<div id="emailConnection" class="flexVertical">
				<div id="emailTitle"  style="font-weight:bold;text-align:center;">
					Email
					<div id="emailSpinner" class="spinner-border spinner-border-sm" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>
				</div>
				<div id="emailConnectionDiv" class="flexHorizontal">
					<div id="emailStatusDiv"  class="flexVertical">
						<button id="emailConnectionButton" class="btn btn-danger btn-sm" data-toggle="tooltip" title="Σύνδεση στο email"><i id="faMail" class="far fa-envelope-open"></i></button>
						<button  disabled id="requestOTPBtn"  type="button" class="btn btn-info btn-sm">OTP</button>
					</div>
					<div id="emailConnectionBtns"  class="flexVertical">
						<input class="form-control form-control-sm" type="text" id="emailUsername" placeholder="email username"/>
						<input class="form-control form-control-sm" type="password" id="emailPassword" placeholder="email password"/>
					</div>
				</div>
			</div>
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
		</div>
		<div class="providerContent flexHorizontal" style="width : 40%;flex-basis: auto; align-items : flex-start;">
			<div id="otpDiv"  class="flexHorizontal">
				<input   id="otpText" cols="10" rows="1" type="number"  min="100000" max="999999" placeholder="εξαψήφιο OTP" size="200" class="form-control form-control-sm"></input>
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
	const mindigitalStatusBtn = document.getElementById("emailConnectionButton");

	if(localStorage.getItem("EMAIL_token") !==null){
		let ans = confirm("Αποσύνδεση;");
		if(ans){
			localStorage.removeItem("EMAIL_token");
			emailConnectionButton.classList.remove('btn-success');
			emailConnectionButton.classList.add('btn-danger');
			document.querySelector("#emailUsername").value ="";
			document.querySelector("#emailPassword").value ="";
			document.querySelector("#emailUsername").style.display = "inline-block";
			document.querySelector("#emailPassword").style.display = "inline-block";
			document.querySelector("#requestOTPBtn").setAttribute("disabled",true);
			document.querySelector("#emailSpinner").style.display = 'none';
			return;
		}
	}
	if (username === "" || password ===""){
		alert("Συμπληρώστε τα πεδία σύνδεσης");
		document.querySelector("#emailSpinner").style.display = 'none';
		return;
	}

	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	let formData = new FormData();
	formData.append("username",username);
	formData.append("password", password);

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/saveEmailCred.php",init);
	if (!res.ok){
		document.querySelector("#emailSpinner").style.display = 'none';
		if (res.status ==  401){
			if (await res.json() !== "remote Error"){
				const resRef = await refreshToken();
				if (resRef ===1){
					connectToEmail(username, password);
				}
				else{
					alert("σφάλμα εξουσιοδότησης");
				}
			}
			else{
				alert("Λάθος κωδικός ή όνομα χρήστη");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		emailConnectionButton.classList.remove('btn-success');
		emailConnectionButton.classList.add('btn-danger');
	}
	else {
		const token = await res.json();
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

async function connectToMindigital(username, password){
	document.querySelector("#mindigitalSpinner").style.display = 'inline-block';
	const mindigitalStatusBtn = document.getElementById("mindigitalConnectionButton");

	if(localStorage.getItem("MINDIGITAL_token") !==null){
		let ans = confirm("Αποσύνδεση;");
		if(ans){
			localStorage.removeItem("MINDIGITAL_token");
			mindigitalStatusBtn.classList.remove('btn-success');
			mindigitalStatusBtn.classList.add('btn-danger');
			document.querySelector("#mindigitalUsername").value ="";
			document.querySelector("#mindigitalPassword").value ="";
			document.querySelector("#mindigitalUsername").style.display = "inline-block";
			document.querySelector("#mindigitalPassword").style.display = "inline-block";
			document.querySelector("#mindigitalSpinner").style.display = 'none';
			return;
		}
	}
	if (username === "" || password ===""){
		alert("Συμπληρώστε τα πεδία σύνδεσης");
		document.querySelector("#mindigitalSpinner").style.display = 'none';
		return;
	}

	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	let formData = new FormData();
	formData.append("username",username);
	formData.append("password", password);

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/saveMindigitalCred.php",init);
	if (!res.ok){
		document.querySelector("#mindigitalSpinner").style.display = 'none';
		if (res.status ==  401){
			if (await res.json() !== "remote Error"){
				const resRef = await refreshToken();
				if (resRef ===1){
					connectToMindigital(username, password);
				}
				else{
					alert("σφάλμα εξουσιοδότησης");
				}
			}
			else{
				alert("Λάθος κωδικός ή όνομα χρήστη");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		mindigitalConnectionButton.classList.remove('btn-success');
		mindigitalConnectionButton.classList.add('btn-danger');
	}
	else {
		const token = await res.json();
		localStorage.setItem("MINDIGITAL_token", token);
		mindigitalConnectionButton.classList.remove('btn-danger');
		mindigitalConnectionButton.classList.add('btn-success');
		document.querySelector("#mindigitalUsername").value ="";
		document.querySelector("#mindigitalPassword").value ="";
		document.querySelector("#mindigitalUsername").style.display = "none";
		document.querySelector("#mindigitalPassword").style.display = "none";
		alert("Επιτυχής σύνδεση");
		document.querySelector("#mindigitalSpinner").style.display = 'none';
	}
}

async function requestOTP(){
	document.querySelector("#emailSpinner").style.display = 'inline-block';
	document.querySelector('#otpText').value = "";
	document.querySelector('#requestOTPBtn').setAttribute('disabled',true);

	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	let formData = new FormData();
	if (localStorage.getItem("EMAIL_token")==null || localStorage.getItem("MINDIGITAL_token")==null){
		document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		alert("Δεν υπάρχουν διαπιστευτήρια");
	}
	formData.append("EMAIL_token",localStorage.getItem("EMAIL_token"));
	formData.append("MINDIGITAL_token", localStorage.getItem("MINDIGITAL_token"));

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/getLastOTP.php",init);
	const resDec = await res.json();
	if (!res.ok){
		document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		if (res.status ==  400){
			if (resDec === "email"){
				localStorage.removeItem("EMAIL_token");
				mindigitallMiddleware();
			}
			else if (resDec === "mindigital"){
				console.log("mindigital error ")
				localStorage.removeItem("MINDIGITAL_token");
				mindigitallMiddleware();
			}
		}
		if (res.status ==  401){
			if (resDec !== "remote Error"){
				const resRef = await refreshToken();
				if (resRef ===1){
					requestOTP(username, password);
				}
				else{
					alert("σφάλμα εξουσιοδότησης");
				}
			}
			else{
				alert("Λάθος κωδικός ή όνομα χρήστη");
			}
		}
		else if (res.status==403){
			alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else if (res.status>=500){
			alert("πρόβλημα server");
		}
	}
	else {
		document.querySelector("#emailSpinner").style.display = 'none';
		document.querySelector('#requestOTPBtn').removeAttribute('disabled');
		if (Array.isArray(resDec)){
			if(resDec[0]===0){
				document.querySelector("#otpText").value = resDec[1];
				MINDIGITAL.params.otp.value = resDec[1];
			}
			else if(resDec[0]===1){
				alert("Το OTP λαμβάνεται μέσω κινητού");
			}
			else{
				alert(resDec[2]);
			}
		}
	}
}






export async function getSignedRecords(){
	document.querySelector("#myNavBar").classList.toggle("disabledDiv");
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	const {jwt,role} = getFromLocalStorage();	
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	//console.log(init);
	
	const params = new URLSearchParams({
		role: role
	});
	
	const res = await fetch("/api/getSignedRecords.php?"+params,init); 
	if (!res.ok){
		if (res.status == 401){
			document.querySelector("#recordsSpinner").style.display = 'none';
			document.querySelector("#myNavBar").classList.remove("disabledDiv");
			const reqToken = await refreshToken();
			if (reqToken ==1){
				getSignedRecords();
				const error = new Error("token expired")
				error.code = "400"
				throw error;
			}
			else{
				alert('σφάλμα εξουσιοδότησης');
				const error = new Error("token invalid")
				error.code = "400"
				throw error;
			}
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;	
		}
	}
	else{
		//return res;
		fillTableWithSigned(await res.json());
		document.querySelector("#recordsSpinner").style.display = 'none';
		document.querySelector("#myNavBar").classList.remove("disabledDiv");
		return "ok";
	}
}

export function fillTableWithSigned(result){
	//const table = $('#example1').DataTable();
	//table.clear().draw();
	const table = document.getElementById("dataToSignTable");
	var rows = table.rows;
	var i = rows.length;
	while (--i) {
		table.deleteRow(i);
	}
	
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
		historyBtn = '<button  class="btn btn-primary btn-sm" type="button" class="btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#historyModal" data-whatever="'+result[key].revisionId+'">'+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i></button>';

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
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let formData = new FormData();
	formData.append("record",event.target.dataset.whatever);
	let init = {method: 'POST', headers : myHeaders, body : formData};
	
	const res = await fetch("/api/requestExactCopy.php?",init); 
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				requestExactCopy(event);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");	
			}
			throw Error("My error");
		}
		else if (res.status==403){
			window.open('unAuthorized.html', '_blank');
		}
		else if (res.status==404){
			//alert("το αρχείο δε βρέθηκε");
			throw Error("το αρχείο δε βρέθηκε");
		}
		else if (res.status==409){
			//alert("Υπάρχει αίτημα σε εκκρεμότητα");
			throw Error("Υπάρχει αίτημα σε εκκρεμότητα");
		}
		else{
			//alert("γενικό σφάλμα");
			throw Error("My error");
		}
	}
	else {
		return("Το αίτημα έχει καταχωρηθεί");
	}
}



