import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const eventContent = `    

    <div id="eventModule" class="isComponent" style="background: var(--my-component-dark);padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">

        <details>
            <summary>
                <span style="font-weight:bold;">Συμβάντα</span>
                <span class="badge bg-secondary" id="eventTitleBadge"></span>
            </summary>
            <div style="display:flex;gap:10px;flex-direction:column;">
                <div style="display:inline-flex;align-self:end;gap:5px;">
                    <button id="showEventModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
                </div>
                <div style="min-height: 50px; max-height: 200px; overflow-y:scroll;" id="eventTable">
        
                </div>
                <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
            </div>    
        </details>
    </div>

    <dialog id="addEventModal" class="customDialog" " style="width:500px;">
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέο Συμβάν</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <form  class="flexVertical" style="padding: 10px;">
                <div class="flexHorizontal" style="justify-content:space-between;gap:20px;">
                    <label for="insertEventField">
                        Περιγραφή  
                    </label>
                    <input type="text" id="insertEventField" style="flex-grow:1;"></input>
                </div>
                <div class="flexHorizontal" style="justify-content:space-between;">
                    <label for="insertStartDateField">
                        Έναρξη 
                    </label>
                    <input type="date" id="insertStartDateField"></input>
                </div>
                <div class="flexHorizontal" style="justify-content:space-between;">
                    <label for="insertEndDateField">
                        Λήξη
                    </label>
                    <input type="date" id="insertEndDateField"></input>
                </div>
                <button id="saveCommentBtn" type="button" class="btn-sm btn-success mb-2">Εισαγωγή</button>	
            </form>
        </div>
    </dialog>`;


class Event extends HTMLElement {
    static observedAttributes = ["timestamp"];

    protocolNo;
    protocolYear;
    shadow;
    locked;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = eventContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.locked = this.dataset.locked;
        // if (!+this.locked){
        //     this.loadEvents(this.protocolNo,1);
        //     this.shadow.querySelector("#showAddCommentModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addCommentModal").showModal());
        // }
        // else{
        //     this.loadEvents(this.protocolNo,0);
        //     this.shadow.querySelector("#showAddCommentModalBtn").style.display = "none";
        // }
        // this.shadow.querySelector("#saveCommentBtn").addEventListener("click",()=>{ 
        //     const comment = this.shadow.getElementById("insertCommentField").value; 
        //     this.saveComment(this.protocolNo, this.protocolYear, comment);
        // });
        // this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addCommentModal").close());
       
    }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldValue, newValue){
        //console.log("attribute changed");
        this.loadEvents(this.protocolNo,1);
    }
    
    async loadEvents(protocolNo, active){
        this.shadow.querySelector("#insertCommentField").value = "";
        this.shadow.querySelector("#commentsTable tbody").innerHTML = "";
        this.shadow.querySelector("#commentsSpinner").display = "inline-block"; 
        this.shadow.querySelector("#actionStatus").innerHTML = "";
      
        let urlparams = new URLSearchParams({protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});

        const res = await runFetch("/api/getComments.php", "GET", urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
        }
        else{
            const resdec = res.result;
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
            this.shadow.querySelector("#commentTableTitleBadge").textContent = resdec.length;
            let html = "";
            for (let key1=0;key1<resdec.length;key1++) {
                const commentUser = '<div style="background-color: lightgray; padding: 5px;border-radius: 5px;">'+resdec[key1]['userField']+"</div>";
                let removeComment = "";
                if (active){
                    removeComment = '<button style="margin-left:5px;" id="removeCommentBtn-'+resdec[key1]['aaField']+'" class="btn btn-sm btn-danger"><i class="far fa-minus-square"></i></button>';
                }
                const commentString = '<div>'+resdec[key1]['commentField']+(resdec[key1]['insertDateField'] !=null? " - στις <b>"+resdec[key1]['insertDateField']:"")+"</b>"+removeComment+"</div>";;
                let temp = '<tr><td><div style="display:flex; flex-direction : column;align-items:flex-start; border-left: solid;padding-left: 10px;border-color:#b5b9bd;">'+commentUser+commentString+"</div></td></tr>";
                html += temp;
            }
            this.shadow.querySelector("#commentsTable tbody").innerHTML = html;
            //onclick="removeComment('+resdec[key1]['aaField']+')"
            for (let key1=0;key1<resdec.length;key1++) {
                   this.shadow.querySelector("#removeCommentBtn-"+resdec[key1]['aaField']).addEventListener("click", ()=>{this.removeComment(this.protocolNo, this.protocolYear, resdec[key1]['aaField'])}); 
            }
        }
    }

    async removeEvent (protocolNo, protocolYear, aa){
        var r = confirm("Πρόκειται να διαγράψετε ενα σχόλιο");
        if (r !== true) {
            return;
        }
        let formData = new FormData();
        formData.append("aaField",aa);
        formData.append("protocolNo",protocolNo);
        formData.append("protocolYear",protocolYear);
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        const res = await runFetch("/api/removeComment.php", "POST", formData);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
        }
        else{
            this.loadComments(this.protocolNo,1);
        }    
    }

    async saveEvent(protocolNo, protocolYear, comment){
        let formData = new FormData();
        formData.append("commentField",comment);
        if (comment == ""){
            this.shadow.querySelector("#actionStatus").innerHTML = "Δεν υπάρχει κείμενο σχολίου";
            return;
        }
        formData.append("protocolNo",protocolNo);
        formData.append("protocolYear",protocolYear);
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        const res = await runFetch("/api/saveComment.php", "POST", formData);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
        }
        else{
            this.loadComments(this.protocolNo,1);
            this.shadow.querySelector("#addCommentModal").close()
        }    
    }
}

customElements.define("record-events", Event);