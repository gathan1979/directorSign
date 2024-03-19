import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const commentContent = `    

    <div id="commentModule" style="display:flex;gap:10px;flex-direction:column;background: rgba(122, 160, 180, 0.2)!important;padding:10px;height:100%;">	
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">

        <div style="display:flex;justify-content: space-between;align-items:center;">
            <div>
                <span id="commentTableTitle" style="font-size:14px;font-weight:bold;">Σχόλια</span> 
                <span class="badge bg-secondary" id="commentTableTitleBadge"></span>
                <div id="commentsSpinner" class="spinner-border" style="display:none;margin-left:1em;width: 1rem; height: 1rem;" role="status"></div>
            </div>
            <div>
                <button id="showAddCommentModalBtn" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-plus"></i></button>
            </div>
        </div>
        <div style="height:90%;overflow-y:scroll;">
            <table class="table" id="commentsTable">
                <tbody style="font-size : 12px;">
            
                </tbody>
            </table>
        </div>
        <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
    </div>

    <dialog id="addCommentModal" class="customDialog">
        <div class="customDialogContentTitle">
            <span style="font-weight:bold;">Νέο Σχόλιο</span>
            <button class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
        </div>
        <div class="customDialogContent">
            <div class="flexVertical">
                <form>
                    <div class="flexHorizontal">
                        <textarea type="text" cols="100" rows="2" class="form-control form-control-sm " id="insertCommentField"></textarea>
                    </div>
                </form>
                <button id="saveCommentBtn" type="button" class="btn-sm btn-success mb-2">Εισαγωγή</button>	
            </div>
        </div>
    </dialog>`;


class Comment extends HTMLElement {
    static observedAttributes = ["timestamp"];

    protocolNo;
    protocolYear;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = commentContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.shadow.querySelector("#showAddCommentModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addCommentModal").showModal());
        this.shadow.querySelector("#saveCommentBtn").addEventListener("click",()=>{ 
            const comment = this.shadow.getElementById("insertCommentField").value; 
            this.saveComment(this.protocolNo, this.protocolYear, comment);
        });
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addCommentModal").close());
        this.loadComments(this.protocolNo,1);
    }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldValue, newValue){
        //console.log("attribute changed");
        this.loadComments(this.protocolNo,1);
    }
    
    async loadComments(protocolNo, active){
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

    async removeComment (protocolNo, protocolYear, aa){
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

    async saveComment(protocolNo, protocolYear, comment){
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

customElements.define("record-comment", Comment);