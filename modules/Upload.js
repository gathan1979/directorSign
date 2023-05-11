import refreshToken from "./RefreshToken.js"
import getFromLocalStorage from "./LocalStorage.js"
import { getSigRecords, createSearch} from "./Records.js";

export const uploadComponents = `<div class="col-md-12 d-flex flex-column p-2" >
		<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX"/>
		<div class="col-md-12 d-flex flex-row mt-1" id="viewSelectedFiles"></div>
		<div class="d-flex flex-row bd-highlight mt-3 mb-3 gap-5">
			<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="2" cols="50" placeholder="Προαιρετικό κείμενο"></textarea>
			<button disabled style="margin-top : 5px;" class="btn btn-primary" id="uploadFileButton"><i class="fas fa-upload"></i></button>
		</div>`;

export function uploadFile(){                                               //θα αντικατασταθεί από το παρακάτω ΤΕΣΤ
	var files = document.getElementById('selectedFile').files;
	const numFiles = files.length;
	var data = new FormData();
	var k=0;
	for (let i = 0; i < numFiles; i++) {
		//const file = files[i];
		data.append('selectedFile'+i, document.getElementById('selectedFile').files[i]);
		var element = document.getElementById('filebutton_'+i);
		if (element.classList.contains('btn-success')){
			data.append('tobeSigned',i);
			k+=1;
		}
	}
	if (k>1){
			alert("Έχετε επιλέξει περισσότερα από ένα έγγραφα προς υπογραφή");
			return;
	}
	else if (k==0){
			alert("Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά");
			return;
	}

	$("#loading").fadeIn();
	data.append('authorComment', document.getElementById('authorComment').value);
	data.append('numFiles',numFiles);
	//data.append('aped',aped);                   															-------13-01-2023
	
	//for (var pair of data.entries()) {
		//console.log(pair[0]+ ', ' + pair[1]); 
	//}
	var xmlhttp;
	if (window.XMLHttpRequest)
	{// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	}
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			clearInterval() 
			//document.getElementById("soma").innerHTML=xmlhttp.responseText;
			var response = xmlhttp.responseText;
			alert(xmlhttp.responseText);
			var checkSigned = response.search("@");
			if (checkSigned != "-1"){
				//notifyMe(response);
			}
			location.reload();
		}
	}
	
	xmlhttp.open("POST","upload.php");
	xmlhttp.send(data);	
}

export async function uploadFileTest(uploadURL="/api/uploadSigFiles.php",reloadNo = 0){
	//$("#loading").fadeIn();
	const {jwt,role} = getFromLocalStorage();	
	
	const files = document.getElementById('selectedFile').files;
	let numFiles = files.length;
	let data = new FormData();
	let numFilesToSign=0;

	if (reloadNo){			// είναι επαναφόρτωση αρχείου για διόρθωση				
		data.append('aa', reloadNo);
		numFiles = 1;
		data.append('authorComment', "επαναφόρτωση αρχείου από συντάκτη");
		data.append('selectedFile0', document.getElementById('reuploadFileBtn'+reloadNo).files[0]);
		data.append('tobeSigned',0);
	}
	else{
		for (let i = 0; i < numFiles; i++) {
			data.append('selectedFile'+i, document.getElementById('selectedFile').files[i]);
			const element = document.getElementById('filebutton_'+i);
			if (element.classList.contains('btn-success')){
				data.append('tobeSigned',i);
				numFilesToSign+=1;
			}
		}
		if (numFilesToSign>1){
				alert("Έχετε επιλέξει περισσότερα από ένα έγγραφα προς υπογραφή");
				return;
		}
		else if (numFilesToSign==0){
				alert("Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά");
				return;
		}
		data.append('authorComment', document.getElementById('authorComment').value);
	}
	
	data.append('numFiles',numFiles);
	data.append('role',role);
		
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders, body : data};
	
	const res = await fetch(uploadURL,init); 
	if (!res.ok){
		if (res.status == 401){
			const resRef = await refreshToken();
			if (resRef ===1){
				uploadFileTest(uploadURL="/api/uploadSigFiles.php",reloadNo);
			}
			else{
				alert("Σφάλμα εξουσιοδότησης");	
			}
		}
		else if (res.status==403){
			window.open('unAuthorized.html', '_blank');
		}
		else if (res.status==404){
			alert("το αρχείο δε βρέθηκε");
		}
		else if (res.status==500){
			alert("Σφάλμα! Επικοινωνήστε με το διαχειριστή του συστήματος");
		}
		else{
			alert("Σφάλμα!!!");
		}
	}
	else {
		document.querySelector("#viewSelectedFiles").innerHTML = "";
		document.querySelector("#selectedFile").value = null;
		alert("Το έγγραφο έχει αποσταλεί! Μάλλον...");
		const records = getSigRecords().then( res => {
			createSearch();
		}, rej => {});	
	}
}


export function uploadfileAdv(){
	//var data = new FormData();
	var files = document.getElementById('selectedFile').files;
	const numFiles = files.length;
	var data = new FormData();
	var k=0;
	var aped = document.getElementById("apedCheckButton").checked;
	if(aped){
		aped=1;
	}else{
		aped=0;
	}
	for (i = 0; i < numFiles; i++) {
		//const file = files[i];
		data.append('selectedFile'+i, document.getElementById('selectedFile').files[i]);
		var element = document.getElementById('filebutton_'+i);
		if (element.classList.contains('btn-success')){
			data.append('tobeSigned',i);
			k+=1;
		}
	}
	if (k>1){
			alert("Έχετε επιλέξει περισσότερα από ένα έγγραφα προς υπογραφή");
			return;
	}
	else if (k==0){
			alert("Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά");
			return;
	}
	var radios = document.getElementsByName('optradio');
	for (var i = 0, length = radios.length; i < length; i++)
	{
		if (radios[i].checked)
		{
			data.append('action',radios[i].value);
			break;
		}
	}
	$("#loading").fadeIn();
	data.append('authorComment', document.getElementById('authorComment').value);
	data.append('numFiles',numFiles);
	data.append('aa', document.getElementById('aa').value);
	var xmlhttp;
	if (window.XMLHttpRequest)
	  {// code for IE7+, Firefox, Chrome, Opera, Safari
		xmlhttp=new XMLHttpRequest();
	  }
	else
	{// code for IE6, IE5
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function()
	{
		if (xmlhttp.readyState==4 && xmlhttp.status==200)
		{
			//document.getElementById("soma").innerHTML=xmlhttp.responseText;
			var response = xmlhttp.responseText;
			alert(xmlhttp.responseText);
			var checkSigned = response.search("@");
			if (checkSigned != "-1"){
				notifyMe(response);
			}
			location.reload();
		}
	}
	xmlhttp.open("POST","upload.php");
	xmlhttp.send(data);	
}

export function enableFileLoadButton(){
	const well = document.getElementById("viewSelectedFiles");
	if(document.getElementById("selectedFile").value != "") {
		document.getElementById("uploadFileButton").removeAttribute("disabled");
		const files = document.getElementById('selectedFile').files;
		const numFiles = files.length;
		document.querySelector("#viewSelectedFiles").innerHTML= "";
		for (let i = 0; i < numFiles; i++) {
			  let element = document.createElement("BUTTON");
			  //Assign different attributes to the element. 
			  element.innerHTML  = files[i].name;
			  element.id = "filebutton_"+i;
			  element.className="btn-xs btn-primary";
			  element.setAttribute("style","margin-right:15px;");
			  element.addEventListener("click", changeFileState);
			  if (numFiles===1){
				element.classList.remove('btn-primary');
				element.classList.add('btn-success');
			  }
			  //Append the element in page (in span).  
			  well.appendChild(element);
		}
		
	}
	else{
		document.getElementById("uploadFileButton").disabled = true;
		well.innerHTML = "";
	}
}	

function changeFileState(event) { // Note this is a function
	const element = event.target;
	if (element.classList.contains('btn-primary')){
		element.classList.remove('btn-primary');
		element.classList.add('btn-success');
	}
	else{
		element.classList.remove('btn-success');
		element.classList.add('btn-primary');
	}
};