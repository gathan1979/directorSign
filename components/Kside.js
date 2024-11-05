import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const tagsContent = `
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

        .outline{
            background-color: rgba(255,255,255,0);
        }

        .small{
            font-size: 0.8em;
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

        #folderSearchText{
            min-height: 2em;
            border-radius : 5px;
        }

    </style>
    <div id="ksideModule" class="isComponent" style="display:flex;gap:10px;flex-direction:column;background: var(--my-component-light);padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">
        
        <details>
            <summary>
                <span id="ksideTitle" style="font-weight:bold;">Αρ.πρωτ. ΚΣΗΔΕ</span>
                <span class="badge bg-secondary" id="ksideTableTitleBadge"></span>
            </summary>
            <div style="display:flex;gap:10px;flex-direction:column;">
                <div style="display:inline-flex;align-self:end;gap:5px;">
                    <button id="showAddKsideModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
                </div>
                <div id="ksideBody" style="height:90%;overflow-y:scroll;display:flex; flex-wrap:wrap;gap:5px;"></div>
                <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
            </div>    
        </details>

    </div>

   
    <dialog id="addKsideModal" class="customDialog" style="width:60%;">
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Αριθμός Πρωτοκόλλου ΚΣΗΔΕ</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <div class="flexVertical" >
                <form style="width: 100%;">
                    <input type="text" class="form-control form-control-sm" id="insertTagsField">
                </form>
                <div class="flexHorizontal" style="justify-content: space-between;">
                    <div id="searchResults" style="display:flex; gap:5px; padding: 10px;"></div>
                    <button id="insertKsideBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
                </div>
            </div>
        </div>
    </dialog>`;


class Kside extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;
    locked;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = tagsContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.locked = this.dataset.locked;
        // if (!+this.locked){
        //     this.shadow.querySelector("#showAddTagModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addTagsModal").showModal());
        // }
        // else{
        //     this.shadow.querySelector("#showAddTagModalBtn").style.display = "none";
        // }
        // //this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>this.loadRelativeFull(this.protocolNo,1,1));
        // this.shadow.querySelector("#insertTagsBtn").addEventListener("click",()=>this.saveTags(this.protocolNo, this.protocolYear));
        // this.getTags(this.protocolNo, this.protocolYear);
        
        // this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> {
        //     this.shadow.querySelector("#addTagsModal").close();
        //     this.shadow.querySelector("#insertTagsField").value= "";   
        //     this.shadow.querySelector("#searchResults").innerHTML = ""; 
        // });
        // this.shadow.querySelector("#insertTagsField").addEventListener("keyup",()=>{this.searchTags()});
    }

    disconnectedCallback() {
    
    }



    async getTags(protocolNo, protocolYear){
        this.shadow.querySelector("#tagsBody").innerHTML = "";
        let urlparams = new URLSearchParams({protocolNo, currentYear : this.protocolYear});
        const res = await runFetch("/api/getTags.php", "GET", urlparams);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            this.shadow.getElementById("tagsTableTitleBadge").textContent = resdec.length;

            for (let key1=0;key1<resdec.length;key1++) {
                let temp="<span id='tag_"+resdec[key1]['aaField']+"' style='cursor: pointer; background-color:green; border-radius:5px; font-size: 10px;padding: 5px;color: white;'>"+resdec[key1]['tag']+"</span>";
                this.shadow.getElementById("tagsBody").innerHTML += temp;
            }
            for (let key1=0;key1<resdec.length;key1++) {
                this.shadow.querySelector("#tag_"+resdec[key1]['aaField']).addEventListener("click", ()=>{
                        this.removeTag(resdec[key1]['aaField']);
                });
            }
        }    
    }

    async removeKsideProtocol(aaField){   
        const dialogRes = confirm("Πρόκειται να διαγράψετε μια ετικέτα");
        if (dialogRes == true) {  
            const formdata = new FormData();
            formdata.append('aaField', aaField);
            formdata.append('currentYear', this.protocolYear);

            const res = await runFetch("/api/removeTag.php", "POST", formdata);
            if (!res.success){
                alert(res.msg);
            }
            else{
                await this.getTags(this.protocolNo, this.protocolYear);
                const RefreshTagsDatalistEvent = new CustomEvent("RefreshTagsDatalistEvent", { bubbles: true, cancelable: false, composed: true });
                this.dispatchEvent(RefreshTagsDatalistEvent);
            }
        }    
    }
   
    async saveKsideProtocol(protocolNo, protocolYear){

        const formdata = new FormData();
        formdata.append('protocolNo',protocolNo);
        formdata.append('currentYear',protocolYear);
        formdata.append('tagsString',this.shadow.querySelector("#insertTagsField").value);

        const res = await runFetch("/api/saveTags.php", "POST", formdata);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            this.shadow.querySelector("#addTagsModal").close();
            this.shadow.querySelector("#insertTagsField").value= "";
            await this.getTags(this.protocolNo, this.protocolYear);
            const RefreshTagsDatalistEvent = new CustomEvent("RefreshTagsDatalistEvent", { bubbles: true, cancelable: false, composed: true });
            this.dispatchEvent(RefreshTagsDatalistEvent);
        }
    }
    
}

customElements.define("record-kside", Kside);