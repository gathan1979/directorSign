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

    </style>
    <div id="foldersDiv" class="secondBottomSectionColumn" style="background: rgba(86, 86, 136, 0.2)!important;">	
        <link href="css/all.css" rel="stylesheet">
        <div  style="padding-top:10px; display: flex; padding: 15px; gap: 5px;">
            <button id="saveFoldersButton" type="button" class="isButton"  onclick="saveFolders();" data-toggle="tooltip" data-placement="top" title="Αποθήκευση Αλλαγών στους Φακέλους"><i class="far fa-save"></i></button>
            <button id="showFoldersButton" type="button"  class="isButton"  style="background-color:chocolate;" data-toggle="tooltip" data-placement="top" title="Εμφάνιση λίστας φακέλων με επεξηγήσεις"><i class="fas fa-list-ol"></i></button>
            <button class="isButton" data-toggle="tooltip" data-placement="top"  style="background-color:chocolate;" title="Αναζήτηση φακέλων" id="seachFolderButton"><i class="fas fa-search"></i></button>
        </div>
        <div id="folderList" name="folderList" style="padding: 15px; display:flex; flex-wrap: wrap;gap:5px;">
           
        </div>
    </div>`;


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
        this.protocolFolders = await this.getFolders(this.protocolNo);
        this.selectedFolders = [...this.protocolFolders];

        this.shadow.querySelector("#folderList").innerHTML = folderList.join("");
        this.shadow.querySelectorAll("#folderList > button").forEach((element,index)=> {element.addEventListener("click",(event)=>{this.changeFolderStatus(element.dataset.folderAa)})});
        this.showFolders(this.protocolFolders);

        //this.shadow.querySelector("#insertRelativeBtn").addEventListener("click",()=>this.saveRelative());
        //this.loadRelativeFull(this.protocolNo,1, true);
        //this.shadow.querySelector("#showRelativeModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addRelativeModal").showModal());
        //this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addRelativeModal").close());
    }

    disconnectedCallback() {
    
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
        if (this.shadow.getElementById('saveFoldersButton').classList.contains('active')){
            
        }
        else{
            this.shadow.getElementById('saveFoldersButton').classList.add('active');
            this.shadow.querySelector("#saveFoldersButton  i").classList.add('faa-shake');
            this.shadow.querySelector("#saveFoldersButton  i").classList.add('animated');
        }
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
            return resdec;
        }    
    }

    showFolders(arrayOfObjects){
        arrayOfObjects.forEach( elem => { 
            this.shadow.querySelector('[data-folder-aa="'+elem.folderField+'"]').classList.add("active"); 
        });
    }
    
}

customElements.define("record-folders", Folders);