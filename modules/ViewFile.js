import runFetch, {FetchResponseType} from "./CustomFetch.js";

export async function viewFile(filename, folder="", doc = document){  // doc= document or this.shadow.document
	if(filename === ""){
		alert("Δεν έχει οριστεί όνομα αρχείου");
		return;
	}
	const urlpar = new URLSearchParams({filename : encodeURIComponent(filename), folder});

	const res = await runFetch("/api/viewFileGeneral.php", "GET", urlpar, FetchResponseType.blob);
	if (!res.success){
		alert(res.msg);
	}
	else{
		const dispHeader = res.responseHeaders.get('Content-Disposition');
		if (dispHeader !== null){
			const parts = dispHeader.split(';');
			filename = parts[1].split('=')[1];
			filename = filename.replaceAll('"',"");
		}
		else{
			filename = "tempfile.tmp";
		}
		const fileExtension = filename.split('.').pop();
		const blob = res.result;
		const href = URL.createObjectURL(blob);
		const inBrowser = ['pdf','PDF','html','htm','jpg','png'];

		if (inBrowser.includes(fileExtension)){
			if (doc.querySelector("#fileOpenDialog")){
				doc.querySelector("#fileOpenDialog").innerHTML =
				`<div><div style="margin-bottom:10px;">Χρήση του αρχείου για : </div><div>
				<button class="isButton primary" id="fileOpenFromDialogBtn">Άνοιγμα</button>
				<button class="isButton active" id="fileSaveFromDialogBtn">Αποθήκευση</button>
				<button class="isButton secondary" id="fileCloseDialog">Κλείσιμο</button></div></div>`;
				doc.querySelector("#fileOpenFromDialogBtn").addEventListener("click",() => openFromDialog(href, filename));
				doc.querySelector("#fileSaveFromDialogBtn").addEventListener("click",() => saveFromDialog(href, filename, doc));
				doc.querySelector("#fileCloseDialog").addEventListener("click",() => closeFromDialog(doc));
				doc.querySelector("#fileOpenDialog").showModal();
			}
			return;
		}
		else{
			const aElement = doc.createElement('a');
			aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
			Object.assign(aElement, {
			href,
			download: decodeURI(filename)
			}).click();
		}
	}
}

function openFromDialog(href,filename){
	const pdfWin = window.open(href);
	//pdfWin.document.title = decodeURI(filename);
	setTimeout(()=>{pdfWin.document.title = decodeURI(filename)},1000);
	closeFromDialog();
}

function saveFromDialog(href,filename, doc){
	const aElement = document.createElement('a');
	aElement.addEventListener("click",()=>setTimeout(()=>URL.revokeObjectURL(href),10000));
	Object.assign(aElement, {
	href,
	download: decodeURI(filename)
	}).click();
	closeFromDialog(doc);
}

function closeFromDialog(doc){
	doc.querySelector("#fileOpenDialog").close();
}