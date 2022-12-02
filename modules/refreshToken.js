export default async function refreshToken(){
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	//console.log(loginData.user.aa_staff);
	const params = new URLSearchParams({
		aa_staff: loginData.user.aa_staff
	});
	const res = await fetch("/api/refreshToken.php?" + params); 
	//console.log("refresh token running");
	if (res.ok){
		if (res.status >= 200 && res.status <= 299) {
			const newJwt = await res.json();
			loginData.jwt = newJwt;
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

function logout(){
	window.close();
}