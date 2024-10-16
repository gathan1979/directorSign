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

        <link rel="stylesheet" type="text/css" href="/libraries/fontawesome-free-5.15.4-web/css/all.css" >

        <div id="paggingDiv" class="flexHorizontal" style="gap:2em; margin: 1em;padding: 0.2em 1em 0.2em 1em; justify-content : center;">
			<span id="previousPaggingBtn" style="cursor:pointer;"><i class="fas fa-chevron-left"></i></span>
			<div id="currentPageDiv" ><input type="number" style="width:5ch;" id="currentPageSelector"></input></div>	
			<span id="nextPaggingBtn" style="cursor:pointer;"><i class="fas fa-chevron-right"></i></span>
            <span>από</span><span id="totalPagesDiv"></span><span>(<span id="totalRecordsDiv"></span> εγγραφές)</span>
		</div>
    `;


class PagingSelector extends HTMLElement {
    shadow;
    totalRecords;
    paggingStart;
    paggingSize;
    timer = null;
    page = null;
    static observedAttributes = ["paggingstart"];

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = paggingSelectorDiv;
        this.page = this.dataset.page;
        console.log("page", this.page)
        this.totalRecords = this.attributes.totalRecords.value;
        this.paggingStart = this.attributes.paggingStart.value;
        this.paggingSize = this.attributes.paggingSize.value;
        this.shadow.querySelector('#currentPageSelector').value = +this.paggingStart +1;
        const maxPages = this.checkDisabledArrows();
        this.shadow.querySelector('#totalPagesDiv').innerText = maxPages;
        this.shadow.querySelector('#totalRecordsDiv').innerText = this.totalRecords;
        if (this.shadow.querySelector('#previousPaggingBtn')){
            this.shadow.querySelector('#previousPaggingBtn').addEventListener("click", ()=>{
                if (this.shadow.querySelector('#currentPageSelector').value != 1){
                    this.shadow.querySelector('#currentPageSelector').value -=1;
                    const pageChangeEvent = new CustomEvent("pageChangeEvent",  { bubbles: true, cancelable: false });
                    pageChangeEvent.currentPage = +this.shadow.querySelector('#currentPageSelector').value;
                    this.page = +this.shadow.querySelector('#currentPageSelector').value;
                    this.dataset.page = this.page;
                    let debouncedFilter = this.debounce( () =>  this.dispatchEvent(pageChangeEvent));
                    debouncedFilter();
                    this.checkDisabledArrows()
                }
            });
        }
    
        if (this.shadow.querySelector('#nextPaggingBtn')){
            this.shadow.querySelector('#nextPaggingBtn').addEventListener("click", ()=>{
                //console.log("++"+this.shadow.querySelector('#currentPageSelector').value+" "+maxPages)
                if (this.shadow.querySelector('#currentPageSelector').value != maxPages){
                    this.shadow.querySelector('#currentPageSelector').value= + this.shadow.querySelector('#currentPageSelector').value + 1;
                    const pageChangeEvent = new CustomEvent("pageChangeEvent",  { bubbles: true, cancelable: false });
                    pageChangeEvent.currentPage = +this.shadow.querySelector('#currentPageSelector').value;
                    this.page = +this.shadow.querySelector('#currentPageSelector').value;
                    this.dataset.page = this.page;
                    let debouncedFilter = this.debounce( () =>  this.dispatchEvent(pageChangeEvent));
                    debouncedFilter();
                    this.checkDisabledArrows()
                }
            });
        }

        if(this.shadow.querySelector('#currentPageSelector')){
            this.shadow.querySelector('#currentPageSelector').addEventListener("change",()=>{
                if(this.shadow.querySelector('#currentPageSelector').value < 1 ){
                    this.shadow.querySelector('#currentPageSelector').value = 1;    
                }
                if(this.shadow.querySelector('#currentPageSelector').value > maxPages ){
                    this.shadow.querySelector('#currentPageSelector').value = maxPages;    
                }
                const pageChangeEvent = new CustomEvent("pageChangeEvent",  { bubbles: true, cancelable: false });
                pageChangeEvent.currentPage = +this.shadow.querySelector('#currentPageSelector').value;
                this.page = +this.shadow.querySelector('#currentPageSelector').value;
                this.dataset.page = this.page;
                this.dispatchEvent(pageChangeEvent);
                this.checkDisabledArrows();
            })
        }
    }

    attributeChangedCallback(name, oldValue, newValue){
        if (name == "paggingstart"){ 
            //console.log(name)
            if (this.shadow){
                this.shadow.querySelector("#currentPageSelector").value = newValue+1;     
            }  
        }
    }

    disconnectedCallback() {    
    }

    debounce(func, timeout = 1000){
        return (...args) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

    checkDisabledArrows(){
        const maxPages =  Math.floor(this.totalRecords/ this.paggingSize) + ((this.totalRecords%this.paggingSize) ==0? 0: 1);

        if (this.shadow.querySelector('#currentPageSelector').value == 1){
            this.shadow.querySelector('#previousPaggingBtn').setAttribute("disabled","disabled");
        }
        else{
            this.shadow.querySelector('#previousPaggingBtn').removeAttribute("disabled");
        }
        if (this.shadow.querySelector('#currentPageSelector').value == maxPages){
            this.shadow.querySelector('#nextPaggingBtn').setAttribute("disabled","disabled");    
        }
        else{
            this.shadow.querySelector('#nextPaggingBtn').removeAttribute("disabled");
        }
        return maxPages;
    }

}

customElements.define("page-selector", PagingSelector);  