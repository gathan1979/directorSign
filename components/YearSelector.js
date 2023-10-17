import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const yearSelectorDiv = `
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
        <div id="topMenuAdminYearsDiv" class="flexHorizontal" style="align-items: center;align-self: stretch; padding: 5px; ">
			<span id="upYearsBtn" style="cursor:pointer;"><i class="fas fa-chevron-up"></i></span>
			<div id="protocolYears" ></div>	
			<div id="selectedYear" style="position:absolute;transform-origin: top right; rotate:30deg;translate: 35px -15px;background-color: coral; padding:5px; font-size: 0.85em; border-radius:5px;border-width:4px;border-color:lightyellow;border-right-style:solid;">2023</div>	
			<span id="downYearsBtn" style="cursor:pointer;"><i class="fas fa-chevron-down"></i></span>
		</div>
    `;


class YearSelector extends HTMLElement {
    shadow;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = yearSelectorDiv;
        
        const protocolYearsRes = await this.getProtocolYears();
        if (Array.isArray(protocolYearsRes.result.sort())){
                let currentYear = localStorage.getItem('currentYear');
                if (currentYear == null || (protocolYearsRes.result.indexOf(currentYear) == -1)){
                    currentYear = protocolYearsRes.result.at(-1);
                }
                localStorage.setItem("currentYear", currentYear);
                this.shadow.querySelector("#selectedYear").innerHTML = currentYear;
                const btn1 = `<button class="isButton extraSmall" data-year="${protocolYearsRes.result.at(-1)}">${protocolYearsRes.result.at(-1)}</button>`;
                this.shadow.querySelector("#protocolYears").innerHTML += btn1;
        }
        this.shadow.querySelector("#protocolYears>button").addEventListener("click", (elem)=>{
            this.shadow.querySelector("#selectedYear").classList.remove('faa-shake');
            this.shadow.querySelector("#selectedYear").classList.remove('animated');
            void  this.shadow.querySelector("#selectedYear").offsetWidth;
            localStorage.setItem("currentYear", elem.currentTarget.dataset.year);
            this.shadow.querySelector("#selectedYear").classList.add('faa-shake');
            this.shadow.querySelector("#selectedYear").classList.add('animated');
            this.shadow.querySelector("#selectedYear").innerHTML = localStorage.getItem("currentYear");
            const yearChangeEvent = new CustomEvent("yearChangeEvent",  { bubbles: true, cancelable: false });
            this.dispatchEvent(yearChangeEvent);
        })

        if (this.shadow.querySelector('#downYearsBtn')){
            this.shadow.querySelector('#downYearsBtn').addEventListener("click", ()=>{
                    const elem = this.shadow.querySelector('#protocolYears>button');
                    const index = protocolYearsRes.result.indexOf(elem.dataset.year);
                    if (index !== 0){
                        this.shadow.querySelector("#protocolYears>button").dataset.year = protocolYearsRes.result.at(index-1);
                        this.shadow.querySelector("#protocolYears>button").textContent = protocolYearsRes.result.at(index-1);
                    }
            });
        }
    
        if (this.shadow.querySelector('#upYearsBtn')){
            this.shadow.querySelector('#upYearsBtn').addEventListener("click", ()=>{
                const elem = this.shadow.querySelector('#protocolYears>button');
                    const index = protocolYearsRes.result.indexOf(elem.dataset.year);
                    if (index !== (protocolYearsRes.result.length-1)){
                        this.shadow.querySelector("#protocolYears>button").dataset.year = protocolYearsRes.result.at(index+1);
                        this.shadow.querySelector("#protocolYears>button").textContent = protocolYearsRes.result.at(index+1);
                    }
            });
        }
    }

    disconnectedCallback() {    
    }

    changeYear(){
       
    }

    async getProtocolYears(){
        const res = await runFetch("/api/getProtocolYears.php", "GET", null);
        if (!res.success){
            console.log(res.msg);
        }
        else{
            return  res.result;
        }
    }
    
}

customElements.define("year-selector", YearSelector);