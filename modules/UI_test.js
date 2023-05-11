import {uploadFileTest, uploadComponents,enableFileLoadButton} from "./Upload.js";
import {createActionsTemplate,getSigRecords, getSignedRecords, createSearch}  from "./Records_test.js";
import getFromLocalStorage from "./LocalStorage.js"

let loginData = null;
export let page = null;
const adeiesBtn = '<div><a target="_blank" href="/adeies/index.php">Άδειες</a></div>';
const pwdBtn = '<button class="btn btn-warning btn-sm" id="changePwdBtn" data-bs-toggle="modal" data-bs-target="#passwordModal" title="αλλαγή κωδικού"><i class="fas fa-key" id="changePwdBtn"></i></button>';

const passwordModalDiv =
`<div class="modal fade" id="passwordModal" tabindex="-1" role="dialog" aria-labelledby="passwordModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg" role="document" >
		<div class="modal-content">
			<div class="modal-header">
				<b>Αλλαγή κωδικού</b>
			</div>
			<div class="modal-body" id="passwordForm">
				<div style="display : grid; grid-template-columns: 3fr 3fr 1fr;grid-template-rows: repeat(3, 33% [row-start]);justify-items: left;gap : 5px;align-items:center;justify-content:stretch;" >
					<div style="grid-column: 1/2; grid-row: 1/2">Παλιός Κωδικός Πρόσβασης</div><div style="width:100%;grid-column: 2/3; grid-row: 1/2"><input class="form-control" type="password" name="oldPwd" id="oldPwd" /></div><div style="grid-column: 3/4; grid-row: 1/2"><i id="showOldPassBtn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i></div>			
					<div style="grid-column: 1/2; grid-row: 2/3">Νέος Κωδικός Πρόσβασης</div><div style="width:100%;grid-column: 2/3; grid-row: 2/3"><input  class="form-control" type="password" name="newPwd" id="newPwd" /></div><div style="grid-column: 3/4; grid-row: 2/3"><i id="showNewPass1Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i></div>
					<div style="grid-column: 1/2; grid-row: 3/4">Επανεισαγωγή Νέου Κωδικού Πρόσβασης</div><div style="width:100%;grid-column: 2/3; grid-row: 3/4"><input  class="form-control" type="password"  name="newPwd2" id="newPwd2" /></div><div style="grid-column: 3/4; grid-row: 3/4"><i id="showNewPass2Btn" style="cursor:pointer"  class="fas fa-eye fa-1x"></i></div>
				</div>			
				<button style="margin-top:1em;" class="btn btn-success btn-sm" id="setPwd" >Αλλαγή</button>
			</div>
			<div class="modal-footer">
				<div class="otherContentFooter">
				</div>
				<button id="closePasswordModalBtn" type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
	</div>
</div>`;

const fileOpenModal = 
	`<dialog id="fileOpenDialog">

	</dialog>`;

const loadingModal = 
	`<dialog id="loadingDialog">
		<div class="spinner-border" role="status">
			<span>Αναμονή για ολοκλήρωση της διαδικασίας</span>
			<span class="visually-hidden">Loading...</span>
		</div>
	</dialog>`;

const navBarDiv = `<div id="myNavBar">
	<div  id="prosIpografi" ><a>Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a>Διεκπεραιωμένα</a></div>
		
	<div id="xreoseis"><a><span id="protocolAppText"></span></a></div>	
	<div id="protocolBookBtn"><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book">Πρωτόκολλο</a></div>
	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->
	<!--<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>-->
	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
	</div><!-- /.container-fluid -->`;

const extraMenuDiv = `<div id="headmasterExtraMenuDiv">
		<div class="flexVertical" id="uploadBtnDiv">
		</div>
		<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->
		<div id="userRoles" ></div>
		<div class="flexHorizontal">
			<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
			<button data-active="0" class="btn btn-danger btn-sm" id="showEmployeesBtn">Προσωπικά</button>
			<button data-active="0" class="btn btn-danger btn-sm" id="showToSignOnlyBtn">Πορεία Εγγρ.</button>
		</div>
		
	</div>`;

const signTable = `<table id="dataToSignTable" class="table">
	<thead>
	<tr>
		<th id="filename" class="text-right">Έγγραφο <button id="syncRecords" title="Ανανέωση εγγραφών" type="button" class="btn btn-dark btn-sm"><i class="fas fa-sync"></i></button><div style="margin-left:1em;display:none;" id="recordsSpinner" class="spinner-border spinner-border-sm" role="status">
				<span class="visually-hidden">Loading...</span>
			</div></th>
		<th id="date" class="text-right">Εισαγωγή</th>
		<th id="author" class="text-right">Συντάκτης</th>
		<th id="status" class="text-right">Κατάσταση</th>
		<th id="fileActions" class="text-right">Ενέργειες</th>
	</tr>
	</thead>
	<tbody>

	</tbody>
	</table>`;


function pagesCommonCode(){
	console.log("common page code executing...")
	if (document.querySelector("#myNavBar")!==null){
		document.querySelector("#myNavBar").remove();
	}
	if (document.querySelector("#headmasterExtraMenuDiv")!==null){
		document.querySelector("#headmasterExtraMenuDiv").remove();
	}
	if (document.querySelector("#uploadBtn")!==null){
		document.querySelector("#uploadBtn").remove();
	}

	if (document.querySelector("#uploadDiv")!==null){
		console.log("common page code executing...")
		document.querySelector("#uploadDiv").remove();
		
	}
	if (document.querySelector("#passwordModal") !== null){
		document.querySelector("#passwordModal").remove();
	}
	if (document.querySelector("#fileOpenDialog") !== null){
		document.querySelector("#fileOpenDialog").remove();
	}
	document.body.insertAdjacentHTML("beforeend",fileOpenModal);

	if (document.querySelector("#loadingDialog")){
		document.querySelector("#loadingDialog").remove();
	}
	document.body.insertAdjacentHTML("beforeend",loadingModal);

	const uploadDiv = `<div id="uploadDiv" class="collapse"></div>`;
	document.body.insertAdjacentHTML("afterbegin",uploadDiv);
	console.log("upload added");

	document.body.insertAdjacentHTML("afterbegin",extraMenuDiv);
	document.body.insertAdjacentHTML("afterbegin",navBarDiv);
	document.body.insertAdjacentHTML("beforeend",passwordModalDiv);

	switch (page){
		case "signature" :
			if (document.querySelector("#dataToSignTable")!==null){
				document.querySelector("#dataToSignTable").remove();
			}
			document.body.insertAdjacentHTML("beforeend",signTable);
			document.querySelector("#ipogegrammena>a").classList.remove("active");
			document.querySelector("#xreoseis>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.add("active");
			break;
		case "signed" :
			if (document.querySelector("#dataToSignTable")!==null){
				document.querySelector("#dataToSignTable").remove();
			}
			document.body.insertAdjacentHTML("beforeend",signTable);
			document.querySelector("#ipogegrammena>a").classList.add("active");
			document.querySelector("#xreoseis>a").classList.remove("active");
			document.querySelector("#prosIpografi>a").classList.remove("active");
			break;
		case "charges" :
			if (document.querySelector("#dataToSignTable")!==null){
				document.querySelector("#dataToSignTable").remove();
			}
			document.querySelector("#ipogegrammena>a").classList.remove("active");
			document.querySelector("#xreoseis>a").classList.add("active");
			document.querySelector("#prosIpografi>a").classList.remove("active");
			break;
		default :
			alert("Σελίδα μη διαθέσιμη");
			return;
	}

	loginData = localStorage.getItem("loginData");
	if (loginData === null){
		window.location.href = "index.php";
		alert("Δεν υπάρχουν στοιχεία χρήστη");
	}
	else{
		loginData = JSON.parse(loginData);
		//Πρόσβαση στο Πρωτόκολλο λεκτικό
		let cRole = localStorage.getItem("currentRole");
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
		document.querySelector("#myNavBarLogoContent").innerHTML += '<div><button class="btn btn-warning btn-sm" id="logoutBtn" title="αποσύνδεση"><i class="fas fa-sign-out-alt"></i></button></div>';
		document.querySelector("#logoutBtn").addEventListener("click",logout);	
		
        document.querySelector("#prosIpografi>a").addEventListener("click",createUIstartUp);
        document.querySelector("#ipogegrammena>a").addEventListener("click",createSignedUIstartUp);	
		document.querySelector("#xreoseis>a").addEventListener("click",createChargesUIstartUp);			
	}

	//create Roles UI	
	document.querySelector("#userRoles").innerHTML = "";
	const cRole = localStorage.getItem("currentRole");
	loginData.user.roles.forEach((role,index)=>{
		let newRole;
		if(index == cRole){
			newRole = `<div><button id="role_${index}_btn"  type="button" class="btn btn-success btn-sm">${role.roleName}</button></div>`;
		}
		else{
			newRole = `<div><button id="role_${index}_btn"  type="button" class="btn btn-secondary btn-sm">${role.roleName}</button></div>`;
		}
		document.querySelector('#userRoles').innerHTML += newRole;
	});  
	loginData.user.roles.forEach((role,index)=>{
			document.querySelector('#role_'+index+'_btn').addEventListener("click",()=>{setRole(index);}); 
	})

	document.querySelector("#showOldPassBtn").addEventListener("click", ()=>showPass('oldPwd'));
	document.querySelector("#showNewPass1Btn").addEventListener("click", ()=>showPass('newPwd'));
	document.querySelector("#showNewPass2Btn").addEventListener("click",()=>showPass('newPwd2'));

	document.querySelector("#passwordModal").addEventListener("show.bs.modal",(e)=> {
		document.getElementById('oldPwd').value= "";
		document.getElementById('newPwd').value= "";
		document.getElementById('newPwd2').value= "";
    });

	document.querySelector("#setPwd").addEventListener("click",changePassword);	

	document.querySelector('#tableSearchInput').addEventListener("keyup", createSearch);
	document.querySelector('#showEmployeesBtn').addEventListener("click", createSearch);
	document.querySelector('#showToSignOnlyBtn').addEventListener("click", createSearch);

	`<button id="fileOpenFromDialogBtn">Άνοιγμα</button>
	<button id="fileSaveFromDialogBtn">Αποθήκευση</button>
	<button id="fileCloseDialog">Κλείσιμο</button>`
}


async function createChargesUIstartUp(){
	page = "charges";
	pagesCommonCode();

	`<div class="topMenu" >
		<div id="topSettingsDiv" class="topSettingsDiv" >	
			<div id="recordChangesBtnDiv" >
				<button class="btn btn-info" type="button" id="openChangesBtn" data-toggle="tooltip" data-original-title="Αλλαγές σε πρωτόκολλα">
					<i class="fas fa-info"></i>
				</button>
				
			</div>
			<div id="filterBtnDiv" >
				<button class="btn btn-info" type="button" id="openFilterBtn" data-toggle="tooltip" data-original-title="Φίλτρο">
					<i class="fas fa-filter"></i>
				</button>
				
			</div>
			<div id="yearDiv" class="yearDiv">
				<div class="dropdown col-7">
					<button class="btn btn-info dropdown-toggle" type="button" id="yearDropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
						
					</button>
					<div class="dropdown-menu" id="yearDropdownMenu" aria-labelledby="yearDropdownMenuButton">
					
					</div>
				</div>
				<div class="form-check">
					<?php
						if ($_SESSION['protocolAccessLevel'] == 1){
							echo '<button class="btn btn-info" type="button" id="addYearButton" onclick="addYear();" >+</button>'; 
						}
					?>
				</div>
			</div>
			
			<div id="removeNotificationsBtnDiv" >
				<?php
					if ($_SESSION['protocolAccessLevel'] != 1){
						echo  '<button class="btn btn-info ektos" name="removeNotifications" id="removeNotifications" onclick="removeNotifications()" data-toggle="tooltip" title="" data-original-title="Αποχρέωση Κοινοποιήσεων">';
						echo  '<i class="fab fa-stack-overflow"></i>';
						echo  '</button>';
					}
				?>
			</div>
			
				
		</div>
		<div id="recentProtocolsDiv" class="col-lg-5 col-sm-12" >	
		</div>
		<div id="topMenuAdminBtnsDiv" class="col-lg-2 col-sm-12" >	
		<?php
			if ($_SESSION['protocolAccessLevel'] == 1){
				echo '<div  ><a rel="opener"   rel="referer" target="_blank" href="../mich_login.php"><i class="fas fa-envelope  fa-lg"></i>&nbspEmails</a></div>';
				echo '<div  ><a rel="opener"   rel="referer" target="_blank" href="../kside/index.php"><i class="fas fa-inbox  fa-lg"></i>&nbspΚΣΗΔΕ</a></div>';
			}
		?>
		</div>

	</div>`;
	const protocolYears = getProtocolYears();
	let currentYear = null;
	if (currentYear = localStorage.getItem(currentYear)){
		yearDropdownMenuButton.innerHTML = "Έτος "+currentYear;
	}
}

export function createUIstartUp(){
	
	console.log("signature");
    page = "signature";
	pagesCommonCode();

	const uploadBtn=`<button class="btn btn-success btn-sm" data-bs-toggle="collapse" data-bs-target="#uploadDiv"><i class="far fa-plus-square"></i></button>`;
	document.querySelector("#uploadBtnDiv").innerHTML =uploadBtn;
	//create Upload UI
	document.querySelector("#uploadDiv").innerHTML = uploadComponents;

	document.querySelector("#selectedFile").addEventListener("change",() => enableFileLoadButton());
	document.querySelector("#uploadFileButton").addEventListener("click",()=>uploadFileTest());

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

	//Γέμισμα πίνακα με εγγραφές χρήστη
    createActionsTemplate();
	getToSignRecordsAndFill();

}

export function createSignedUIstartUp(){
	
    console.log("signed");
    page = "signed";
	pagesCommonCode();

	//Γέμισμα πίνακα με εγγραφές χρήστη
	getSignedRecordsAndFill();

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

async function getProtocolYears(){
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

	let init = {method: 'GET', headers : myHeaders};
	const res = await fetch("/api/getProtocolYears.php",init);
	if (!res.ok){
		const resdec = res.json();
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ==1){
				getProtocolYears();
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
			alert("Πρόβλημα στο σέρβερ, επικοινωνήστε με το διαχειριστή του συστήματος");
		}
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		return res.json();
	}
}

async function changePassword(){
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);

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

	let init = {method: 'POST', headers : myHeaders, body : formData};
	const res = await fetch("/api/changePassword.php",init);
	if (!res.ok){
		const resdec = res.json();
		if (res.status ==  401){
			const resRef = await refreshToken();
			if (resRef ==1){
				changePassword();
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
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		oldPwdInput.value ="";
		newPwdInput.value ="";
		newPwd2Input.value ="";
		const myModalEl = document.querySelector("#passwordModal");
		const modal = bootstrap.Modal.getInstance(myModalEl);
		modal.hide();
	}
}


function updateRolesUI(){
	const cRole = localStorage.getItem("currentRole");
	loginData.user.roles.forEach((role,index)=>{
		if(index == cRole){
			document.querySelector('#role_'+index+'_btn').classList.remove('btn-secondary'); 
			document.querySelector('#role_'+index+'_btn').classList.add('btn-success'); 
		}
		else{
			document.querySelector('#role_'+index+'_btn').classList.remove('btn-success'); 
			document.querySelector('#role_'+index+'_btn').classList.add('btn-secondary');  
		}
	});   
	return;
}

function setRole(index){
	localStorage.setItem("currentRole",index);									
	updateRolesUI();
    switch (page){
        case "signature" :
            getToSignRecordsAndFill();
            break;
        case "signed" :
            getSignedRecordsAndFill();
            break;
        default :
            alert("Σελίδα μη διαθέσιμη");
            return;
    }
	//getRecordsAndFill();
	if (loginData === null){
		window.location.href = "index.php";
		alert("Δεν υπάρχουν στοιχεία χρήστη");
	}
	else{
		//Πρόσβαση στο Πρωτόκολλο λεκτικό
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
	//createUIstartUp();
}

export function getToSignRecordsAndFill(){
	const records = getSigRecords().then( res => {
		createSearch();
	}, rej => {});		
}


export function getSignedRecordsAndFill(){
	const records = getSignedRecords().then( res => {
		createSearch();
	}, rej => {});			
}

export function getChargesAndFill(){
	const records = getSignedRecords().then( res => {
		createSearch();
	}, rej => {});			
}



function logout(){
	localStorage.clear();
	location.href = "/api/logout.php";
}