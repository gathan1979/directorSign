import { refreshTokenTest } from "./RefreshToken.js";
import getFromLocalStorage from "./LocalStorage.js";

export const FetchResponseType = {
    json : "json",
    blob : "blob",
    text : "text"
}

async function fetchAuthHeader(url){
    const myHeaders = new Headers();
    if (url.split("/")[1] && (url.split("/")[1] === "admin")){
        if (localStorage.getItem("loginAdeies")){
            const jwt = localStorage.getItem("loginAdeies");
            myHeaders.append('Authorization', jwt);
            return {myHeaders, role : null}; 
        }
        else{
            window.location.href= "/admin/";
        }
    }
    else{
        const {jwt,role} = getFromLocalStorage() || {};	
        if (jwt !== undefined){
            myHeaders.append('Authorization', jwt);
            return {myHeaders, role};    
        }
        else{
            const init = {method: "POST"};
            await fetch("/api/logout.php",init);
            localStorage.clear();
            window.location.href= "/directorSign/";
        }
    }
}

export default async function runFetch(url, method, params, responseType = FetchResponseType.json, signal = null){   //params FormData || URLSearchParams || null
    const {myHeaders, role} = await fetchAuthHeader(url);
    let  res;
    let init ={method, headers : myHeaders};
    let msg = "";

    const currentYear = (localStorage.getItem("currentYear")==null?new Date().getFullYear(): localStorage.getItem("currentYear"));
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
            let resdec  = null;
            // 30-1-2024---
            if (FetchResponseType.json === responseType || res.headers.get("Content-Type")==="application/json"){
                resdec = await res.json();
            }
            //-------------
            if (res.status == 401){
                if (resdec.message){
                    if (resdec.message.includes("authFailed")){
                        if (resdec.message.includes("email")){
                            msg="Σφάλμα αυθεντικοποίησης αλληλογραφιας. Αποσυνδεθείτε και επανασυνδεθείτε";
                        }
                        if (resdec.message.includes("mindigital")){
                            msg="Σφάλμα αυθεντικοποίησης υπογραφών. Αποσυνδεθείτε και επανασυνδεθείτε";
                        }
                        else{
                            msg="Σφάλμα αυθεντικοποίησης";
                        }
                    }  
                }
                else{
                    if (role === null){
                        if (localStorage.getItem("loginAdeies")){
                            localStorage.removeItem("loginAdeies");
                        }
                        msg = ("Σφάλμα εξουσιοδότησης");
                        window.location = "/";	
                        return;  
                    }
                    else{
                        const resRef = await refreshTokenTest();
                        console.log("o "+url+" περιμένει...λέμε τώρα");
                        if (resRef === 1){
                            const rerunRes = await runFetch(url, method, params, responseType, signal);
                            return rerunRes;
                        }
                        else{
                            if (url.split("/")[1]){
                                msg = ("Σφάλμα εξουσιοδότησης");
                                window.location = `/${url.split("/")[1]}/`;	
                                return;
                            }
                            else{
                                msg = ("Σφάλμα εξουσιοδότησης");
                                window.location = "/";	
                                return;
                            }
                        }
                    }
                }
            }
            else{
                msg = await printResponseErrorStatus(res.status, res.headers.get("Content-Type") , resdec.message);
                console.log("σφάλμα μηνύματος" +msg)
            }
            return {success: false, msg, url, role};
        }
    }
    catch (e){
        return {success: false, msg: "Σφάλμα εκτέλεσης κλήσης. " +e, url, role};
    }
    let result;
    try{
        switch (responseType){
            case FetchResponseType.json : result = await res.json();break;
            case FetchResponseType.blob : result = await res.blob();break;
            case FetchResponseType.text : result = await res.text();break;
        }
    }
    catch(e){
        result = "";
    }
    const returnObj = {success: true, msg : "Επιτυχία αιτήματος", url, role, result : result, responseHeaders : res.headers};
    //console.log(returnObj);
    return returnObj;
}

async function printResponseErrorStatus(status, responseType, responseMessage){
    let msg="";
    //console.log(status, responseType, responseMessage)
    if (responseType === "application/json"){
        if (responseMessage !== ""){
            msg = responseMessage;
            return msg;
        }
    }

    if (status==400){
        msg = ("Σφάλμα αιτήματος.Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
    }
    else if (status==403){
        msg = ("δεν έχετε πρόσβαση στο συγκεκριμένο πρωτόκολλο");
    }
    else if (status==404){
        msg = ("το αρχείο δε βρέθηκε");
    }
    else if (status==406){
        msg = ("αρχείο μη αποδεκτό");
    }
    else if (status==500){
        msg = ("Σφάλμα συστήματος. Επικοινωνήστε με το διαχειριστή για αυτό το σφάλμα. Όχι για όλα τα σφάλματα!!");
    }
    else {
        msg = ("Σφάλμα");
    }
    return msg;
}