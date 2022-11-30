import refreshToken from "./refreshToken.js"
	
export async function getUserData(){
	const jwt = localStorage.getItem("jwt");
	console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders};
	console.log(init);
	const res = await fetch("/api/getUserData.php",init); 
	if (!res.ok){
		//console.log("Status "+res.status);
		if (res.status>=400 && res.status <= 499){
			refreshToken();
		}
		else{
			const error = new Error("unauthorized")
			error.code = "400"
			throw error;	
		}
	}
	else{
		return res.json();
	}
}	