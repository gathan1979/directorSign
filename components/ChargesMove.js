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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
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
        <span style="font-weight:bold;">Μεταφορά χρεώσεων</span>
        <div class="topButtons" style="display:flex;gap: 7px;">
            <button id="saveRecordBtn" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
            <button class="isButton " name="closeAddModalBtn" id="closeAddModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
    </div>
    <div class="customDialogContent" style="margin-top:10px;">
        <form id="chargesMoveForm">
            <div id="chargesMoveFormDiv">
                <div style="background-color:lightgray;padding: 0.3em;">
                    <div class="flexHorizontal" style="background-color:lightgray;gap:1em;">   
                        <label class="formItem" style="flex-basis:200px;font-weight:bold;">ΜΕΤΑΦΟΡΑ ΑΠΟ ΧΡΗΣΤΗ</label>
                        <select class="formInput" id="moveFromUserBtn"></select>
                    </div>
                    <div class="flexHorizontal" style="background-color:lightgray;gap:1em;">    
                        <label class="formItem" style="flex-basis:200px;font-weight:bold;">ΚΑΙ ΑΠΟ ΡΟΛΟ</label>
                        <select class="formInput"  id="moveFromUserRoleBtn" ></select>
                    </div>
                </div>
                <div style="background-color:aliceblue; padding: 0.3em; margin-top:1em">
                    <div class="flexHorizontal" style="background-color:aliceblue;gap:1em;">
                        <label class="formItem" style="flex-basis:200px;font-weight:bold;">ΜΕΤΑΦΟΡΑ ΣΕ ΧΡΗΣΤΗ</label>
                        <select class="formInput"  id="moveToUserBtn" ></select>
                    </div>
                    <div class="flexHorizontal" style="background-color:aliceblue;gap:1em;">    
                        <label class="formItem" style="flex-basis:200px;font-weight:bold;">ΚΑΙ ΣΕ ΡΟΛΟ</label>
                        <select class="formInput"  id="moveToUserRoleBtn" ></select>
                    </div>
                </div>
                <div>
                    <label class="formItem" style="flex-basis:200px;font-weight:bold;">ΔΙΑΓΡΑΦΗ ΧΡΕΩΣΕΩΝ ΑΠΟ ΑΡΧΙΚΟ ΧΡΗΣΤΗ</label>
                    <input type="checkbox" id="cutCharges">
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
    </div>`;


class ChargesMove extends HTMLElement {
    static observedAttributes = ["timestamp"];
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

        //Συμπλήρωση των πτυσσόμενων μενού
        const users = await this.getUsers(1);
        const newOption1 = new Option("", 0, true);
        this.shadow.querySelector("#moveFromUserBtn").add(newOption1);
        const newOption2 = new Option("", 0, true);
        this.shadow.querySelector("#moveToUserBtn").add(newOption2);
        users.forEach( elem => {
            const newOption1 = new Option(elem.fullName, elem.aa);
            this.shadow.querySelector("#moveFromUserBtn").add(newOption1);
            const newOption2 = new Option(elem.fullName, elem.aa);
            this.shadow.querySelector("#moveToUserBtn").add(newOption2);
        })
        //-------------------------------------------------------
        //Προσθήκη listeners
        this.shadow.querySelector("#moveFromUserBtn").addEventListener("change", async () =>{
            const selectedValue = this.shadow.querySelector("#moveFromUserBtn").value;
            this.shadow.querySelector("#moveFromUserRoleBtn").innerHTML = "";
            if (selectedValue >0){
                const newOption1 = new Option("", 0, true);
                this.shadow.querySelector("#moveFromUserRoleBtn").add(newOption1);
                const roles = await this.getUserRoles(selectedValue);
                roles.forEach( elem => {
                    const newOption = new Option(elem.roleName, elem.aa);
                    this.shadow.querySelector("#moveFromUserRoleBtn").add(newOption);
                })
            }
            this.checkSelected();
        })
        this.shadow.querySelector("#moveToUserBtn").addEventListener("change", async () =>{
            const selectedValue = this.shadow.querySelector("#moveToUserBtn").value;
            this.shadow.querySelector("#moveToUserRoleBtn").innerHTML = "";
            if (selectedValue >0){
                const newOption1 = new Option("", 0, true);
                this.shadow.querySelector("#moveToUserRoleBtn").add(newOption1);
                const roles = await this.getUserRoles(selectedValue);
                roles.forEach( elem => {
                    const newOption = new Option(elem.roleName, elem.aa);
                    this.shadow.querySelector("#moveToUserRoleBtn").add(newOption);
                })
            }
            this.checkSelected();    
        })

        this.shadow.querySelector("#moveFromUserRoleBtn").addEventListener("change", ()=> this.checkSelected());
        this.shadow.querySelector("#moveToUserRoleBtn").addEventListener("change", ()=> this.checkSelected());

        this.shadow.querySelector("#closeAddModalBtn").addEventListener("click", ()=>{
            this.parentElement.close();
        });
        
        this.shadow.querySelector("#saveRecordBtn").addEventListener("click",()=>this.moveCharges());
        //-------------------------------------------------------
    }

    attributeChangedCallback(name, oldValue, newValue){
        this.clearAll();
    }

    clearAll(){
        this.shadow.querySelector("#moveToUserRoleBtn").value = 0;
        this.shadow.querySelector("#moveFromUserRoleBtn").value = 0;
        this.shadow.querySelector("#moveToUserBtn").value = 0; 
        this.shadow.querySelector("#moveFromUserBtn").value = 0;
        this.shadow.getElementById('saveRecordBtn').classList.remove('active');
        this.shadow.querySelector("#saveRecordBtn  i").classList.remove('faa-shake');
        this.shadow.querySelector("#saveRecordBtn  i").classList.remove('animated');
        this.shadow.querySelector("#cutCharges").checked = false; 
        
    }

    checkSelected(){
        let result = true;
        if (+this.shadow.querySelector("#moveToUserRoleBtn").value <=0){
            result = false;
        }  
        if (+this.shadow.querySelector("#moveFromUserRoleBtn").value <=0){
            result = false;
        }  
        if (+this.shadow.querySelector("#moveToUserBtn").value <=0){
            result = false;
        }  
        if (+this.shadow.querySelector("#moveFromUserBtn").value <=0){
            result = false;
        }  

        if (+this.shadow.querySelector("#moveToUserBtn").value == +this.shadow.querySelector("#moveFromUserBtn").value){
            result = false;
        }
        if (result){
            this.shadow.getElementById('saveRecordBtn').classList.add('active');
            this.shadow.querySelector("#saveRecordBtn  i").classList.add('faa-shake');
            this.shadow.querySelector("#saveRecordBtn  i").classList.add('animated');
        }
        else{
            this.shadow.getElementById('saveRecordBtn').classList.remove('active');
            this.shadow.querySelector("#saveRecordBtn  i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveRecordBtn  i").classList.remove('animated');
        }
        return result;
    }
    
    async moveCharges(){
        const formdata = new FormData();
        formdata.append("toUserRole",+this.shadow.querySelector("#moveToUserRoleBtn").value);
        formdata.append("fromUserRole",+this.shadow.querySelector("#moveFromUserRoleBtn").value);
        formdata.append("toUser",+this.shadow.querySelector("#moveToUserBtn").value);
        formdata.append("fromUser",+this.shadow.querySelector("#moveFromUserBtn").value);
        if (+this.shadow.querySelector("#cutCharges").checked == 1){
            const conf = confirm("Προσοχή. Πρόκειται να διαγράψετε τις ενεργές χρεώσεις του αρχικού χρήστη");
            if (conf == false){
                return;
            }
            formdata.append("cutCharges",1);
        }
        else{
            formdata.append("cutCharges",0);
        }

        const res = await runFetch("/api/moveCharges.php","POST",formdata);
        if (!res.success){
            alert("Αποτυχία μεταφοράς χρεώσεων. "+ res.msg);
        }
        else{
            const resdec = res.result;
            alert(res.msg);
            this.parentElement.close(); 
            return;
            // const RefreshProtocolFilesEvent = new CustomEvent("RefreshProtocolFilesEvent", { bubbles: true, cancelable: false, composed: true });
            // this.dispatchEvent(RefreshProtocolFilesEvent);
            // this.parentElement.close(); 
        }
    } 

    async getUsers(type){
        const urlData = new URLSearchParams();
        urlData.append("type", type);
        const res = await runFetch("/api/getUsers.php","GET",urlData);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            return resdec.users;
        }
    }

    async getUserRoles(user){
        const urlData = new URLSearchParams();
        urlData.append("user", user);
        const res = await runFetch("/api/getUserRoles.php","GET",urlData);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            return resdec.roles;
        }
    }

}

customElements.define("charges-move", ChargesMove);