import refreshToken from "./refreshToken.js"
import getFromLocalStorage from "./localStorage.js"
import { createSearch } from "./createSignedUI.js";
import { viewFile } from "./signatureRecords.js";

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

const loginData = JSON.parse(localStorage.getItem("loginData"));
const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));

export async function getSignedRecords(){
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
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['revisionId']+'" class="btn btn-success btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton  fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+"</div>";
		}
		else{
			filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['revisionId']+'" class="btn btn-danger btn-sm" >'+result[key]['filename']+'</button><i id="btn_'+result[key]['aa']+'_position" class="isButton  fas fa-crosshairs fa-1x" title="Επιλογή θέσης υπογραφής" ></i>'+relevantDocsElement+"</div>";
		}
		
		temp1[0] = filenameBtn;
		temp1[1] = result[key].date;
		temp1[2] = result[key].fullName;
		
		let recordStatus = '<button id="signedBtn_'+result[key]['aa']+'" type="button" class="btn btn-warning btn-sm" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-download" data-toggle="tooltip" title="Υπογεγραμμένο για αρχειοθέτηση" data-whatever="'+result[key].aa+'"></i>'+"</button>";
		let exactCopyBtn = '<button id="excopyBtn_'+result[key]['aa']+'" type="button" class="btn btn-success btn-sm" data-whatever="'+result[key].aa+'">'+'<i class="fas fa-paper-plane" data-toggle="tooltip" title="Υπογεγραμμένο για αποστολή" data-whatever="'+result[key].aa+'"></i>'+"</button>";

		if (!rejected){
			temp1[3] =  '<div class="filenameDiv">'+recordStatus+exactCopyBtn+'</div>';
		}
		else{
			temp1[3] ="";
		}
		
		let historyBtn = "";
		let reqExactCopyBtn = "";
		
		//if (result[key].objection>0){
			//historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].revisionId+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού"></i>'+"<span class='glyphicon glyphicon-flash' style='font-size: 20px;' aria-hidden='true' data-toggle='tooltip'></span></a>";
		//}
		//else{
			historyBtn = "<a class='btn btn-primary btn-sm' href='/directorSign/history.php?aa="+result[key].revisionId+"'>"+'<i class="fas fa-inbox" data-toggle="tooltip" title="Προβολή Ιστορικού">'+"</i></a>";
		//}
		if (!rejected){
			reqExactCopyBtn = '<button id="reqExactCopyBtn_'+result[key]['revisionId']+'" type="button" class="btn btn-info btn-sm" data-whatever="'+result[key].revisionId+'">'+'<i class="fas fa-bell" data-toggle="tooltip" title="Αίτημα Ακριβούς Αντιγράφου" data-whatever="'+result[key].revisionId+'"></i>'+"</button>";
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
			document.querySelector("#excopyBtn_"+result[key]['aa']).addEventListener("click",()=>viewFile(result[key]['exactCopyFilename'],result[key].date));
		}
		document.querySelector("#btn_"+result[key]['revisionId']).addEventListener("click",()=>viewFile(result[key]['filename'],result[key].date));
		document.querySelector("#btn_"+result[key]['aa']+"_position").addEventListener("click",()=> window.open("pdfjs-3.4.120-dist/web/viewer.html?file="+result[key]['lastFilename']+"&insertDate="+result[key].date+"&id="+result[key].revisionId+"#zoom=page-fit"));

		if (!(relevantDocsArray.length === 1 && relevantDocsArray[0]==="")) {
			for (let l=0;l<relevantDocsArray.length;l++){
				document.querySelector("#rel_btn_"+result[key]['revisionId']+"_"+l).addEventListener("click",()=>viewFile(relevantDocsArray[l],result[key].date));
			}
		}						
	}
}

async function requestExactCopy(event){
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


// async function viewFile(filename){ 
// 	const loginData = JSON.parse(localStorage.getItem("loginData"));
// 	const urlpar = new URLSearchParams({filename : encodeURIComponent(filename)});
// 	const jwt = loginData.jwt;
// 	const myHeaders = new Headers();
// 	myHeaders.append('Authorization', jwt);
// 	let init = {method: 'GET', headers : myHeaders};
	
// 	const res = await fetch("/api/viewFile.php?"+urlpar,init); 
// 	if (!res.ok){
// 		if (res.status ==  401){
// 			const resRef = await refreshToken();
// 			if (resRef ===1){
// 				viewFile(filename);
// 			}
// 			else{
// 				alert("σφάλμα εξουσιοδότησης");	
// 			}
// 		}
// 		else if (res.status==403){
// 			window.open('unAuthorized.html', '_blank');
// 		}
// 		else if (res.status==404){
// 			alert("το αρχείο δε βρέθηκε");
// 		}
// 	}
// 	else {

// 		const dispHeader = res.headers.get('Content-Disposition');
// 		if (dispHeader !== null){
// 			const parts = dispHeader.split(';');
// 			filename = parts[1].split('=')[1];
// 			filename = filename.replaceAll('"',"");
// 		}
// 		else{
// 			filename = "tempfile.tmp";
// 		}
// 		const fileExtension = filename.split('.').pop();
// 		const blob = await res.blob();
// 		const href = URL.createObjectURL(blob);
// 		const inBrowser = ['pdf','PDF','html','htm','jpg','png'];
		
// 		let openFileAns = confirm("Ναι για απευθείας άνοιγμα, άκυρο για αποθήκευση");
// 		if (inBrowser.includes(fileExtension) && openFileAns){
// 			const pdfWin = window.open(href);
// 			setTimeout(()=>{pdfWin.document.title = decodeURI(filename)},1000);
// 		}
// 		else{
// 			const aElement = document.createElement('a');
// 			aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
// 			Object.assign(aElement, {
// 			  href,
// 			  download: decodeURI(filename)
// 			}).click();
// 		}
// 	}
// }

export function filterTable (tableName, searchObject){   	// searchObject example {dataKeys :{author : "Αθανασιάδης Γιάννης", diff : 0}, searchString : "καλημέρα"}  
															// diff = 0 είναι για υπογραφή στο τμήμα
	const table = document.querySelector("#"+tableName);

	//console.log(searchObject)
	for (const tempRow of Array.from(table.rows)){                       			// π.χ. <tr data-diff="0" data-author="ΖΗΚΟΣ ΑΘΑΝΑΣΙΟΣ">
		if (tempRow.dataset.author && tempRow.dataset.diff){   	// απορρίπτει γραμμές του header, footer
			let hide = false;
			for(const [key,value] of Object.entries(searchObject.dataKeys)){
				console.log(key,value,tempRow.dataset[key] );
				if (value != null){
					if (tempRow.dataset[key] != value){
						hide = true;
					}
				}
			}
			let findTextInRow = true;
			if (searchObject.searchString !== "" && searchObject.searchString !==null){
				findTextInRow = false;
				for (const cell of tempRow.cells){
					if (cell.textContent.indexOf(searchObject.searchString) !== -1){
						findTextInRow = true;
						console.log("το κείμενο βρέθηκε στη γραμμή ")
					}
				}
			}
			if (hide || !findTextInRow){
				tempRow.setAttribute("hidden","hidden");
			}
			else{
				tempRow.removeAttribute("hidden");
			}
		}
	}
}



