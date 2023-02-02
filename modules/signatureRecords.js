import refreshToken from "./refreshToken.js"
import getFromLocalStorage from "./localStorage.js"

const signModalDiv =
	`<div class="modal fade" id="signModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
	  <div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="exampleModalLabel">Υπογραφή Εγγράφου</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
			</div>
			<div class="modal-body" id="signForm">
				<div>
					<div >
						<u>Επισήμανση</u>
							Ν.2693/1999. αρ.25 παρ.5 <i>
							Οι προιστάμενοι όλων των βαθμίδων οφείλουν να προσυπογράφουν τα έγγραφα που ανήκουν στην 
							αρμοδιότητά τους και εκδίδονται με την υπογραφή του προϊσταμένου τους. Αν διαφωνούν, οφείλουν 
							να διατυπώσουν εγγράφως τις τυχόν αντιρρήσεις τους. Αν παραλείψουν να προσυπογράψουν το 
							έγγραφο, θεωρείται ότι το προσυπέγραψαν.</i>
					</div>
					<textarea id="signText" cols="100" rows="3" size="200" class="form-control" placeholder="Το σχόλιο είναι προαιρετικό" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
					<div style="margin-top : 0.2em;" class="btn-group" role="group" aria-label="Basic example">
					  <button type="button" id="selectMiniditalButtons" onclick="mindigitalButtons();" class="btn btn-primary">Mindigital</button>
					  <button type="button" id="selectSchButtons" onclick="schButtons();" class="btn btn-secondary">sch</button>
					</div>
				</div>
			
				<div class="contentFooter">
					<div style="margin-top:1em;" id="mindigitalBtngroup" aria-label="mindigitalGroup">
						<button id="signWithObjectionButtonMindigital" type="button" class="btn btn-danger trn" style="margin-left:3em;">Έγγραφη αντίρρηση<i style="margin-left:0.2em;" class="fas fa-thumbs-down"></i></button>
						<button  style="margin-left:0.5em;" id="signAsLastMindigital" type="button" class="btn btn-warning trn">Τελικός υπογράφων<i style="margin-left:0.2em;" class="fas fa-stamp"></i></button>
							
						<button id="signWithMindigital" type="button" class="btn btn-success trn" style="margin-left:1.5em;">Mindigital<i style="margin-left:0.2em;" class="fas fa-signature"></i></button>
					</div>
					<div style="margin-top:1em;" id="schBtngroup" aria-label="schGroup">
						<button id="signWithObjectionButton" type="button" class="btn btn-danger trn" style="margin-left:3em;">Έγγραφη αντίρρηση<i style="margin-left:0.2em;" class="fas fa-thumbs-down"></i></button>
						<button style="margin-left:0.5em;" id="signAsLast" type="button" class="btn btn-warning trn">Τελικός υπογράφων<i style="margin-left:0.2em;" class="fas fa-stamp"></i></button>
						<button id="signButton" type="button" class="btn btn-success trn" style="margin-left:1.5em;">Sch<i style="margin-left:0.2em;" class="fas fa-signature"></i></button>
					</div>
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
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon1" >Οριστική Απόρριψη Εγγράφου</span></b>
					<span class="input-group-text" id="basic-addon1" ><br><br><u>Επισήμανση</u><br>
					    Ν.2693/1999. αρ.25 παρ.5<i>
						Οι προιστάμενοι όλων των βαθμίδων οφείλουν να προσυπογράφουν τα έγγραφα που ανήκουν στην 
						αρμοδιότητά τους και εκδίδονται με την υπογραφή του προϊσταμένου τους. Αν διαφωνούν, οφείλουν 
						να διατυπώσουν εγγράφως τις τυχόν αντιρρήσεις τους. Αν παραλείψουν να προσυπογράψουν το 
						έγγραφο, θεωρείται ότι το προσυπέγραψαν.</i>
					</span>
				  </div>
				  <textarea onKeyUp="enableRejectButton();" id="rejectText" cols="100" rows="3" size="200" class="form-control" placeholder="Η απόρριψη δεν αφορά σε διαφωνία ως προς το περιεχόμενο" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
			  	<button id="rejectButton" type="button" class="btn btn-warning trn" disabled>Απόρριψη</button>
				<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
	</div>`;
	

const otpModalsDiv =		
	`<div class="modal fade" id="otpModal" tabindex="-1" role="dialog" aria-labelledby="otpModalLabel" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div  class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon2" >Εισαγωγή OTP</span></b><div id="otpTitle"></div>
					<span class="input-group-text" id="basic-addon2" ><br><br><u>Επισήμανση</u><br>
						<span id="otpStatus">το ΟTP λαμβάνεται αυτόματα από το email, εφόσον έχετε δηλώσει αυτό τον τρόπο λήψης στο mindigital.</span>
					</span>
				  </div>
				  <textarea id="otpText" cols="100" rows="3" size="200" class="form-control" placeholder="Εισαγωγή OTP" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
				<button id="checkEmailButton" type="button" class="btn btn-secondary trn"  style="margin-right:2em;">Επανέλεγχος Email</button>
				<button id="createExCopyButton" type="button" class="btn btn-warning trn" >Δημιουργία Αντιγράφου</button>
				<button id="closeButtonModal" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
	</div>
	
	<div class="modal fade" id="otpModal1" tabindex="-1" role="dialog" aria-labelledby="otpModalLabel1" aria-hidden="true">
	  <div class="modal-dialog modal-lg" role="document" >
			<div class="modal-content">
			  <div class="modal-body" id="rejectForm">
				<div class="input-group mb-3">
				  <div  class="input-group-prepend" style="margin-bottom:2em;"><b>
					<span class="input-group-text" id="basic-addon21" >Εισαγωγή OTP</span></b><div id="otpTitle"></div>
					<span class="input-group-text" id="basic-addon21" ><br><br><u>Επισήμανση</u><br>
						<span id="otpStatus1">το ΟTP λαμβάνεται αυτόματα από το email, εφόσον έχετε δηλώσει αυτό τον τρόπο λήψης στο mindigital.</span>
					</span>
				  </div>
				  <textarea id="otpText1" cols="100" rows="3" size="200" class="form-control" placeholder="Εισαγωγή OTP" aria-label="keyword" aria-describedby="basic-addon1"></textarea>
				</div>
				
			  <div class="modal-footer">
				<button id="checkEmailButton1" type="button" class="btn btn-secondary trn"  style="margin-right:2em;">Επανέλεγχος Email</button>
				<button id="createExCopyButton1" type="button" class="btn btn-warning trn" >Υπογραφή Εγγράφου</button>
				<button id="closeButtonModal1" type="button" class="btn btn-secondary trn" data-dismiss="modal">Close</button>
			  </div>
			</div>
		  </div>
		</div>
	</div>`;
	
	

document.body.insertAdjacentHTML("beforeend",signModalDiv);
document.body.insertAdjacentHTML("beforeend",rejectModalDiv);
document.body.insertAdjacentHTML("beforeend",otpModalsDiv);

// $('#signModal').on('show.bs.modal', function (e) {
					// var aa = e.relatedTarget.getAttribute('data-whatever');
					// $('#signButton').click(function(){signDocument(aa);});
					// $('#signWithObjectionButton').click(function(){signWithObjectionDocument(aa);});
					// $('#signAsLast').click(function(){signAsLast(aa);});
					// $('#signWithMindigital').click(function(){showOTP(aa);});
					// $('#signAsLastMindigital').click(function(){showOTP(aa, 1);});
					// $('#signWithObjectionButtonMindigital').click(function(){signWithObjectionDocument(aa);});
					
				// });

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

export async function getSigRecords(){
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
		if (res.status == 401){
			const reqToken = await refreshToken();
			if (reqToken){
				getSigRecords();
			}
			else{
				alert('σφάλμα εξουσιοδότησης');
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
		return await res.json();
	}
}

export function fillTable(result){
	//const table = $('#example1').DataTable();
	//table.clear().draw();

	const table = document.getElementById("dataToSignTable");

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
		
		let temp1=[];
		let filenameBtn = "";
		
		let relevantDocs = result[key].relevantDocs;
		let relevantDocsArray = relevantDocs.split("*");
		let relevantDocsElement = "&nbsp&nbsp&nbsp";
		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				relevantDocsElement +='<i id="rel_btn_'+result[key]['aa']+'_'+l+'" class="fas fa-paperclip" title="'+relevantDocsArray[l]+'"></i>&nbsp';		
			}
		}						
		
		if (result[key].preview_file_last==""){
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-success" >'+result[key]['filename']+'</button>&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";
		}
		else{
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-success" >'+result[key]['filename']+'</button>&nbsp<i  id="btn_'+result[key]['aa']+'_lastFile" class="fas fa-search-plus" title="Προεπισκόπηση τελευταίας τροποποίησης"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";;
		}
		
		temp1[0] = filenameBtn;
		temp1[1] = result[key].date;
		temp1[2] = result[key].fullName;
		
		let recordStatus = "";
		for (let i=0;i<result[key].levels;i++){
			if (i<result[key].diff){
				recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-success btn-sm"><i class="fas fa-calendar-check"></i></button>';
			}
			else{
				recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-secondary btn-sm"><i class="fas fa-calendar-times"></i></button>';
			}	
		}
		temp1[3] =  recordStatus;
		
		let signBtn = "";
		let historyBtn = "";
		let rejectBtn = "";
		if (result[key].diff == 0 && accessLevel==1){
			signBtn = '<button id="showSignModalBtn" type="button" class="btn btn-success btn-sm"  data-bs-toggle="modal" data-bs-target="#signModal" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
		}
		
		if (result[key].objection>0){
			historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].aa+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i>'+"<span class='glyphicon glyphicon-flash' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip'></span></a>";
		}
		else{
			historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].aa+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού">'+"</i></a>";
		}
		rejectBtn = '<button id="showRejectModal" type="button" class="btn btn-danger btn-sm" data-toggle="modal" data-target="#rejectModal" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-ban" data-toggle="tooltip" title="Οριστική Απόρριψη"></i>'+"</button>";
		temp1[4] = 	'<div class="recordButtons">'+signBtn+historyBtn+rejectBtn+'</div>';	
		
		c1.innerHTML = temp1[0];
		c2.innerHTML = temp1[1];
		c3.innerHTML = temp1[2];
		c4.innerHTML = temp1[3];
		c5.innerHTML = temp1[4];		
		
		document.querySelector("#btn_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['filename']));
		document.querySelector("#btn_"+result[key]['aa']+"_firstFile").addEventListener("click",()=>viewFile(result[key]['filename']));
		if (result[key].preview_file_last !==""){
			document.querySelector("#btn_"+result[key]['aa']+"_lastFile").addEventListener("click",()=>viewFile(result[key]['preview_file_last']));
		}
		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				document.querySelector("#rel_btn_"+result[key]['aa']+"_"+l).addEventListener("click",()=>viewFile(relevantDocsArray[l]));
			}
		}						
	}
}


async function viewFile(filename){ 
	//console.log(filename);
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const urlpar = new URLSearchParams({filename : encodeURIComponent(filename)});
	const jwt = loginData.jwt;
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	
	const res = await fetch("/api/viewFile.php?"+urlpar,init); 
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				viewFile(filename);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");	
			}
		}
		else if (res.status==403){
			window.open('unAuthorized.html', '_blank');
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
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
		
		let openFileAns = confirm("Ναι για απευθείας άνοιγμα, άκυρο για αποθήκευση");
		if (inBrowser.includes(fileExtension) && openFileAns){
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
}

export async function signDocument(aa, isLast=0, mindigital=1, otp=0, objectionComment=0){
	document.querySelector  ('#signModal').modal('hide');
	$("#signing").fadeIn();
	const {jwt,role} = getFromLocalStorage();	
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	
	const comment = document.getElementById('signText').value;
	let formData = new FormData();
	formData.append("aa", aa);
	if (objectionComment){
		formData.append("objectionComment", comment);
	}
	else{
		formData.append("comment", comment);
	}
	formData.append("isLast", isLast);
	formData.append("mindigital", mindigital);
	formData.append("otp", otp);
	
	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/signDoc.php",init); 
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				signDocument(aa);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");	
			}
		}
		else if (res.status==403){
			window.open('unAuthorized.html', '_blank');
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
	}
	else {
		
	}
}

export async function showOTP(aa , isLast = 0){
	const otpbutton = document.getElementById("createExCopyButton1");
	otpbutton.dataset.whatever = aa;
	otpbutton.addEventListener("click",function(){signDocumentMindigital(aa ,isLast);});
	document.querySelector('#signModal').modal('hide');
	document.querySelector('#otpModal1').modal('show');
}


export async function rejectDocument(aa){
	document.querySelector('#rejectModal').modal('hide');
	document.querySelector("#rejecting").fadeIn();
	const {jwt,role} = getFromLocalStorage();	
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	
	const comment = document.getElementById('rejectText').value;
	let formData = new FormData();
	formData.append("aa",aa);
	formData.append("comment", comment);
	
	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/rejectDoc.php",init); 
	if (!res.ok){
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ===1){
				signDocument(aa);
			}
			else{
				alert("σφάλμα εξουσιοδότησης");	
			}
		}
		else if (res.status==403){
			window.open('unAuthorized.html', '_blank');
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
	}
	else {
		
	}
}

document.querySelector('#rejectModal').addEventListener('show.bs.modal', function (e) {
	const aa = e.relatedTarget.getAttribute('data-whatever');
	document.querySelector('#rejectButton').addEventListener("click", function(){rejectDocument(aa);});
});


document.querySelector('#otpModal').addEventListener('shown.bs.modal', function (e) {
	document.querySelector('#createExCopyButton').setAttribute("disabled", false);
	document.querySelector('#otpText').value="";
	const otpRes = requestOTP();
	console.log(otpRes);
	if (otpRes[0] == 0){
		document.querySelector('#otpText').value = otpRes[1];
		document.querySelector('#otpStatus').value = "Εισαγωγή OTP από email";
		const aa = e.relatedTarget.getAttribute('data-whatever');
		document.querySelector('#createExCopyButton').addEventListener("click", function(){signMD(aa);}); 
	}
	else if (otpRes[0] == 1){
		document.querySelector('#otpStatus').value = otpRes[1];
		document.querySelector('#otpText').value = 'Eχει δηλωθεί η χρήση κινητού για λήψη OTP. Eισάγετε το OTP';
		const aa = e.relatedTarget.getAttribute('data-whatever');
		document.querySelector('#createExCopyButton').addEventListener("click", function(){signMD(aa);}); 	
	}
	else {
		document.querySelector('#otpStatus').value = otpRes[1];
		document.querySelector('#createExCopyButton').setAttribute("disabled", true);
	}
});

document.querySelector('#otpModal1').addEventListener('shown.bs.modal', function (e) {
	//console.log(e);
	document.querySelector('#createExCopyButton1').setAttribute("disabled", false);
	document.querySelector('#otpText1').value="";
	const otpRes = requestOTP();
	console.log(otpRes);
	if (otpRes[0] == 0){
		document.querySelector('#otpText1').value = otpRes[1];
		document.querySelector('#otpStatus1').value = "Εισαγωγή OTP από email";
	}
	else if (otpRes[0] == 1){
		document.querySelector('#otpStatus1').value = otpRes[1];
		//$('#otpText1').val('Eχει δηλωθεί η χρήση κινητού για λήψη OTP. Eισάγετε το OTP.');
		//var aa = e.relatedTarget.getAttribute('data-whatever'); 	
	}
	else {
		document.querySelector('#otpStatus1').value = otpRes[1];
		document.querySelector('#createExCopyButton1').setAttribute("disabled", true);
	}
});





//document.querySelector("#saveButtonModal").addEventListener("click", function() {
	 //var interest = $('ul#alldevices').find('li.active').;
//});

//tempUserElement.classList.remove('btn-danger');
//tempUserElement.classList.add('btn-success');


const element1 = document.getElementById("selectSchButtons");
const element2 = document.getElementById("schBtngroup");	
const element3 = document.getElementById("mindigitalBtngroup");

if (element1.classList.contains('btn-secondary')){
	element2.style.display = "none";
	element3.style.display = "block";
} else {
	element2.style.display = "block";
	element3.style.display = "none";
}

function mindigitalButtons(){
	const element0 = document.getElementById("selectMiniditalButtons");
	const element1 = document.getElementById("selectSchButtons");
	if (element0.classList.contains('btn-secondary')){
		element0.classList.remove('btn-secondary');
		element0.classList.add('btn-primary');
		element1.classList.remove('btn-primary');
		element1.classList.add('btn-secondary');
	}
	const element2 = document.getElementById("schBtngroup");	
	const element3 = document.getElementById("mindigitalBtngroup");
	if (element1.classList.contains('btn-secondary')){
		element2.style.display = "none";
		element3.style.display = "block";
	} else {
		element2.style.display = "block";
		element3.style.display = "none";
	}
}

function schButtons(){
	const element0 = document.getElementById("selectMiniditalButtons");
	const element1 = document.getElementById("selectSchButtons");
	if (element1.classList.contains('btn-secondary')){
		element1.classList.remove('btn-secondary');
		element1.classList.add('btn-primary');
		element0.classList.remove('btn-primary');
		element0.classList.add('btn-secondary');
	}
	const element2 = document.getElementById("schBtngroup");	
	const element3 = document.getElementById("mindigitalBtngroup");
	if (element1.classList.contains('btn-secondary')){
		element2.style.display = "none";
		element3.style.display = "block";
	} else {
		element2.style.display = "block";
		element3.style.display = "none";
	}
}