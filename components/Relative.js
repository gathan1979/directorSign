import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

const relativeContent = `
    <div id="relativeModule" style="display:flex;gap:10px;flex-direction:column;background: rgba(122, 160, 126, 0.2)!important;padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">
        
        <div style="display:flex;justify-content: space-between;align-items:center;">
            <div>
                <span style="font-weight:bold;">Σχετικά</span>
                <span class="badge bg-secondary" id="relativeTableTitleBadge"></span>
                <div id="relativeSpinner" class="spinner-border spinner-border-sm" role="status" style="display:none;">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            <div>
                <!--<button id="fullRelativeTree" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-sitemap"></i></button>-->
                <button id="showRelativeModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
            </div>
        </div>

        <div style="height:90%;overflow-y:scroll;">
            <table class="table" id="relativeTable">
                
                <tbody id="relativeTableBody" style="font-size : 12px;">
            
                </tbody>
            </table>
        </div>
    </div>
    <dialog id="addRelativeModal" class="customDialog" >
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέο Σχετικό</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <div class="flexVertical">
                <form>
                    <div class="flexHorizontal">
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

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = relativeContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        //this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>this.loadRelativeFull(this.protocolNo,1,1));
        this.shadow.querySelector("#insertRelativeBtn").addEventListener("click",()=>this.saveRelative());
        this.loadRelativeFull(this.protocolNo,1, true);
        this.shadow.querySelector("#showRelativeModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addRelativeModal").showModal());
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addRelativeModal").close());
    }

    disconnectedCallback() {
    
    }


    // async loadRelative(protocolNo, active){
    //     this.shadow.querySelector("#insertRelativeField").value = "";
    //     this.shadow.querySelector("#insertRelativeYearField").value = new Date().getFullYear;
    //     this.shadow.querySelector("#relativeTableBody").innerHTML = "";

    //     const {jwt,role} = getFromLocalStorage();
    //     const myHeaders = new Headers();
    //     myHeaders.append('Authorization', jwt);
    //     let urlparams = new URLSearchParams({currentRole :role, protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
    //     let init = {method: 'GET', headers : myHeaders};
    //     const res = await fetch("/api/getRelative.php?"+urlparams,init);
    //     if (!res.ok){
    //         const resdec = res.json();
    //         if (res.status ==  401){
    //             const resRef = await refreshToken();
    //             if (resRef ==1){
    //                 this.loadRelative(protocolNo,active);
    //             }
    //             else{
    //                 alert("σφάλμα εξουσιοδότησης");
    //             }
    //         }
    //         else if (res.status==403){
    //             alert("δεν έχετε πρόσβαση στο συγκεκριμένο πόρο");
    //         }
    //         else if (res.status==404){
    //             alert("το αρχείο δε βρέθηκε");
    //         }
    //         else{
    //             alert("Σφάλμα!!!");
    //         }
    //     }
    //     else{
    //         const resdec = await res.json();
    //         this.shadow.getElementById("relativeTableTitleBadge").textContent = resdec.length;

    //         for (let key1=0;key1<resdec.length;key1++) {
    //             let temp="";
    //             const removeRelative = '<button style="margin-left:0.5em;" id="removeRelative_'+resdec[key1]['aaField']+'" class="btn btn-sm btn-danger"><i class="far fa-minus-square"></i></button>';
    //            // const spacesString ='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
    //             const subject = '&nbsp&nbsp&nbsp'+resdec[key1]["subject"].substring(0, 70)+ "...";
    //             //const subjectRel = '&nbsp&nbsp&nbsp'+resdec[key1][5].substring(0, 50)+ "...";
    //             //console.log(selectedIndex+" --- "+resdec[key1]['recordField']);
    //             if (active){
    //                 if (protocolNo == resdec[key1]['recordField']){
    //                     temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['relative']+');">'+resdec[key1]['relative']+"/"+resdec[key1]['year']+'</button>'+removeRelative+subject+"</td></tr>";
    //                 }
    //                 else{
    //                     temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['recordField']+');">'+resdec[key1]['recordField']+"/"+resdec[key1]['year']+'</button>'+removeRelative+subject+"</td></tr>";
    //                 }
    //             }else{
    //                 if (protocolNo == resdec[key1]['recordField']){
    //                     temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['relative']+');">'+resdec[key1]['relative']+"/"+resdec[key1]['year']+'</button></td></tr>';
    //                 }
    //                 else{
    //                     temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['recordField']+');">'+resdec[key1]['recordField']+"/"+resdec[key1]['year']+'</button></td></tr>';
    //                 }
    //             }
    //             this.shadow.getElementById("relativeTableBody").innerHTML += temp;
    //         }
    //         for (let key1=0;key1<resdec.length;key1++) {
    //             this.shadow.querySelector("#removeRelative_"+resdec[key1]['aaField']).addEventListener("click", ()=>{
    //                     this.removeRelative(resdec[key1]['aaField']);
    //             });
    //         }
    //     }    
    // }

    async loadRelativeFull(protocolNo, active, deepSearch){
        this.shadow.querySelector("#insertRelativeField").value = "";
        this.shadow.querySelector("#insertRelativeYearField").value = new Date().getFullYear;
        this.shadow.querySelector("#relativeTableBody").innerHTML = "";

        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({currentRole :role, protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear()), deepSearch});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getRelativeFull.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.loadRelativeFull(protocolNo,active,deepSearch);
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
            this.shadow.getElementById("relativeTableTitleBadge").textContent = resdec.length;

            for (let key1=0;key1<resdec.length;key1++) {
                let temp="";
                const removeRelative = '<button style="margin-left:0.5em;" id="removeRelative_'+resdec[key1]['aaField']+'" class="btn btn-sm btn-danger"><i class="far fa-minus-square"></i></button>';
               // const spacesString ='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
                const subject = '&nbsp&nbsp&nbsp'+resdec[key1]["subject"].substring(0, 70)+ "...";
                const relativeBtn = '<button class="btn btn-info btn-sm" type="button">'+resdec[key1]['relative']+"/"+resdec[key1]['relativeYear']+'</button>';
                const parentBtn = '<button class="btn btn-light btn-sm" type="button">'+resdec[key1]['parent']+"/"+resdec[key1]['parentYear']+'</button>';
                const caretSym = '<i style="margin: 0px 5px 0px 5px;" class="fas fa-caret-square-right"></i>';
               
                if (active){
                    temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+parentBtn+caretSym+relativeBtn+removeRelative+subject+"</td></tr>";
                }else{
                    temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+parentBtn+caretSym+relativeBtn+'</button>'+subject+'</td></tr>';
                }
                this.shadow.getElementById("relativeTableBody").innerHTML += temp;
            }
            for (let key1=0;key1<resdec.length;key1++) {
                this.shadow.querySelector("#removeRelative_"+resdec[key1]['aaField']).addEventListener("click", ()=>{
                        this.removeRelative(resdec[key1]['aaField']);
                });
            }
        }    
    }

    async removeRelative (aaField){   
        const res = confirm("Πρόκειται να διαγράψετε ενα σχετικό έγγραφο");
        if (res == true) {  
            const {jwt,role} = getFromLocalStorage();
            const myHeaders = new Headers();
            myHeaders.append('Authorization', jwt);
            const formdata = new FormData();
            formdata.append('relativeAAField', aaField);
            formdata.append('currentYear', this.protocolYear);
            formdata.append('role',role);
            
            let init = {method: 'POST', headers : myHeaders, body : formdata};
            const res = await fetch("/api/removeRelative.php",init);
            if (!res.ok){
                const resdec = res.json();
                if (res.status ==  400){
                    alert(resdec['message']);
                }
                else if (res.status ==  401){
                    const resRef = await refreshToken();
                    if (resRef ==1){
                        this.removeRelative();
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
            }
        }
    }
   
    async saveRelative(){
        const relativeNo = this.shadow.getElementById("insertRelativeField").value;
        const relativeYear = this.shadow.getElementById("insertRelativeYearField").value;
        console.log(relativeNo);
        if (relativeNo == "" || relativeNo == undefined || relativeYear == "" || relativeYear == undefined){
            alert("Εισάγετε σωστό σχετικό");
            return;
        }
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);

        const formdata = new FormData();
        formdata.append('protocolNo',this.protocolNo);
        formdata.append('protocolYear',this.protocolYear);
        formdata.append('relativeNo',relativeNo);
        formdata.append('relativeYear',relativeYear);
        formdata.append('role',role);
        
        let init = {method: 'POST', headers : myHeaders, body :formdata};
        const res = await fetch("/api/saveRelative.php",init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  400){
                alert(resdec['message']);
            }
            else if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.saveRelative();
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
        }
    }

    
    showRelative(aaField){
        $('#example').DataTable().search(aaField).draw();
        $("#bottomSection").addClass("d-none");
        var elmnt = document.getElementById("tableButtonsSection");
    }
    
}

customElements.define("record-relative", Relative);