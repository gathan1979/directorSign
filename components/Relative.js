
const content = `<div id="relativeModule">
    <div class="pr-1 pl-2 pt-3">
        <button class="btn btn-primary btn-sm" type="button" data-bs-toggle="collapse" data-bs-target="#sxetika" aria-expanded="false" aria-controls="sxetika">
            Σχετικά Έγγραφα <span id="relativeButtonBadge" class="badge badge-info"></span>
        </button>
    </div>
    <div class=" mh-25 mt-3 pt-3  collapse" id="sxetika" style="background: rgba(122, 160, 126, 0.2)!important;">

        <form>
            <div class="form-group row mb-2 mr-2 pt-2 ml-1">
                <label for="insertRelativeField" class="col-sm-2 col-form-label">Νέο Σχετικό</label>
                <div class="row pl-4 pl-sm-0 pt-1 pt-sm-0 pb-2 pb-sm-0 ">
                    <input type="number" class="form-control-sm col-3" id="insertRelativeField" placeholder="αρ.πρωτ">&nbsp/&nbsp
                    <input type="number" class="form-control-sm col-3" id="insertRelativeYearField" value="">
                </div>
                <button id="insertRelativeBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
            </div>
            
        </form>
        <table class="table" id="relativeTable">
            <thead>
            <tr>
                <th ><button id="fullRelativeTree" type="button"  class="btn-sm btn-outline-success mb-2"><i class="fas fa-sitemap"></i></button>	
                &nbspΣχετικά</th>
            </tr>
            </thead>
            <tbody>
        
            </tbody>
        </table>
        
    </div>
</div>`;


class Relative extends HTMLElement {
    protocolNo;

    constructor() {
        super();
    }

    connectedCallback(){
        this.innerHTML = content;
        this.protocolNo = this.attributes.protocolNo.value;
        console.log(this.protocolNo);
        document.querySelector("#uploadFileButton").addEventListener("click",()=>uploadFile());
        this.loadAttachments(1);
    }

    disconnectedCallback() {
    
    }

    async uploadFile(uploadURL="/api/uploadAttFile.php"){
        document.querySelector("#loadingDialog").showModal();
        const {jwt,role} = getFromLocalStorage();	
        
        const files = document.getElementById('selectedFile').files;
        let numFiles = files.length;
        let data = new FormData();

        if (numFiles==0){
            alert("Παρακαλώ επιλέξτε το αρχείο που θα προσθέσετε στα συνημμένα");
            document.querySelector("#loadingDialog").close();
            return;
        }

        data.append('selectedFile', document.getElementById('selectedFile').files[0]);
        data.append('role',role);
            
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let init = {method: 'POST', headers : myHeaders, body : data};
        
        const res = await fetch(uploadURL,init); 
        if (!res.ok){
            document.querySelector("#loadingDialog").close();
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
            document.querySelector("#loadingDialog").close();
            document.querySelector("#selectedFile").value = null;
            alert("Το έγγραφο έχει αποσταλεί! Μάλλον...");
            this.loadAttachments(1);
        }
    }

    async loadAttachments(level){ // το level να ελεγχθεί, δουλεύει πλέον με το localStorage
        let fileArray = [];
        let year;
        let exdisk=0;
        document.querySelectorAll("#attachments tbody").innerHTML = "";
        document.querySelectorAll("#attachmentsTitle").innerHTML = '<div id="attachmentsSpinner" class="spinner-border" style="margin-left:1em;width: 1rem; height: 1rem;" role="status"></div>';
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
            //document.querySelector("#attachmentsSpinner").remove();
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
            let zipBut = document.getElementById('zipFileButton').addEventListener("click",async function(){
                // $.ajax({
                   // type: "post",
                   // data: {"fileArray" : fileArray, "selectedIndex" : selectedIndex, "selectedYear" : year, "externaldisk" : exdisk},
                   // url: "zipFiles.php",
                   // success: function(msg1){					
                        // window.open(msg1);
                   // }
                // })
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
            document.querySelector("#attachments tbody").innerHTML = temp3;
        }		
    }
}




customElements.define("record-attachments", Attachments);