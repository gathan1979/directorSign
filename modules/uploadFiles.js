import refreshToken from "./refreshToken.js"
import getFromLocalStorage from "./localStorage.js"

export const uploadComponents = `<div class="col-md-12" style="padding-left:1em;">
		<input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX" onchange="enableFileLoadButton();"/><br>
		</div>
		<div class="col-md-12" id="viewSelectedFiles"></div>
		<div class="form-group" style="padding:1em;">
			<label for="authorComment">Σχόλια: </label>
			<textarea class="form-control" type="text" name="authorComment" id="authorComment" rows="3" cols="100" placeholder="Προαιρετικό κείμενο"></textarea>
			
			<input type="button" disabled style="margin-top : 5px;" class="btn btn-primary ektos" id="uploadFileButton"  value="Μεταφόρτωση Αρχείου"/>

			
		</div>`;
		

export function uploadFile(){                                               //θα αντικατασταθεί από το παρακάτω ΤΕΣΤ
	var files = document.getElementById('selectedFile').files;
	const numFiles = files.length;
	var data = new FormData();
	var k=0;
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
	const numFiles = files.length;
	let data = new FormData();
	let numFilesToSign=0;

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
	if (reloadNo){			// είναι επαναφόρτωση αρχείου για διόρθωση				
		const radios = document.getElementsByName('optradio');
		if (radios !== null){
			for (let i = 0, length = radios.length; i < length; i++)
			{
				if (radios[i].checked)
				{
					data.append('action',radios[i].value);
					break;
				}
			}
		}
		data.append('aa', reloadNo);
	}
	
	data.append('authorComment', document.getElementById('authorComment').value);
	data.append('numFiles',numFiles);
	data.append('role',role);
		
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders, body : data};
	
	const res = await fetch(uploadURL,init); 
	if (!res.ok){
		if (res.status>=400 && res.status <= 401){
			const resRef = await refreshToken();
			if (resRef ===1){
				uploadFileTest(uploadURL="/api/uploadSigFiles.php",reloadNo);
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