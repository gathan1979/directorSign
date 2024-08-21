import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const inputContent = `<div style="display:flex;">
                        <input  style="width: 50%;" type="text" class="formInput autoCompleteText" id="inputText">
                        <div id="contactsResult"></div>
                      </div>  
                    `;


class InputComplete extends HTMLElement {

    shadow;
    locked;

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
        this.querySelector(".autoCompleteText").addEventListener("keyup", async () =>{
            if (this.querySelector(".autoCompleteText").value.length >3){
                await this.searchDB(this.querySelector(".autoCompleteText").value);
            }
            else{
                this.querySelector("#contactsResult").innerHTML = "";
            }
        })
    }

    disconnectedCallback() {
    
    }
    
    async searchDB(needle){
        let urlparams = new URLSearchParams({needle});

        const res = await runFetch("/api/searchContacts.php", "GET", urlparams);
        if (!res.success){
        }
        else{
            const resdec = res.result;
           if (res.result.contacts){
                if(Array.isArray(res.result.contacts)){
                    this.querySelector("#contactsResult").innerHTML = "";
                    res.result.contacts.forEach( (element,index) => {
                        this.querySelector("#contactsResult").innerHTML+= `<div tabindex="0" style="cursor:pointer;">${element.firstName} ${element.lastName}</div>`;
                        //this.querySelector(".autoCompleteText").value+= 
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

}

customElements.define("auto-complete", InputComplete);