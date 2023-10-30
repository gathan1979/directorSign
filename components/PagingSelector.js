import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const paggingSelectorDiv = `
        <style>
            /* SHAKE */
            .faa-shake.animated,
            .faa-shake.animated-hover:hover,
            .faa-parent.animated-hover:hover>.faa-shake {
                animation: wrench 0.5s ease ;
            }
            
            /* WRENCHING */
            @keyframes wrench {
                0%{transform:rotateY( 0deg)}
                50%{transform:rotateY(-120deg)}
                100%{transform:rotateY(0deg)}
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

            .notification{
                background-color: var(--bs-blue);
            }

            .outline{
                background-color: rgba(255,255,255,0.6);
                color: black;
                border: 1px solid black;
            }

            .small{
                font-size: 0.875rem;
            }
            
            .extraSmall{
                font-size: 0.75rem;
            }
            
            .active{
                background-color: var(--bs-success);
            }
            
            .dismiss{
                background-color: var(--bs-danger);
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

            .departmentEmployees>button:nth-child(n+1){
                margin-left:20px;
            }

            .departmentEmployees>button:nth-child(1){
                margin-left:10px;
            }

            .flexVertical{
                display : flex;	
                flex-flow: column nowrap;
                gap : 0.2em;
                background-color : lightgray;
                border-radius : 5px;
                align-items : stretch;
                flex-basis : auto;
            }
            
            .flexHorizontal{
                display : flex;	
                flex-flow: row nowrap;
                gap : 0.2em;
                background-color : lightgray;
                border-radius : 5px;
                align-items : stretch;
                flex-basis : auto;
            }

            [disabled]{
                opacity: 0.5;
                pointer-events: none;
            }
        </style>
        <link href="css/all.css" rel="stylesheet">    
        <div id="paggingDiv" class="flexHorizontal" style="gap:2em;padding: 0.2em 1em 0.2em 1em; ">
			<span id="previousPaggingBtn" style="cursor:pointer;"><i class="fas fa-chevron-left"></i></span>
			<div id="currentPageDiv" ><input type="number" style="width:5ch;" id="currentPageSelector" value="1"></input></div>	
			<span id="nextPaggingBtn" style="cursor:pointer;"><i class="fas fa-chevron-right"></i></span>
            <span>από</span><span id="totalRecordsDiv"></span>
		</div>
    `;


class PagingSelector extends HTMLElement {
    shadow;
    totalRecords;
    paggingStart;
    paggingSize;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = paggingSelectorDiv;
        
        this.totalRecords = this.attributes.totalRecords.value;
        this.paggingStart = this.attributes.paggingStart.value;
        this.paggingSize = this.attributes.paggingSize.value;
        this.shadow.querySelector('#totalRecordsDiv').innerText = this.totalRecords;

        if (this.shadow.querySelector('#previousPaggingBtn')){
            this.shadow.querySelector('#previousPaggingBtn').addEventListener("click", ()=>{
                    
            });
        }
    
        if (this.shadow.querySelector('#nextPaggingBtn')){
            this.shadow.querySelector('#nextPaggingBtn').addEventListener("click", ()=>{
                
            });
        }
        console.log("pagging ok")
    }

    disconnectedCallback() {    
    }

}

customElements.define("page-selector", PagingSelector);