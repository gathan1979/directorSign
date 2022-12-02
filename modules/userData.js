import refreshToken from "./refreshToken.js"
	
export async function getUserData(){
	// const loginData = JSON.parse(localStorage.getItem("loginData"));
	// const jwt = loginData.jwt;
	// console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'POST', headers : myHeaders};
	console.log(init);
	const res = await fetch("/api/getUserData.php",init); 
	if (!res.ok){
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

export async function getUserRecords(){
	const loginData = JSON.parse(localStorage.getItem("loginData"));
	const jwt = loginData.jwt;
	//console.log(jwt);
	const myHeaders = new Headers();
	myHeaders.append('Authorization', jwt);
	let init = {method: 'GET', headers : myHeaders};
	//console.log(init);
	
	const params = new URLSearchParams({
		role: loginData.user.roles[0].aa_role
	});
	
	const res = await fetch("/api/getRecords.php?"+params,init); 
	if (!res.ok){
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
		//fillTable(res.json);
	}
}

export function fillTable(data){	  
	let table = $('#example').DataTable();
	table.clear().draw();
	
	for (let key=0;key<result.length;key++) {
		temp1=[];
		for (let key1=0;key1<tablelength;key1++) {
			
			if(result[key][key1]==""){
				temp1.push("");
			}
			else{
				temp1.push(result[key][key1]);
			}
				
		}
		table.row.add(temp1);
	}
	table.draw();

	
}