import { createUIstartUp } from "./createUI.js";
import {getSignedRecords, filterTable}  from "./signedRecords.js";
			
const basicUI = `<div id="myNavBar">
	<div  id="prosIpografi" ><a href="headmaster1_test.php">Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a class="active"  href="signed_test.php">Διεκπεραιωμένα</a></div>
		
	<div ><a target="_blank" rel="opener" href="../nocc-1.9.8/protocol/editTable1.php?tn=book"><span id="protocolAppText"></span></a></div>	
	<div id="protocolBookBtn"><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book">Πρωτόκολλο</a></div>

	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>

	<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>-->

	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
</div><!-- /.container-fluid -->


<div id="headmasterExtraMenuDiv">
	
	<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->

	<div id="userRoles" ></div>
	<div class="flexHorizontal">
		<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
		<button data-active="0" class="btn btn-danger btn-sm" id="showEmployeesBtn">Προσωπικά</button>
		<button data-active="0" class="btn btn-danger btn-sm" id="showToSignOnlyBtn">Πορεία Εγγρ.</button>
	</div>
	
</div>`

document.body.insertAdjacentHTML("afterbegin",basicUI);

let loginData = localStorage.getItem("loginData");
if (loginData === null){
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
	const basicBtns ='<li><a class="dropdown-item" id="changePwdBtn">Αλλαγή Κωδικού</a></li>';
	//document.querySelector("#userRoles").innerHTML = basicBtns;
	document.querySelector("#myNavBarLogoContent").innerHTML = loginData.user.user;
	document.querySelector("#myNavBarLogoContent").innerHTML += '<div><button class="btn btn-warning"  id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button></div>';
	document.querySelector("#logoutBtn").addEventListener("click",logout);		
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


//Γέμισμα πίνακα με εγγραφές χρήστη
getRecordsAndFill();

// Να δω τι γίνεται εδώ
if (+JSON.parse(localStorage.getItem("loginData")).user.roles[0].accessLevel){
	//$('#example1').DataTable().columns(4).search("#sign#").draw();
}
else{
	const tempUserElement= document.getElementById('showToSignOnlyBtn');
	tempUserElement.classList.remove('btn-success');
	tempUserElement.classList.add('btn-danger');
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
	getRecordsAndFill()
}

function getRecordsAndFill(){
	const records = getSignedRecords().then( res => {
		createSearch();
	}, rej => {});		
	
}

document.querySelector('#tableSearchInput').addEventListener("keyup", createSearch);
document.querySelector('#showEmployeesBtn').addEventListener("click", createSearch);
document.querySelector('#showToSignOnlyBtn').addEventListener("click", createSearch);

export function createSearch(event) {
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const department = loginData.user.roles[currentRole].department;
	const user = loginData.user.user;

	const showToSignOnlyBtn = document.getElementById('showToSignOnlyBtn');
	const showEmployeesBtn = document.getElementById('showEmployeesBtn');
	const tableSearchInput = document.getElementById('tableSearchInput');

	let  filterObject = {dataKeys : {author :null , currentDep : null} , searchString : null};

	if (event !== undefined){
		if(event.target.dataset.active == "0"){
			event.target.classList.remove('btn-danger');
			event.target.classList.add('btn-success');
			event.target.dataset.active = "1";
		}
		else if(event.target.dataset.active == "1"){
			event.target.classList.remove('btn-success');
			event.target.classList.add('btn-danger');
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
	console.log(filterObject)
	const debouncedFilter = debounce( () => filterTable("dataToSignTable",filterObject));
	debouncedFilter();
}


var timer;

function debounce(func, timeout = 500){
	return (...args) => {
		clearTimeout(timer);
		timer = setTimeout(() => { func.apply(this, args); }, timeout);
	};
}


function logout(){
	localStorage.clear();
	location.href = "logout.php"
}