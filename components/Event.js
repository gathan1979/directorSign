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
                    <button id="showAddEventModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
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
                    <input type="datetime-local" id="insertStartDateField"></input>
                </div>
                <div class="flexHorizontal" style="justify-content:space-between;">
                    <label for="insertEndDateField">
                        Λήξη
                    </label>
                    <input type="datetime-local" id="insertEndDateField"></input>
                </div>
                <button id="saveEventBtn" type="button" class="isButton active" style="align-self:end;margin-top:10px;">Εισαγωγή</button>	
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
        if (!+this.locked){
            this.loadEvents(this.protocolNo,1);
            this.shadow.querySelector("#showAddEventModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addEventModal").showModal());
        }
        else{
            this.loadEvents(this.protocolNo,0);
            this.shadow.querySelector("#showAddEventModalBtn").style.display = "none";
        }
        this.shadow.querySelector("#saveEventBtn").addEventListener("click",()=>{ 
            const event = this.shadow.getElementById("insertEventField").value; 
            const startDate = this.shadow.getElementById("insertStartDateField").value; 
            const endDate = this.shadow.getElementById("insertEndDateField").value; 
            this.saveEvent(this.protocolNo, event, startDate, endDate);
        });
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addEventModal").close());
       
    }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldValue, newValue){
        //console.log("attribute changed");
        this.loadEvents(this.protocolNo,1);
    }
    
    async loadEvents(protocolNo, active){
        this.shadow.querySelector("#eventTable").innerHTML = "";
        this.shadow.querySelector("#actionStatus").innerHTML = "";
      
        let urlparams = new URLSearchParams({protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});

        const res = await runFetch("/api/getEvents.php", "GET", urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            const resdec = res.result.events;
            this.shadow.querySelector("#eventTitleBadge").textContent = resdec.length;
            let html = "";
            let info = "";
            for (let key1=0;key1<resdec.length;key1++) {
                const eventUser = '<span>'+resdec[key1]['userField']+"</span>";
                let removeEvent = "";
                if (active){
                    removeEvent = '<button style="margin-left:5px;" id="removeEventBtn-'+resdec[key1]['aa']+'" class="isButton danger"><i class="far fa-minus-square"></i></button>';
                }
                const eventString = `<span>${resdec[key1]['eventField']}
                                            ${(resdec[key1]['startDateField'] !=null? " - ΕΝΑΡΞΗ <b>"+resdec[key1]['startDateField']:"")}
                                            ${(resdec[key1]['endDateField'] !=null? " - ΛΗΞΗ <b>"+resdec[key1]['endDateField']:"")}
                                            </b>${removeEvent}</span>`;
                const eventStringForInfo = `<span style="cursor: not-allowed;border-radius:5px; font-size: 10px;" class="isButton danger">${resdec[key1]['eventField']}
                                            ${(resdec[key1]['startDateField'] !=null? " - ΕΝΑΡΞΗ <b>"+resdec[key1]['startDateField']:"")}
                                            ${(resdec[key1]['endDateField'] !=null? " - ΛΗΞΗ <b>"+resdec[key1]['endDateField']:"")}</b></span>`;
                html += '<div style="display:flex; flex-direction : column;align-items:flex-start; border-left: solid;padding-left: 10px;border-color:#b5b9bd;font-size:12px;">'+eventUser+eventString+"</div>";
                info += eventStringForInfo;
            }
            this.shadow.querySelector("#eventTable").innerHTML = html;
            document.querySelector("#eventsInfo").innerHTML = info;
            //onclick="removeComment('+resdec[key1]['aaField']+')"
            for (let key1=0;key1<resdec.length;key1++) {
                   this.shadow.querySelector("#removeEventBtn-"+resdec[key1]['aa']).addEventListener("click", ()=>{this.removeEvent(this.protocolNo, resdec[key1]['aa'])}); 
            }
        }
    }

    async removeEvent (protocolNo, aa){
        var r = confirm("Πρόκειται να διαγράψετε ενα συμβάν");
        if (r !== true) {
            return;
        }
        let formData = new FormData();
        formData.append("aaField",aa);
        formData.append("protocolNo",protocolNo);
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        const res = await runFetch("/api/removeEvent.php", "POST", formData);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            this.loadEvents(this.protocolNo,1);
        }    
    }

    async saveEvent(protocolNo, eventField, startDateField ="", endDateField = ""){
        if (eventField == "" && startDateField =="" && endDateField == ""){
            this.shadow.querySelector("#actionStatus").innerHTML = "Δεν υπάρχουν στοιχεία για παραχώρηση";
            return;
        }
        let formData = new FormData();
        formData.append("eventField", eventField);
        formData.append("startDateField", startDateField);
        formData.append("endDateField", endDateField);
        formData.append("protocolNo", protocolNo);
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        const res = await runFetch("/api/saveEvent.php", "POST", formData);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            this.loadEvents(this.protocolNo,1);
            this.shadow.querySelector("#addEventModal").close()
        }    
    }
}

customElements.define("record-events", Event);