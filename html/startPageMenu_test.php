
<div id="myNavBar">
	<div  id="prosIpografi" ><a href="directorSign.php">Προς Υπογραφή</a></div>
	<div  id="ipogegrammena" ><a href="signed.php">Διεκπεραιωμένα</a></div>
		
	<div ><a target="_blank" rel="opener" href="../nocc-1.9.8/protocol/editTable1.php?tn=book"><span id="protocolAppText"></span></a></div>	
	<div ><a target="_blank" href="../nocc-1.9.8/protocol/protocolBook.php?tn=book">Πρωτόκολλο</a></div>

	<!--<li class="nav-item" id="minimata" class="text-center"><a class="nav-link" href="/messages.php">Μηνύματα</a></li>-->

	<div id="rithmiseis" ><a href="settings.php">Ρυθμίσεις</a></div>

	<div id="userRoles" ></div>
	<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
</div><!-- /.container-fluid -->



<script type="text/javascript" defer>
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

	function updateRolesUI(){
		document.querySelector("#userRoles").innerHTML = "";
		const cRole = localStorage.getItem("currentRole");
		loginData.user.roles.forEach((role,index)=>{
			let newRole;
			if(index == cRole){
				newRole = '<div><button onclick="setRole('+index+')" type="button" class="btn btn-success btn-sm">'+role.roleName+'</button></div>';
			}
			else{
				newRole = '<div><button onclick="setRole('+index+')" type="button" class="btn btn-secondary btn-sm">'+role.roleName+'</button></div>';
			}
			document.querySelector("#userRoles").innerHTML += newRole;
			return;
		});
		return;
	}
	
	function setRole(index){
		localStorage.setItem("currentRole",index);									
		updateRolesUI();
	}
	updateRolesUI();
	
	const aaStaff = loginData.user.aa_staff;
	const aaUser = loginData.user.aa_user;
	//document.querySelector("#changePwdBtn").href = "changePasswordForm.php?aa="+aaStaff+"&aaP="+aaUser;
</script>