import refreshToken from "./refreshToken.js"
import getFromLocalStorage from "./localStorage.js"
import { createSearch } from "./createSignedUI.js";

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

		if(result[key].nextLevel == -2){
			row.dataset.rejected = 1;
		}
		else{
			row.dataset.rejected = 0;
		}

		row.dataset.author = result[key].fullName;

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
		
		if (!result[key].isExactCopy){
			if (result[key].preview_file_last==""){
				filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-success" >'+result[key]['filename']+'</button>&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";
			}
			else{
				filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-success" >'+result[key]['filename']+'</button>&nbsp<i  id="btn_'+result[key]['aa']+'_lastFile" class="fas fa-search-plus" title="Προεπισκόπηση τελευταίας τροποποίησης"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";;
			}
		}
		else{
			if (result[key].preview_file_last==""){
				filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-info" >'+result[key]['filename']+'</button>&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";
			}
			else{
				filenameBtn = '<div class="filenameDiv"><button id="btn_'+result[key]['aa']+'" class="btn btn-info" >'+result[key]['filename']+'</button>&nbsp<i  id="btn_'+result[key]['aa']+'_lastFile" class="fas fa-search-plus" title="Προεπισκόπηση τελευταίας τροποποίησης"></i>&nbsp&nbsp&nbsp-&nbsp&nbsp&nbsp<i id="btn_'+result[key]['aa']+'_firstFile" class="fab fa-amilia fa-1x" title="Προεπισκόπηση αρχικής ανάρτησης" ></i>'+relevantDocsElement+"</div>";;
			}
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
		}
		else{
			recordStatus = "Ακριβές Αντίγραφο";
		}
		temp1[3] =  recordStatus;
		
		let signBtn = "";
		let historyBtn = "";
		let rejectBtn = "";
		if (result[key].currentDep == department && accessLevel==1){
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
		//document.querySelector("#btn_"+result[key]['aa']+"_firstFile").addEventListener("click",()=>viewFile(result[key]['filename']));
		document.querySelector("#btn_"+result[key]['aa']+"_firstFile").addEventListener("click",()=> window.open("pdfjs-3.4.120-dist/web/viewer.html?file="+result[key]['filename']+"&id="+result[key].aa+"#zoom=page-fit"));

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



