import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const roleSelectorDiv = `
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
                background-color: var(--my-secondary);
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
                background-color: var(--my-success);
            }

            .notification{
                background-color: var(--my-blue);
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
                background-color: var(--my-success);
            }
            
            .dismiss{
                background-color: var(--my-danger);
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
        <div id="topMenuAdminRolesDiv" class="flexHorizontal" style="align-items: center;align-self: stretch; padding: 5px; ">
			<span id="upRoleBtn" style="cursor:pointer;"><i class="fas fa-chevron-up"></i></span>
			<div id="allRoles"></div>	
			<span id="downRoleBtn" style="cursor:pointer;"><i class="fas fa-chevron-down"></i></span>
		</div>
    `;


class RoleSelector extends HTMLElement {
    shadow;
    timer = null;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = roleSelectorDiv;
        const {currentRole, roles} = this.getRoles();
        console.log(roles);
        if (Array.isArray(roles)){
                if (currentRole == null || (roles.at(currentRole) == undefined)){
                    currentRole = 0;
                }
                localStorage.setItem("currentRole", currentRole);
                if (currentRole == 0){
                    this.shadow.querySelector('#upRoleBtn').setAttribute("disabled","disabled");  
                }
                else if (currentRole == roles.length-1){
                    this.shadow.querySelector('#downRoleBtn').setAttribute("disabled","disabled"); 
                }
                else{
                    this.shadow.querySelector('#downRoleBtn').removeAttribute("disabled"); 
                    this.shadow.querySelector('#downRoleBtn').removeAttribute("disabled"); 
                }
                //this.shadow.querySelector("#selectedRole").innerHTML = roles.at(currentRole).roleName;
                const btn1 = `<button class="isButton extraSmall active" style="width: 60ch" data-role='${currentRole}'> ${roles.at(currentRole).roleName}</button>`;
                console.log(btn1);
                this.shadow.querySelector("#allRoles").innerHTML += btn1;
        }
        this.shadow.querySelector("#allRoles>button").addEventListener("click", (elem)=>{
            
        })

        if (this.shadow.querySelector('#upRoleBtn')){
            this.shadow.querySelector('#upRoleBtn').addEventListener("click", ()=>{
                    const elem = this.shadow.querySelector('#allRoles>button');
                    const index = +elem.dataset.role;
                    if (+index !== 0){
                        this.shadow.querySelector("#allRoles>button").dataset.role = index-1;
                        this.shadow.querySelector("#allRoles>button").innerHTML = roles.at(index-1).roleName;
                        localStorage.setItem("currentRole", index-1);
                        const roleChangeEvent = new CustomEvent("roleChangeEvent",  { bubbles: true, cancelable: false });
                        this.dispatchEvent(roleChangeEvent);
                        if (index-1 == 0){
                            this.shadow.querySelector('#upRoleBtn').setAttribute("disabled", "disabled");           
                        }
                        else{
                            this.shadow.querySelector('#upRoleBtn').removeAttribute("disabled");  
                        }
                        if (+index == roles.length-1){
                            this.shadow.querySelector('#downRoleBtn').removeAttribute("disabled"); 
                        }
                    }
                   
            });
        }
    
        if (this.shadow.querySelector('#downRoleBtn')){
            this.shadow.querySelector('#downRoleBtn').addEventListener("click", ()=>{
                const elem = this.shadow.querySelector('#allRoles>button');
                const index = +elem.dataset.role;
                if (+index !== (roles.length-1)){
                    this.shadow.querySelector("#allRoles>button").dataset.role = index+1;
                    this.shadow.querySelector("#allRoles>button").innerHTML = roles.at(index+1).roleName;
                    localStorage.setItem("currentRole", index+1);
                    const roleChangeEvent = new CustomEvent("roleChangeEvent",  { bubbles: true, cancelable: false });
                    this.dispatchEvent(roleChangeEvent);
                    console.log(index+1);
                    if (+index+1 == roles.length-1){
                        this.shadow.querySelector('#downRoleBtn').setAttribute("disabled", "disabled"); 
                    }
                    else{
                        this.shadow.querySelector('#downRoleBtn').removeAttribute("disabled");  
                    }
                    if (index == 0){
                        this.shadow.querySelector('#upRoleBtn').removeAttribute("disabled");  
                    }
                }
            });
        }
    }

    disconnectedCallback() {    
    }

    changeYear(){
       
    }

    getRoles(){
        let loginData = localStorage.getItem("loginData");
        let cRole = null;
        if (loginData === null){
            alert("Δεν υπάρχουν στοιχεία χρήστη");
            return;
        }
        else{
            loginData = JSON.parse(loginData);
            cRole = localStorage.getItem("currentRole");
            const roles = loginData.user.roles;
            return {currentRole : cRole, roles};
        }
    }
    
}

customElements.define("role-selector", RoleSelector);