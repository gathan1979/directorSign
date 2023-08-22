import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

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
    protocolNo;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = commentContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.shadow.querySelector("#showAddCommentModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addCommentModal").showModal());
        this.shadow.querySelector("#saveCommentBtn").addEventListener("click",()=>{ const comment = this.shadow.getElementById("insertCommentField").value; saveComment(this.protocolNo, comment);});
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addCommentModal").close());
        this.loadComments(this.protocolNo,1);
    }

    disconnectedCallback() {
    
    }
    
    async loadComments(protocolNo, active){
        this.shadow.querySelector("#insertCommentField").value = "";
        this.shadow.querySelector("#commentsTable tbody").innerHTML = "";
        this.shadow.querySelector("#commentsSpinner").display = "inline-block"; 
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({protocolNo, role, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getComments.php?"+urlparams,init);
        if (!res.ok){
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.loadComments(protocolNo, active);
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
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
            this.shadow.querySelector("#commentTableTitleBadge").textContent = resdec.length;
            let html = "";
            for (let key1=0;key1<resdec.length;key1++) {
                const commentUser = '<div class="verticalFlexWithPadding">'+resdec[key1]['userField']+"</div>";
                const removeComment = '<button id="removeCommentBtn-'+resdec[key1]['aaField']+'" class="btn btn-sm btn-danger"><i class="far fa-minus-square"></i></button>';
                const commentString = '<div>'+resdec[key1]['commentField']+(resdec[key1]['insertDateField'] !=null? " - στις <b>"+resdec[key1]['insertDateField']:"")+"</b></div>";;
                let temp = "";
                if (active){
                    temp = "<tr><td><div style='display:flex;gap:10px;align-items:center;'>"+commentUser+commentString+removeComment+"</div></td></tr>";
                }
                else{
                    temp = "<tr><td><div style='display:flex;gap:10px;align-items:center;'>"+commentUser+commentString+"</div></td></tr>";
                }
                html += temp;
            }
            this.shadow.querySelector("#commentsTable tbody").innerHTML = html;
            //onclick="removeComment('+resdec[key1]['aaField']+')"
            for (let key1=0;key1<resdec.length;key1++) {
                   this.shadow.querySelector("#removeCommentBtn-"+resdec[key1]['aaField']).addEventListener("click", ()=>{this.removeComment(this.protocolNo,resdec[key1]['aaField'])}); 
            }
        }
    }

    async removeComment (protocolNo, protocolYear, aa){
        var r = confirm("Πρόκειται να διαγράψετε ενα σχόλιο");
        if (r !== true) {
            //console.log(protocolNo, " - ", aa);
            return;
        }
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let formData = new FormData();
        formData.append("aaField",aa);
        formData.append("protocolNo",protocolNo);
        formData.append("protocolYear",protocolYear);
        formData.append("role",role);
        let init = {method: 'POST', headers : myHeaders, body : formData};
        const res = await fetch("/api/removeComment.php", init);
        if (!res.ok){
            this.shadow.querySelector("#commentsSpinner").display = "none"; 
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.removeComment(protocolNo, aa);
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
            this.loadComments(this.protocolNo,1);
        }    
    }

    async saveComment(protocolNo, protocolYear, comment){
        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let formData = new FormData();
        formData.append("commentField",comment);
        formData.append("protocolNo",protocolNo);
        formData.append("protocolYear",protocolYear);
        formData.append("role",role);
        let init = {method: 'POST', headers : myHeaders, body : formData};
        const res = await fetch("/api/removeComment.php", init);
        if (!res.ok){
           // this.shadow.querySelector("#commentsSpinner").display = "none"; 
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    this.saveComment(protocolNo, comment);
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
          //  this.shadow.querySelector("#commentsSpinner").display = "none"; 
            this.loadComments(this.protocolNo,1);
        }    
    }


    // async saveComment(aaUser){
    //     const comment = this.shadow.getElementById("insertCommentField").value;
    //     $.ajax({
    //            type: "post",
    //            data: {"postData" : selectedIndex, "commentField": comment,"aaUser": aaUser },
    //            url: "saveComment.php",
    //            success: function(msg){
    //                 //alert(msg);
    //                if (msg="success"){
    //                    $(".message").html("επιτυχής καταχώρηση");
    //                     $("#alert").show();
    //                }
    //                else{
    //                    $(".message").html("σφάλμα στην καταχώρηση");
    //                     $("#alert1").show();
    //                }
    //                loadComments(1);
    //            }
    //     });	
    // }

    // async removeComment (aa){
    //     var r = confirm("Πρόκειται να διαγράψετε ενα σχόλιο");
    //     if (r == true) {
    //             $.ajax({
    //             type: "post",
    //             data: {"aa" : aa},
    //             url: "removeComment.php",
    //             success: function(msg){
    //                     console.log(msg);
    //                 if (msg=="success"){
    //                     $(".message").html("επιτυχής διαγραφή");
    //                         $("#alert").show();
    //                 }
    //                 else{
    //                     $(".message").html(msg);
    //                         $("#alertError").show();
    //                 }
    //                 loadComments(1); 
    //                 }
    //             });	  		
    //     } else {
            
    //     }
    // } 
}

customElements.define("record-comment", Comment);