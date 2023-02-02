import {uploadFileTest, uploadComponents} from "./uploadFiles.js";
			
const basicUI = `<div id="myNavBar">
	<div  id="prosIpografi" ><a class="active" href="directorSign.php">Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a href="signed.php">Διεκπεραιωμένα</a></div>
		
	<div ><a target="_blank" rel="opener" href="../nocc-1.9.8/protocol/editTable1.php?tn=book"><span id="protocolAppText"></span></a></div>	
	<div ><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book">Πρωτόκολλο</a></div>

	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->

	<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>

	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
</div><!-- /.container-fluid -->


<div id="headmasterExtraMenuDiv">
	<div class="flexVertical">
		<button class="btn btn-success btn-sm" data-bs-toggle="collapse" data-bs-target="#uploadDiv"><i class="far fa-plus-square"></i></button>
	</div>
	<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->
	<div class="flexVertical">
		<button id="emailButton" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Λήψη μηνυμάτων" onclick="connectToEmail();"><i id="faMail" class="far fa-envelope-open"></i></button>
		<button id="mindigitalButton" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Σύνδεση στο mindigital" onclick="showMindigitalModal();"><i class="fas fa-file-signature"></i></button>
	</div>
	<div id="userRoles" ></div>
	<div class="flexHorizontal">
		<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
		<button class="btn btn-warning btn-sm" id="showEmployeesBtn">Υφιστ.</button>
		<button class="btn btn-warning btn-sm" id="showToSignOnlyBtn">Όλα</button>
	</div>
	
</div>

<div id="uploadDiv" class="collapse">
	

</div>`

document.body.insertAdjacentHTML("beforebegin",basicUI);

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
		const adeiesBtn = '<div><a class="nav-link" target="_blank" href="/adeies/index.php">Άδειες</a></div>';
		document.querySelector("#myNavBar").innerHTML += adeiesBtn;
	}
	const basicBtns ='<li><a class="dropdown-item" id="changePwdBtn">Αλλαγή Κωδικού</a></li>';
	//document.querySelector("#userRoles").innerHTML = basicBtns;
	document.querySelector("#myNavBarLogoContent").innerHTML = loginData.user.user;
	document.querySelector("#myNavBarLogoContent").innerHTML += '<div><button class="btn btn-warning" onclick="logout();" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button></div>';	
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
//create Upload UI
document.querySelector("#uploadDiv").innerHTML = uploadComponents;
document.querySelector("#uploadFileButton").addEventListener("click",()=>uploadFileTest());


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
}

document.querySelector('#showEmployeesBtn').addEventListener("click", function() {
	const user = document.querySelector('#connectedUser').value;
	const tempUserElement= document.getElementById('showEmployees');
	if(tempUserElement.classList.contains('btn-danger')){
		tempUserElement.classList.remove('btn-danger');
		tempUserElement.classList.add('btn-success');
		//$('#example1').DataTable().columns(2).search('').draw();
	}
	else if(tempUserElement.classList.contains('btn-success')){
		tempUserElement.classList.remove('btn-success');
		tempUserElement.classList.add('btn-danger');
		//$('#example1').DataTable().columns(2).search(user).draw();
	}
	tempUserElement1= document.getElementById('showToSignOnlyBtn');
	if(tempUserElement1.classList.contains('btn-danger')){
		//$('#example1').DataTable().columns(4).search('').draw();
	}
	else{
		//$('#example1').DataTable().columns(4).search('#sign#').draw();
	}
	//$('#textbox1').val(this.checked);        
});

document.querySelector('#showToSignOnlyBtn').addEventListener("click", function() {
	const user = document.querySelector('#connectedUser').value;
	const tempUserElement= document.getElementById('showToSignOnlyBtn');
	if(tempUserElement.classList.contains('btn-danger')){
		tempUserElement.classList.remove('btn-danger');
		tempUserElement.classList.add('btn-success');
		//$('#example1').DataTable().columns(4).search("#sign#").draw();
	}
	else if(tempUserElement.classList.contains('btn-success')){
		tempUserElement.classList.remove('btn-success');
		tempUserElement.classList.add('btn-danger');
		//$('#example1').DataTable().columns(4).search('').draw();
	}
	tempUserElement1= document.getElementById('showEmployees');
	if(tempUserElement1.classList.contains('btn-danger')){
		//$('#example1').DataTable().columns(2).search(user).draw();
	}
	else{
		//$('#example1').DataTable().columns(2).search('').draw();
	}
	//$('#textbox1').val(this.checked);        
});
