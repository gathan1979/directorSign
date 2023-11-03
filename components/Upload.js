import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const uploadDiv = `
        <style>
        /* SHAKE */
        .faa-shake.animated,
        .faa-shake.animated-hover:hover,
        .faa-parent.animated-hover:hover>.faa-shake {
            animation: wrench 2.5s ease infinite;
        }
        
        .faa-shake.animated.faa-fast,
        .faa-shake.animated-hover.faa-fast:hover,
        .faa-parent.animated-hover:hover>.faa-shake.faa-fast {
            animation: wrench 1.2s ease infinite;
        }
        
        .faa-shake.animated.faa-slow,
        .faa-shake.animated-hover.faa-slow:hover,
        .faa-parent.animated-hover:hover>.faa-shake.faa-slow {
            animation: wrench 3.7s ease infinite;
        }
        
        /* WRENCHING */
        @keyframes wrench {
            0%{transform:rotate(-12deg)}
            8%{transform:rotate(12deg)}
            10%{transform:rotate(24deg)}
            18%{transform:rotate(-24deg)}
            20%{transform:rotate(-24deg)}
            28%{transform:rotate(24deg)}
            30%{transform:rotate(24deg)}
            38%{transform:rotate(-24deg)}
            40%{transform:rotate(-24deg)}
            48%{transform:rotate(24deg)}
            50%{transform:rotate(24deg)}
            58%{transform:rotate(-24deg)}
            60%{transform:rotate(-24deg)}
            68%{transform:rotate(24deg)}
            75%,100%{transform:rotate(0deg)}
        }

            .isButton{
                background-color: var(--bs-secondary);
                font-family: var(--bs-body-font-family);
                color : white;
                border-radius:5px;
                border:1px solid transparent;
                padding : 10px;
                cursor : pointer;
                font-size: 1em;
            }

            .notification{
                background-color: var(--bs-blue);
            }

            .outline{
                background-color: rgba(255,255,255,0.6);
                color: black;
                border: 1px solid black;
            }

            .small{
                font-size: 0.875rem;
            }
            
            .extraSmall{
                font-size: 0.75rem;
            }
            
            .active{
                background-color: var(--bs-success);
                color: white;
            }
            
            .dismiss{
                background-color: var(--bs-danger);
            }

            .customDialogContent{
                display: flex;
                flex-direction: column;
                align-items: stretch;
                gap: 10px;
                border-radius: 15px;
            }
            
            .customDialogContentTitle{
                display: flex;
                justify-content: space-between;
                gap: 10px;
                border-radius: 0px;
                margin-bottom:10px;
                align-items: flex-start;
                background-color: gray;
                padding:10px;
                color:white;
            }

            .customDialog::backdrop{
                background-color: rgba(0, 0, 0, 0.8);
            }

            .departmentEmployees>button:nth-child(n+1){
                margin-left:20px;
            }

            .departmentEmployees>button:nth-child(1){
                margin-left:10px;
            }

            .flexVertical{
                display : flex;	
                flex-flow: column nowrap;
                gap : 0.2em;
                background-color : lightgray;
                border-radius : 5px;
                align-items : stretch;
                flex-basis : auto;
                padding: 5px;
            }
            
            .flexHorizontal{
                display : flex;	
                flex-flow: row nowrap;
                gap : 0.2em;
                background-color : lightgray;
                border-radius : 5px;
                align-items : stretch;
                flex-basis : auto;
                padding-left: 5px;
                padding-right: 5px;
            }

            [disabled]{
                opacity: 0.5;
                pointer-events: none;
            }
        </style>
        <link href="css/all.css" rel="stylesheet">    
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέα αρχεία</span>
            <div class="topButtons" style="display:flex;gap: 7px;">
                <button id="uploadFileButton" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
                <button id="undoBtn" title="Αναίρεση αλλαγών" type="button" class="isButton"><i class="fas fa-undo"></i></button>
                <button class="isButton " name="closeEditModalBtn" id="closeEditModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
            </div>
        </div>
        <div class="customDialogContent" style="margin:10px;">
            <div id="uploadFileForm" style="padding:10px;">
                <div id="addFormDiv" class="flexVertical">
                    <div class="flexHorizontal">    
                        <input type="file" class="form-control-file" name="selectedFile" id="selectedFile"  multiple  accept="pdf,PDF,doc,DOC,docx,DOCX,xls,XLS,xlsx,XLSX"/>
                    </div>
                    <div class="flexHorizontal" id="viewSelectedFiles"></div>
                    <div class="flexHorizontal">   
                        <label class="formItem" for="authorComment" class="col-sm-2 col-form-label">Σχόλιο</label>
                        <textarea  class="form-control" type="text" name="authorComment" id="authorComment" rows="2" cols="50" placeholder="Προαιρετικό κείμενο"></textarea>
                    </div>
                </div>
            </div>
        </div>`;

class Upload extends HTMLElement {
    shadow;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = uploadDiv;
        this.shadow.getElementById("uploadFileButton").setAttribute("disabled","disabled");
        this.shadow.querySelector("#uploadFileButton").addEventListener("click", (elem)=>{
            this.uploadFileTest();   
        })
        this.shadow.querySelector("#selectedFile").addEventListener("change",() => this.enableFileLoadButton());
        this.shadow.querySelector("#closeEditModalBtn").addEventListener("click", ()=>{
            this.undoChanges();  
            this.parentElement.close();
        });
        this.shadow.querySelector("#undoBtn").addEventListener("click",()=>this.undoChanges());
    }

    disconnectedCallback() {    
    }

    undoChanges(){
        this.shadow.getElementById('uploadFileButton').classList.remove('active');
        this.shadow.querySelector("#uploadFileButton  i").classList.remove('faa-shake');
        this.shadow.querySelector("#uploadFileButton  i").classList.remove('animated');  
        this.shadow.getElementById('uploadFileButton').setAttribute("disabled","disabled");

        this.shadow.querySelector("#viewSelectedFiles").innerHTML = "";
        this.shadow.querySelector("#authorComment").textContent = "";
        this.shadow.querySelector("#selectedFile").value = null;

    }

    async uploadFileTest(uploadURL="/api/uploadSigFiles.php",reloadNo = 0){
        const files = this.shadow.getElementById('selectedFile').files;
        let numFiles = files.length;
        let data = new FormData();
        let numFilesToSign=0;
    
        if (reloadNo){			// είναι επαναφόρτωση αρχείου για διόρθωση				
            data.append('aa', reloadNo);
            numFiles = 1;
            data.append('authorComment', "επαναφόρτωση αρχείου από συντάκτη");
            data.append('selectedFile0', this.shadow.getElementById('reuploadFileBtn'+reloadNo).files[0]);
            data.append('tobeSigned',0);
        }
        else{
            for (let i = 0; i < numFiles; i++) {
                data.append('selectedFile'+i, this.shadow.getElementById('selectedFile').files[i]);
                const elem = this.shadow.getElementById('filebutton_'+i);
                if (elem.classList.contains('active')){
                    data.append('tobeSigned',i);
                    numFilesToSign+=1;
                }
            }
            if (numFilesToSign>1){
                    alert("Έχετε επιλέξει περισσότερα από ένα έγγραφα προς υπογραφή");
                    this.shadow.querySelector("#loadingDialog").close();
                    return;
            }
            else if (numFilesToSign==0){
                    alert("Παρακαλώ επιλέξτε το αρχείο που θα υπογράψετε ψηφιακά");
                    this.shadow.querySelector("#loadingDialog").close();
                    return;
            }
            data.append('authorComment', this.shadow.getElementById('authorComment').value);
        }
        
        data.append('numFiles',numFiles);
            
        const res = await runFetch("/api/uploadSigFiles.php", "POST", data);
        if (!res.success){
            alert(res.msg);
        }
        else {
            //this.shadow.querySelector("#loadingDialog").close();
            //this.shadow.querySelector("#viewSelectedFiles").innerHTML = "";
            //this.shadow.querySelector("#selectedFile").value = null;
            const uploadEvent = new CustomEvent("uploadEvent",  { bubbles: true, cancelable: false });
            this.dispatchEvent(uploadEvent);
            //const records = getSigRecords().then( res => {
            //    createSearch();
            //}, rej => {});
            this.undoChanges();  
            this.parentElement.close();	
            alert("Το έγγραφο έχει αποσταλεί! Μάλλον... :)");
        }
    }

    enableFileLoadButton(){
        const well = this.shadow.getElementById("viewSelectedFiles");
        if(this.shadow.getElementById("selectedFile").value != "") {
            this.shadow.getElementById("uploadFileButton").removeAttribute("disabled");
            const files = this.shadow.getElementById('selectedFile').files;
            const numFiles = files.length;
            this.shadow.querySelector("#viewSelectedFiles").innerHTML= "";
            for (let i = 0; i < numFiles; i++) {
                let elem = `<button class="isButton extraSmall outline" style="margin-right:15px;padding:2px;" id="filebutton_${i}">${files[i].name}</button>`;
                well.innerHTML += elem;
                if (numFiles===1){
                    this.shadow.querySelector("#filebutton_"+i).classList.add("active");
                }
            }
            for (let i = 0; i < numFiles; i++) {
                this.shadow.querySelector("#filebutton_"+i).addEventListener("click", this.changeFileState);
            }
            this.shadow.getElementById('uploadFileButton').classList.add('active');
            this.shadow.querySelector("#uploadFileButton  i").classList.add('faa-shake');
            this.shadow.querySelector("#uploadFileButton  i").classList.add('animated');
        }
        else{
            this.shadow.getElementById("uploadFileButton").setAttribute("disabled","disabled");
            well.innerHTML = "";
        }
    }	

    changeFileState(event) { 
        const element = event.currentTarget;
        if (element.classList.contains('active')){
            element.classList.remove('active');
            element.classList.add('outline');
        }
        else{
            element.classList.remove('outline');
            element.classList.add('active');
        }
    };
    
}

customElements.define("file-upload", Upload);