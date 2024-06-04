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
    <div id="tagsModule" style="display:flex;gap:10px;flex-direction:column;background: rgba(122, 160, 126, 0.2)!important;padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">
        
        <div style="display:flex;justify-content: space-between;align-items:center;">
            <div>
                <span style="font-weight:bold;font-size:14px;">Ετικέτες</span>
                <span class="badge bg-secondary" id="tagsTableTitleBadge"></span>
                <div id="tagsSpinner" class="spinner-border spinner-border-sm" role="status" style="display:none;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div>
                <!--<button id="fullRelativeTree" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-sitemap"></i></button>-->
                <button id="showAddTagModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
            </div>
        </div>

        <div id="tagsBody" style="height:90%;overflow-y:scroll;display:flex; flex-wrap:wrap;gap:5px;"></div>
    </div>

    <dialog id="addTagsModal" class="customDialog" style="width:60%;">
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέες Ετικέτες</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <div class="flexVertical" >
                <form style="width: 100%;">
                    <input type="text" class="form-control form-control-sm" id="insertTagsField">
                </form>
                <div class="flexHorizontal" style="justify-content: space-between;">
                    <div id="searchResults" style="display:flex; gap:5px; padding: 10px;"></div>
                    <button id="insertTagsBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
                </div>
            </div>
        </div>
    </dialog>`;


class Tags extends HTMLElement {
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
        if (!+this.locked){
            this.shadow.querySelector("#showAddTagModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addTagsModal").showModal());
        }
        else{
            this.shadow.querySelector("#showAddTagModalBtn").style.display = "none";
        }
        //this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>this.loadRelativeFull(this.protocolNo,1,1));
        this.shadow.querySelector("#insertTagsBtn").addEventListener("click",()=>this.saveTags(this.protocolNo, this.protocolYear));
        this.getTags(this.protocolNo, this.protocolYear);
        
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> {
            this.shadow.querySelector("#addTagsModal").close();
            this.shadow.querySelector("#insertTagsField").value= "";   
            this.shadow.querySelector("#searchResults").innerHTML = ""; 
        });
        this.shadow.querySelector("#insertTagsField").addEventListener("keyup",()=>{this.searchTags()});
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

    async removeTag(aaField){   
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
            }
        }
    }
   
    async saveTags(protocolNo, protocolYear){

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
        }
    }

    async searchTags(){
        const selectedTags = [...this.shadow.querySelectorAll("#tagsBody>span")].map(elem=>elem.innerHTML);

        const currentTextAsArray = this.shadow.getElementById("insertTagsField").value.split(",");
        const searchValue = currentTextAsArray.at(-1);
        //ΟΤΑΝ ΒΑΖΟΥΜΕ ΝΕΟ ΣΤΟΙΧΕΙ0 ΜΕ (ΚΟΜΜΑ) ΓΙΝΕΤΑΙ ΕΛΕΓΧΟΣ ΑΝ ΥΠΑΡΧΕΙ ΗΔΗ ΚΑΙ ΑΦΑΙΡΕΙΤΑΙ 
        if (currentTextAsArray.at(-1)=="" && currentTextAsArray.at(-2) != null){
            console.log("ειμαι εδω",currentTextAsArray.at(-2))
            if (selectedTags.indexOf(currentTextAsArray.at(-2)) !== -1){
                console.log(currentTextAsArray)
               this.shadow.getElementById("insertTagsField").value = currentTextAsArray.slice(0,-2).join(", ");
            }
        }
        if (searchValue.trim().length <3){
            this.shadow.querySelector("#searchResults").innerHTML = "";
            return;
        }
        this.shadow.querySelector("#searchResults").innerHTML = "";
        const similarTags = await this.searchSimilar(searchValue);
        
        //console.log(selectedTags);

        //ΕΛΕΓΧΟΣ ΑΝ ΣΤΑ ΟΜΟΙΑ ΠΟΥ ΒΡΈΘΗΚΑΝ ΚΑΠΟΙΟ ΕΧΕΙ ΚΑΤΑΧΩΡΗΘΕΙ ΗΔΗ ΩΣΤΕ ΝΑ ΕΜΦΑΝΙΣΤΕΙ ΠΡΑΣΙΝΟ 
        similarTags.forEach( (elem,index) => {
            if (selectedTags.indexOf(elem.tag) === -1){
                this.shadow.querySelector("#searchResults").innerHTML += "<span id='similar_"+index+"'  style='cursor: pointer; background-color: var(--bs-orange); border-radius:5px; font-size: 10px;padding: 5px;color: white;'>"+elem.tag+'</span>'
            }
            else{
                this.shadow.querySelector("#searchResults").innerHTML += "<span id='similar_"+index+"' class='active' style='border-radius:5px; font-size: 10px;padding: 5px;color: white;'>"+elem.tag+'</span>'
            }
        })
        similarTags.forEach( (elem,index) => {
            if (selectedTags.indexOf(elem.tag) === -1){
                this.shadow.querySelector("#similar_"+index).addEventListener("click", (event)=>{
                    if (currentTextAsArray.length == 1){
                        this.shadow.getElementById("insertTagsField").value = event.currentTarget.innerHTML;
                    }
                    else{
                        this.shadow.getElementById("insertTagsField").value = currentTextAsArray.slice(0,-1).join(", ")+", "+event.currentTarget.innerHTML;
                    }
                })
            }
        });
        return;

        this.shadow.querySelectorAll("#folderList > button").forEach((element,index)=> {
            //console.log(element.title.toLowerCase());
            //console.log(searchValue.toLowerCase());
            if (element.title.toLowerCase().includes(searchValue.toLowerCase())){
                //console.log(element.title);
                let isActive = 0;
                if (this.shadow.querySelector('#folderList [data-folder-aa="'+element.dataset.folderAa+'"]').dataset.active == "1"){
                    isActive = 1;
                }
                let newButtonText = '<button data-active="'+isActive+'" data-folder-search-aa="'+element.dataset.folderAa+'" id="searchFoldersRes_'+element.dataset.folderAa+'" style="margin-bottom:0.5em;margin-left:0.5em;" type="button" class="isButton small '+(isActive?"active":"")+'" >';
                // /onclick="selectSearchFolder('+result[key]['aaField']+');"    
                newButtonText +="Φ"+element.innerText+" "+element.title+'</button>';
                //console.log(newButtonText);
                this.shadow.querySelector("#searchResults").innerHTML += newButtonText;
                this.shadow.querySelector('#searchFoldersRes_'+element.dataset.folderAa).addEventListener("click",(event)=>{
                    this.selectSearchFolder(event.currentTarget.dataset.folderSearchAa);
                })
            }
        });
    }

    async searchSimilar(tag){
        let urlparams = new URLSearchParams({tag, currentYear : this.protocolYear});
        const res = await runFetch("/api/searchSimilarTags.php", "GET", urlparams);
        if (!res.success){
            alert(res.msg);
        }
        else{
            const resdec = res.result;
            return resdec;
        }    
    }
    
}

customElements.define("record-tags", Tags);