import {uploadFileTest, uploadComponents,enableFileLoadButton} from "./uploadFiles.js";
import {getSigRecords, createSearch}  from "./signatureRecords.js";

let loginData = null;
const adeiesBtn = '<div id="leaveBtn"><a target="_blank" href="/adeies/startPage.php">Άδειες</a></div>';

export function createUIstartUp(){

	const navBarDiv = `<div id="myNavBar">
		<div  id="prosIpografi" ><a class="active" href="headmaster1_test.php">Προς Υπογραφή</a></div>
		<div  id="ipogegrammena" ><a href="signed_test.php">Διεκπεραιωμένα</a></div>
			
		<div ><a target="_blank" rel="opener" href="../nocc-1.9.8/protocol/editTable1.php?tn=book"><span id="protocolAppText"></span></a></div>	
		<div id="protocolBookBtn"><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book">Πρωτόκολλο</a></div>
		<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->
		<!--<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>-->
		<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
	</div><!-- /.container-fluid -->`;


	const extraMenuDiv = `<div id="headmasterExtraMenuDiv">
		<div class="flexVertical">
			<button class="btn btn-success btn-sm" data-bs-toggle="collapse" data-bs-target="#uploadDiv"><i class="far fa-plus-square"></i></button>
		</div>
		<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->

		<div id="userRoles" ></div>
		<div class="flexHorizontal">
			<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
			<button data-active="0" class="btn btn-danger btn-sm" id="showEmployeesBtn">Προσωπικά</button>
			<button data-active="0" class="btn btn-danger btn-sm" id="showToSignOnlyBtn">Πορεία Εγγρ.</button>
		</div>
		
	</div>`;

	const uploadDiv = `<div id="uploadDiv" class="collapse">	
	</div>`;

	if (document.querySelector("#myNavBar")!==null){
		document.querySelector("#myNavBar").remove();
		document.querySelector("#headmasterExtraMenuDiv").remove();
		document.querySelector("#uploadDiv").remove();
	}

	document.body.insertAdjacentHTML("afterbegin",uploadDiv);
	document.body.insertAdjacentHTML("afterbegin",extraMenuDiv);
	document.body.insertAdjacentHTML("afterbegin",navBarDiv);

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
			document.querySelector("#protocolBookBtn").insertAdjacentHTML("afterend",adeiesBtn);
		}
		const basicBtns ='<li><a class="dropdown-item" id="changePwdBtn">Αλλαγή Κωδικού</a></li>';
		//document.querySelector("#userRoles").innerHTML = basicBtns;
		document.querySelector("#myNavBarLogoContent").innerHTML = loginData.user.user;
		document.querySelector("#myNavBarLogoContent").innerHTML += '<div><button class="btn btn-warning" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button></div>';
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
	getRecordsAndFill();

	document.querySelector('#tableSearchInput').addEventListener("keyup", createSearch);
	document.querySelector('#showEmployeesBtn').addEventListener("click", createSearch);
	document.querySelector('#showToSignOnlyBtn').addEventListener("click", createSearch);
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
	getRecordsAndFill();
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

function getRecordsAndFill(){
	const records = getSigRecords().then( res => {
		createSearch();
	}, rej => {});		
}

function logout(){
	localStorage.clear();
	location.href = "/api/logout.php";
}