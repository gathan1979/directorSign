import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";
import {getPage,Pages} from "../modules/UI_test.js"

const content = 
`<div  id="attachmentsDiv"  style="display:flex;gap:10px;flex-direction:column;height:100%;background: rgba(122, 130, 136, 0.2)!important;border-radius:5px;padding:10px;">
    <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
    <link rel="stylesheet" type="text/css" href="css/custom.css" />
    <link href="css/all.css" rel="stylesheet">

    <div style="display:flex;justify-content: space-between;align-items:center;">
        <div>
            <span style="font-weight:bold;">Συνημμένα</span>
            <div id="attachmentSpinner" class="spinner-border spinner-border-sm" role="status" style="display:none;">
                <span class="visually-hidden">Loading...</span>
            </div>
            <span class="badge bg-secondary" id="attachmentTableTitleBadge"></span>
        </div>
        <div>
            <button class="btn btn-outline-danger btn-sm" id="zipFileButton"  title="Λήψη όλων"><i class="fas fa-file-archive"></i></button>
            <button id="showAttachmentModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
        </div>
    </div>

    <div style="height:90%;overflow-y:scroll;">
        <table id="attachments" name="attachments" class="table table-striped">
            <tbody> 
            </tbody>
        </table>
    </div>
    <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
</div>

<dialog id="attachmentModal" class="customDialog" style="width:500px;"> 
    <div class="customDialogContentTitle">
        <span style="font-weight:bold;"></span>
        <button class="btn btn-secondary" name="closeAttModalBtn" id="closeAttModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
    </div>
    <div class="customDialogContent">
       
    </div>
</dialog>

<dialog id="loadingDialog">
    <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
    </div>
</dialog>

<dialog id="gdprModal" class="customDialog" style="width:70%;"> 
    <div class="customDialogContentTitle">
        <span style="font-weight:bold;"></span>
        <div id="customDialogContentTitleBtns">
            <button class="btn btn-secondary" name="closeGdprModalBtn" id="closeGdprModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
    </div>
    <div class="customDialogContent">
        <div class="gdprContent" style="display:flex;gap:10px;">
            <div id="gdprSelectedUsers" style="flex-basis: 100px; flex-shrink:0;flex-grow:1; padding: 5px; border-right: 5px solid orange; background-color:palegoldenrod;">
                <span id="gdprSelectedUsersTitle" style="margin-bottom:10px;">Επιλεγμένοι υπάλληλοι</span>
                <div id="gdprSelectedUsersContent" style="display:flex; flex-direction: column; gap:5px; wrap: no-wrap;"></div>
            </div>
            <div id="gdprUsersSelectionDiv" style="flex-basis:250px;flex-shrink:0;flex-grow:1;">
                <span class="gdprUsers" style="margin-bottom:10px;">Επιλέξτε Υπάλληλο:</span> 
                <div id="selectGdprUserDiv" style="display:flex;gap:5px;flex-wrap:wrap;"></div>
            </div>  
            <div id="gdprPageSelectionDiv" style="flex-basis:150px;flex-shrink:0;flex-grow:1;">	
                <div class="karteles">
                    <b>Σελίδες Πρόσβασης</b>
                     <input type="text" oninput="this.className = ''" class="form-control" name="pages" id="pages" placeholder="π.χ. 2,4,5 ή #6,#8 (άρνηση πρόσβασης) ή κενό για πλήρη πρόσβαση ">
                </div>
                <button id="addToGdprBtn" class="btn btn-success" onclick="addToGdpr(event);">Προσθήκη</button>
            </div>
        </div>
    </div>
</dialog>`;


class Attachments extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;
    users;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = content;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        //console.log(this.protocolNo);
        const currentYear = localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):2023;
        this.shadow.querySelector("#actionStatus").innerHTML = "";
        //this.uploadFile(undefined,this.protocolNo,this.currentYear)
        if (getPage() === Pages.CHARGES){
            this.shadow.querySelector("#showAttachmentModalBtn").addEventListener("click",()=> {
                this.shadow.querySelector("#attachmentSpinner").style.display = "none";
                this.shadow.querySelector("#attachmentModal .customDialogContentTitle>span").innerText = "Προσθήκη συνημμένου σε "+this.protocolNo+"/"+this.protocolYear;
                this.shadow.querySelector("#attachmentModal .customDialogContent").innerHTML = `<form>
                    <div class="flexVertical" style="padding:5px;">
                        <span></span>
                        <input type="file" class="btn btn-default" name="selectedFile" id="selectedFile" />
                        <button class="btn btn-outline-success ektos " id="uploadFileButton"  title="Μεταφόρτωση επιλεγμένου αρχείου"><i class="fas fa-upload"></i></button>
                    </div>
                </form>`;
                this.shadow.querySelector("#uploadFileButton").addEventListener("click",(event)=> {event.preventDefault();this.uploadFile(undefined,this.protocolNo,this.protocolYear)});
                this.shadow.querySelector("#attachmentModal").showModal();
            }); 
            await this.loadAttachments(1); 
        }
        else{
            this.shadow.querySelector("#showAttachmentModalBtn").style.display = "none"; 
            await this.loadAttachments(-1);
        }
        this.shadow.querySelector("#closeAttModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#attachmentModal").close());
        this.shadow.querySelector("#closeGdprModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#gdprModal").close());
       
        this.users = await this.getUsers(1);  // get all active protocol users
        
       

    }

    disconnectedCallback() {
    
    }

    async uploadFile(uploadURL="/api/uploadProtocolAtt.php",protocolNo, year){
        this.shadow.querySelector("#attachmentSpinner").style.display = "inline-block";
        //console.log(this.shadow.getElementById('selectedFile'))
        const files = this.shadow.getElementById('selectedFile').files;
    
        if (files.length==0){
            alert("Παρακαλώ επιλέξτε το αρχείο που θα προσθέσετε στα συνημμένα");
            this.shadow.querySelector("#loadingDialog").close();
            return;
        }

        let data = new FormData();
        data.append('selectedFile', this.shadow.getElementById('selectedFile').files[0]);
        data.append('protocolNo',protocolNo);
        data.append('year',year);

        const res = await runFetch(uploadURL, "POST", data);
        if (!res.success){
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else {
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
            this.shadow.querySelector("#selectedFile").value = null;
            alert("Το έγγραφο έχει αποσταλεί! Μάλλον...");
            this.loadAttachments(1);
            const historyRefreshEvent = new CustomEvent("historyRefreshEvent",  { bubbles: true, cancelable: false, composed: true });
            this.dispatchEvent(historyRefreshEvent);
            this.shadow.querySelector("#attachmentModal").close();
        }
    }

    async loadAttachments(level){ // το level να ελεγχθεί, δουλεύει πλέον με το localStorage, Εννοεί διαχειριστή στο 1 και απενεργοποίηση πλήκτρων στο -1
        this.shadow.querySelector("#attachmentSpinner").style.display = "inline-block";
        this.shadow.querySelector("#attachments>tbody").innerHTML = "";
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        let fileArray = [];
        let year;
        let exdisk=0;
        this.shadow.querySelectorAll("#attachments tbody").innerHTML = "";
        this.shadow.querySelectorAll("#attachmentsTitle").innerHTML = '<div id="attachmentsSpinner" class="spinner-border" style="margin-left:1em;width: 1rem; height: 1rem;" role="status"></div>';
        
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        const urlpar = new URLSearchParams({currentYear : this.protocolYear, protocolNo : this.protocolNo});
       
        if (level!=-1){
            level = +loginData.user.roles[localStorage.getItem("currentRole")].protocolAccessLevel;
        }

        const res = await runFetch("/api/getAttachments.php", "GET", urlpar);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
        }
        else{
            const result =  res.result;     
            //this.shadow.querySelector("#attachmentsSpinner").remove();
            //$("#attachmentsSpinner").remove();
            const openInBrowser = ['pdf','PDF','html','htm','jpg','png'];
            for (let key1=0;key1<result.length;key1++) {
                let temp3="";
                let filenameSize = result[key1]['filename'].length;
                let attachedByString = '<span  class="badge rounded-pill bg-secondary">'+result[key1]['attachedBy']+'</span>';
                let newTableLineString = '<tr><td style="padding-top:0.2rem;padding-bottom:0.2rem"><div style="display:flex;align-items:center;gap:10px;">';
                let fileLinkString = "";
                if (result[key1]['isGdprProtected']=="1"){
                    fileLinkString+='<i class="fas fa-exclamation" style="color:red"></i>&nbsp';
                }
                if (level==1){	
                    //<i class="fas fa-pencil-alt"></i>
                    fileLinkString += '<button title="Μετονομασία" id="renameAtt_'+result[key1]['aa']+'" class="btn btn-secondary btn-sm"><i class="fas fa-pencil-alt"></i></button>'+'<span class="small" >'+result[key1]['filename']+'</span>';
                }
                else{
                    fileLinkString += '<span class="small">'+result[key1]['filename']+'</span>';
                }		
                fileArray.push(result[key1]['filename']);	
                year = result[key1]['year'];
                exdisk = result[key1]['externaldisk'];
                
                let isPDF = false;
                let isWord = false;
                let fileParts = result[key1]['filename'].split(".");
                let fileType = fileParts[fileParts.length - 1];
                if (fileType == "pdf" || fileType=="PDF"){
                    isPDF = true;
                }
                else if (fileType == "doc" || fileType=="docx"){
                    isWord = true;
                }
                
                let removeFileString = "";
                if (level!=-1){
                    removeFileString = '<button id="removeAtt_'+result[key1]['aa']+'" data-toggle="tooltip" title="Διαγραφή συνημμένου" class="btn btn-sm  btn-danger" ><i class="far fa-minus-square"></i></button>';
                }
                //let openFileString = '<button type="button" class="btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου" onclick="viewAttachmentNew('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="fas fa-folder-open"></i></button>';
                let openFileImage = '<i class="fas fa-download"></i>';
                if (openInBrowser.includes(fileType)){
                    openFileImage = '<i class="fas fa-folder-open"></i>';
                }
                let openFileString = '<button id="openAtt_'+result[key1]['aa']+'" type="button" class="btn btn-sm  btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου">'+openFileImage+'</button>';
                //let openFileStringWithProtocol = '<button class="btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" onclick="viewAttachmentNewWithProtocol('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="far fa-window-maximize"></i></button>';
                let openFileStringWithProtocol = '<button id="openAttWithProt_'+result[key1]['aa']+'" class="btn btn-sm  btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" ><i class="fas fa-stamp"></i></button>';
                
                let setGdprString = "";
                if (level==1){	
                    setGdprString = '<button id="openAttGDPRModal_'+result[key1]['aa']+'" class="btn btn-sm btn-warning"  data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                }
                //if (level!=-1){	
                    //setGdprString = '<button '+(level ==1 ? "" : "disabled")+' class="btn-warning" data-toggle="modal" data-target="#gdprModal" data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                //}
                let spacesString ='&nbsp&nbsp&nbsp';
                attachedByString = "";
                let attachmentBtnDiv = "<div style='display:flex;justify-content:end;gap:2px;flex-grow:1;align-items:flex-start;'>"+openFileString+(isWord||isPDF?openFileStringWithProtocol:"")+(isPDF&&level?setGdprString:"")+removeFileString+"</div>";
                temp3+=newTableLineString+attachedByString+fileLinkString+attachmentBtnDiv+'</div></td></tr>';
                this.shadow.querySelector("#attachments tbody").innerHTML += temp3;
                
            }
            for (let key1=0;key1<result.length;key1++) {
                this.shadow.querySelector("#openAtt_"+result[key1]['aa']).addEventListener("click",()=> this.viewAttachment(result[key1]['aa']));
                if(level ===1){
                    this.shadow.querySelector("#renameAtt_"+result[key1]['aa']).addEventListener("click",()=> {
                        this.shadow.querySelector("#attachmentModal").showModal();
                        this.shadow.querySelector(".customDialogContentTitle>span").innerText = "Μετονομασία συνημμένου";
                        this.shadow.querySelector(".customDialogContent").innerHTML = `<form>
                            <div class="flexVertical" style="padding:5px;">
                                <span></span>
                                <input type="text" class="form-control" name="newAttName" id="newAttName" value="${result[key1]['filename']}">
                                <button class="btn btn-outline-success ektos " id="renameFileButton"  title="Μετονομασία συνημμένου"><i class="fas fa-upload"></i></button>
                            </div>
                        </form>`;
                        this.shadow.querySelector("#renameFileButton").addEventListener("click",async (event)=> {
                            event.preventDefault(); await this.renameAttachment(result[key1]['aa'], this.protocolNo, this.protocolYear)
                        });
                    });
                    if(this.shadow.querySelector("#openAttGDPRModal_"+result[key1]['aa'])){
                        this.shadow.querySelector("#openAttGDPRModal_"+result[key1]['aa']).addEventListener("click",()=> {
                            this.shadow.querySelector("#gdprModal").showModal();
                            this.shadow.querySelector("#gdprModal .customDialogContentTitle>span").innerText = `Ορισμός Δικαιωμάτων του ${result[key1]['filename']}`;
                            //this.shadow.querySelector("#gdprModal .customDialogContent").innerHTML = gdprContent;
                            this.getGdprAndFill(result[key1]['aa']);
                        });
                    }
                }
                if (level !== -1){
                    this.shadow.querySelector("#removeAtt_"+result[key1]['aa']).addEventListener("click",()=> this.removeAttachment(result[key1]['aa'], this.protocolNo, this.protocolYear));
                }
                if (this.shadow.querySelector("#openAttWithProt_"+result[key1]['aa'])){
                    this.shadow.querySelector("#openAttWithProt_"+result[key1]['aa']).addEventListener("click",()=> this.viewAttachment(result[key1]['aa'],1));
                }
            }
            this.shadow.getElementById('zipFileButton').addEventListener("click",async ()=> await this.zipFiles());
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";	
        }
    }

    async zipFiles(){
        this.shadow.querySelector("#attachmentSpinner").style.display = "inline-block";
        this.shadow.querySelector("#actionStatus").innerHTML = "";
        let formData  = new FormData();
        formData.append('protocolNo',this.protocolNo);
        formData.append('currentYear', this.protocolYear);

        const res = await runFetch("/api/zipFiles.php", "POST", formData, FetchResponseType.blob);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            const blob = res.result;
            const href = URL.createObjectURL(blob);
            const aElement = document.createElement('a');
			aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
			Object.assign(aElement, {
			href,
			download: decodeURI(this.protocolNo+" "+this.protocolYear+".zip")
			}).click();
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
        }
    };

    async removeAttachment(aa,protocolNo, year){
        const procc = confirm("Πρόκειται να διαγράψετε ενα συνημμένο έγγραφο");
        if ( procc == true) {
            this.shadow.querySelector("#attachmentSpinner").style.display = "inline-block";
            this.shadow.querySelector("#actionStatus").innerHTML = "";
            let data = new FormData();
            data.append('attAA',aa);
            data.append('protocolNo',protocolNo);
            data.append('year',year);
            const res = await runFetch("/api/removeProtocolAtt.php", "POST", data);
            if (!res.success){
                this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            }
            else{
                this.loadAttachments(1);
                this.shadow.querySelector("#attachmentSpinner").style.display = "none";
            }
        } 
    }

    async renameAttachment(aa,protocolNo, year){
        this.shadow.querySelector("#attachmentSpinner").style.display = "inline-block";
        this.shadow.querySelector("#actionStatus").innerHTML = "";
        let data = new FormData();
        data.append('attAA',aa);
        data.append('protocolNo',protocolNo);
        data.append('year',year);
        data.append('newAttName', this.shadow.querySelector('#newAttName').value);

        const res = await runFetch("/api/renameProtocolAtt.php", "POST", data);
        if (!res.success){
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            this.loadAttachments(1);
            this.shadow.querySelector("#attachmentSpinner").style.display = "none";
            this.shadow.querySelector("#attachmentModal").close();
        }
    }

    async viewAttachment(attachmentNo, showProtocol=0){   // 15-12-2022 Θα αντικαταστήσει το παραπάνω ΚΑΙ ΤΟ VIEWATTACHMENTWITHPROTOCOL
        const currentYear = this.protocolYear;
        const urlpar = new URLSearchParams({attachmentNo, currentYear, showProtocol});
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        const res = await runFetch("/api/viewAttachmentTest.php", "GET", urlpar, FetchResponseType.blob);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            const dispHeader = res.responseHeaders.get('Content-Disposition');
            let filename = "tempfile.tmp";
            if (dispHeader !== null){
                const parts = dispHeader.split(';');
                //console.log(parts);
                filename = parts[1].split('=')[1];
                filename = filename.replaceAll('"',"");
            }
            const fileExtension = filename.split('.').pop();
            const blob = res.result;
            const href = URL.createObjectURL(blob);
            const inBrowser = ['pdf','PDF','html','htm','jpg','png'];
            
            if (inBrowser.includes(fileExtension)){
                if (document.querySelector("#fileOpenDialog")){
                    document.querySelector("#fileOpenDialog").innerHTML =
                    `<div><div style="margin-bottom:10px;">Χρήση του αρχείου για : </div><div>
                    <button class="btn btn-primary" id="fileOpenFromDialogBtn">Άνοιγμα</button>
                    <button class="btn btn-success" id="fileSaveFromDialogBtn">Αποθήκευση</button>
                    <button class="btn btn-secondary" id="fileCloseDialog">Κλείσιμο</button></div></div>`;
                    document.querySelector("#fileOpenFromDialogBtn").addEventListener("click",() => this.openFromDialog(href, filename));
                    document.querySelector("#fileSaveFromDialogBtn").addEventListener("click",() => this.saveFromDialog(href, filename));
                    document.querySelector("#fileCloseDialog").addEventListener("click",() => this.closeFromDialog());
                    document.querySelector("#fileOpenDialog").showModal();
                }
                return;
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

    openFromDialog(href,filename){
        const pdfWin = window.open(href);
        //pdfWin.document.title = decodeURI(filename);
        setTimeout(()=>{pdfWin.document.title = decodeURI(filename)},1000);
        this.closeFromDialog();
    }
    
    saveFromDialog(href,filename){
        const aElement = document.createElement('a');
        aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
        Object.assign(aElement, {
        href,
        download: decodeURI(filename)
        }).click();
        this.closeFromDialog();
    }
    
    closeFromDialog(){
        document.querySelector("#fileOpenDialog").close();
    }

    async getUsers(type){  // 1: active protocol users
        const urlpar = new URLSearchParams({type});
        const res = await runFetch("/api/getUsers.php", "GET", urlpar);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            return res.result; 
        }
    }

    changeAssignmentStatus(user){
        let tempUserElement= this.shadow.querySelector('.departmentEmployees [data-user="'+user+'"]');
        const charged = tempUserElement.dataset.charge;
        const chargedType = tempUserElement.dataset.chargeType;
        if (charged == 0){ 
            //tempUserElement.style.backgroundColor = "lightGray";
            tempUserElement.classList.remove('notification')
            tempUserElement.classList.add('active')
            tempUserElement.dataset.charge = 1;
            tempUserElement.dataset.chargeType = 1;
        }
        else if (charged == 1 && chargedType == 1){
            tempUserElement.classList.add('notification');
            tempUserElement.classList.remove('active');
            tempUserElement.dataset.charge = 1;
            tempUserElement.dataset.chargeType = 0;
        }
        else if (charged == 1 && chargedType == 0){
            tempUserElement.classList.remove('notification');
            tempUserElement.classList.remove('active');
            tempUserElement.dataset.charge = 0;
            tempUserElement.dataset.chargeType = 0;
        }
        this.updateSelectedCharges();
    }

    async getGdprAndFill(attNo){
       
        let urlParams = new URLSearchParams();
        urlParams.append('attNo', attNo);
        urlParams.append('currentYear',this.protocolYear);
        const res = await runFetch("/api/getGdprData.php", "GET", urlParams);
        if (!res.success){
            console.log(res.msg);
        }
        else{
            this.users.forEach( user => {
                this.shadow.querySelector("#selectGdprUserDiv").innerHTML += `<button data-selected="0" data-user="${user['aa']}" class="isButton warning gdprUser">${user['fullName']}</button>`
            });
            if (Array.isArray(res.result.gdprUserData)){
                res.result.gdprUserData.forEach( selectedUser =>{
                    //this.shadow.querySelector(`.gdprUser[data-user="${selectedUser['userId']}"]`).classList.remove("warning")
                    const userName = this.shadow.querySelector(`.gdprUser[data-user="${selectedUser['userId']}"]`).innerText;
                    this.shadow.querySelector(`.gdprUser[data-user="${selectedUser['userId']}"]`).remove();
                    const removeBtn = `<button id="removeGdprUser_${selectedUser['userId']}" data-aa="${selectedUser['aa']}" title="Διαγραφή χρήστη" class="isButton danger removeGdprBtn" ><i class="far fa-minus-square"></i></button>`
                    this.shadow.querySelector("#gdprSelectedUsersContent").innerHTML += `<div class="addedGdprUserDiv" style="display:flex; justify-content: space-between;"> <button class="isButton active small" id="addedGdprUser_${selectedUser['userId']}">${userName}</button><div><span>Σελίδες ${selectedUser['pages']}</span>${removeBtn}</div></div> `
                })
                this.shadow.querySelectorAll(".removeGdprBtn").forEach( btn =>{
                    btn.addEventListener("click", async () =>{
                        if (confirm("Διαγραφή χρήστη;")){
                            await this.deleteGdprRecord(btn.dataset.aa);
                        }
                    })
                })
                this.shadow.querySelectorAll(".gdprUser").forEach( elem =>{
                    elem.addEventListener("click", () =>{
                        console.log('change state')
                    })
                })
            }

        }  
    }

    async deleteGdprRecord(aa){
        let formData = new FormData();
        formData.append('aa', aa);
        const res = await runFetch("/api/deleteGdprRecord.php", "POST", formData);
        if (!res.success){
            console.log(res.msg);
        }
        else{

        }
    }
}

customElements.define("record-attachments", Attachments);