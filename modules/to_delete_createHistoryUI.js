

let loginData = null;

export function createHistoryUIstartUp(){

	const navBarDiv = `<div id="myNavBar">
		<div  id="prosIpografi" ><a class="active" href="headmaster1_test.php">Επιστροφή</a></div>
		<div  id="myNavBarLogo"><div  id="myNavBarLogoContent"></div></div>
	</div><!-- /.container-fluid -->`;

	if (document.querySelector("#myNavBar")!==null){
		document.querySelector("#myNavBar").remove();
	}

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
		if (cRole == null){
			alert("Δεν υπάρχουν στοιχεία ιδιότητας χρήστη");	
		}
		document.querySelector("#myNavBarLogoContent").innerHTML = loginData.user.user;
		document.querySelector("#myNavBarLogoContent").innerHTML += '<div><button class="btn btn-warning" id="logoutBtn"><i class="fas fa-sign-out-alt"></i></button></div>';
	}

	//Γέμισμα πίνακα με εγγραφές χρήστη
	getRecordsAndFill();

}

function getRecordsAndFill(){
	const records = getHistoryRecord().then( res => {
	}, rej => {});		
}

export async function getHistoryRecord(){
	document.querySelector("#recordsSpinner").style.display = 'inline-block';
	const {jwt,role} = getFromLocalStorage();
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	//console.log(init);

	const params = new URLSearchParams({
		role: role
	});

	const res = await fetch("/api/getHistoryRecord.php?"+params,init);
	if (!res.ok){
		document.querySelector("#recordsSpinner").style.display = 'none';
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
		document.querySelector("#recordsSpinner").style.display = 'none';
		fillTable(await res.json());
		return "ok";
	}
}

export function fillTable(result){
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
		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				relevantDocsElement +='<i style="cursor : pointer;" id="rel_btn_'+result[key]['aa']+'_'+l+'" class="fas fa-paperclip" title="'+relevantDocsArray[l]+'"></i>';
			}
		}
		// result[key].preview_file_last
		if (!result[key].isExactCopy){
			filenameBtn = '<div class="filenameDiv"><button style="width:70%;" id="btn_'+result[key]['aa']+'" class="btn btn-success" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton isGreen fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+'</div>';
		}
		else{
			filenameBtn = '<div class="filenameDiv"><button style="width:70%;" id="btn_'+result[key]['aa']+'" class="btn btn-info" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton isGreen fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+'</div>';
		}

		temp1[0] = filenameBtn;
		temp1[1] = result[key].date;
		temp1[2] = result[key].fullName;

		let recordStatus = "";
		if (!result[key].isExactCopy){
			for (let i=0;i<result[key].levels;i++){
				if (i<result[key].diff){
					recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-success btn-sm"><i class="fas fa-calendar-check"></i></button>';
				}
				else{
					recordStatus += '<button type="button" style="margin-left:3px;" disabled class="btn btn-secondary btn-sm"><i class="fas fa-calendar-times"></i></button>';
				}
			}
			if(result[key].isReturned){
				recordStatus += '<i style="margin-left:3px;color : orange;" class="fas fa-undo"></i>';
			}
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
			if (accessLevel==1){
				signModalBtn = '<button id="showSignModalBtn'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm"  data-bs-toggle="modal" data-bs-target="#signModal" data-isExactCopy="'+result[key].isExactCopy+'" data-whatever="'+result[key].aa+'">'+"<i class='fa fa-tag' aria-hidden='true' data-toggle='tooltip' title='Ψηφιακή Υπογραφή και Αυτόματη Προώθηση'><span style='display:none;'>#sign#</span></i></button>";
				returnBtn = '<button id="showReturnModal'+result[key]['aa']+'" type="button" class="btn btn-warning btn-sm" data-bs-toggle="modal" data-bs-target="#returnModal" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-arrow-down" data-toggle="tooltip" title="Επιστροφή Εγγράφου"></i>'+"</button>";
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
					signModalBtn = "";
				}
			}
		}	
		

		if (result[key].objection>0){
			historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history_test.php?aa="+result[key].aa+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i>'+"<span class='glyphicon glyphicon-flash' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip'></span></a>";
		}
		else{
			historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history_test.php?aa="+result[key].aa+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού">'+"</i></a>";
		}
		rejectBtn = '<button id="showRejectModal'+result[key]['aa']+'" type="button" class="btn btn-danger btn-sm" data-bs-toggle="modal" data-bs-target="#rejectModal" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-ban" data-toggle="tooltip" title="Οριστική Απόρριψη"></i>'+"</button>";
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
