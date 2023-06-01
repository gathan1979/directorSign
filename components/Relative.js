import refreshToken from "../modules/RefreshToken.js";
import getFromLocalStorage from "../modules/LocalStorage.js";

const relativeContent = `
    <div id="relativeModule" style="display:flex;gap:10px;flex-direction:column;background: rgba(122, 160, 126, 0.2)!important;padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">
        
        <div style="display:flex;justify-content: space-between;align-items:center;">
            <div>
                <span id="relativeTableTitle" style="font-size:14px;font-weight:bold;">Σχετικά</span> 
                <span class="badge bg-secondary" id="relativeTableTitleBadge"></span>
            </div>
            <div>
                <button id="fullRelativeTree" type="button"  class="btn btn-sm btn-outline-success"><i class="fas fa-sitemap"></i></button>
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
        <div class="customDialogContent">
            <button style="margin-left:20px;align-self:flex-end;" class="btn btn-secondary" name="closeModalBtn" id="closeModalBtn" title="Κλείσιμο παραθύρου"><i class="far fa-times-circle"></i></button>
            <form>
                <div class="flexVertical" style="padding:5px;">
                    <span >Νέο Σχετικό</span>
                    <div class="flexHorizontal">
                        <input type="number" class="form-control form-control-sm" id="insertRelativeField" placeholder="αρ.πρωτ">&nbsp/&nbsp
                        <input type="number" class="form-control form-control-sm" id="insertRelativeYearField" value="">
                    </div>
                    <button id="insertRelativeBtn" type="button" class="btn btn-success mb-2">Εισαγωγή</button>	
                </div>
            </form>
        </div>
    </dialog>`;


class Relative extends HTMLElement {
    protocolNo;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = relativeContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.shadow.querySelector("#fullRelativeTree").addEventListener("click",()=>loadRelativeFull(1));
        this.shadow.querySelector("#insertRelativeBtn").addEventListener("click",()=>saveRelative());
        this.loadRelative(this.protocolNo,1);
        this.shadow.querySelector("#showRelativeModalBtn").addEventListener("click",()=> this.shadow.querySelector("#addRelativeModal").showModal());
        this.shadow.querySelector("#closeModalBtn").addEventListener("click", ()=> this.shadow.querySelector("#addRelativeModal").close());
    }

    disconnectedCallback() {
    
    }


    async loadRelative(protocolNo, active){
        this.shadow.querySelector("#insertRelativeField").value = "";
        this.shadow.querySelector("#insertRelativeYearField").value = new Date().getFullYear;
        this.shadow.querySelector("#relativeTableBody").innerHTML = "";

        const {jwt,role} = getFromLocalStorage();
        const myHeaders = new Headers();
        myHeaders.append('Authorization', jwt);
        let urlparams = new URLSearchParams({postData : protocolNo, currentYear : (localStorage.getItem("currentYear")?localStorage.getItem("currentYear"):new Date().getFullYear())});
        
        let init = {method: 'GET', headers : myHeaders};
        const res = await fetch("/api/getRelative.php?"+urlparams,init);
        if (!res.ok){
            const resdec = res.json();
            if (res.status ==  401){
                const resRef = await refreshToken();
                if (resRef ==1){
                    loadRelative(active);
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
                const removeRelative = '<button class="btn btn-sm btn-danger" onclick="removeRelative('+resdec[key1]['aaField']+')"><i class="far fa-minus-square"></i></button>';
                const spacesString ='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
                const subject = '&nbsp&nbsp&nbsp'+resdec[key1][4].substring(0, 50)+ "...";
                const subjectRel = '&nbsp&nbsp&nbsp'+resdec[key1][5].substring(0, 50)+ "...";
                //console.log(selectedIndex+" --- "+resdec[key1]['recordField']);
                if (active){
                    if (protocolNo == resdec[key1]['recordField']){
                        temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['relative']+');">'+resdec[key1]['relative']+"/"+resdec[key1]['year']+'</button>'+spacesString+removeRelative+subjectRel+"</td></tr>";
                    }
                    else{
                        temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['recordField']+');">'+resdec[key1]['recordField']+"/"+resdec[key1]['year']+'</button>'+spacesString+removeRelative+subject+"</td></tr>";
                    }
                }else{
                    if (protocolNo == resdec[key1]['recordField']){
                        temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['relative']+');">'+resdec[key1]['relative']+"/"+resdec[key1]['year']+'</button>'+spacesString+"</td></tr>";
                    }
                    else{
                        temp = "<tr><td id='sxet"+resdec[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+resdec[key1]['recordField']+');">'+resdec[key1]['recordField']+"/"+resdec[key1]['year']+'</button>'+spacesString+"</td></tr>";
                    }
                }
                this.shadow.getElementById("relativeTableBody").innerHTML += temp;
            }
        }    
    }
    
    async loadRelativeFull(active){
        $("#insertRelativeField").val('');
        $("#insertRelativeYearField").val('');
        $("#relativeTable tbody tr").remove(); 
        if (this.shadow.getElementById('fullRelativeTree').classList.contains('btn-success')){
            this.shadow.getElementById('fullRelativeTree').classList.remove('btn-success');
            this.shadow.getElementById('fullRelativeTree').classList.add('btn-outline-success');
            loadRelative(active);
            return;
        }
        else{
            this.shadow.getElementById('fullRelativeTree').classList.remove('btn-outline-success');
            this.shadow.getElementById('fullRelativeTree').classList.add('btn-success');
        }
        $.ajax({
           type: "post",
           data: {"postData" : selectedIndex},
           url: "getRelativeFull.php",
           success: function(msg){
             //console.log(msg); 
            result = jQuery.parseJSON(msg); 
            //console.log(result);
            temp4="";
            var html = "";
            $("#relativeButtonBadge").empty().html(result.length);
            for (var key1=0;key1<result.length;key1++) {
                var removeRelative = '<button class="btn-danger" onclick="removeRelative('+result[key1]['aaField']+')"><i class="far fa-minus-square"></i></button>';
                var spacesString ='&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp';
                var subject = '&nbsp&nbsp&nbsp'+result[key1][4].substring(0, 80)+ "...";
                var subjectRel = '&nbsp&nbsp&nbsp'+result[key1][5].substring(0, 80)+ "...";
                console.log(result[key1]['recordField']+" --- "+result[key1]['relative']+">>>>>"+subject+">>>>>"+subjectRel);
                if (active){
                    if (selectedIndex == result[key1]['recordField']){
                        temp = "<tr><td id='sxet"+result[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+result[key1]['relative']+');">'+result[key1]['relative']+"/"+result[key1]['year']+'</button>'+spacesString+removeRelative+subjectRel+"</td></tr>";
                    }
                    else if (selectedIndex == result[key1]['relative']){
                        temp = "<tr><td id='sxet"+result[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+result[key1]['recordField']+');">'+result[key1]['recordField']+"/"+result[key1]['year']+'</button>'+spacesString+removeRelative+subject+"</td></tr>";
                    }
                    else{
                        temp = "<tr><td id='sxet"+result[key1]['aaField']+"'>"+'<button class="btn btn-warning btn-sm" type="button" onclick="showRelative('+result[key1]['recordField']+');">'+result[key1]['recordField']+"/"+result[key1]['year']+'</button>'+'&nbsp<i class="far fa-arrow-alt-circle-right"></i>&nbsp'+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+result[key1]['relative']+');">'+result[key1]['relative']+"/"+result[key1]['year']+'</button>'+spacesString+removeRelative+subject+"|"+subjectRel+"</td></tr>";
                    }
                }else{
                    if (selectedIndex == result[key1]['recordField']){
                        temp = "<tr><td id='sxet"+result[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+result[key1]['relative']+');">'+result[key1]['relative']+"/"+result[key1]['year']+'</button>'+spacesString+subjectRel+"</td></tr>";
                    }
                    else{
                        temp = "<tr><td id='sxet"+result[key1]['aaField']+"'>"+'<button class="btn btn-info btn-sm" type="button" onclick="showRelative('+result[key1]['recordField']+');">'+result[key1]['recordField']+"/"+result[key1]['year']+'</button>'+spacesString+subject+"</td></tr>";
                    }
                }
                //console.log(temp);
                html = $.parseHTML(temp);
                $("#relativeTable tbody").append(html);
            }
           }
        })	
    }

    async removeRelative (aa){
        var r = confirm("Πρόκειται να διαγράψετε ενα σχετικό έγγραφο");
        if (r == true) {
            $.ajax({
                type: "post",
                data: {"aa" : aa},
                url: "removeRelative.php",
                success: function(msg){
                    //alert(msg);
                    if (msg="success"){
                        $(".message").html("επιτυχής διαγραφή");
                        $("#alert").show();
                    }
                    else{
                        $(".message").html(msg);
                        $("#alertError").show();
                    }
                    loadRelative();
                    
                }
            });	  		
        } 
    }
   
    async saveRelative(){
        var relative = this.shadow.getElementById("insertRelativeField").value;
        var year = this.shadow.getElementById("insertRelativeYearField").value;
        //console.log(comment);
        $.ajax({
                type: "post",
                data: {"postData" : selectedIndex, "relative": relative,"year": year},
                url: "saveRelative.php",
                success: function(msg){
                    //alert(msg);
                    if (msg="success"){
                        $(".message").html("επιτυχής καταχώρηση");
                        $("#alert").show();
                    }
                    else{
                        $(".message").html("σφάλμα στην καταχώρηση");
                        $("#alert1").show();
                    }
                    loadRelative();
                    //$('#addModal').modal('hide');
                    //setTimeout(window.location.reload.bind(window.location),1500);
                }
        });	
    }

    
    showRelative(aaField){
        $('#example').DataTable().search(aaField).draw();
        $("#bottomSection").addClass("d-none");
        var elmnt = document.getElementById("tableButtonsSection");
    }
    
}




customElements.define("record-relative", Relative);