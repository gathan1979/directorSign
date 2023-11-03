import { refreshTokenTest } from "./RefreshToken.js";
import getFromLocalStorage from "./LocalStorage.js";

export const FetchResponseType = {
    json : "json",
    blob : "blob",
    text : "text"
}

function fetchAuthHeader(){
    const {jwt,role} = getFromLocalStorage();	
    const myHeaders = new Headers();
    myHeaders.append('Authorization', jwt);
    return {myHeaders, role};    
}

export default async function runFetch(url, method, params, responseType = FetchResponseType.json, signal = null){   //params FormData || URLSearchParams || null
    const {myHeaders, role} = fetchAuthHeader();
    let  res;
    let init ={method, headers : myHeaders};
    let msg = "";

    const currentYear = (localStorage.getItem("currentYear")==null?new Date().getFullYear: localStorage.getItem("currentYear"));
    if (method=="POST" || method=="post"){
        if (params == null){
            params = new FormData();
        }
        params.append("currentRole", role);
        if (!params.has("currentYear")){
            params.append("currentYear", currentYear);
        }
        init.body = params;
    }
    else if (method="GET" || method=="get"){
        if (params == null){
            params = new URLSearchParams();
        }
        params.append("currentRole", role);
        if (!params.has("currentYear")){
            params.append("currentYear", currentYear);
        }
        url +="?"+ params;
    }
    if (signal !== null){
        init.signal = signal;
    }
    try{
        res = await fetch(url, init); 
        if (!res.ok){
            if (res.status == 401){
                const resRef = await refreshTokenTest();
                console.log("o "+url+" περιμένει...λέμε τώρα")
                if (resRef === 1){
                    runFetch(url, method, params);
                }
                else{
                    msg = ("Σφάλμα εξουσιοδότησης");
                    window.location = "10.142.49.10/directorSign/"	
                }
            }
            else{
                msg = printResponseErrorStatus(res);
            }
            return {success: false, msg, url, role};
        }
    }
    catch (e){
        return {success: false, msg: "Σφάλμα εκτέλεσης κλήσης. " +e, url, role};
    }
    let result;
    switch (responseType){
        case FetchResponseType.json : result = await res.json();break;
        case FetchResponseType.blob : result = await res.blob();break;
        case FetchResponseType.text : result = await res.text();break;
    }
    const returnObj = {success: true, msg : "Επιτυχία αιτήματος", url, role, result : result, responseHeaders : res.headers};
    //console.log(returnObj);
    return returnObj;
}

function printResponseErrorStatus(res){
    let msg="";
    if (res.status==400){
        msg = ("Σφάλμα αιτήματος.Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
    }
    else if (res.status==403){
        msg = ("δεν έχετε πρόσβαση στο συγκεκριμένο πρωτόκολλο");
    }
    else if (res.status==404){
        msg = ("το αρχείο δε βρέθηκε");
    }
    else if (res.status==500){
        msg = ("Σφάλμα συστήματος. Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
    }
    else {
        msg = ("Σφάλμα");
    }
    return msg;
}