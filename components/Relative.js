import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";
import {getPage,Pages} from "../modules/UI_test.js"

const relativeContent = `
    <div id="relativeModule" class="isComponent" style="background: var(--my-component-light);padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">
        
        <details>
            <summary>
                <span style="font-weight:bold;">Σχετικά</span>
                <span class="badge bg-secondary" id="relativeTableTitleBadge"></span>
            </summary>
            <div style="display:flex;gap:10px;flex-direction:column;">
                <div style="display:inline-flex;align-self:end;gap:5px;">
                    <button id="fullRelativeTree" type="button" data-full="0" class="btn btn-sm btn-outline-success"><i class="fas fa-sitemap"></i></button>
                    <button id="showRelativeModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
                </div>
                <div style="min-height: 50px; max-height: 200px; overflow-y:scroll;">
                    <table class="table" id="relativeTable">
                        
                        <tbody id="relativeTableBody" style="font-size : 12px;">
                    
                        </tbody>
                    </table>
                </div>
                <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
            </div>    
        </details>
    </div>
    <dialog id="addRelativeModal" class="customDialog" >
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέο Σχετικό</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent" style="align-items:end;>
            <div class="flexVertical">
                <form>
                    <div class="flexHorizontal" style="padding:10px;">
                        <input type="number" class="form-control form-control-sm" id="insertRelativeField" placeholder="αρ.πρωτ">&nbsp/&nbsp
                        <input type="number" class="form-control form-control-sm" id="insertRelativeYearField" value="">
                    </div>
                </form>
                <button id="insertRelativeBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
            </div>

        </div>
    </dialog>`;


class Relative extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;
    locked;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = relativeContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.locked = this.dataset.locked;
        //this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>this.loadRelativeFull(this.protocolNo,1,1));
        this.shadow.querySelector("#insertRelativeBtn").addEventListener("click",()=>this.saveRelative(this.protocolNo,this.protocolYear));
        //if (getPage() === Pages.CHARGES){
        if (!+this.locked){
            this.loadRelativeFull(this.protocolNo,1, false);
            //showRelativeModalBtn είναι το modal για εισαγωγή νέου σχετικού
            this.shadow.querySelector("#showRelativeModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addRelativeModal").showModal());
        }
        else{
            this.loadRelativeFull(this.protocolNo,0, false);
            this.shadow.querySelector("#showRelativeModalBtn").style.display = "none";
        }
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addRelativeModal").close());
        this.shadow.querySelector("#insertRelativeYearField").value = localStorage.getItem("currentYear")!==null?localStorage.getItem("currentYear"):"";
        this.shadow.querySelector("#fullRelativeTree").addEventListener("click", (event) =>{
            if (+this.shadow.querySelector("#fullRelativeTree").dataset.full === 0){
                this.loadRelativeFull(this.protocolNo,1, 1);
                this.shadow.querySelector("#fullRelativeTree").dataset.full = "1";
                this.shadow.querySelector("#fullRelativeTree").classList.remove("btn-outline-success");
                this.shadow.querySelector("#fullRelativeTree").classList.add("btn-success");
            }
            else{
                this.loadRelativeFull(this.protocolNo,1, 0);
                this.shadow.querySelector("#fullRelativeTree").dataset.full = "0";
                this.shadow.querySelector("#fullRelativeTree").classList.remove("btn-success");
                this.shadow.querySelector("#fullRelativeTree").classList.add("btn-outline-success");
            }
        })
    }

    disconnectedCallback() {    
    }

    async loadRelativeFull(protocolNo, active, deepSearch){ 
        this.shadow.querySelector("#insertRelativeField").value = "";
        this.shadow.querySelector("#insertRelativeYearField").value = new Date().getFullYear();
        this.shadow.querySelector("#relativeTableBody").innerHTML = "";
        this.shadow.querySelector("#actionStatus").innerHTML = "";

        let urlparams = new URLSearchParams({ protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear()), deepSearch});
        
        const res = await runFetch("/api/getRelativeFull.php", "GET",urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
        }
        else{
            const resdec = res.result.relatives;
            this.shadow.getElementById("relativeTableTitleBadge").textContent = resdec.length;

            if (Array.isArray(resdec)){    
                resdec.sort((a, b) => a.relative - b.relative);
            }
            for (let key1=0;key1<resdec.length;key1++) {
                let temp="";
                const removeRelative = '<button style="margin-left:0.5em;" id="removeRelative_'+resdec[key1]['aaField']+'" class="btn btn-sm btn-danger"><i class="far fa-minus-square"></i></button>';
               // const spacesString ='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
                const subject = '&nbsp&nbsp&nbsp'+resdec[key1]["subject"].substring(0, 70)+ "...";
                //const relativeBtn = '<button class="btn btn-info btn-sm" type="button" title="'+resdec[key1]['insertedBy']+'">'+resdec[key1]['relative']+"/"+resdec[key1]['relativeYear']+'</button>';
                const relativeBtn = `<protocol-btn protocolNo="${resdec[key1]['relative']}" protocolDate="${resdec[key1]['relativeYear']}" title="${resdec[key1]['insertedBy']}"></protocol-btn>`;
                //const parentBtn = '<button class="btn btn-outline-secondary btn-sm" type="button">'+resdec[key1]['parent']+"/"+resdec[key1]['parentYear']+'</button>';
                const parentBtn = `<protocol-btn protocolNo="${resdec[key1]['parent']}" protocolDate="${resdec[key1]['parentYear']}"></protocol-btn>`;
                const caretSym = '<i style="margin: 0px 5px 0px 5px;" class="fas fa-caret-square-right"></i>';
               
                if (active){
                    temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+parentBtn+caretSym+relativeBtn+removeRelative+subject+"</td></tr>";
                }else{
                    temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+parentBtn+caretSym+relativeBtn+'</button>'+subject+'</td></tr>';
                }
                this.shadow.getElementById("relativeTableBody").innerHTML += temp;
            }
            if (active){
                for (let key1=0;key1<resdec.length;key1++) {
                    this.shadow.querySelector("#removeRelative_"+resdec[key1]['aaField']).addEventListener("click", ()=>{
                            this.removeRelative(resdec[key1]['aaField']);
                    });
                }
            }
        }    
    }

    async removeRelative (aaField){   
        const res = confirm("Πρόκειται να διαγράψετε ενα σχετικό έγγραφο");
        if (res == true) {  
            const formdata = new FormData();
            this.shadow.querySelector("#actionStatus").innerHTML = "";
            formdata.append('relativeAAField', aaField);
            formdata.append('currentYear', this.protocolYear);

            const res = await runFetch("/api/removeRelative.php", "POST",formdata);
            if (!res.success){
                this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            }
            else{
                const resdec = res.result;
                this.loadRelativeFull(this.protocolNo,1, true);
            }
        }
    }
   
    async saveRelative(protocolNo, protocolYear, relativeNo=null, relativeYear=null){
        if  (relativeNo == null){
            relativeNo = this.shadow.getElementById("insertRelativeField").value;
        } 
        if (relativeYear == null){
            relativeYear =  this.shadow.getElementById("insertRelativeYearField").value;
        }
        if (relativeNo == "" || relativeNo == undefined || relativeYear == "" || relativeYear == undefined){
            alert("Εισάγετε σωστό σχετικό");
            return;
        }

        const formdata = new FormData();
        formdata.append('protocolNo',protocolNo);
        formdata.append('protocolYear',protocolYear);
        formdata.append('relativeNo',relativeNo);
        formdata.append('relativeYear',relativeYear);

        const res = await runFetch("/api/saveRelative.php", "POST", formdata);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#addRelativeModal").close();
        }
        else{
            this.loadRelativeFull(this.protocolNo,1, false);
            this.shadow.querySelector("#addRelativeModal").close();
        }
    }

    
    showRelative(aaField){
        $('#example').DataTable().search(aaField).draw();
        $("#bottomSection").addClass("d-none");
        var elmnt = document.getElementById("tableButtonsSection");
    }
    
}

customElements.define("record-relative", Relative);