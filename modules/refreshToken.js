export default async function refreshToken(){
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const res = await fetch("/api/refreshToken.php?aa_staff="+loginData.user.aa_staff); 
	return res;
	console.log("refresh token running");
	if (res.ok){
		if (res.status >= 200 && res.status <= 299) {
			const resdec = await res.json();
			//localStorage.setItem("jwt",resdec);
			loginData.jwt = resdec;
			localStorage.setItem("loginData",JSON.stringify(loginData));
		}
		else{	
			logout();
		}
	}
	else{
		logout();
	}
	
	
}	

