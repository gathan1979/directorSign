import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

const foldersContent = `
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
    <div id="foldersDiv" class="secondBottomSectionColumn" style="background: rgba(86, 86, 136, 0.2)!important;">	
        <link href="css/all.css" rel="stylesheet">
        <div  style="padding-top:10px; display: flex; padding: 15px; gap: 5px;">
            <button id="saveFoldersButton" type="button" class="isButton"  title="Αποθήκευση Αλλαγών στους Φακέλους"><i class="far fa-save"></i></button>
            <button id="showFoldersButton" type="button"  class="isButton"  style="background-color:chocolate;" title="Εμφάνιση λίστας φακέλων με επεξηγήσεις"><i class="fas fa-list-ol"></i></button>
            <button id="seachFolderModalButton" class="isButton" style="background-color:chocolate;" title="Αναζήτηση φακέλων" ><i class="fas fa-search"></i></button>
            <button id="undoButton" title="Αναίρεση αλλαγών" type="button" class="isButton"><i class="fas fa-undo"></i></button>
        </div>
        <div id="folderList" name="folderList" style="padding: 15px; display:flex; flex-wrap: wrap;gap:5px;">
           
        </div>
    </div>
    <dialog id="foldersDetailsModal" class="customDialog" >
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Φάκελοι Αρχειοθέτησης</span>
            <button class="isButton " name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <hr>
        <div class="customDialogContent">
            
        </div>
    </dialog>
    <dialog id="seachfoldersModal" class="customDialog" >
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Αναζήτηση φακέλων αρχειοθέτησης</span>
            <button class="isButton " name="closeModalBtn2" id="closeModalBtn2" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
                <input id="folderSearchText" type="text"  placeholder="Αναζήτηση εδώ (τουλάχιστον 3 χαρακτήρες)">
            </div>
            <hr>
            <div id="searchResults" style="display:flex; flex-direction : column; gap: 5px;"></>
            </div>
        </div>
    </dialog>`;


class Folders extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;
    protocolFolders;            // example [{aaField: '8294', recordField: '4884', folderField: '71'}]
    selectedFolders;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = foldersContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; 
        let folderList = null;
        if (localStorage.getItem("folders") !== null){
            folderList = JSON.parse(localStorage.getItem("folders"));
        }
        else{
            folderList = await this.getFoldersList();
        }
        const foldersArrFromDb = await this.getFolders(this.protocolNo);
        this.protocolFolders = foldersArrFromDb.map((item)=>{return item.folderField;})
        console.log(this.protocolFolders);
        this.selectedFolders = [...this.protocolFolders];

        this.shadow.querySelector("#folderList").innerHTML = folderList.join("");
        this.shadow.querySelectorAll("#folderList > button").forEach((element,index)=> {
            if (this.protocolFolders.indexOf(element.dataset.folderAa) !== -1){
                element.dataset.active = 1;
            }
            element.addEventListener("click",(event)=>{this.changeFolderStatus(element.dataset.folderAa)})
            this.shadow.querySelector(".customDialogContent").innerHTML += '<div><b>'+element.innerText+"</b> : "+element.title+'</div>';
        });
        this.showFolders(this.protocolFolders);
        this.shadow.querySelector("#saveFoldersButton").addEventListener("click",()=>this.saveFolders());
        this.shadow.querySelector("#closeModalBtn").addEventListener("click",()=>this.shadow.querySelector("#foldersDetailsModal").close());
        this.shadow.querySelector("#closeModalBtn2").addEventListener("click",()=>this.shadow.querySelector("#seachfoldersModal").close());
        this.shadow.querySelector("#showFoldersButton").addEventListener("click",()=>{
                this.shadow.querySelector("#foldersDetailsModal").showModal();
            });
        this.shadow.querySelector("#seachFolderModalButton").addEventListener("click",()=>{
                this.shadow.querySelector("#folderSearchText").value = "";
                this.shadow.querySelector("#searchResults").innerHTML = "";
                this.shadow.querySelector("#seachfoldersModal").showModal();
            });
        this.shadow.querySelector("#folderSearchText").addEventListener("keyup",()=>{this.searchFolders()});
        this.shadow.querySelector("#undoButton").addEventListener("click",()=>this.undoChanges());
        //this.loadRelativeFull(this.protocolNo,1, true);
        //this.shadow.querySelector("#showRelativeModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addRelativeModal").showModal());
        //this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addRelativeModal").close());
    }

    disconnectedCallback() {
    
    }


    async getFoldersList(){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getFoldersList.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.getFoldersList();
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
            localStorage.setItem("folders",JSON.stringify(resdec));
            return resdec;
        }    
    }

    async getFolders(protocolNo){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getFolders.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.getFolders(protocolNo);
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

    undoChanges(){
        this.selectedFolders = [...this.protocolFolders];
        // this.shadow.querySelectorAll("#folderList>button").forEach((element,index)=> {
        //     if (this.protocolFolders.indexOf(element.dataset.folderAa) !== -1){
        //         element.dataset.active = 1;
        //     }
        //     else{
        //         element.dataset.active = 0;
        //     }
        // });
        this.showFolders(this.protocolFolders);
        if (this.protocolFolders.sort().toString() == this.selectedFolders.sort().toString()){
            console.log("no change to folders");
            this.shadow.getElementById('saveFoldersButton').classList.remove('active');
            this.shadow.querySelector("#saveFoldersButton  i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveFoldersButton  i").classList.remove('animated');
        }
    }

    showFolders(arrayOfProtocols){
        this.shadow.querySelectorAll("#folderList>button").forEach(elem => {
            elem.classList.remove("active");
            elem.dataset.active = 0;

        });
        arrayOfProtocols.forEach( elem => { 
            this.shadow.querySelector('[data-folder-aa="'+elem+'"]').classList.add("active"); 
            this.shadow.querySelector('[data-folder-aa="'+elem+'"]').dataset.active = 1;
        });
    }

    async saveFolders(){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('folders',JSON.stringify(this.selectedFolders));
        formdata.append('currentRole',role);
        
        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/saveFolders.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.saveFolders();
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

    searchFolders(){
        const searchValue = this.shadow.getElementById("folderSearchText").value;
        if (searchValue.length <3){
            this.shadow.querySelector("#searchResults").innerHTML = "";
            return;
        }
        this.shadow.querySelector("#searchResults").innerHTML = "";
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
    
    selectSearchFolder(folderAa){
        let tempUserElement= this.shadow.querySelector('#searchFoldersRes_'+folderAa);
        console.log(tempUserElement);
        const active = tempUserElement.dataset.active;
        //console.log(this.selectedFolders);
        if (active == "1"){
            //tempUserElement.style.backgroundColor = "lightGray";
            tempUserElement.classList.remove('active');
            tempUserElement.dataset.active = 0;
        }
        else{
            tempUserElement.classList.add('active');
            tempUserElement.dataset.active = 1;
        }
        this.changeFolderStatus(folderAa)
    }

    changeFolderStatus(folderAa){
        let tempUserElement= this.shadow.querySelector('#folderList [data-folder-aa="'+folderAa+'"]');
        const active = tempUserElement.dataset.active;
        console.log(this.selectedFolders);
        if (active == "1"){
            //tempUserElement.style.backgroundColor = "lightGray";
            tempUserElement.classList.remove('active')
            tempUserElement.dataset.active = 0;
        }
        else{
            tempUserElement.classList.add('active')
            tempUserElement.dataset.active = 1;
        }
        if (!this.shadow.getElementById('saveFoldersButton').classList.contains('active')){
            this.shadow.getElementById('saveFoldersButton').classList.add('active');
            this.shadow.querySelector("#saveFoldersButton  i").classList.add('faa-shake');
            this.shadow.querySelector("#saveFoldersButton  i").classList.add('animated');
        }
        //update selectedFolders var
        this.selectedFolders= [];
        this.selectedFolders = Array.from(this.shadow.querySelectorAll("#folderList > button")).map((element,index)=>{ 
            if (element.dataset.active == "1"){return element.dataset.folderAa;}else{return null;}
                }).filter(item=>{if (item == null){return 0;}else{return 1;}});
        console.log(this.selectedFolders);
        if (this.protocolFolders.sort().toString() == this.selectedFolders.sort().toString()){
            console.log("no change to folders");
            this.shadow.getElementById('saveFoldersButton').classList.remove('active');
            this.shadow.querySelector("#saveFoldersButton  i").classList.remove('faa-shake');
            this.shadow.querySelector("#saveFoldersButton  i").classList.remove('animated');
        }
    }
}


customElements.define("record-folders", Folders);