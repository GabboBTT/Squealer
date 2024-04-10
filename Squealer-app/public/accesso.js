const formsign = document.getElementById("formsign");
const formcell = document.getElementById("formcell");
const UrlSite = 'https://site222325.tw.cs.unibo.it';
localStorage.setItem('inAwait', JSON.stringify(false));
let sign = true;
let security = false;
let actualuser;
var range;
let access = false;
let users;

async function getUsers(){
    try {
        const response = await fetch(UrlSite+'/get-users');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

async function addUserAndActualUser(nickname, email, password, fullname, type) {
    try {
        // Crea un oggetto utente base
        let userData = {
            nickname: nickname, 
            photoprofile: "", 
            email: email, 
            password: password, 
            fullname: fullname, 
            cell: "", 
            version: type, 
            blocked: false, 
            popularity: 0, 
            char_d: 300, 
            char_w: 2000,
            char_m: 7000, 
            notifications: [true, true, true, true]
        };

        // Aggiungi il campo managedAccounts se l'utente è un social media manager
        if (type === "social media manager") {
            userData.managedAccounts = [];
        }

        // Aggiungi l'utente
        await addUserAsync(userData);

        // Dopo che l'utente è stato aggiunto, ottieni gli utenti
        users = await getUsers();

        if (users && users.length > 0) {
            actualuser = users[users.length - 1];
            localStorage.setItem("actualUserId", JSON.stringify(actualuser._id));
            // Esegui altri compiti che dipendono da actualuser
            switch(type){
                case "normal":
                    window.location.href = UrlSite+'/squealer-app';
                break;
                case "social media manager":
                    window.location.href = UrlSite+'/SMM';
                break;
                case "moderator":
                    window.location.href = UrlSite+'/moderator';
                break;
                default:
                    window.location.href = UrlSite+'/squealer-app';
                break;
            }
        } else {
            console.log("Nessun utente trovato");
        }
    } catch (error) {
        console.error('There has been a problem:', error);
        // Gestire l'errore come necessario
    }
}
/*Fine nuova funzione */


fetch(UrlSite+'/get-users')
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json();
})
.then(data => {
    users = data;
})
.catch(error => console.error('There has been a problem with your fetch operation:', error));

async function addUserAsync(userData) {
    try {
        const response = await fetch(UrlSite+'/add-user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

function addUser(userData) {
    fetch(UrlSite+'/add-user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

function getUserById(id) {
    fetch(UrlSite+`/get-user/${id}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            return(data);
        })
        .catch(error => {
            console.error('Errore nella richiesta:', error);
        });
}

const requirements = [
    {regex: /.{8,}/, index: 0},     //minimo di 8 caratteri
    {regex: /[0-9]/, index: 1},     //almeno un numero
    {regex: /[a-z]/, index: 2},     //almeno una lettera minuscola
    {regex: /[^A-Za-z0-9]/, index: 3}, //almeno un carattere speciale
    {regex: /[A-Z]/, index: 4},     //almeno una lettera maiuscola
]
    
document.getElementById("signin").addEventListener("click", ()=>{
    formsign.classList.remove("translateform");
    document.getElementById("fullnamesign1").style = "display:none";
    document.getElementById("emailsign1").style = "display:none";
    document.getElementById("type_user1").style = "display:none";
    sign = true;
    access = true;
});
    
document.getElementById("signup").addEventListener("click", ()=>{
    formsign.classList.add("translateform");
    document.getElementById("fullnamesign1").style = "display:inline";
    document.getElementById("emailsign1").style = "display:inline";
    document.getElementById("type_user1").style = "display:inline";
    sign = false;
    access = true;
});

document.getElementById("signincell").addEventListener("click", ()=>{
    formcell.classList.remove("turnform");
    sign = true;
    access = true;
});
    
document.getElementById("signupcell").addEventListener("click", ()=>{
    formcell.classList.add("turnform");
    sign = false;
    access = true;
});

document.getElementById("passwordsign1").addEventListener("input", (e) => {
    range = document.getElementById("range_security1");
    range.value = 100;
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);

        if(!isValid) {
            range.value -= 20;    //essendo 5 condizioni decrementa dal massimo 100, 20 per ogni condizione non convalidata
        }
    })
    if(range.value==100){
        security = true;

    } else {
        security = false;

    }
});

document.getElementById("passwordsign3").addEventListener("input", (e) => {
    range = document.getElementById("range_security3");
    range.value = 100;
    requirements.forEach(item => {
        const isValid = item.regex.test(e.target.value);

        if(!isValid) {
            range.value -= 20;    //essendo 5 condizioni decrementa dal massimo 100, 20 per ogni condizione non convalidata
        }
    })
    if(range.value==100){
        security = true;

    } else {
        security = false;

    }
});

function login(x){
    let nickname = document.getElementById("nicknamesign"+x).value;
    let password = document.getElementById("passwordsign"+x).value;
    let email;
    let fullname;
    let type;
    if(x==3 | x==1){
        email = document.getElementById("emailsign"+x).value;
        fullname = document.getElementById("fullnamesign"+x).value;
        type = document.getElementById("type_user"+x).value;
    }
    let valid = false;
    if(sign){
        for(i=0;i<users.length;i++){
            if((nickname==users[i].nickname)&&(password==users[i].password)){
                valid = true;
                actualuser = users[i];
                localStorage.setItem("actualUserId", JSON.stringify(actualuser._id));
            }
        }
        if(valid){
            if(actualuser.blocked!=true){
                switch(actualuser.version){
                    case "normal":
                        window.location.href = UrlSite+'/squealer-app';
                    break;
                    case "social media manager":
                        window.location.href = UrlSite+'/SMM';
                    break;
                    case "moderator":
                        window.location.href = UrlSite+'/moderator';
                    break;
                    default:
                        window.location.href = UrlSite+'/squealer-app';
                    break;
                }
            } else {
                alert("This account has been blocked by a moderator!");
            }
        } else {
            alert('Invalid credentials');
        }
    } else {
        for(i=0;i<users.length;i++){
            if(((nickname==users[i].nickname)||(email==users[i].email))||(password==users[i].password)){
                valid = true;
            }
        }
        if(!valid){
            if(security){
                addUserAndActualUser(nickname, email, password, fullname, type);            
            } else {
                alert("Password not strong enough");
            }
        } else {
            alert("Credentials already used");
        }
    }
}

function password_security(x){
    if(!sign){
        document.getElementById("pass_security"+x).style = "display:inline";
        document.getElementById("range_security"+x).value = 0;
    }
}

function blur_password(x){
    if(!sign){
        document.getElementById("pass_security"+x).style = "display:none";
    }
}

document.getElementById("infopassword").addEventListener("mouseover", ()=>{
    document.getElementById("divinfopassword").style = "display:inline";
});

document.getElementById("infopassword").addEventListener("mouseout", ()=>{
    document.getElementById("divinfopassword").style = "display:none";
});

document.getElementById("notsign").addEventListener("click", ()=>{
    window.location.href = UrlSite+"/squealer-app";
    actualuser = "1";
    localStorage.setItem("actualUserId", JSON.stringify(actualuser));
});

document.getElementById("notsigncell").addEventListener("click", ()=>{
    window.location.href = UrlSite+"/squealer-app";
    actualuser = "1";
    localStorage.setItem("actualUserId", JSON.stringify(actualuser));
});