import runFetch from "../modules/CustomFetch.js";

const addContent = `
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

        .active{
            background-color: var(--bs-success);
        }

        .notification{
            background-color: var(--bs-blue);
        }

        .warning{
            background-color: var(--bs-warning);
            color : black;
        }

        .secondary{
            background-color: var(--bs-gray);
        }

        .outline{
            background-color: rgba(255,255,255,0.6);
            color: black;
            border: 1px solid black;
        }

        .small{
            font-size: 0.8em;
            width : 80%;
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
            border-radius: 15px;
            margin-bottom:10px;
            align-items: flex-start;
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

        [disabled]{
            opacity: 0.7;
            pointer-events: none;
        }

        .formRow{
            display:flex;
            gap: 10px;
        }    

        .formItem{
            flex-basis:100px;
            flex-grow:1;
        }

        .formInput{
            flex-basis:300px;
            flex-grow:1;
            height : 2em;
        }

        #addFormDiv{
            display:flex;
            flex-direction : column;
            gap: 10px;
        }
        .undo{
            background-color : cadetblue;
        }

    </style>
    <link rel="stylesheet" type="text/css" href="/libraries/fontawesome-free-5.15.4-web/css/all.css" >

    <div class="customDialogContentTitle">
        <span style="font-weight:bold;">Νέο Πρωτόκολλο</span>
        <div class="topButtons" style="display:flex;gap: 7px;">
            <button id="saveRecordBtn" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
            <button id="undoBtn" title="Αναίρεση αλλαγών" type="button" class="isButton undo"><i class="fas fa-undo"></i></button>
            <button class="isButton " name="closeEditModalBtn" id="closeEditModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
    </div>
    <div class="customDialogContent" style="margin-top:10px;">
        <form id="addRecordForm">
            <div id="addFormDiv">
                <div class="formRow">    
                    <label class="formItem" for="subjectField" class="col-sm-2 col-form-label">ΘΕΜΑ*</label>
                    <textarea class="formInput" required=""  type="text"  id="subjectField" ></textarea>
                </div>
                <hr style="width : 100%;border:4px solid orange; border-radius: 2px;">
                <div class="formRow">    
                    <label class="formItem" for="toField" class="col-sm-2 col-form-label">ΠΡΟΣ*</label>
                    <input class="formInput" required=""  type="text"  id="toField">
                </div>
                <div class="formRow">   
                    <label class="formItem" for="outSubjectField" class="col-sm-2 col-form-label">ΘΕΜΑ ΕΞΕΡΧ.*</label>
                    <input class="formInput" required=""  type="text"  id="outSubjectField">
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
    </div>`;


class RequestRecord extends HTMLElement {
    shadow;
    changedProperties;
    emptyProperties = {
        subjectField : "",
        toField  : "",
        outSubjectField : "" 
    };

    constructor() {
        super();
    }

    async connectedCallback(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
        //console.log(currentRoleObject);
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = addContent;
        this.changedProperties = {};
        
        this.shadow.querySelector("#closeEditModalBtn").addEventListener("click", ()=>this.parentElement.close());
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
                element.addEventListener("keyup", (event) => this.updateChangedProperties(event)); 
         });

        //Listeners πάνω κουμπιών
        //this.shadow.querySelector("#archiveButtonModal").addEventListener("click",()=>this.saveAssignments());
        //this.shadow.querySelector("#restoreButtonModal").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#saveRecordBtn").addEventListener("click",()=>{ this.requestRecord(); });
        this.shadow.querySelector("#undoBtn").addEventListener("click",()=>this.undoChanges());
    }

    disconnectedCallback() {
    
    }

    updateChangedProperties(event){
        //Ανανέωση αντικειμένου changedProperties με τιμές πεδίων
        this.changedProperties = {};
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            this.changedProperties[element.id] = element.value;
            if (element.type == "date" && element.value == ""){
                this.changedProperties[element.id] = "0000-00-00";
            }
        });
        //Έλεγχος ισότητας changedProperties με protocolProperties
        const shallowCompare = (obj1, obj2) => {
                return ( (Object.keys(obj1).length === Object.keys(obj2).length) &&
                Object.keys(obj1).every(key => {console.log(obj1[key], obj2[key]); return obj2.hasOwnProperty(key) && obj1[key] === obj2[key]}))
            };
        //Αν υπάρχει τροποποίηση στα δεδομένα από το χρήστη αλλάζει κουμπί αποθήκευσης
        if (shallowCompare(this.changedProperties, this.emptyProperties)){
            this.shadow.getElementById('saveRecordBtn').classList.remove('active');
            this.shadow.querySelector("#saveRecordBtn  i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveRecordBtn  i").classList.remove('animated');     
        }
        else{
            this.shadow.getElementById('saveRecordBtn').classList.add('active');
            this.shadow.querySelector("#saveRecordBtn  i").classList.add('faa-shake');
            this.shadow.querySelector("#saveRecordBtn  i").classList.add('animated');    
        }
    }


    undoChanges(){
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = "";
        });
        this.updateChangedProperties();
    }

    async requestRecord(){
        const formdata = new FormData();
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = this.changedProperties[element.id];
            formdata.append(element.id, element.value);
        });

        const res = await runFetch("/api/requestRecord.php", "POST", formdata);
        if (!res.success){
            alert(res.msg);
        }
        else{    
            alert("επιτυχής αίτηση εγγραφής");
            this.shadow.getElementById('saveRecordBtn').classList.remove('active');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('animated');
            const RefreshRequestProtocol = new CustomEvent("RefreshRequestProtocol", { bubbles: true, cancelable: false, composed: true });
            this.dispatchEvent(RefreshRequestProtocol);
            this.undoChanges();
            this.parentElement.close();
        }
    } 
}

customElements.define("record-request", RequestRecord);