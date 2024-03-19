import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const assignmentsContent = `
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
            opacity: 0.5;
            pointer-events: none;
        }
        
        .undo{
            background-color : cadetblue;
        }


    </style>
    <link href="css/all.css" rel="stylesheet">
    <div class="thirdBottomSectionColumn" id="assignmentsDiv">
        <div style="padding:10px;display:flex;gap:5px;background: rgba(155, 130, 136, 0.2)!important;">	
            <button id="saveAssignmentButton" title="Αποθήκευση αλλαγών" type="button" class="isButton"><i class="far fa-save"></i></button>
            <button id="addNotificationButton" style="background-color:chocolate;" title="Κοινοποίηση σε όλους" type="button" class="isButton"><i class="far fa-bell"></i></button>
            <button id="deselectUsersButton"  style="background-color:chocolate;" title="Αποεπιλογή όλων" type="button" class="isButton"><i class="fas fa-user-slash"></i></button>
            <button id="undoUsersButton" title="Αναίρεση αλλαγών" type="button" class="isButton undo"><i class="fas fa-undo"></i></button>
            <div style="background-color: var(--bs-success);font-size:0.7em;padding:2px;border-radius:5px;align-self:flex-end;color:white;">Χρέωση</div>
            <div style="background-color: var(--bs-blue);font-size:0.7em;padding:2px;border-radius:5px;align-self:flex-end;color:white;">Κοιν.</div>
        </div>
        <div id="assignmentsTitle" style="color: DarkRed;font-size: 12px;">Χρεώσεις</div>
        <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
        <div class="col-12" id="assignments" name="assignments" style="padding:0.5em;background: rgba(155, 130, 136, 0.2)!important;">
            <div id="assignmentsToAbsent" style="background: rgba(155, 130, 136, 0.2)!important;">';
            </div>';
        </div>
    </div>`;


class Assignments extends HTMLElement {
    static observedAttributes = ["timestamp"];

    protocolNo;   
    protocolYear;
    shadow;
    protocolCharges;  //{assignedTo : null, type: null}
    selectedCharges;

    constructor() {
        super();
    }

    attributeChangedCallback(name, oldValue, newValue){
        //console.log("attribute changed");
        this.getChargesAndFill();
    }

    // Ο πίνακας assignments δουλεύει με το ΑΑ του STAFF
    async connectedCallback(){
       
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
        //console.log(currentRoleObject);
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = assignmentsContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; 
        let employeesTree = null;
        if (localStorage.getItem("employeesTree") !== null){
            employeesTree = JSON.parse(localStorage.getItem("employeesTree"));
        }
        else{
            employeesTree = await this.getEmployeesTree();
        }
        this.shadow.querySelector("#assignments").innerHTML = employeesTree;
        //Φόρτωση χρεώσεων και εμφάνιση
        await this.getChargesAndFill();
        //Πτυσσόμενα μενού τμημάτων
        this.shadow.querySelectorAll(".departmentTitle").forEach(element => {
            if (element.dataset.opened == 0){
                element.firstChild.innerHTML = '<i style="margin-right:10px;" class="far fa-folder"></i>';
            }
            else if (element.dataset.opened == 1){
                element.firstChild.innerHTML = '<i style="margin-right:10px;" class="far fa-folder-open"></i>';
            }
            element.addEventListener("click",(event)=>{
                if (element.nextElementSibling.style.display == "none"){
                    element.nextElementSibling.style.display = "flex";
                    element.firstChild.innerHTML = '<i style="margin-right:10px;" class="far fa-folder-open"></i>';
                }
                else{
                    element.nextElementSibling.style.display = "none";
                    element.firstChild.innerHTML = '<i style="margin-right:10px;" class="far fa-folder"></i>';
                }
            })
        });

        //Listeners πάνω κουμπιών
        this.shadow.querySelector("#saveAssignmentButton").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#addNotificationButton").addEventListener("click",()=>this.selectAllforNotification());
        this.shadow.querySelector("#deselectUsersButton").addEventListener("click",()=>this.deselectAllAssignments());
        this.shadow.querySelector("#undoUsersButton").addEventListener("click",()=>this.undoUserChanges());

        let departmentChildren = await this.getDepartmentChildren();
        departmentChildren.push(currentRoleObject.department);
        //Απενεργοποίηση εργαζομένων ανάλογα με δικαιώματα επεξεργασίας χρεώσεων currentRoleObject
        if (currentRoleObject.protocolAccessLevel == 1){
            // Προς το παρόν δεν κάνει κάτι
        }
        else if (currentRoleObject.accessLevel == 1){
            // ενεργοποίηση μόνο για τμήμα
            this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
                if (departmentChildren.includes(element.parentNode.parentNode.dataset.dep)){
                    element.removeAttribute("disabled");
                }
                else{
                    element.setAttribute("disabled","disabled");
                }
            });
        }
        else{
            // απενεργοποίηση όλων
            this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
                element.setAttribute("disabled","disabled");
            });
        }
    }

    disconnectedCallback() {
    
    }

    selectAllforNotification(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];    
        if (currentRoleObject.protocolAccessLevel == 1){
            this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
                element.dataset.charge = 1;
                element.dataset.chargeType = 0;
                element.classList.remove("active");
                element.classList.add("notification");
            })
        }
        else if (currentRoleObject.accessLevel == 1){
            this.shadow.querySelectorAll(".departmentDiv[data-dep='"+currentRoleObject.department+"'] .departmentEmployees>button").forEach((element,index)=> {
                element.dataset.charge = 1;
                element.dataset.chargeType = 0;
                element.classList.remove("active");
                element.classList.add("notification");
            })
        }
        this.updateSelectedCharges();
    };

    deselectAllAssignments(){
        this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
            element.dataset.charge = 0;
            element.dataset.chargeType = 0;
            element.classList.remove("active");
            element.classList.remove("notification");
        });
        this.updateSelectedCharges();
    }

    undoUserChanges(){
        this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
            //console.log(element);
            const found = this.protocolCharges.find(el => el.assignedTo == element.dataset.user);    
            if (found !== undefined){
                element.dataset.charge = 1;
                element.dataset.chargeType = found.type;
                if (found.type == "0"){
                    element.classList.add("notification");
                }
                else{
                    element.classList.add("active");
                }
            }
            else{
                element.dataset.charge = 0;
                element.dataset.chargeType = 0;
                element.classList.remove("active");
                element.classList.remove("notification");
            }
        }); 
        this.updateSelectedCharges();
    }

    updateSelectedCharges(){
        //update selected charges  {assignedTo : null, type: null};
        this.selectedCharges= [];
        this.selectedCharges = Array.from(this.shadow.querySelectorAll(".departmentEmployees>button")).map((element,index)=>{ 
                if (element.dataset.charge == 1){
                    if (element.dataset.chargeType == 1){
                        return {assignedTo :element.dataset.user, type: 1};
                    }
                    else{
                        return {assignedTo :element.dataset.user, type: 0};    
                    }
                }
                else{
                    return null;
                }
            }).filter(item=>{if (item == null){return 0;}else{return 1;}});

        if (this.protocolCharges.sort((a,b) =>{ if (Number(a.assignedTo) > Number(b.assignedTo)){ return 1;}else{return 0;}}).toString() == this.selectedCharges.sort((a,b) =>{ if (Number(a.assignedTo) > Number(b.assignedTo)){ return 1;}else{return 0;}}).toString()){
            console.log("no change to charges");
            this.shadow.getElementById('saveAssignmentButton').classList.remove('active');
            this.shadow.querySelector("#saveAssignmentButton  i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveAssignmentButton  i").classList.remove('animated');
        }  
        else{
            if (!this.shadow.getElementById('saveAssignmentButton').classList.contains('active')){
                this.shadow.getElementById('saveAssignmentButton').classList.add('active');
                this.shadow.querySelector("#saveAssignmentButton  i").classList.add('faa-shake');
                this.shadow.querySelector("#saveAssignmentButton  i").classList.add('animated');
            }
        }
        //console.log(this.protocolCharges);
        //console.log("---------------")
        //console.log(this.selectedCharges);
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


    async getEmployeesTree(){
        const res = await runFetch("/api/getEmployeesTree.php", "GET", null);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            localStorage.setItem("employeesTree",JSON.stringify(resdec));
            return resdec;
        }    
    }


    async getChargesAndFill(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
        let isRead = 0;
        const chargesArrFromDb = await this.getCharges(this.protocolNo, this.protocolYear);
        if (chargesArrFromDb === null){
            return;
        }
        
        this.protocolCharges = chargesArrFromDb.map((item)=>{
            const charge = {assignedTo : item.assignedToUser, type: Number(item.typeOfAssignment)};
            if ((item.assignedToUser == loginData.user.aa_staff) && (item.isRead == 1)){
                isRead = 1;        
            }
            return charge;
        });
        if (!isRead){
            const formdata = new FormData();
            formdata.append('protocolNo',this.protocolNo);
            formdata.append('currentYear',this.protocolYear);
            const res = await runFetch("/api/makeMessageRead.php", "POST", formdata);
            if (!res.success){
                console.log(res.msg);
            }
            else{
                //const resdec = res.result;
                document.querySelector(`div [data-record="${this.protocolNo}"]`).dataset.isread = 1;
            }  
        }
        //console.log(this.protocolCharges);
        this.selectedCharges = [...this.protocolCharges];
        //console.log(this.shadow.querySelectorAll(".departmentEmployees>button"));
        this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
            //console.log(element);
            const found = this.protocolCharges.find(el => el.assignedTo == element.dataset.user);    
            if (found !== undefined){
                element.dataset.charge = 1;
                element.dataset.chargeType = found.type;
                if (found.type == "0"){
                    element.classList.add("notification");
                }
                else{
                    element.classList.add("active");
                }
            }
            else{
                element.classList.remove("active");
                element.classList.remove("notification");
            }
            element.addEventListener("click",(event)=>{this.changeAssignmentStatus(element.dataset.user)})
            //this.shadow.querySelector(".customDialogContent").innerHTML += '<div><b>'+element.innerText+"</b> : "+element.title+'</div>';
        });
    }

    async getCharges(protocolNo){
        let urlparams = new URLSearchParams({protocolNo, currentYear : this.protocolYear});
        const res = await runFetch("/api/getCharges.php", "GET", urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            return null;
        }
        else{
            return res.result;
        }    
    }

    async getDepartmentChildren(){
        const res = await runFetch("/api/getDepsDown.php", "GET");
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            return null;
        }
        else{
            return res.result['result'];
        }    
    }


    async saveAssignments(){
        const formdata = new FormData();
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('charges',JSON.stringify(this.selectedCharges));
        formdata.append('oldCharges',JSON.stringify(this.protocolCharges));
        
        const res = await runFetch("/api/saveAssignments.php", "POST", formdata);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            if (resdec['success']){
                this.shadow.getElementById('saveAssignmentButton').classList.remove('active');
                this.shadow.querySelector("#saveAssignmentButton  i").classList.remove('faa-shake');
                this.shadow.querySelector("#saveAssignmentButton  i").classList.remove('animated');
                const historyRefreshEvent = new CustomEvent("historyRefreshEvent",  { bubbles: true, cancelable: false, composed: true });
                this.dispatchEvent(historyRefreshEvent);

                const chargesArrFromDb = await this.getCharges(this.protocolNo, this.protocolYear);
                if (chargesArrFromDb === null){
                    return;
                }
                this.protocolCharges = chargesArrFromDb.map((item)=>{
                    const charge = {assignedTo : item.assignedToUser, type: Number(item.typeOfAssignment)};
                    return charge;
                });
            }
        }
    } 
}

customElements.define("record-assignments", Assignments);