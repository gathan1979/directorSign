import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";
import { viewFile } from "../modules/Records_test.js";

const content = 
`<div  id="attachmentsDiv"  style="display:flex;gap:10px;flex-direction:column;height:100%;background: rgba(122, 130, 136, 0.2)!important;border-radius:5px;padding:10px;">
    <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
    <link rel="stylesheet" type="text/css" href="css/custom.css" />
    <link href="css/all.css" rel="stylesheet">

    <div style="display:flex;justify-content: space-between;align-items:center;">
        <div>
            <span style="font-size:14px;font-weight:bold;">Συνημμένα</span>
        </div>
        <div>
            <button class="btn btn-outline-danger btn-sm" id="zipFileButton"  title="Λήψη όλων"><i class="fas fa-file-download"></i></button>
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
    <form>
        <div class="flexVertical">
            <input type="file" class="btn btn-default ektos" name="selectedFile" id="selectedFile" />
            <button class="btn btn-outline-success ektos " id="uploadFileButton"  title="Μεταφόρτωση επιλεγμένου αρχείου"><i class="fas fa-upload"></i></button>
        </div>
    </form>
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
        let fileArray = [];
        let year;
        let exdisk=0;
        this.shadow.querySelectorAll("#attachments tbody").innerHTML = "";
        this.shadow.querySelectorAll("#attachmentsTitle").innerHTML = '<div id="attachmentsSpinner" class="spinner-border" style="margin-left:1em;width: 1rem; height: 1rem;" role="status"></div>';
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        const currentYear = localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):2023;
        const urlpar = new URLSearchParams({currentYear , protocolNo : this.protocolNo});
        if (level!=-1){
            level = +loginData.user.roles[localStorage.getItem("currentRole")].protocolAccessLevel;
        }
        const jwt = loginData.jwt;
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
                    loadAttachments(level);
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
            let temp3="";
            //this.shadow.querySelector("#attachmentsSpinner").remove();
            //$("#attachmentsSpinner").remove();
            const openInBrowser = ['pdf','PDF','html','htm','jpg','png'];
            for (let key1=0;key1<result.length;key1++) {
                
                let filenameSize = result[key1]['filename'].length;
                let attachedByString = '<button type="button" class="btn btn-info btn-sm">'+result[key1]['attachedBy']+'</button>';
                let newTableLineString = '<tr><td style="padding-top:0.2rem;padding-bottom:0.2rem">';
                let fileLinkString = "";
                if (result[key1]['isGdprProtected']=="1"){
                    fileLinkString+='<i class="fas fa-exclamation" style="color:red"></i>&nbsp';
                }
                if (level==1){	
                    fileLinkString += '<b data-toggle="tooltip" title="Μετονομασία Συνημμένου" contenteditable="true" onkeyup="checkAndrenameAttachment('+result[key1]['aa']+',event);" onfocusout="renameAttachment('+result[key1]['aa']+',event);">'+result[key1]['filename']+'</b>';
                }
                else{
                    fileLinkString += '<b>'+result[key1]['filename']+'</b>';
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
                    removeFileString = '<button data-toggle="tooltip" title="Διαγραφή συνημμένου" class="btn-danger" onclick="removeAttachment('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\')"><i class="far fa-minus-square"></i></button>';
                }
                //let openFileString = '<button type="button" class="btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου" onclick="viewAttachmentNew('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="fas fa-folder-open"></i></button>';
                let openFileImage = '<i class="fas fa-download"></i>';
                if (openInBrowser.includes(fileType)){
                    openFileImage = '<i class="fas fa-folder-open"></i>';
                }
                let openFileString = '<button type="button" class="btn-success" data-toggle="tooltip" title="Άνοιγμα αρχείου" onclick="viewAttachmentNew('+result[key1]['aa']+',0)">'+openFileImage+'</button>';
                //let openFileStringWithProtocol = '<button class="btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" onclick="viewAttachmentNewWithProtocol('+result[key1]['aa']+','+result[key1]['record']+',\''+result[key1]['filename']+'\''+','+result[key1]['isGdprProtected']+','+result[key1]['isGdprViewable']+','+result[key1]['externaldisk']+','+result[key1]['year']+')"><i class="far fa-window-maximize"></i></button>';
                let openFileStringWithProtocol = '<button class="btn-success" data-toggle="tooltip" title="Άνοιγμα ως pdf με πρωτόκολλο" onclick="viewAttachmentNew('+result[key1]['aa']+',1)"><i class="far fa-window-maximize"></i></button>';
                
                let setGdprString = '<button class="btn-warning" data-toggle="modal" data-target="#gdprModal" data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                //if (level!=-1){	
                    //setGdprString = '<button '+(level ==1 ? "" : "disabled")+' class="btn-warning" data-toggle="modal" data-target="#gdprModal" data-id="'+result[key1]['aa']+'"><i data-toggle="tooltip" title="Ορισμός Δικαιωμάτων" class="fas fa-key "></i></button>';
                //}
                let spacesString ='&nbsp&nbsp&nbsp';
                temp3+=newTableLineString+fileLinkString+spacesString+openFileString+(isWord||isPDF?spacesString+openFileStringWithProtocol:"")+(isPDF&&level?spacesString+setGdprString:"")+spacesString+removeFileString+spacesString+spacesString+attachedByString+'</td></tr>';
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
            this.shadow.querySelector("#attachments tbody").innerHTML = temp3;
        }		
    }

    removeAttachment(aa,record,filename){
        var r = confirm("Πρόκειται να διαγράψετε ενα συνημμένο έγγραφο");
        if (r == true) {
            $.ajax({
                type: "post",
                data: {"aa" : aa, "record":record,"filename":filename},
                url: "removeAttachment.php",
                success: function(msg){

                        $(".message").html(msg);
                        $("#alert").show();
                    
                    loadAttachments(1);
                    loadHistory();
                    
                }
            });	  		
        } else {
        
        }
    }
}




customElements.define("record-attachments", Attachments);