import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

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

    </style>
    <link href="css/all.css" rel="stylesheet">

    <div class="customDialogContentTitle">
        <span style="font-weight:bold;">Νέο Πρωτόκολλο</span>
        <div class="topButtons" style="display:flex;gap: 7px;">
            <button id="saveRecordBtn" title="Αποθήκευση αλλαγών" type="button" class="isButton active"><i class="far fa-save"></i></button>
            <button id="undoBtn" title="Αναίρεση αλλαγών" type="button" class="isButton"><i class="fas fa-undo"></i></button>
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


class AddRecord extends HTMLElement {
    shadow;

    constructor() {
        super();
    }

    async connectedCallback(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
        //console.log(currentRoleObject);
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = addContent;
 
        // Προσθήκη κουμπιών ενεργειών με βάση την ιδιότητα .
        let tempFooterBtns = this.shadow.querySelector(".topButtons");
        
        this.shadow.querySelector("#closeEditModalBtn").addEventListener("click", ()=>this.parentElement.close());

        //Listeners πάνω κουμπιών
        //this.shadow.querySelector("#archiveButtonModal").addEventListener("click",()=>this.saveAssignments());
        //this.shadow.querySelector("#restoreButtonModal").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#saveRecordBtn").addEventListener("click",()=>{
                if (currentRoleObject.protocolAccessLevel == 1){
                    this.addRecord();
                }
                else{
                    this.requestRecord();
                }    
            });
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
        if (shallowCompare(this.changedProperties, this.protocolProperties)){
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
            element.value = this.protocolProperties[element.id];
        });
        this.updateChangedProperties();
    }

    async getRecord(protocolNo){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getRecord.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.getCharges(protocolNo);
                }
                else{
                    alert("σφάλμα εξουσιοδότησης");
                }
            }
            else if (res.status==403){
                alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
            }
            else if (res.status==404){
                alert("το αρχείο δε βρέθηκε");
            }
            else{
                alert("Σφάλμα!!!");
            }
        }
        else{
            const resdec = await res.json();
            return resdec;
        }    
    }


    async addRecord(){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = this.changedProperties[element.id];
            formdata.append(element.id, element.value);
         });
  
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('currentRole',role);

        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/addRecord.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.editRecord();
                }
                else{
                    alert("σφάλμα εξουσιοδότησης");
                }
            }
            else if (res.status==403){
                alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
            }
            else if (res.status==404){
                alert("το αρχείο δε βρέθηκε");
            }
            else if (res.status==500){
                alert("Εσωτερικό σφάλμα. Επικοινωνήστε με το διαχειριστή");
            }
            else{
                alert("Σφάλμα!!!");
            }
        }
        else{
            const resdec = await res.json();
            console.log(resdec['message']);
            if (resdec['success']){
                alert("επιτυχής εισαγωγή εγγραφής");
                this.shadow.getElementById('saveRecordButton').classList.remove('active');
                this.shadow.querySelector("#saveRecordButton  i").classList.remove('faa-shake');
                this.shadow.querySelector("#saveRecordButton  i").classList.remove('animated');
            }
        }
    } 

    async requestRecord(){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = this.changedProperties[element.id];
            formdata.append(element.id, element.value);
         });
  
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('currentRole',role);

        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/addRecord.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.requestRecord();
                }
                else{
                    alert("σφάλμα εξουσιοδότησης");
                }
            }
            else if (res.status==403){
                alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
            }
            else if (res.status==404){
                alert("το αρχείο δε βρέθηκε");
            }
            else if (res.status==500){
                alert("Εσωτερικό σφάλμα. Επικοινωνήστε με το διαχειριστή");
            }
            else{
                alert("Σφάλμα!!!");
            }
        }
        else{
            const resdec = await res.json();
            console.log(resdec['message']);
            if (resdec['success']){
                alert("επιτυχής αίτηση εγγραφής");
                this.shadow.getElementById('saveRecordButton').classList.remove('active');
                this.shadow.querySelector("#saveRecordButton  i").classList.remove('faa-shake');
                this.shadow.querySelector("#saveRecordButton  i").classList.remove('animated');
            }
        }
    } 
}

customElements.define("record-add", AddRecord);