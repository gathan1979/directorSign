import refreshToken from "./refreshToken.js"

if (+JSON.parse(localStorage.getItem("loginData")).user.privilege){
	const adeiesBtn = '<li class="text-center"><a target="_blank" href="/adeies/index.php"><span class="label label-info">Άδειες</span></br></br><i class="far fa-calendar-alt  fa-lg"></i></a></li>';
	document.querySelector("#bs-example-navbar-collapse-1>ul").innerHTML += adeiesBtn;
}

const loginData = localStorage.getItem("loginData")?JSON.parse(localStorage.getItem("loginData")):alert('Δεν υπάρχουν δεδομένα χρήστη');
//Πρόσβαση στο Πρωτόκολλο λεκτικό
let cRole = localStorage.getItem("currentRole");
if (+loginData.user.roles[cRole].protocolAccessLevel){
	document.querySelector("#protocolAppText").textContent = "Διαχειριστής";
}
else{
	document.querySelector("#protocolAppText").textContent = "Χρεώσεις Μου";
}

loginData.user.roles.forEach((role,index)=>{
	let newRole;
	if(index == cRole){
		newRole = '<li style="margin-top:2px;"><button id="roleBtn_'+index+'" data-role="'+index+'" type="button" class="btn btn-success btn-sm">'+role.roleName+'</button></li>';
	}
	else{
		newRole = '<li style="margin-top:2px;"><button id="roleBtn_'+index+'" data-role="'+index+'" type="button" class="btn btn-info btn-sm">'+role.roleName+'</button></li>';
	}
	//console.log(newRole);
	document.querySelector("#userRoles").innerHTML += newRole;
	return;
});

document.querySelector("#connectedUser>span").textContent = loginData.user.user;
document.querySelectorAll('button[id^="roleBtn"]').forEach( index =>{
		index.addEventListener("click", (event)=>{
			localStorage.setItem("currentRole",index.dataset.role);
			setRoleToSession(loginData.user.roles[index.dataset.role].aa);
			setSelectedRole(index);
		});
});

function setSelectedRole(index){
	document.querySelectorAll('button[id^="roleBtn"]').forEach( index =>{
		if (localStorage.getItem("currentRole") == index.dataset.role){
			index.classList.remove('btn-info');
			index.classList.add('btn-success');
		}
		else{
			index.classList.remove('btn-success');
			index.classList.add('btn-info');
		}
	});
}

async function setRoleToSession(roleAA){
	//Μετά την πλήρη ενσωμάτωση να αφαιρεθεί τελείως αυτο -----------
	let formData = new FormData();
	formData.append('role',roleAA);
	
	const loginData = localStorage.getItem("loginData")?JSON.parse(localStorage.getItem("loginData")):alert('Δεν υπάρχουν δεδομένα χρήστη');
	const jwt = loginData.jwt;
	console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	
	let init = {method: 'POST',  headers : myHeaders, body: formData};
	//console.log(init);
	const res = await fetch("/api/changeProperty_test.php",init); 
	if (res.status >= 200 && res.status <= 299) {
		console.log("αλλαγή ρόλου πραγματοποιήθηκε");
	}
	else if (res.status>=400 && res.status <= 499){
		refreshToken();
	}
	else {
		alert("Σφάλμα στην αυθεντικοποίηση");
	}
}

const aaStaff = loginData.user.aa_staff;
const aaUser = loginData.user.aa_user;
document.querySelector("#changePwdBtn").href = "changePasswordForm.php?aa="+aaStaff+"&aaP="+aaUser;

async function getRecords(){
	const loginData = localStorage.getItem("loginData")?JSON.parse(localStorage.getItem("loginData")):alert('Δεν υπάρχουν δεδομένα χρήστη');
	const jwt = loginData.jwt;
	console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	
	let init = {method: 'GET',  headers : myHeaders};
	//console.log(init);
	const res = await fetch("/api/getRecords.php",init); 
	if (res.status >= 200 && res.status <= 299) {
		console.log("αλλαγή ρόλου πραγματοποιήθηκε");
	}
	else if (res.status>=400 && res.status <= 499){
		refreshToken();
	}
	else {
		alert("Σφάλμα στην αυθεντικοποίηση");
	}
}