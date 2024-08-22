import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const inputContent = `<div style="display:flex;">
                        <input  style="width: 50%;" type="text" class="formInput autoCompleteText" id="inputText">
                        <div id="contactsResult"></div>
                      </div>  
                    `;


class InputComplete extends HTMLElement {
    static observedAttributes = ["timestamp"];

    shadow;
    locked;
    searchTable;
    searchFields;
    timer;

    constructor() {
        super();
    }

    async connectedCallback(){
        //this.shadow = this.attachShadow({mode: 'open'});
        this.innerHTML = inputContent;
        if(this.attributes.inputId){
            this.querySelector(".autoCompleteText").setAttribute("id", this.attributes.inputid.value);
        }
        this.locked = this.dataset.locked;
        if (!+this.locked){
            this.querySelector(".autoCompleteText").disabled = false;
        }
        else{
            this.querySelector(".autoCompleteText").disabled = true;
        }
        this.searchTable = this.dataset.table;
        this.searchFields = this.dataset.fields.split(",");
        this.querySelector(".autoCompleteText").addEventListener("keyup", async (event) =>{
            if (this.querySelector(".autoCompleteText").value.length >3){
                let debounceFunc = this.debounce( async () =>  {
                    const res = await this.searchDB(this.querySelector(".autoCompleteText").value);
                });
                debounceFunc();
            }
            else{
                this.querySelector("#contactsResult").innerHTML = "";
            }
            if(event.keyCode === 13){
                event.preventDefault(); 
                this.querySelector("#contactsResult").innerHTML= "";
            }    
        })
    }

    disconnectedCallback() {
    
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name=="timestamp"){
            this.querySelector("#contactsResult").innerHTML = "";
            this.querySelector(".autoCompleteText").value = "";
        }
    }
    
    async searchDB(needle){
        let urlparams = new URLSearchParams({needle, table: this.searchTable, fields: JSON.stringify(this.searchFields)});

        const res = await runFetch("/api/searchSimilar.php", "GET", urlparams);
        if (!res.success){
        }
        else{
            const resdec = res.result;
           if (res.result.contacts){
                if(Array.isArray(res.result.contacts)){
                    this.querySelector("#contactsResult").innerHTML = "";
                    res.result.contacts.forEach( (element,index) => {
                        if (this.searchTable === "contacts@adeies"){
                            this.querySelector("#contactsResult").innerHTML+= `<div tabindex="0" style="cursor:pointer;">${element.firstName} ${element.lastName}</div>`;
                        }
                        else if (this.searchTable === "book@protocol"){
                            this.querySelector("#contactsResult").innerHTML+= `<div tabindex="0" style="cursor:pointer;">${element[this.searchFields[0]]}</div>`;
                        }
         
                    });
                    this.querySelectorAll("#contactsResult>div").forEach( proposal => {
                        proposal.addEventListener("focus", (event) => {
                            this.querySelector(".autoCompleteText").value = event.target.textContent;
                        })
                    })
                    this.querySelectorAll("#contactsResult>div").forEach( proposal => {
                        proposal.addEventListener("keyup", (event) => {
                            if(event.keyCode === 13){
                                event.preventDefault(); // Ensure it is only this code that runs
                                this.querySelector("#contactsResult").innerHTML= "";
                            }    
                        })
                    })
                }
           }
        }
    }

    debounce(func, timeout = 1000){
        return (...args) => {
            clearTimeout(this.timer);
            this.timer = setTimeout(() => { func.apply(this, args); }, timeout);
        };
    }

}

customElements.define("auto-complete", InputComplete);