export let peddingReq = null;
export let isRunning = false;

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
			return 1;
		}
		else{	
			return 0;
		}
	}
	else{
		return 0;
	}
}

export async function refreshTokenTest(){
	console.log(isRunning+".. τρέχει ")
	if (!isRunning){
		peddingReq = new Promise((resolve,reject)=>{
			isRunning = true;
			const loginData = JSON.parse(localStorage.getItem("loginData"));
			//console.log(loginData.user.aa_staff);
			const params = new URLSearchParams({
				aa_staff: loginData.user.aa_staff
			});
			fetch("/api/refreshToken.php?" + params).then((res)=>{
				if (res.ok){
					if (res.status >= 200 && res.status <= 299) {
						res.json().then((val)=>{
							loginData.jwt = val;
							localStorage.setItem("loginData",JSON.stringify(loginData));
							resolve(1);
						})
					}
					else{	
						 resolve(0);;
					}
				}
				else{
					res.json().then((val)=>{
						console.log(val['message']);
						resolve(0);;
					})
				}
				isRunning = false;
			}) 
			//console.log("refresh token running");
		})
	}
	return peddingReq;
}



