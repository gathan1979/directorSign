import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

const content = 
`<div  id="attachmentsDiv"  style="display:flex;gap:10px;flex-direction:column;height:100%;background: rgba(122, 130, 136, 0.2)!important;border-radius:5px;padding:10px;">
    <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
    <link rel="stylesheet" type="text/css" href="css/custom.css" />
    <link href="css/all.css" rel="stylesheet">

    <div style="display:flex;justify-content: space-between;align-items:center;">
        <div>
            <span style="font-size:14px;font-weight:bold;">Συνημμένα</span>
            <span class="badge bg-secondary" id="attachmentTableTitleBadge"></span>
        </div>
        <div>
            <button class="btn btn-outline-danger btn-sm" id="zipFileButton"  title="Λήψη όλων"><i class="fas fa-file-archive"></i></button>
            <button id="showAttachmentModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
        </div>
    </div>

    <div style="height:90%;overflow-y:scroll;">
        <table id="attachments" name="attachments" class="table">
            <tbody style="font-size : 12px;"> 
            </tbody>
        </table>
    </div>
</div>

<dialog id="addAttachmentModal" class="customDialog"> 
    <div class="customDialogContent">
        <button style="margin-left:20px;align-self:flex-end;" class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        <form>
            <div class="flexVertical" style="padding:5px;">
                <span >Νέο συνημμένο</span>
                <input type="file" class="btn btn-default" name="selectedFile" id="selectedFile" />
                <button class="btn btn-outline-success ektos " id="uploadFileButton"  title="Μεταφόρτωση επιλεγμένου αρχείου"><i class="fas fa-upload"></i></button>
            </div>
        </form>
    </div>
</dialog>`;


class Attachments extends HTMLElement {
    protocolNo;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = content;
        this.protocolNo = this.attributes.protocolNo.value;
        //console.log(this.protocolNo);
        this.shadow.querySelector("#uploadFileButton").addEventListener("click",()=>uploadFile());
        this.shadow.querySelector("#showAttachmentModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addAttachmentModal").showModal());
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addAttachmentModal").close());
        this.loadAttachments(1);
    }

    disconnectedCallback() {
    
    }

    async uploadFile(uploadURL="/api/uploadAttFile.php"){
        this.shadow.querySelector("#loadingDialog").showModal();
        const {jwt,role} = getFromLocalStorage();	
        
        const files = this.shadow.getElementById('selectedFile').files;
        let numFiles = files.length;
        let data = new FormData();

        if (numFiles==0){
            alert("Παρακαλώ επιλέξτε το αρχείο που θα προσθέσετε στα συνημμένα");
            this.shadow.querySelector("#loadingDialog").close();
            return;
        }

        data.append('selectedFile', this.shadow.getElementById('selectedFile').files[0]);
        data.append('role',role);
            
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let init = {method: 'POST', headers : myHeaders, body : data};
        
        const res = await fetch(uploadURL,init); 
        if (!res.ok){
            this.shadow.querySelector("#loadingDialog").close();
            if (res.status == 401){
                const resRef = await refreshToken();
                if (resRef ===1){
                    uploadFile(uploadURL);
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
            this.shadow.querySelector("#loadingDialog").close();
            this.shadow.querySelector("#selectedFile").value = null;
            alert("Το έγγραφο έχει αποσταλεί! Μάλλον...");
            this.loadAttachments(1);
        }
    }

    async loadAttachments(level){ // το level να ελεγχθεί, δουλεύει πλέον με το localStorage
        const {jwt,role} = getFromLocalStorage();	
        let fileArray = [];
        let year;
        let exdisk=0;
        this.shadow.querySelectorAll("#attachments tbody").innerHTML = "";
        this.shadow.querySelectorAll("#attachmentsTitle").innerHTML = '<div id="attachmentsSpinner" class="spinner-border" style="margin-left:1em;width: 1rem; height: 1rem;" role="status"></div>';
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        const currentYear = localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):2023;
        const urlpar = new URLSearchParams({currentYear , protocolNo : this.protocolNo, currentRole : role});
       
        if (level!=-1){
            level = +loginData.user.roles[localStorage.getItem("currentRole")].protocolAccessLevel;
        }
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let init = {method: 'GET', headers : myHeaders};
        
        const res = await fetch("/api/getAttachments.php?"+urlpar,init); 
        if (!res.ok){
            if (res.status==401){
                const resRef = await refreshToken();
                if (resRef !==1){
                    alert("σφάλμα στη λήψη συνημμένων");
                }
                else{
                    this.loadAttachments(level);
                }
            }
            else{
                const error = new Error("unauthorized");
                error.code = "400";
                throw error;	
            }
        }
        else{
            const result = await res.json(); 
            
            //this.shadow.querySelector("#attachmentsSpinner").remove();
            //$("#attachmentsSpinner").remove();
            const openInBrowser = ['pdf','PDF','html','htm','jpg','png'];
            for (let key1=0;key1<result.length;key1++) {
                let temp3="";
                let filenameSize = result[key1]['filename'].length;
                let attachedByString = '<span  class="badge rounded-pill bg-secondary">'+result[key1]['attachedBy']+'</span>';
                let newTableLineString = '<tr><td style="padding-top:0.2rem;padding-bottom:0.2rem"><div style="display:flex;align-items:flex-start;gap:2px;">';
                let fileLinkString = "";
                if (result[key1]['isGdprProtected']=="1"){
                    fileLinkString+='<i class="fas fa-exclamation" style="color:red"></i>&nbsp';
                }
                if (level==1){	
                    fileLinkString += '<span title="Μετονομασία Συνημμένου" contenteditable="true" onkeyup="checkAndrenameAttachment('+result[key1]['aa']+',event);" onfocusout="renameAttachment('+result[key1]['aa']+',event);">'+result[key1]['filename']+'</span>';
                }
                else{
                    fileLinkString += '<span>'+result[key1]['filename']+'</span>';
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
                    removeFileString = '<button id="removeAtt_'+result[key1]['aa']+'" data-toggle="tooltip" title="Διαγραφή συνημμένου" class="btn btn-sm  btn-danger" onclick="removeAttachment('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\')"><i class="far fa-minus-square"></i></button>';
                }
                //let openFileString = '<button type="button" class="btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου" onclick="viewAttachmentNew('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="fas fa-folder-open"></i></button>';
                let openFileImage = '<i class="fas fa-download"></i>';
                if (openInBrowser.includes(fileType)){
                    openFileImage = '<i class="fas fa-folder-open"></i>';
                }
                let openFileString = '<button id="openAtt_'+result[key1]['aa']+'" type="button" class="btn btn-sm  btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου">'+openFileImage+'</button>';
                //let openFileStringWithProtocol = '<button class="btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" onclick="viewAttachmentNewWithProtocol('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="far fa-window-maximize"></i></button>';
                let openFileStringWithProtocol = '<button id="openAttWithProt_'+result[key1]['aa']+'" class="btn btn-sm  btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" ><i class="far fa-window-maximize"></i></button>';
                
                let setGdprString = '<button id="openAttGDPRModal_'+result[key1]['aa']+'" class="btn btn-sm btn-warning"  data-target="#gdprModal" data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                //if (level!=-1){	
                    //setGdprString = '<button '+(level ==1 ? "" : "disabled")+' class="btn-warning" data-toggle="modal" data-target="#gdprModal" data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                //}
                let spacesString ='&nbsp&nbsp&nbsp';
                let attachmentBtnDiv = "<div style='display:flex;justify-content:end;gap:2px;flex-grow:1;align-items:flex-start;'>"+openFileString+(isWord||isPDF?openFileStringWithProtocol:"")+(isPDF&&level?setGdprString:"")+removeFileString+"</div>";
                temp3+=newTableLineString+attachedByString+fileLinkString+attachmentBtnDiv+'</div></td></tr>';
                this.shadow.querySelector("#attachments tbody").innerHTML += temp3;
                
            }
            for (let key1=0;key1<result.length;key1++) {
                this.shadow.querySelector("#openAtt_"+result[key1]['aa']).addEventListener("click",()=> this.viewAttachment(result[key1]['aa']));
                if (this.shadow.querySelector("#openAttWithProt_"+result[key1]['aa'])){
                    this.shadow.querySelector("#openAttWithProt_"+result[key1]['aa']).addEventListener("click",()=> this.viewAttachment(result[key1]['aa'],1));
                }
            }
            let zipBut = this.shadow.getElementById('zipFileButton').addEventListener("click",async function(){
                let formData  = new FormData();
                formData.append('protocolNo',this.protocolNo);
                formData.append('currentYear', year);
                let newInit = {method: 'POST', headers : myHeaders, body : formData};
                const res = await fetch("/api/zipFiles.php",newInit); 
                if (!res.ok){
                    if (res.status==401){
                        await refreshToken();
                    }
                    else{
                        const error = new Error("unauthorized");
                        error.code = "400";
                        throw error;	
                    }
                }
                else{
                    const result = await res.text();
                    console.log(result);
                    window.open(result);
                }
            });
            //$( "#attachments tbody").append(temp3);
            
        }		
    }

    async removeAttachment(aa,record,filename){
        const procc = confirm("Πρόκειται να διαγράψετε ενα συνημμένο έγγραφο");
        if ( procc == true) {
            const {jwt,role} = getFromLocalStorage();	
            let data = new FormData();
            data.append('aa',aa);
            data.append('record',record);
            data.append('filename',filename);
                
            const myHeaders = new Headers();
            myHeaders.append('Authorization', jwt);
            let init = {method: 'POST', headers : myHeaders, body : data};
            const res = await fetch("/api/removeAttachment.php",init); 
            if (!res.ok){
                this.shadow.querySelector("#loadingDialog").close();
                if (res.status == 401){
                    const resRef = await refreshToken();
                    if (resRef ===1){
                        this.removeAttachment(aa,record,filename);
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
                this.loadAttachments(1);
               //loadHistory();
            }
        } 
    }

    async viewAttachment(attachmentNo, showProtocol=0){   // 15-12-2022 Θα αντικαταστήσει το παραπάνω ΚΑΙ ΤΟ VIEWATTACHMENTWITHPROTOCOL
        console.log("show ...",showProtocol)
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        const currentYear = localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear;
        const urlpar = new URLSearchParams({attachmentNo, currentYear, showProtocol});
        const jwt = loginData.jwt;
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let init = {method: 'GET', headers : myHeaders};
        
        const res = await fetch("/api/viewAttachmentTest.php?"+urlpar,init); 
        if (!res.ok){
            if (res.status>=400 && res.status <= 401){
                const resRef = await refreshToken();
                if (resRef ===1){
                    this.viewAttachment(attachmentNo, showProtocol=0);
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
            let filename = "tempfile.tmp";
            if (dispHeader !== null){
                const parts = dispHeader.split(';');
                console.log(parts);
                filename = parts[1].split('=')[1];
                filename = filename.replaceAll('"',"");
            }
            const fileExtension = filename.split('.').pop();
            const blob = await res.blob();
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
    
}

customElements.define("record-attachments", Attachments);