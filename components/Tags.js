import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

const tagsContent = `
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

        <div id="tagsBody" style="height:90%;overflow-y:scroll;display:flex; flex-wrap:wrap;gap: 5px;"></div>
    </div>
    <dialog id="addTagsModal" class="customDialog" style="width:60%;">
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέες Ετικέτες</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <div class="flexVertical" style="align-items: self-end;">
                <form style="width: 100%;">
                    <input type="text" class="form-control form-control-sm" id="insertTagsField">
                </form>
                <div class="flexHorizontal">
                    <div id="searchResults"></div>
                    <button id="insertTagsBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
                </div>
            </div>

        </div>
    </dialog>`;


class Tags extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = tagsContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        //this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>this.loadRelativeFull(this.protocolNo,1,1));
        this.shadow.querySelector("#insertTagsBtn").addEventListener("click",()=>this.saveTags(this.protocolNo, this.protocolYear));
        this.getTags(this.protocolNo, this.protocolYear);
        this.shadow.querySelector("#showAddTagModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addTagsModal").showModal());
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> {
            this.shadow.querySelector("#addTagsModal").close();
            this.shadow.querySelector("#insertTagsField").value= "";    
        });
        this.shadow.querySelector("#insertTagsField").addEventListener("keyup",()=>{this.searchTags()});
    }

    disconnectedCallback() {
    
    }

    async getTags(protocolNo, protocolYear){
        this.shadow.querySelector("#tagsBody").innerHTML = "";
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({protocolNo, currentYear : protocolYear});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getTags.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.getTags(protocolNo);
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
            this.shadow.getElementById("tagsTableTitleBadge").textContent = resdec.length;

            for (let key1=0;key1<resdec.length;key1++) {
                let temp="<span id='tag_"+resdec[key1]['aaField']+"' style='cursor: pointer; background-color:#189ecf; border-radius:5px; font-size: 10px;padding: 5px;color: white;'>"+resdec[key1]['tag']+"</span>";
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
        const res = confirm("Πρόκειται να διαγράψετε μια ετικέτα");
        if (res == true) {  
            const {jwt,role} = getFromLocalStorage();
            const myHeaders = new Headers();
            myHeaders.append('Authorization', jwt);
            const formdata = new FormData();
            formdata.append('aaField', aaField);
            formdata.append('currentYear', this.protocolYear);
            formdata.append('role', role);
            
            let init = {method: 'POST', headers : myHeaders, body : formdata};
            const res = await fetch("/api/removeTag.php",init);
            if (!res.ok){
                const resdec = res.json();
                if (res.status ==  400){
                    alert(resdec['message']);
                }
                else if (res.status ==  401){
                    const resRef = await refreshToken();
                    if (resRef ==1){
                        this.removeTag(aaField);
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
                const resdec = res.json();
                console.log(res['message']);
                await this.getTags(this.protocolNo, this.protocolYear);
            }
        }
    }
   
    async saveTags(protocolNo, protocolYear){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        formdata.append('protocolNo',protocolNo);
        formdata.append('currentYear',protocolYear);
        formdata.append('tagsString',this.shadow.querySelector("#insertTagsField").value);
        formdata.append('role',role);
        
        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/saveTags.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.saveTags();
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
            const resdec = res.json();
            console.log(res['message']);
            this.shadow.querySelector("#addTagsModal").close();
            this.shadow.querySelector("#insertTagsField").value= "";
            await this.getTags(this.protocolNo, this.protocolYear);
        }
    }

    async searchTags(){
        const searchValue = this.shadow.getElementById("insertTagsField").value.split(",").at(-1);
        console.log(searchValue);
        if (searchValue.trim().length <3){
            this.shadow.querySelector("#searchResults").innerHTML = "";
            return;
        }
        this.shadow.querySelector("#searchResults").innerHTML = "";
        const similarTags = await this.searchSimilar(searchValue);
        similarTags.forEach( elem => {
            this.shadow.querySelector("#searchResults").innerHTML += '<span>'+elem.tag+'</span>'
        })
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
        console.log("κλήση")
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({tag,  currentYear : this.protocolYear});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/searchSimilarTags.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.searchSimilar(tag);
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
    
}

customElements.define("record-tags", Tags);