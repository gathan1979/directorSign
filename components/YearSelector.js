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
                border-style: none;
                border-right-style: solid;
                border-bottom-style: solid;
                border-color: #4f4a4a;
                padding : 5px;
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
			<span id="downYearsBtn" style="cursor:pointer;"><i class="fas fa-chevron-down"></i></span>
		</div>
    `;


class YearSelector extends HTMLElement {
    shadow;
    static observedAttributes = ["year"];
    protocolYears;
    yearsActiveTable;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = yearSelectorDiv;
        const extended = 1;
        const protocolYearsRes = await this.getProtocolYears(extended); // extented με πεδίο active
        if (protocolYearsRes == false){
            return null;
        }
        if (extended){
            this.protocolYears = protocolYearsRes.result.map( yearObject => {
                return yearObject.year;
            });
            this.yearsActiveTable = protocolYearsRes.result.map( yearObject => {
                return yearObject.active;
            });
        }
        else{
            this.protocolYears = protocolYearsRes.result;
        }

        const unlock = `<span> <i style="color: darkorange;" class="fas fa-lock"></i></span>`;
        const lock =`<span> <i class="fas fa-unlock"></i></span>`;

        if (Array.isArray(this.protocolYears.sort())){
            let currentYear = localStorage.getItem('currentYear');
            let currentYearIndex = this.protocolYears.indexOf(currentYear);
            //console.log(currentYear, currentYearIndex)
            if (currentYear == null || (this.protocolYears.indexOf(currentYear) == -1)){
                currentYear = this.protocolYears.at(-1);
                localStorage.setItem("currentYear", currentYear);
                currentYearIndex = this.protocolYears.length-1;
            }

            console.log(currentYear, currentYearIndex);
            if (currentYearIndex == 0){
                this.shadow.querySelector('#downYearsBtn').setAttribute("disabled","disabled");  
            }
            else if (currentYearIndex == this.protocolYears.length-1){
                this.shadow.querySelector('#upYearsBtn').setAttribute("disabled","disabled"); 
            }
            else{
                this.shadow.querySelector('#upYearsBtn').removeAttribute("disabled"); 
                this.shadow.querySelector('#upYearsBtn').removeAttribute("disabled"); 
            }
            const btn1 = `<button class="isButton extraSmall" style="background-color: var(--bs-success);" data-year="${this.protocolYears.at(currentYearIndex)}">${this.protocolYears.at(currentYearIndex)}
            ${protocolYearsRes.result[currentYearIndex].active==0?unlock:lock}`;
            this.shadow.querySelector("#protocolYears").innerHTML += btn1;
        }
        this.shadow.querySelector("#protocolYears>button").addEventListener("click", (elem)=>{
            const index = this.protocolYears.indexOf(elem.target.dataset.year);
            localStorage.setItem("currentYear", this.protocolYears[index]);
            const yearChangeEvent = new CustomEvent("yearChangeEvent",  { bubbles: true, cancelable: false });
            this.dispatchEvent(yearChangeEvent);
        })

        if (this.shadow.querySelector('#downYearsBtn')){
            this.shadow.querySelector('#downYearsBtn').addEventListener("click", ()=>{
                    const elem = this.shadow.querySelector('#protocolYears>button');
                    const index = this.protocolYears.indexOf(elem.dataset.year);
                    if (+index !== 0){
                        this.shadow.querySelector("#protocolYears>button").dataset.year = this.protocolYears.at(index-1);
                        this.shadow.querySelector("#protocolYears>button").innerHTML = this.protocolYears.at(index-1)+`${this.yearsActiveTable.at(index-1)==0?`${unlock}`:`${lock}`}</button>`;
                        localStorage.setItem("currentYear", this.protocolYears[index-1]);
                        const yearChangeEvent = new CustomEvent("yearChangeEvent",  { bubbles: true, cancelable: false });
                        this.dispatchEvent(yearChangeEvent);
                        if (index-1 == 0){
                            this.shadow.querySelector('#downYearsBtn').setAttribute("disabled", "disabled");           
                        }
                        else{
                            this.shadow.querySelector('#downYearsBtn').removeAttribute("disabled");  
                        }
                        if (+index == this.protocolYears.length-1){
                            this.shadow.querySelector('#upYearsBtn').removeAttribute("disabled"); 
                        }
                    }
            });
        }
    
        if (this.shadow.querySelector('#upYearsBtn')){
            this.shadow.querySelector('#upYearsBtn').addEventListener("click", ()=>{
                const elem = this.shadow.querySelector('#protocolYears>button');
                const index = this.protocolYears.indexOf(elem.dataset.year);
                if (index !== (this.protocolYears.length-1)){
                    this.shadow.querySelector("#protocolYears>button").dataset.year = this.protocolYears.at(index+1);
                    this.shadow.querySelector("#protocolYears>button").innerHTML = this.protocolYears.at(index+1)+`${this.yearsActiveTable.at(index+1)==0?`${unlock}`:`${lock}`}</button>`;
                    localStorage.setItem("currentYear", this.protocolYears[index+1]);
                    const yearChangeEvent = new CustomEvent("yearChangeEvent",  { bubbles: true, cancelable: false });
                    this.dispatchEvent(yearChangeEvent);
                    if (+index+1 == this.protocolYears.length-1){
                        this.shadow.querySelector('#upYearsBtn').setAttribute("disabled", "disabled"); 
                    }
                    else{
                        this.shadow.querySelector('#upYearsBtn').removeAttribute("disabled");  
                    }
                    if (index == 0){
                        this.shadow.querySelector('#downYearsBtn').removeAttribute("disabled");  
                    }
                }
            });
        }
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name == "year"){ 
            if(newValue !== this.shadow.querySelector("#protocolYears>button").dataset.year){
                console.log("Το έτος στην μνήμη είναι διαφορετικό από το επιλεγμένο έτος της καρτέλας")
                if (this.shadow){
                    //Να γίνει έλεγχος αν το newValue υπάρχει στα έτη
                    if (this.protocolYears.includes(newValue) === false){
                        console.log('το έτος επιλογής βρίσκεται εκτός επιλογής');
                        const logoutEvent = new CustomEvent("logoutEvent",  { bubbles: true, cancelable: false });
                        this.dispatchEvent(logoutEvent);
                        return;
                    }
                
                    this.shadow.querySelector("#protocolYears>button").dataset.year = newValue;
                    this.shadow.querySelector("#protocolYears>button").textContent = newValue;
                    //localStorage.setItem("currentYear", newValue);
                    const yearChangeEvent = new CustomEvent("yearChangeEvent",  { bubbles: true, cancelable: false });
                    this.dispatchEvent(yearChangeEvent);
                    if (+newValue == this.protocolYears.length-1){
                        this.shadow.querySelector('#upYearsBtn').setAttribute("disabled", "disabled"); 
                    }
                    else{
                        this.shadow.querySelector('#upYearsBtn').removeAttribute("disabled");  
                    }
                    if (+newValue == 0){
                        this.shadow.querySelector('#downYearsBtn').removeAttribute("disabled");  
                    }
                }  
            }
        }
    }

    disconnectedCallback() {    
    }

    changeYear(){
       
    }

    async getProtocolYears(extended = 1){
        const urlparams = new URLSearchParams({extended: extended})
        const res = await runFetch("/api/getProtocolYears.php", "GET", urlparams);
        if (!res.success){
            console.log(res.msg);
            return false;
        }
        else{
            return  res.result;
        }
    }
    
}

customElements.define("year-selector", YearSelector);