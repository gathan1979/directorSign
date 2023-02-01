export default function getFromLocalStorage(uploadURL="/api/uploadSigFiles.php",reloadNo = 0){
	//$("#loading").fadeIn();
	if (localStorage.getItem("loginData") == null){
		alert("Δεν υπάρχουν πληροφορίες σύνδεσης");
		return null;
	}
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const jwt = loginData.jwt;
	if (typeof jwt === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες αυθεντικοποίησης");
		return null;
	}
	const currentRole = (localStorage.getItem("currentRole")==null?0:localStorage.getItem("currentRole"));
	const role = loginData.user.roles[currentRole].aa_role;
	if (role === "undefined"){
		alert("Δεν υπάρχουν πληροφορίες ιδιότητας χρήστη");
		return null;
	}
	return {jwt, role, loginData};
}