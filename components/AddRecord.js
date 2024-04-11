import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

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
            background-color : gray;
            color: white;
            padding:10px;
            display: flex;
            justify-content: space-between;
            gap: 10px;
            border-radius: 0px;
            margin-bottom:10px;
            align-items: center;
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
    <link rel="stylesheet" type="text/css" href="/directorSign/css/custom.css" />


    <div class="customDialogContentTitle">
        <span style="font-weight:bold;">Νέα Εγγραφή</span>
        <div class="topButtons" style="display:flex;gap: 7px;">
            <button id="saveRecordBtn" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
            <button id="undoBtn" title="Εκκαθάριση πεδίων" type="button" class="isButton"><i class="fas fa-undo"></i></button>
            <button class="isButton " name="closeAddModalBtn" id="closeAddModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
    </div>
    <div class="customDialogContent" style="margin-top:10px;">
        <form id="addRecordForm">
            <div id="addFormDiv">
                <div class="flexHorizontal" style="background-color:white;">   
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΑΠΟΣΤΟΛΕΑΣ</label>
                    <input class="formInput" required=""  type="text"  id="fromField" disabled="">
                </div>
                <div class="flexHorizontal" style="background-color:white;">    
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΘΕΜΑ</label>
                    <textarea class="formInput" required=""  type="text"  id="subjectField" disabled=""></textarea>
                </div>
                <div class="flexHorizontal" style="background-color:white;">
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΗΜΕΡ. ΠΑΡΑΛ.</label>
                    <input class="formInput" required=""  type="datetime-local"  id="docDate" disabled="">
                </div>
                <div class="flexHorizontal" style="background-color:white;">    
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΑΡΙΘΜ. ΕΙΣ.</label>
                    <input class="formInput" required=""  type="text"  id="docNumber">
                </div>
                <hr style="width : 100%;border:4px solid orange; border-radius: 2px;">
                <div class="flexHorizontal" style="background-color:white;">    
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΠΡΟΣ</label>
                    <input class="formInput" required=""  type="text"  id="toField">
                </div>
                <div class="flexHorizontal" style="background-color:white;">   
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΘΕΜΑ ΕΞΕΡΧ.</label>
                    <input class="formInput" required=""  type="text"  id="outSubjectField">
                </div>
                <div class="flexHorizontal" style="background-color:white;">
                    <label class="formItem" style="flex-basis:150px;font-weight:bold;">ΗΜΕΡ. ΕΞΕΡΧ.</label>
                    <input class="formInput" required="" type="date"  id="outDocDate">
                </div>
                <div class="flexHorizontal" style="background-color:white;">
                    <label style="flex-basis:150px;font-weight:bold;">ΑΠΟΣΤΟΛΗ ΑΠΟΔΕΙΚΤΙΚΟΥ</label>
                    <input  type="text" id="proofRecipient" style="flex-grow:1;" placeholder="Email για αποστολή αποδεικτικού">
                    <input  type="checkbox" id="proofSendCheckbox" >
                </div>
             </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
    </div>`;


class AddRecord extends HTMLElement {

    static observedAttributes = ["timestamp"];

    protocolNo;   
    protocolYear;
    shadow;
    protocolProperties;  
    changedProperties;

    constructor() {
        super();
    }

    async connectedCallback(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
        //console.log(currentRoleObject);
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = addContent;
        this.protocolProperties ={};
        this.clearInputs();
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            this.protocolProperties[element.id] = element.value;
        });
        console.log(this.protocolProperties);
        this.changedProperties = {...this.protocolProperties};
        //console.log(this.shadow.querySelectorAll(".departmentEmployees>button"));

        //ενεργοποίηση ανάλογα με την ιδιότητα
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
           if (currentRoleObject.protocolAccessLevel == 1){
                element.removeAttribute("disabled");
           }
           if (element.type == "date"){
                element.addEventListener("change", (event) => this.updateChangedProperties(event)); 
           }
           else{
                element.addEventListener("keyup", (event) => this.updateChangedProperties(event)); 
           }
        });

        this.setDocDate();
 
        this.shadow.querySelector("#closeAddModalBtn").addEventListener("click", ()=>{
            this.clearInputs();
            this.parentElement.close();
        });

        //Listeners πάνω κουμπιών
        //this.shadow.querySelector("#archiveButtonModal").addEventListener("click",()=>this.saveAssignments());
        //this.shadow.querySelector("#restoreButtonModal").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#saveRecordBtn").addEventListener("click",()=>this.addRecord());
        this.shadow.querySelector("#undoBtn").addEventListener("click",()=>this.clearFields());
    }

    clearInputs(){
        this.shadow.getElementById('saveRecordBtn').classList.remove('active');
        this.shadow.querySelector("#saveRecordBtn  i").classList.remove('faa-shake');
        this.shadow.querySelector("#saveRecordBtn  i").classList.remove('animated');
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            if (element.type == "date"){
                element.value = "0000-00-00";
                return;
            }
            if (element.type == "datetime-local"){
                this.setDocDate();
                return;
            }
            element.value = "";
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name=="timestamp"){
            this.clearInputs();
        }
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
        console.log(this.changedProperties)
    }


    clearFields(){
        this.clearInputs();
        this.updateChangedProperties();
    }

    setDocDate(){
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        this.shadow.getElementById('docDate').value = now.toISOString().slice(0,16);
    }

    // async getRecord(protocolNo){
    //     const {jwt,role} = getFromLocalStorage();
    //     const myHeaders = new Headers();
    //     myHeaders.append('Authorization', jwt);
    //     let urlparams = new URLSearchParams({protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
    //     let init = {method: 'GET', headers : myHeaders};
    //     const res = await fetch("/api/getRecord.php?"+urlparams,init);
    //     if (!res.ok){
    //         const resdec = res.json();
    //         if (res.status ==  401){
    //             const resRef = await refreshToken();
    //             if (resRef ==1){
    //                 this.getCharges(protocolNo);
    //             }
    //             else{
    //                 alert("σφάλμα εξουσιοδότησης");
    //             }
    //         }
    //         else if (res.status==403){
    //             alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
    //         }
    //         else if (res.status==404){
    //             alert("το αρχείο δε βρέθηκε");
    //         }
    //         else{
    //             alert("Σφάλμα!!!");
    //         }
    //     }
    //     else{
    //         const resdec = await res.json();
    //         return resdec;
    //     }    
    // }


    async addRecord(){
        //const {jwt,role} = getFromLocalStorage();
        // myHeaders = new Headers();
        //myHeaders.append('Authorization', jwt);
        let Procotol_EMAIL_token = null;
        if (this.shadow.querySelector("#proofSendCheckbox").checked){
            Procotol_EMAIL_token= localStorage.getItem("Procotol_EMAIL_token");
            if (Procotol_EMAIL_token == null){
                alert("Δεν υπάρχουν στοιχεία σύνδεσης στο email");
                return;
            }
        }

        const formdata = new FormData();
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = this.changedProperties[element.id];
            formdata.append(element.id, element.value);
        });
        //formdata.append('protocolNo',this.protocolNo);
        //formdata.append('protocolYear',this.protocolYear);
        //formdata.append('currentRole',role);

        //let init = {method: 'POST', headers : myHeaders, body :formdata};
        //const res = await fetch("/api/addProtocolRecord.php",init);
        const res = await runFetch("/api/addProtocolRecord.php","POST",formdata);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            //console.log(resdec['message']);
            if (this.shadow.querySelector("#proofSendCheckbox").checked){
                const postData = new FormData();
                postData.append("record", resdec['newRecordNo']);
                postData.append("proofRecipient", this.shadow.querySelector('#proofRecipient').value);
                postData.append("Procotol_EMAIL_token", Procotol_EMAIL_token);
                const res = await runFetch("/api/sendProof.php","POST",postData);
                if (!res.success){
                    alert("Eπιτυχής εισαγωγή εγγραφής. Η αποστολή αποδεικτικού απέτυχε!");
                }
                else{
                    alert("Επιτυχής εισαγωγή εγγραφής και αποστολή αποδεικτικού");
                }
            }
            else{
                alert("Επιτυχής εισαγωγή εγγραφής");
            }
            this.clearInputs();
            const RefreshProtocolFilesEvent = new CustomEvent("RefreshProtocolFilesEvent", { bubbles: true, cancelable: false, composed: true });
            this.dispatchEvent(RefreshProtocolFilesEvent);
            this.parentElement.close(); 
        }
    } 
}

customElements.define("record-add", AddRecord);