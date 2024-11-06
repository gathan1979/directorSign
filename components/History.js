import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";


const historyContent = `    
    <div id="historyModule" class="isComponent" style="background: var(--my-component-dark);padding:10px;height:100%;">
        <link rel="stylesheet" type="text/css" href="bootstrap-5.1.3-dist/css/bootstrap.min.css" >
        <link rel="stylesheet" type="text/css" href="css/custom.css" />
        <link href="css/all.css" rel="stylesheet">

        <details open>
            <summary>
                <span id="historyTableTitle" style="font-weight:bold;">Ιστορικό</span>
                <span class="badge bg-secondary" id="historyTableTitleBadge"></span>
            </summary>
            <div style="height: clamp(50px, 200px, 300px); overflow-y: scroll;">
                <table class="table" id="historyTable">
                    <tbody style="font-size : 12px;">
                
                    </tbody>
                </table>
            </div>
            <div id="actionStatus" name="actionStatus" style="background-color: orange;"></div>
        </details>
    </div>`;


class History extends HTMLElement {
    static observedAttributes = ["timestamp"];

    protocolNo;
    protocolYear;
    shadow;

    constructor() {
        super();
    }

    connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = historyContent;
        this.protocolNo = this.attributes.protocolNo.value;
        this.protocolYear = this.attributes.protocolDate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.loadHistoryTranslated(this.protocolNo);
    }

    attributeChangedCallback(name, oldValue, newValue){
        //console.log("attribute changed");
        this.loadHistoryTranslated(this.protocolNo);
    }

    disconnectedCallback() {
    
    }

    async loadHistory(protocolNo){
        this.shadow.querySelector("#historyTable tbody").innerHTML = "";
        //this.shadow.querySelector("#historySpinner").display = "inline-block"; 
        const urlparams = new URLSearchParams({postData: this.protocolNo, currentYear : this.protocolYear})

        const res = await runFetch("/api/getHistory.php", "GET", urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            //this.shadow.querySelector("#historySpinner").display = "none"; 
        }
        else{
            const resdec = await res.result;
            //this.shadow.querySelector("#historySpinner").display = "none"; 
            this.shadow.querySelector("#historyTableTitleBadge").textContent = resdec.length;
            let html = "";
            //$("#historyTable").append(html);
            for (let key1=0;key1<resdec.length;key1++) {
                html += "<tr><td>"+resdec[key1]+"</td></tr>" ;
            }
            this.shadow.querySelector("#historyTable tbody").innerHTML = html;
        }
    }

    async loadHistoryTranslated(protocolNo){
        this.shadow.querySelector("#historyTable tbody").innerHTML = "";
        //this.shadow.querySelector("#historySpinner").display = "inline-block"; 
        const urlparams = new URLSearchParams({postData: this.protocolNo, currentYear : this.protocolYear})

        const res = await runFetch("/api/getHistoryTranslated.php", "GET", urlparams);
        if (!res.success){
            this.shadow.querySelector("#actionStatus").innerHTML = res.msg;
            this.shadow.querySelector("#historySpinner").display = "none"; 
        }
        else{
            const resdec = await res.result.ssr;
           // this.shadow.querySelector("#historySpinner").display = "none"; 
            this.shadow.querySelector("#historyTableTitleBadge").textContent = resdec.length;
            let html = "";
            //$("#historyTable").append(html);
            for (let key1=0;key1<resdec.length;key1++) {
                html += "<tr><td>"+resdec[key1]+"</td></tr>" ;
            }
            this.shadow.querySelector("#historyTable tbody").innerHTML = html;
        }
    }

}

customElements.define("record-history", History);