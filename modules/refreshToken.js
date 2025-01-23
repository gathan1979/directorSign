
export let peddingReq = null;
export let isRunning = false;

let keycloakFetchAdapter = null;

export function getKeycloakAdapter(){
    return keycloakFetchAdapter;
}

export function setKeycloakAdapter(value){
    keycloakFetchAdapter = value;
	console.log(keycloakFetchAdapter);
}

export default async function refreshToken(){
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const params = new URLSearchParams({
		aa_staff: loginData.user.aa_staff
	});
	const res = await fetch("/api/refreshToken.php?" + params); 
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
	//console.log(isRunning+".. τρέχει ")
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
						resolve(0);
					})
				}
				isRunning = false;
			}) 
			//console.log("refresh token running");
		})
	}
	return peddingReq;
}

export async function refreshTokenKeycloak(){
	if (!isRunning){
		try {
			const refreshURL = `https://10.142.49.91:8443/realms/pde/protocol/openid-connect/token`;
			const rt = JSON.parse(localStorage.getItem("loginData")).rt;
			const refreshResult = await fetch(	refreshURL, 
												{
													method: "POST", 
													headers:
													{
														'Content-Type': 'application/x-www-form-urlencoded'
													},    
													body: new URLSearchParams(
														{ 	
															client_id: "public-client", 
															grant_type: "refresh_token", 
															refresh_token: rt
														})
												}
											);

			if (!refreshResult.ok) {
				return false;
			}
			const newTokens = await refreshResult.json();
			if (localStorage.getItem("loginData")){
				let loginObject = JSON.parse(localStorage.getItem("loginData"));
				loginObject.jwt = newTokens.access_token;
				loginObject.rt = newTokens.refresh_token;
				localStorage.setItem("loginData", JSON.stringify(loginObject));
				return true;
			}
			else{
				return false;
			}
			
		} catch (error) {
			return false;
		}
	}
}


