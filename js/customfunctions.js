function uploadfile(){
	var files = document.getElementById('selectedFile').files;
	const numFiles = files.length;
	var data = new FormData();
	var k=0;
	var aped = document.getElementById("apedCheckButton").checked; //23-08-2021
	aped = document.getElementById("mindigitalCheckButton").checked;
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
	
	//++++++++++28-04-2021
	var signers = document.getElementById("exactCopySignature").getElementsByTagName("button");
	var signerId = 0;
	for (i = 0; i < signers.length; i++) {
		if (signers[i].classList.contains('btn-success')){
			signerId = signers[i].id;
		}
	}
	data.append('signerId',signerId);
	//-----------------------------
	
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
	data.append('aped',aped);
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

function uploadfileAdv(){
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
	data.append('aped',aped);
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

function enableFileLoadButton(){
	if(document.getElementById("selectedFile").value != "") {
		document.getElementById("uploadFileButton").disabled = false;
		var files = document.getElementById('selectedFile').files;
		const numFiles = files.length;
		var well = document.getElementById("viewSelectedFiles");
		$( "#viewSelectedFiles" ).empty();
		for (i = 0; i < numFiles; i++) {
			  var element = document.createElement("BUTTON");
			  //Assign different attributes to the element. 
			  element.innerHTML  = files[i].name;
			  element.id = "filebutton_"+i;
			  element.className="btn-xs btn-primary";
			  element.setAttribute("style","margin-right:15px;");
			  element.addEventListener("click", changeFileState);
			  if (numFiles ==1){
				element.classList.remove('btn-primary');
				element.classList.add('btn-success');
			  }
			  //Append the element in page (in span).  
			  well.appendChild(element);
		}
		
	}
	else{
		document.getElementById("uploadFileButton").disabled = true;
	}
}	

function changeFileState(event) { 
	var element = event.target;
	if (element.classList.contains('btn-primary')){
		element.classList.remove('btn-primary');
		element.classList.add('btn-success');
	}
	else{
		element.classList.remove('btn-success');
		element.classList.add('btn-primary');
	}
};
  

function changeSignatureState(id) { 
	var buttons = $("#"+id ).parent().children("button").removeClass('btn-success').addClass('btn-primary');
	//console.log(buttons);
	var element = document.getElementById(id);
	if (element.classList.contains('btn-primary')){
		element.classList.remove('btn-primary');
		element.classList.add('btn-success');
	}
	else{
		element.classList.remove('btn-success');
		element.classList.add('btn-primary');
	}
};  
  
  
function preview_PDF(file,id){
	var xmlhttp;
	var data = new FormData();
	data.append('file',file);
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
			window.open("pdfjs/web/viewer.php?file="+response+file+"&id="+id+"#zoom=page-fit");
		}
	}
	
	xmlhttp.open("POST","fileExists.php");
	xmlhttp.send(data);	
	 //$( "#my-container").dialog({width : 800, height : 800, modal :true});
	 //var t = PDFObject.embed("/directorSign/uploads/"+file, "#my-container");
}


 function preview_file(aa){
	$.ajax({
	   type: "post",
	   data: {"aa" :  aa},
	   url: "viewFile.php",
	   success: function(msg){
			window.open(msg); 
			//alert(msg);
		}  
	   
	});	  		
}

 function preview_file_by_name(file){
	$.ajax({
	   type: "post",
	   data: {"file" :  file},
	   url: "viewFilebyName.php",
	   success: function(msg){
			window.open(msg); 
			//alert(msg);
		}  
	   
	});	  		
}


function uploadMessage(){
	var files = document.getElementById('selectedFile').files;
	const numFiles = files.length;
	var data = new FormData();	
	for (i = 0; i < numFiles; i++) {
		//const file = files[i];
		data.append('selectedFile'+i, document.getElementById('selectedFile').files[i]);
		var element = document.getElementById('filebutton_'+i);
		
	}

	$("#loading").fadeIn();
	data.append('authorComment', document.getElementById('authorComment').value);
	data.append('numFiles',numFiles);
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
			//clearInterval() 
			//document.getElementById("soma").innerHTML=xmlhttp.responseText;
			
			var response = xmlhttp.responseText;
			saveAssignments(response);
			//alert(xmlhttp.responseText);
			location.reload();
		}
	}
	
	xmlhttp.open("POST","uploadMessage.php");
	xmlhttp.send(data);	
}	


 function preview_message_by_name(file){
	$.ajax({
	   type: "post",
	   data: {"file" :  file},
	   url: "viewMessagebyName.php",
	   success: function(msg){
			window.open(msg); 
			//alert(msg);
		}  
	   
	});	  		
}

function changeAssignmentStatus(aa){
	tempUserElement= document.getElementById(aa);
	if(tempUserElement.classList.contains('btn-secondary')){
		tempUserElement.classList.remove('btn-secondary');
		tempUserElement.classList.add('btn-success');
	}
	else{
		tempUserElement.classList.remove('btn-success');
		tempUserElement.classList.add('btn-secondary');	
	}
	
}

function selectAll(){
	var el = $("#assignments  :button");
	for (i=0; i < el.length;i++){
		if (el[i].classList.contains("btn-success")){
			el[i].classList.remove("btn-success");
		}
		else if(el[i].classList.contains("btn-secondary")){
			el[i].classList.remove("btn-secondary");
		}
		if (!el[i].classList.contains("btn-block")){
			el[i].classList.add('btn-success');	
		}
	}

}

function deselectAll(){
	var el = $("#assignments  :button");
	for (i=0; i < el.length;i++){
		if (el[i].classList.contains("btn-success")){
			el[i].classList.remove("btn-success");
		}
		if (!el[i].classList.contains("btn-block")){
			el[i].classList.add('btn-secondary');
		}
	}
	
}

function saveAssignments(aa){
	var el = $("#assignments  :button");
	//console.log(el);
	var obj1 ={};
	obj1.record = aa;
	for (i=0; i < el.length;i++){
		if (el[i].classList.contains("btn-success")){
			obj1[el[i].id]=el[i].classList;
		}
	}
	//console.log(obj1);
	//console.log(obj2);
	$.ajax({
	   type: "post",
	   data: {"postData1" : JSON.stringify(obj1)},
	   url: "saveAssignments.php",
	   success: function(msg){
			//alert(msg);
		   if (msg="success"){
			   $(".message").html("επιτυχής καταχώρηση");
				$("#alert").show();
		   }
		   else{
			   $(".message").html("σφάλμα στην καταχώρηση");
				$("#alert1").show();
		   }
	   }
	});	  	
	
}

function showEmailModal(){
	$("#emailConnectModal").modal("show");
}

function showMindigitalModal(){
	$("#mindigitalConnectModal").modal("show");
}

function connectToEmail(){
	$.ajax({
	   type: "post",
	   data: {"username" : $('#userSch').val(),"password" : $('#passSch').val()},
	   url: "connectToEmail.php",
	   success: function(msg){
		    $("#emailConnectModal").modal("hide");
			var element1 = document.getElementById("emailButton");
			var element2 = document.getElementById("faMail");
		    if (msg=="outcome 0"){
			   if (element1.classList.contains('btn-success')){
					element1.classList.remove('btn-success');
					element1.classList.add('btn-danger');
				}
				if (element2.classList.contains('fa-envelope-open')){
					element2.classList.remove('fa-envelope-open');
					element2.classList.add('fa-envelope');
				}
			   alert("αποτυχία σύνδεσης");
		    }
		    else {
				if (element1.classList.contains('btn-danger')){
					element1.classList.remove('btn-danger');
					element1.classList.add('btn-success');
				}
				if (element2.classList.contains('fa-envelope')){
					element2.classList.remove('fa-envelope');
					element2.classList.add('fa-envelope-open');
				}
			    //alert("υπάρχει ήδη σύνδεση");
				$('#emailsContainer').empty();
				$('#emailsContainer').append(msg);
		    }
	   }
	});	  	
}

function connectToMindigital(){
	$.ajax({
	   type: "POST",
	   data: {"Username" : $('#userMindigital').val(),"Password" : $('#passMindigital').val()},
	   url: "saveMindigitalCred.php",
	   success: function(msg){
			var element1 = document.getElementById("mindigitalButton");
			if (msg==1){
				element1.classList.remove('btn-danger');
				element1.classList.add('btn-success');
			}
			else{
				element1.classList.remove('btn-success');
				element1.classList.add('btn-danger');
			}
		}
	});
	$("#mindigitalConnectModal").modal("hide");
}

function connectToUsb(){
	$.ajax({
	   type: "POST",
	   data: {},
	   url: "findDevices.php",
	   success: function(msg){
			$('#devicesDiv').empty();
			$('#devicesDiv').append(msg); 
		}
	});
}

function signMD(aa){
	$('#otpModal').modal('hide');
	$("#signing").fadeIn();
	otp = $('#otpText').val();
	$.ajax({
	   type: "GET",
	   data: {"aa" : aa , "otp" : otp},
	   url: "createMindigitalSendFile.php",
	   success: function(msg){
			location.reload();
		}
	});
}

function getLastOTPEmail_old(nextuid){
	var otp;
	$.ajax({
		type: "get",
		data: {"nextuid" : nextuid},
		url: "connectToEmailforLastOTP.php",
		async: false,
		success: function(msg){
			otp = msg
		}
	});
	return otp;
}

function recheckOTPEmail(nextuid){
	var otp = 0;
	$.ajax({
		type: "get",
		data: {"nextuid" : nextuid},
		url: "connectToEmailforLastOTP.php",
		async: false,
		success: function(msg){
			otp = msg
		}
	});
	$('#otpText').val(otp);
}

function precheckOTP_old(){
	var otp = 0;
	$.ajax({
		type: "post",
		data: {},
		url: "precheckOTP.php",
		async: false,
		success: function(msg){
			otp = msg
		}
	});
	return otp;
}

function checkIfSameSigner(aa){
	let isSame = 0;
	$.ajax({
		type: "post",
		data: {aa: aa},
		url: "checkIfSameSigner.php",
		async: false,
		success: function(msg){
			isSame = msg
		}
	});
	return isSame;
}

function requestOTP_old(){
	$('#otpText').val("");
	var nextuid = precheckOTP_old();
	$('#checkEmailButton').click(function(){recheckOTPEmail(nextuid);});
	var res = 0;
	$.ajax({
		type: "post",
		data: {},
		url: "requestOTP.php",
		async: false,
		success: function(msg){
			if (msg==-1){
				res =-1;
			}
			else{
				var mydata = JSON.parse(msg);
				console.log(mydata.Outcome);
				if (mydata.Outcome ==0){
					console.log("επιτυχία "+mydata.Description);	
					res = getLastOTPEmail_old(nextuid);	
				}
				else if (mydata.Outcome ==1){
					res = 1;		
				}
				else if (mydata.Outcome ==9){
					res = 9;	
				}
				else{
					res = 100;	
				}
			}
		}
	});
	
	return res;
}


function requestOTP(){
	$('#otpText').val("");
	var mydata;
	var res = 0;
	$.ajax({
		type: "post",
		data: {},
		url: "getLastOTP.php",
		async: false,
		success: function(msg){
			console.log(msg);
			mydata = JSON.parse(msg);

		}
	});
	console.log(mydata[0]);
	if (mydata[0] == 2){
		$('#checkEmailButton').click(function(){recheckOTPEmail(mydata[2]);});
	}
	return mydata;
}

function rejectMD(aa){
	var r = confirm("Το αίτημα ακριβούς αντιγράφου θα διαγραφεί");
	if (r == true) {
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
				//var response = xmlhttp.responseText;
				location.reload();
			}
		}
		xmlhttp.open("GET","rejectMD.php?aa="+aa);
		xmlhttp.send();	
	} 
}

function saveTextSetting(user,setting){
	var x = document.getElementById(setting).value;
	if (x) {
		$.ajax({
		   type: "post",
		   data: {"user" : user, "setting" : setting, "value": x},
		   url: "saveSetting.php",
		   success: function(msg){
				//alert("Η αλλαγή ονόματος πραγματοποιήθηκε");
				//location.reload();
		   }
		});	
	}
	else{
		alert("Το πεδίο είναι κενό");
	}
}

function saveCheckBoxSetting(user,setting){
	var x = document.getElementById(setting).checked;
	if (x){
		x=1;	
	}
	else{
		x=0;	
	}
	$.ajax({
	   type: "post",
	   data: {"user" : user, "setting" : setting, "value": x},
	   url: "saveSetting.php",
	   success: function(msg){
			//alert("Η αλλαγή ονόματος πραγματοποιήθηκε");
			//location.reload();
	   }
	});		
}



