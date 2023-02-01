<script type="module" >
	import {getSigRecords,fillTable}  from "./modules/signatureRecords.js";
	
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
		<button class="btn btn-success btn-sm" data-bs-toggle="collapse" data-bs-target="#uploadDiv"><i class="far fa-plus-square"></i></button>
		<button class="btn btn-warning btn-sm" id="showEmployees">Έγγρ. Υφισταμένων</button>
		<button class="btn btn-warning btn-sm" id="showToSignOnly">Έγγρ. Προς Υπογραφή</button>
		<!--<button class="btn btn-warning btn-sm" data-toggle="modal" data-target="#exampleModal"><i class="fab fa-usb"></i></button>-->

		<button id="emailButton" style="margin-left : 2em;" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Λήψη μηνυμάτων" onclick="connectToEmail();"><i id="faMail" class="far fa-envelope-open"></i></button>
		<button id="mindigitalButton" style="margin-left : 0.2em;" class="btn btn-warning btn-sm" data-toggle="tooltip" title="Σύνδεση στο mindigital" onclick="showMindigitalModal();"><i class="fas fa-file-signature"></i></button>
		<div id="userRoles" ></div>
		<input id="tableSearchInput" class="form-control form-control-sm" type="text" placeholder="Αναζήτηση" aria-label="search" aria-describedby="basic-addon1">
		
	</div>

	<div id="uploadDiv" class="collapse">
		

	</div>`

	document.body.innerHTML = basicUI;
	
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
	
	
	// $('#showEmployees').click(function() {
		// var user = $('#connectedUser').text();
		// tempUserElement= document.getElementById('showEmployees');
		// if(tempUserElement.classList.contains('btn-danger')){
			// tempUserElement.classList.remove('btn-danger');
			// tempUserElement.classList.add('btn-success');
			////$('#example1').DataTable().columns(2).search('').draw();
		// }
		// else if(tempUserElement.classList.contains('btn-success')){
			// tempUserElement.classList.remove('btn-success');
			// tempUserElement.classList.add('btn-danger');
			////$('#example1').DataTable().columns(2).search(user).draw();
		// }
		// tempUserElement1= document.getElementById('showToSignOnly');
		// if(tempUserElement1.classList.contains('btn-danger')){
			////$('#example1').DataTable().columns(4).search('').draw();
		// }
		// else{
			////$('#example1').DataTable().columns(4).search('#sign#').draw();
		// }
		////$('#textbox1').val(this.checked);        
	// });
	
</script>