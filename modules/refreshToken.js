export default async function refreshToken(){
	const myHeaders = new Headers();
	//myHeaders.append('Authorization', jwt);
	
	let init = {method: 'POST', headers : myHeaders};
	const res = await fetch("/api/refreshToken.php",init); 
	console.log("refresh token running");
	if (res.ok){
		if (res.status >= 200 && res.status <= 299) {
			const resdec = await res.json();
			localStorage.setItem("jwt",resdec);
		}
		else{	
			logout();
		}
	}
	else{
		logout();
	}
	
	
}	

function logout(){
	window.close();
}