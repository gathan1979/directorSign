import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

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
            border-radius : 5px;
            height : 2em;
        }

        #editFormDiv{
            display:flex;
            flex-direction : column;
            gap: 10px;
        }

    </style>
    <link href="css/all.css" rel="stylesheet">
    <div class="flexHorizontal">
        <span style="font-weight:bold;padding:5px;">Επεξεργασία Εγγραφής</span>
    </div>

    <div class="customDialogContent" style="margin-top:10px;">
        <form id="editRecordForm">
            <div id="editFormDiv">
                <div class="formRow">
                    <label class="formItem" for="aaField" class="col-sm-2 col-form-label">AA*</label>
                    <input class="formInput" required=""  type="number" step="1" class="form-control" id="aaField" disabled="">
                </div>
                <div class="formRow">   
                    <label class="formItem" for="fromField" class="col-sm-2 col-form-label">ΑΠΟΣΤΟΛΕΑΣ*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="fromField" disabled="">
                </div>
                <div class="formRow">    
                    <label class="formItem" for="subjectField" class="col-sm-2 col-form-label">ΘΕΜΑ*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="subjectField" disabled="">
                </div>
                <div class="formRow">
                    <label class="formItem" for="docDate" class="col-sm-2 col-form-label">ΗΜΕΡ. ΠΑΡΑΛ.*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="docDate" disabled="">
                </div>
                <div class="formRow">    
                    <label class="formItem" for="docNumber" class="col-sm-2 col-form-label">ΑΡΙΘΜ. ΕΙΣ.*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="docNumber">
                </div>
                <hr style="width : 100%;border:4px solid orange; border-radius: 2px;">
                <div class="formRow">    
                    <label class="formItem" for="toField" class="col-sm-2 col-form-label">ΠΡΟΣ*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="toField">
                </div>
                <div class="formRow">   
                    <label class="formItem" for="outSubjectField" class="col-sm-2 col-form-label">ΘΕΜΑ ΕΞΕΡΧ.*</label>
                    <input class="formInput" required=""  type="text" class="form-control" id="outSubjectField">
                </div>
                <div class="formRow">
                    <label class="formItem" for="outDocDate" class="col-sm-2 col-form-label">ΗΜΕΡ. ΕΞΕΡΧ.*</label>
                    <input class="formInput" required="" type="date" class="form-control" id="outDocDate">
                </div>
                <div class="formRow">    
                    <label class="formItem" for="statusField" class="col-sm-2 col-form-label">ΚΑΤΑΣΤ.*</label>
                    <input class="formInput" required="" type="number" step="1" class="form-control" id="statusField" disabled="">
                </div>
                <div class="formRow">
                    <label class="formItem" for="linkField" class="col-sm-2 col-form-label">ΣΤΟΙΧΕΙΑ EMAIL*</label>
                    <input class="formInput" required="" type="text" class="form-control" id="linkField" disabled="">
                </div>
                <div class="formRow">
                    <label class="formItem" for="insertDateField" class="col-sm-2 col-form-label">ΗΜΕΡ. ΕΙΣΑΓΩΓΗΣ*</label>
                    <input class="formInput" required="" type="date" class="form-control" id="insertDateField" disabled="">
                </div>
            </div>
        </form>
    </div>
    <div class="modal-footer">
        <?php 
        if ($_SESSION['protocolAccessLevel'] == 1){
            echo '<button id="restoreButtonModal" type="button" class="btn btn-info trn" >Restore Record</button>';	
            echo '<button id="archiveButtonModal" type="button" class="btn btn-warning trn" >Save and Archive Record</button>';	
        }
        else{
            echo '<button id="finishButtonModal" type="button" class="btn btn-warning trn" >Close Record</button>';
        }
        ?>
        <button id="saveButtonModal" type="button" class="btn btn-sm btn-success">Save Record</button>
        <button id="editButtonModal" type="button" class="btn btn-sm btn-success" >Save Changes</button>
        <button id="closeButtonModal" type="button" class="btn btn-sm btn-secondary" data-dismiss="modal">Close</button>
    </div>`;


class EditRecord extends HTMLElement {
    protocolNo;   
    protocolYear;
    shadow;
    protocolProperties;  //{assignedTo : null, type: null}
    changedProperties;

    constructor() {
        super();
    }

    async connectedCallback(){
        const loginData = JSON.parse(localStorage.getItem("loginData"));
	    const currentRoleObject = loginData.user.roles[localStorage.getItem("currentRole")];
        //console.log(currentRoleObject);
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = assignmentsContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; 
        //this.shadow.querySelector("#assignments").innerHTML = employeesTree;

        const propertiesArrFromDb = await this.getRecord(this.protocolNo, this.protocolYear);
        this.protocolProperties = propertiesArrFromDb.map((item)=>{
            const charge = {assignedTo : item.assignedToUser, type: Number(item.typeOfAssignment)};
            return charge;
        });
        console.log(this.protocolCharges);
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

        //Listeners πάνω κουμπιών
        this.shadow.querySelector("#saveAssignmentButton").addEventListener("click",()=>this.saveAssignments());
        this.shadow.querySelector("#addNotificationButton").addEventListener("click",()=>this.selectAllforNotification());
        this.shadow.querySelector("#deselectUsersButton").addEventListener("click",()=>this.deselectAllAssignments());
        this.shadow.querySelector("#undoUsersButton").addEventListener("click",()=>this.undoUserChanges());

        //Απενεργοποίηση εργαζομένων ανάλογα με δικαιώματα επεξεργασίας χρεώσεων currentRoleObject
        if (currentRoleObject.protocolAccessLevel == 1){
            // Προς το παρόν δεν κάνει κάτι
        }
        else if (currentRoleObject.accessLevel == 1){
            // ενεργοποίηση μόνο για τμήμα
            this.shadow.querySelectorAll(".departmentEmployees>button").forEach((element,index)=> {
                if (element.parentNode.parentNode.dataset.dep == currentRoleObject.department){
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


    async saveAssignments(){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('charges',JSON.stringify(this.selectedCharges));
        formdata.append('oldCharges',JSON.stringify(this.protocolCharges));
        formdata.append('currentRole',role);
        
        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/saveAssignments.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.saveAssignments();
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
                alert("επιτυχής ανανέωση φακέλων αρχειοθέτησης");
                this.shadow.getElementById('saveFoldersButton').classList.remove('active');
                this.shadow.querySelector("#saveFoldersButton  i").classList.remove('faa-shake');
                this.shadow.querySelector("#saveFoldersButton  i").classList.remove('animated');
            }
        }
    } 
}

customElements.define("record-edit", EditRecord);