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
        <span style="font-weight:bold;">Νέο αίτημα πρόσβασης</span>
        <div class="topButtons" style="display:flex;gap: 7px;">
            <button id="saveRecordBtn" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
            <button id="clearBtn" title="Αναίρεση αλλαγών" type="button" class="isButton undo"><i class="fas fa-undo"></i></button>
            <button class="isButton " name="closeEditModalBtn" id="closeEditModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
    </div>
    <div class="customDialogContent" style="margin-top:10px;">
        <form id="addRecordForm">
            <div id="addFormDiv">
                <div class="formRow">    
                    <label class="formItem" for="protocolField">Αρ.πρωτ.</label>
                    <input class="formInput" required=""  type="number"  id="protocolField" ></input>
                </div>
                <div class="formRow">    
                    <label class="formItem" for="folderField">Φάκελος πρόσβασης</label>
                    <select class="formInput" required=""  id="folderField" ></select>
                </div>
                <div class="formRow">    
                    <label class="formItem" for="yearField">Έτος</label>
                    <select class="formInput" required=""  id="yearField" ></select>
                </div>
                <div class="formRow">    
                    <label class="formItem" for="causeField">Αιτιολογία</label>
                    <textarea class="formInput" required=""  type="text"  id="causeField" ></textarea>
                </div>
            </div>
        </form>
    </div>
    <div id="searchProtocolRes"></div>
    <div class="modal-footer">
    </div>`;


class RequestRecordAccess extends HTMLElement {
    shadow;
    timer = null;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = addContent;
        
        this.shadow.querySelector("#closeEditModalBtn").addEventListener("click", ()=>{
            this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
                element.value = "";
            });   
            this.shadow.getElementById('saveRecordBtn').classList.remove('active');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('animated'); 
            this.parentElement.close();
        });
        
        //Δημιουργία επιλογών φακέλων
        this.shadow.querySelector("#folderField").innerHTML = "";
        this.shadow.querySelector("#folderField").innerHTML += `<option selected value='0'></option>`;
        const folderArray = await this.getFolderList();

        folderArray.forEach( elem => {
            this.shadow.querySelector("#folderField").innerHTML += `<option value='${elem[0]}'>${elem[1]}</option>`;
        })

        //Δημιουργία επιλογών ετών
        this.shadow.querySelector("#yearField").innerHTML = "";
        this.shadow.querySelector("#yearField").innerHTML += `<option selected value='0'></option>`;
        const yearArray = await this.getActiveYears();

        yearArray.forEach( elem => {
            this.shadow.querySelector("#yearField").innerHTML += `<option value='${elem[0]}'>${elem[0]}</option>`;
        })

        //Listeners πεδίων
        this.shadow.querySelector("#folderField").addEventListener("change", ()=>{
            this.checkStatus();
        })
        this.shadow.querySelector("#protocolField").addEventListener("keyup", () =>{
            this.checkStatus();
        })
        this.shadow.querySelector("#protocolField").addEventListener("change", () =>{
            this.checkStatus();
        })
 

        //Listeners πάνω κουμπιών
        //this.shadow.querySelector("#archiveButtonModal").addEventListener("click",()=>this.saveAssignments());
        //this.shadow.querySelector("#restoreButtonModal").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#saveRecordBtn").addEventListener("click",()=>{ this.requestRecordAccess(); });
        this.shadow.querySelector("#clearBtn").addEventListener("click",()=>this.clearChanges());
    }


    disconnectedCallback() {
    
    }

    checkStatus(){
        //console.log(this.shadow.querySelector("#folderField").value,this.shadow.querySelector("#protocolField").value)
        if (this.shadow.querySelector("#folderField").value==0 && this.shadow.querySelector("#protocolField").value==""){
            this.resetSaveBtn();
            return 0;
        }
        else{
            this.setSaveBtn();
            return 1;
        }
    }

    async resetSaveBtn(){
        this.shadow.querySelector("#saveRecordBtn>i").classList.remove("faa-shake");
        this.shadow.querySelector("#saveRecordBtn>i").classList.remove("animated");
        this.shadow.querySelector("#saveRecordBtn").classList.remove("active");
    }

    async setSaveBtn(){
        this.shadow.querySelector("#saveRecordBtn>i").classList.add("faa-shake");
        this.shadow.querySelector("#saveRecordBtn>i").classList.add("animated");
        this.shadow.querySelector("#saveRecordBtn").classList.add("active");
    }

    async getFolderList(){
       
        const urlpar = new URLSearchParams({asList: 1});
        const res = await runFetch("/api/getFoldersList.php", "GET", urlpar);
        if (!res.success){
            console.log(res.msg);
        }
        else{
            console.log(res);
            return  res.result;
        }
    }

    async getActiveYears(){
        const res = await runFetch("/api/getActiveYears.php", "GET");
        if (!res.success){
            console.log(res.msg);
        }
        else{
            return  res.result.years;
        }
    }

    async searchProtocol(protocolNo, protocolYear = localStorage.getItem("currentYear")){
       
        const urlpar = new URLSearchParams({protocolNo, protocolYear});
        const res = await runFetch("/api/getProtocolSubject.php", "GET", urlpar);
        if (!res.success){
            console.log(res.msg);
        }
        else{
            console.log(res.result);
            return  res.result.subjectFields;
        }
    }

    clearChanges(){
        this.shadow.querySelectorAll(".formInput").forEach((element,index)=> {
            element.value = "";
        });
        this.shadow.querySelector("#searchProtocolRes").innerHTML = "";
        this.resetSaveBtn();
    }

    async requestRecordAccess(){
        //console.log(this.checkStatus());
        if (this.checkStatus()===0){
            alert("Συμπληρώστε τουλάχιστον το πρωτόκολλο ή το φάκελο πρόσβασης");
            return;
        }
        let msg = "";
        if (this.shadow.querySelector("#folderField").value !=0){
            msg += " Πρόσβαση σε φάκελο "+this.shadow.querySelector("#folderField").value+".";
        }
        if (this.shadow.querySelector("#protocolField").value !=""){
            msg += " Πρόσβαση σε πρωτόκολλο "+ this.shadow.querySelector("#protocolField").value+".";
        }
        if (this.shadow.querySelector("#yearField").value !=0){
            msg += " Η πρόσβαση αφορά το έτος "+ this.shadow.querySelector("#yearField").value+".";
        }
        else{
            msg += " Η πρόσβαση αφορά όλα τα έτη.";
        }
       
        if (!confirm(msg)){
            return;
        }

        const folderFieldValue = this.shadow.querySelector("#folderField").value==""?0:this.shadow.querySelector("#folderField").value;
        const formdata = new FormData();
        formdata.append("protocolField", this.shadow.querySelector("#protocolField").value);
        formdata.append("folderField", this.shadow.querySelector("#folderField").value);
        formdata.append("yearField", this.shadow.querySelector("#yearField").value);
        formdata.append("causeField", this.shadow.querySelector("#causeField").value);
        formdata.append("currentYear", localStorage.getItem("currentYear"));

        const res = await runFetch("/api/requestRecordAccess.php", "POST", formdata);
        if (!res.success){
            alert(res.msg);
        }
        else{    
            if (res.message !== ""){
                alert(res.msg);
            }
            else{
                alert("επιτυχής αίτηση εγγραφής");
            }
            this.shadow.getElementById('saveRecordBtn').classList.remove('active');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveRecordBtn i").classList.remove('animated');
            this.clearChanges();
            const RefreshAccessToProtocol = new CustomEvent("RefreshAccessToProtocol", { bubbles: true, cancelable: false, composed: true });
            this.dispatchEvent(RefreshAccessToProtocol);
            this.parentElement.close();
        }
    } 
}

customElements.define("record-request-access", RequestRecordAccess);