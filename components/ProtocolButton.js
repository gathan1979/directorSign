import {openProtocolRecord} from "../modules/ProtocolData.js";
import runFetch, {FetchResponseType} from "../modules/CustomFetch.js";

const protocolContent = `
    <style>
        /* SHAKE */
        .faa-shake.animated,
        .faa-shake.animated-hover:hover,
        .faa-parent.animated-hover:hover>.faa-shake {
            animation: wrench 2.5s ease infinite;
        }
        
        .faa-shake.animated.faa-fast,
        .faa-shake.animated-hover.faa-fast:hover,
        .faa-parent.animated-hover:hover>.faa-shake.faa-fast {
            animation: wrench 1.2s ease infinite;
        }
        
        .faa-shake.animated.faa-slow,
        .faa-shake.animated-hover.faa-slow:hover,
        .faa-parent.animated-hover:hover>.faa-shake.faa-slow {
            animation: wrench 3.7s ease infinite;
        }
        
        /* WRENCHING */
        @keyframes wrench {
            0%{transform:rotate(-12deg)}
            8%{transform:rotate(12deg)}
            10%{transform:rotate(24deg)}
            18%{transform:rotate(-24deg)}
            20%{transform:rotate(-24deg)}
            28%{transform:rotate(24deg)}
            30%{transform:rotate(24deg)}
            38%{transform:rotate(-24deg)}
            40%{transform:rotate(-24deg)}
            48%{transform:rotate(24deg)}
            50%{transform:rotate(24deg)}
            58%{transform:rotate(-24deg)}
            60%{transform:rotate(-24deg)}
            68%{transform:rotate(24deg)}
            75%,100%{transform:rotate(0deg)}
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

        .outline{
            background-color: rgba(255,255,255,0);
        }

        .small{
            font-size: 0.8em;
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

        #folderSearchText{
            min-height: 2em;
            border-radius : 5px;
        }

    </style>

    <button class="isButton" title=""></button>`;


class ProtocolButton extends HTMLElement {
    protocolNo;
    protocolYear;
    shadow;
    record;

    constructor() {
        super();
    }

    async connectedCallback(){
        this.shadow = this.attachShadow({mode: 'open'});
        this.shadow.innerHTML = protocolContent;
        this.protocolNo = this.attributes.protocolno.value;
        this.protocolYear = this.attributes.protocoldate.value.split("-")[0]; // ημερομηνία πρωτοκόλλου στην μορφή 2023-06-06
        this.shadow.querySelector("button").innerText= this.protocolNo+"/"+ this.protocolYear;
        this.shadow.querySelector("button").title = this.title ?? "";
        this.shadow.querySelector("button").addEventListener("click", async () => {
            //this.record  = await this.getRecord(this.protocolYear, this.protocolNo);
            openProtocolRecord(this.protocolNo, this.protocolYear, false);
        });
        //openProtocolRecord(this.record.subject, this.record.outSubjectField, this.record.aaField, this.record.insertDateField, this.record.status, false);
    }

    disconnectedCallback(){
    
    }

}

customElements.define("protocol-btn", ProtocolButton);