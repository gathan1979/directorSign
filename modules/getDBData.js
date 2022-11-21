
	
export async function getUserData(){
	let init = {method: 'POST'};
	//console.log(init);
	const res = await fetch("api_calls/getUserData.php",init); 
	return res.json();
}	