export class Logout {


    constructor(logoutService = "Keycloak") {
        this.logoutService = logoutService;
        this.logout();
    }

    async logout(){
        if (this.logoutService === "Keycloak"){
            const logoutRes = await this.logoutFromKeycloak();
            if (logoutRes){
                const settingFromStorage = localStorage.getItem("settings")!==null? JSON.parse(localStorage.getItem("settings")): {};
                localStorage.clear();
                localStorage.setItem("settings", JSON.stringify(settingFromStorage));
                return true;
            }
            return false;
        }
    }

    async logoutFromKeycloak(){
        try {
			const refreshURL = `https://10.142.49.91:8443/realms/pde/protocol/openid-connect/logout`;
            const loginData = JSON.parse(localStorage.getItem("loginData"));
			const rt = loginData.rt;
            const jwt = loginData.jwt;
			const refreshResult = await fetch(	refreshURL, 
												{
													method: "POST", 
													headers:
													{
														'Content-Type': 'application/x-www-form-urlencoded',
                                                        'Authorization' : `Bearer ${jwt}`
													},    
													body: new URLSearchParams(
														{ 	
															client_id: "public-client", 
															refresh_token: rt
														})
												}
											);

			if (!refreshResult.ok) {
				return false;
			}
		
		    return true;
			
		} catch (error) {
			return false;
		}
    }
}