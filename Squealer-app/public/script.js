let users;
let squeals;
let channels;
let actualuser;
let arruser;
let arrusertype = [];
let arrsqueals;
let arrsquealsdate = [];
let arrchannels = [];
let arrsearchchannel = [];
let arrchannelpopularity = [];
let arrCHANNELS = [];
let arrsearchCHANNEL = [];
let arruserpopularity = [];
let arrsquealreceiversusers = [];
let arrsquealreceiverschannels = [];
let input;
let inputsearch;
let edit;
let editchannel;
let editCHANNEL;
let editsqueal;
let arrcreateCHANNELowners = [];
let arrcreateCHANNELownersadd = [];
let arrcreateCHANNELmessages = [];
let list_posts = [];
const CHANNELsilenceable = document.getElementById("sectioncreateCHANNELsilenceable");
let num_message;
const filtersqueal = document.getElementById("filtersqueal");
let newphotoprofile = "";
let latitude = '';
let longitude = '';
var inputLink = '';
var map = null;
var map2 = null;
const UrlSite = 'https://site222325.tw.cs.unibo.it';


function getActualUser(){
    let actualUserId = JSON.parse(localStorage.getItem("actualUserId"));
    fetch(UrlSite+`/get-user/${actualUserId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        actualuser = data;
    })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

window.onload = async function() {
    document.getElementById("preload").classList.remove("d-none");
    await fetch(UrlSite+'/get-users')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        users = data;
        arruser = users;
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

    getActualUser();

    await fetch(UrlSite+'/get-listSqueals')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(async data => {
        squeals = data.reverse();
        arrsqueals = squeals;
        for(i=0;i<arrsqueals.length;i++){
            if(arrsqueals[i].body.photo===''){
                arrsqueals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            }
        }
        for(i=0;i<arrsqueals.length;i++){
            let videoURL = "";
            if(arrsqueals[i].body.video!=""){
                videoURL = arrsqueals[i].body.video;
            }
            let Address = await getAddressGeolocation(arrsqueals[i].body.position[0], arrsqueals[i].body.position[1])
            if(arrsqueals[i].channel==""){
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            } else {
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+' from '+arrsqueals[i].channel+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            }
            if(arrsqueals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                document.getElementById("imgsquealer").style = "display:none";
            }
            if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
            if(arrsqueals[i].photoprofile==""){
                if(arrsqueals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
            }
            document.getElementById("imgprofilesquealer").removeAttribute("id");
            document.getElementById("imgsquealer").removeAttribute("id");
        }
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));

    await fetch(UrlSite+'/get-listChannels')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        channels = data;
    })
    .catch(error => console.error('There has been a problem with your fetch operation:', error));
    document.getElementById("preload").classList.add("d-none");
}

async function updateUsers(updates, id) {
    await fetch(UrlSite+`/update-user/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {
            getActualUser();
        })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

async function deleteSqueal(id) {
    try {
        const response = await fetch(UrlSite+`/delete-squeal/${id}`, {
            method: 'DELETE'
          });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

async function deleteChannel(id) {
    try {
        const response = await fetch(UrlSite+`/delete-channel/${id}`, {
            method: 'DELETE'
          });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Errore nella richiesta:', error);
        throw error;
    }
}

async function updateSqueals(updates, id) {
    await fetch(UrlSite+`/update-squeal/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
        })
        .then(data => {

        })
    .catch(error => {
        console.error('Errore nella richiesta:', error);
    });
}

async function updateChannel(updates, id) {
    try {
        const response = await fetch(UrlSite+`/update-channel/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Canale non trovato o nessun aggiornamento necessario');
            } else if (response.status === 400) {
                throw new Error('Errore di rete. Impossibile completare la richiesta.');
            } else if (response.status === 500) {
                throw new Error('Errore di rete. Impossibile completare la richiesta.');
            }
            throw new Error('Errore di rete. Impossibile completare la richiesta.');
        }

    } catch (error) {
        console.error('Errore durante l\'aggiornamento del canale:', error);
        throw error;
    }
}

function addSqueal(squealData) {
    fetch(UrlSite+'/add-squeal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(squealData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

async function getListChannels() {
    try {
        const response = await fetch(UrlSite+'/get-listChannels');

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

async function getListSqueals() {
    try {
        const response = await fetch(UrlSite+'/get-listSqueals');

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        return data.reverse();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
        throw error;
    }
}

function addChannel(channelData) {
    fetch(UrlSite+'/add-channel', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(channelData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

document.getElementById("gotosquealer").addEventListener("click",()=>{      //fare collegamento con squealer app
    window.location.href = UrlSite+"/squealer-app";
});

function usersbtnclick(){
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:flex";
    document.getElementById("channelshome").style = "display:none";
    document.getElementById("listuser_find").innerHTML = "";
    document.getElementById("searchuser").value = "";
    document.getElementById("filterusertype").value = "all";
    document.getElementById("filteruserpopularity").value = "nothing";
    document.getElementById("sectionedituser").style = "display:none";
    arruserpopularity = [];
    arrusertype = [];
    if((users.length>0)&(users.length<8)){
        for(i=0;i<users.length;i++)
        document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+users[i].nickname+', '+users[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+users[i].nickname+', '+users[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    }
};

document.getElementById("searchuser").addEventListener("input",()=>{
    document.getElementById("listuser_find").innerHTML = "";
    document.getElementById("filterusertype").value = "all";
    arrusertype = [];
    document.getElementById("filteruserpopularity").value = "nothing";
    arruserpopularity = [];
    input = document.getElementById("searchuser").value;
    inputsearch = input.toLowerCase();
    arruser = [];
    if(inputsearch!=""){
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arruser.push(users[i]);
            }
        }
        if((arruser.length>0)&(arruser.length<8)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else if(arruser.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    } else {
        arruser = users;
        if((arruser.length>0)&(arruser.length<8)){
            for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

function showmore1(){
    document.getElementById("listuser_find").innerHTML = "";
    if(arruserpopularity.length>0){
        for(i=0;i<arruserpopularity.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    } else if(arrusertype.length>0){
        for(i=0;i<arrusertype.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    } else {
        for(i=0;i<arruser.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showless1()">Show less</p>';
    }
}

function showless1(){
    document.getElementById("listuser_find").innerHTML = "";
    if(arruserpopularity.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    } else if(arrusertype.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
    }
}

document.getElementById("filterusertype").addEventListener("change",()=>{
    if(arruser.length>0){
        document.getElementById("listuser_find").innerHTML = "";
        let filterusertype = document.getElementById("filterusertype").value;
        document.getElementById("filteruserpopularity").value = "nothing";
        arrusertype = [];
        arruserpopularity = [];
        if (filterusertype!="all"){
            for(i=0;i<arruser.length;i++){
                switch(filterusertype){
                    case 'user':
                        if((arruser[i].version=='user')|(arruser[i].version=='normal')|(arruser[i].version=='verified')|(arruser[i].version=='professional')){
                            arrusertype.push(arruser[i]);
                        }
                    break;
                    case 'social media manager':
                        if(arruser[i].version=='social media manager'){
                            arrusertype.push(arruser[i]);
                        }
                    break;
                    case 'moderator':
                        if(arruser[i].version=='moderator'){
                            arrusertype.push(arruser[i]);
                        }
                    break;
                }
            }
        } else {
            arrusertype = arruser;
        }
        if((arrusertype.length>0)&(arrusertype.length<8)){
            for(i=0;i<arrusertype.length;i++)
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arrusertype[i].nickname+', '+arrusertype[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else if(arrusertype.length==0){
            document.getElementById("listuser_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'" as "'+filterusertype+'". Try a new search.</p>';
        } else {
            for(i=0;i<7;i++){
                document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruser[i].nickname+', '+arruser[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

document.getElementById("filteruserpopularity").addEventListener("change",()=>{
    if(arruser.length>0){
        let filterpopularity = document.getElementById("filteruserpopularity").value;
        switch(filterpopularity){
            case "top":
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                    arruserpopularity.sort(function(a,b){
                        return b.popularity - a.popularity;
                    });
                } else {
                    arruserpopularity = arruser;
                    document.getElementById("filterusertype").value = "all";
                    arruserpopularity.sort(function(a,b){
                        return b.popularity - a.popularity;
                    });
                }
            break;
            case "down":
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                    arruserpopularity.sort(function(a,b){
                        return a.popularity - b.popularity;
                    });
                } else {
                    arruserpopularity = arruser;
                    document.getElementById("filterusertype").value = "all";
                    arruserpopularity.sort(function(a,b){
                        return a.popularity - b.popularity;
                    });
                }
            break;
            default:
                if(arrusertype.length>0){
                    arruserpopularity = arrusertype;
                } else {
                    arruserpopularity = arruser;
                }
            break;
        }
        document.getElementById("listuser_find").innerHTML = "";
        if((arruserpopularity.length>0)&(arruserpopularity.length<8)){
            for(i=0;i<arruserpopularity.length;i++)
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listuser_find").innerHTML += '<div class="found"><p>'+arruserpopularity[i].nickname+', '+arruserpopularity[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="edituser('+i+')">Edit</button></div>';
            }
            document.getElementById("listuser_find").innerHTML += '<p class="showmore" onclick="showmore1()">Show more</p>';
        }
    }
});

function edituser(x){
    if(arruserpopularity.length>0){
        edit = arruserpopularity[x];
    } else if(arrusertype.length>0){
        edit = arrusertype[x];
    } else {
        edit = arruser[x];
    }
    document.getElementById("sectionedituser").style = "display:flex";
    if(edit.photoprofile!="")
        document.getElementById("sectionedituserphoto").src = edit.photoprofile;
    else 
        document.getElementById("sectionedituserphoto").src = "../img/profile_photo1.png";
    document.getElementById("sectioneditusername").innerText = edit.nickname;
    if(edit.blocked)
        document.getElementById("sectionedituserblock").innerText = "Unblock";
    else 
        document.getElementById("sectionedituserblock").innerText = "Block";
    document.getElementById("sectionedituserdaily").innerText = "Remaining daily characters: "+edit.char_d;
    document.getElementById("sectionedituserweekly").innerText = "Remaining weekly characters: "+edit.char_w;
    document.getElementById("sectioneditusermonthly").innerText = "Remaining monthly characters: "+edit.char_m;
}

function addchardaily(){
    let add = document.getElementById("sectionedituserdailyinsert").value;
    edit.char_d = JSON.parse(edit.char_d) + parseInt(add);
    document.getElementById("sectionedituserdaily").innerText = "Remaining daily characters: "+edit.char_d;
    document.getElementById("sectionedituserdailyinsert").value = "";
    savechangesuser();
}

function addcharweekly(){
    let add = document.getElementById("sectionedituserweeklyinsert").value;
    edit.char_w = JSON.parse(edit.char_w) + parseInt(add);
    document.getElementById("sectionedituserweekly").innerText = "Remaining daily characters: "+edit.char_w;
    document.getElementById("sectionedituserweeklyinsert").value = "";
    savechangesuser();
}

function addcharmonthly(){
    let add = document.getElementById("sectioneditusermonthlyinsert").value;
    edit.char_m = JSON.parse(edit.char_m) + parseInt(add);
    document.getElementById("sectioneditusermonthly").innerText = "Remaining daily characters: "+edit.char_m;
    document.getElementById("sectioneditusermonthlyinsert").value = "";
    savechangesuser();
}

document.getElementById("sectionedituserblock").addEventListener("click",()=>{
    if(edit.blocked){
        document.getElementById("sectionedituserblock").innerText = "Block";
        edit.blocked = false;
    } else {
        document.getElementById("sectionedituserblock").innerText = "Unblock";
        edit.blocked = true;
    }
    savechangesuser();
});

function savechangesuser(){
    for(i=0;i<users.length;i++){
        if(edit.nickname==users[i].nickname){
            users[i] = edit;
        }
    }
    const updates = {blocked: edit.blocked, char_d: edit.char_d, char_w: edit.char_w, char_m: edit.char_m}
    updateUsers(updates, edit._id);
}

document.getElementById("closeedituser").addEventListener("click", ()=>{
    document.getElementById("sectionedituser").style = "display:none";
});

/*------------------------------------------------------------------------------------------------------------*/

async function squealbtnclick(){
    document.getElementById("squealhome").style = "display:flex";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:none";
    document.getElementById("sectioneditsqueal").style = "display:none";
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    document.getElementById("filtersqueal").value = "sender";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("searchsqueal").placeholder = "Search sender";
    arrsquealsdate = [];
    for(i=0;i<squeals.length;i++){
        if(squeals[i].body.photo===''){
            squeals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
    }
    for(i=0;i<squeals.length;i++){
        let videoURL = "";
            if(squeals[i].body.video!=""){
                videoURL = squeals[i].body.video;
            }
        let Address = await getAddressGeolocation(squeals[i].body.position[0], squeals[i].body.position[1]);
        if(squeals[i].channel=="")
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
        else 
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+' from '+squeals[i].channel+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
        if(squeals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
            document.getElementById("imgsquealer").style = "display:none";
        }
        if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        document.getElementById("imgsquealer").removeAttribute("id");
        if(squeals[i].photoprofile==""){
            if(squeals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
        }
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
};

document.getElementById("filtersqueal").addEventListener("change",async ()=>{
    document.getElementById("datesqueal").value = "";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("listsqueals_find").innerHTML = "";
    switch(filtersqueal.value){
        case "sender":
            document.getElementById("searchsqueal").placeholder = "Search sender";
            for(i=0;i<squeals.length;i++){
                if(squeals[i].body.photo===''){
                    squeals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                }
            }
            for(i=0;i<squeals.length;i++){
                let videoURL = "";
            if(squeals[i].body.video!=""){
                videoURL = squeals[i].body.video;
            }
                let Address = await getAddressGeolocation(squeals[i].body.position[0], squeals[i].body.position[1]);
                if(squeals[i].channel=="")
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                else
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+' from '+squeals[i].channel+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex;flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(squeals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        break;
        case "receiver":
            document.getElementById("searchsqueal").placeholder = "Search receiver";
            for(i=0;i<squeals.length;i++){
                if(squeals[i].body.photo===''){
                    squeals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                }
            }
            for(i=0;i<squeals.length;i++){
                let videoURL = "";
            if(squeals[i].body.video!=""){
                videoURL = squeals[i].body.video;
            }
                let Address = await getAddressGeolocation(squeals[i].body.position[0], squeals[i].body.position[1]);
                if(squeals[i].channel=="")
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                else 
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+' from '+squeals[i].channel+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(squeals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        break;
    }
});

document.getElementById("datesqueal").addEventListener("change",async ()=>{
    let datesqueal = document.getElementById("datesqueal").value;
    let partiData = datesqueal.split('-');
    datesqueal = partiData[2] + '/' + partiData[1] + '/' + partiData[0];
    document.getElementById("listsqueals_find").innerHTML = "";
    let j = 0;
    arrsquealsdate = [];
    if(arrsqueals.length==0){
        for(i=0;i<squeals.length;i++){
            if(squeals[i].body.photo===''){
                squeals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            }
        }
        for(i=0;i<squeals.length;i++){
            if(datesqueal==squeals[i].date){
                arrsquealsdate.push(squeals[i]);
                j += 1;
                let videoURL = "";
                if(squeals[i].body.video!=""){
                    videoURL = squeals[i].body.video;
                }
                let Address = await getAddressGeolocation(squeals[i].body.position[0], squeals[i].body.position[1]);
                if(squeals[i].channel=="")
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                else 
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+' from '+squeals[i].channel+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
                if(squeals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
                document.getElementById("imgsquealer").removeAttribute("id");
                if(squeals[i].photoprofile==""){
                    if(squeals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        }
        if(j==0){
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">Nothing was found by this search. Try with other input.</p>';
        }
    } else {
        for(i=0;i<arrsqueals.length;i++){
            if(arrsqueals[i].body.photo===''){
                arrsqueals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            }
        }
        for(i=0;i<arrsqueals.length;i++){
                if(datesqueal==arrsqueals[i].date){
                arrsquealsdate.push(arrsqueals[i]);
                j += 1;
                let videoURL = "";
                if(arrsqueals[i].body.video!=""){
                    videoURL = arrsqueals[i].body.video;
                }
                let Address = await getAddressGeolocation(arrsqueals[i].body.position[0], arrsqueals[i].body.position[1]);
                if(arrsqueals[i].channel=="")
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                else
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+' from '+arrsqueals[i].channel+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    if(arrsqueals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        }
        if(j==0){
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">Nothing was found by this search. Try with other input.</p>';
        }
    }
});

document.getElementById("searchsqueal").addEventListener("input",async ()=>{
    let searchsqueal = document.getElementById("searchsqueal").value;
    arrsqueals = [];
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    input = document.getElementById("searchsqueal").value;
    inputsearch = input.toLowerCase();
    if(inputsearch!=""){
        if(filtersqueal.value=="sender"){
            for(i=0;i<squeals.length;i++){
                let mex = ((squeals[i].sender).slice(0,inputsearch.length)).toLowerCase();
                if(inputsearch==mex){
                    const inreceivers = arrsqueals.find(oggetto => {
                        return oggetto == squeals[i];
                      });
                    if(!inreceivers)
                        arrsqueals.push(squeals[i]);
                }
            }
        } else if(filtersqueal.value=="receiver"){
            for(i=0;i<squeals.length;i++){
                for(j=0;j<squeals[i].receivers.length;j++){
                    let mex = ((squeals[i].receivers[j]).slice(1,(inputsearch.length+1))).toLowerCase();
                    if(inputsearch==mex){
                        const inreceivers = arrsqueals.find(oggetto => {
                            return oggetto == squeals[i];
                          });
                        if(!inreceivers)
                            arrsqueals.push(squeals[i]);
                    }
                }
            }
        }
        if(arrsqueals.length!=0){ 
            for(i=0;i<arrsqueals.length;i++){
                if(arrsqueals[i].body.photo===''){
                    arrsqueals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                }
            } 
            for(i=0;i<arrsqueals.length;i++){
                let videoURL = "";
                if(arrsqueals[i].body.video!=""){
                    videoURL = arrsqueals[i].body.video;
                }
                let Address = await getAddressGeolocation(arrsqueals[i].body.position[0], arrsqueals[i].body.position[1])
                if(arrsqueals[i].channel=="")
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                else
                    document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+' from '+arrsqueals[i].channel+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
                if(arrsqueals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                    document.getElementById("imgsquealer").style = "display:none";
                }
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
                document.getElementById("imgsquealer").removeAttribute("id");
                if(arrsqueals[i].photoprofile==""){
                    if(arrsqueals[i].channel=="")
                        document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                    else 
                        document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
                }
                document.getElementById("imgprofilesquealer").removeAttribute("id");
            }
        } else{
            document.getElementById("listsqueals_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        arrsqueals = squeals;
        for(i=0;i<arrsqueals.length;i++){
            if(arrsqueals[i].body.photo===''){
                arrsqueals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            }
        }
        for(i=0;i<arrsqueals.length;i++){
            let videoURL = "";
            if(arrsqueals[i].body.video!=""){
                videoURL = arrsqueals[i].body.video;
            }
            let Address = await getAddressGeolocation(arrsqueals[i].body.position[0], arrsqueals[i].body.position[1]);
            if(arrsqueals[i].channel=="")
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            else
                document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+arrsqueals[i].photoprofile+'" alt=""><h5>'+arrsqueals[i].sender+' from '+arrsqueals[i].channel+'</h5><p class="card-text mb-0 me-3">'+arrsqueals[i].date+'</p><p class="card-text">'+arrsqueals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+arrsqueals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+arrsqueals[i].body.link+'">'+arrsqueals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+arrsqueals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+arrsqueals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+arrsqueals[i].neg_reactions+'</span></div></div></div>';
            if(arrsqueals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
                document.getElementById("imgsquealer").style = "display:none";
            }
            if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
            document.getElementById("imgsquealer").removeAttribute("id");
            if(arrsqueals[i].photoprofile==""){
                if(arrsqueals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "img/group_photo1.png";
            }
            document.getElementById("imgprofilesquealer").removeAttribute("id");
        }
    }
});

function editmex(x){
    if(arrsquealsdate.length>0)
        editsqueal = arrsquealsdate[x];
    else if(arrsqueals.length>0)
        editsqueal = arrsqueals[x];
    else
        editsqueal = squeals[x];
    document.getElementById("sectioneditsqueal").style = "display:flex";
    document.getElementById("sectioneditsquealreceivers").style = "display:flex";
    document.getElementById("sectioneditsquealreactions").style = "display:none";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:1px solid black";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    document.getElementById("searchaddreceivers").value = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
}

function savechangessqueal(){
    for(i=0;i<squeals.length;i++){
        if((editsqueal.sender==squeals[i].sender)&(editsqueal.date==squeals[i].date)&(editsqueal.hour==squeals[i].hour)&(editsqueal.seconds==squeals[i].seconds)){
            squeals[i] = editsqueal;
            if(squeals[i].channel!=""){
                for(j=0; j<channels.length; j++){
                    if(channels[j].name==squeals[i].channel){
                        for(k=0; k<channels[j].list_posts.length; k++){
                            if((editsqueal.sender==channels[j].list_posts[k].sender)&(editsqueal.date==channels[j].list_posts[k].date)&(editsqueal.hour==channels[j].list_posts[k].hour)&(editsqueal.seconds==channels[j].list_posts[k].seconds)){
                                channels[j].list_posts[k] = editsqueal;
                                const updates = {list_posts: channels[j].list_posts};
                                updateChannel(updates, channels[j]._id);
                            }
                        }
                    }
                }
            }
        }
    }
    const updates = {receivers: editsqueal.receivers, pos_reactions: editsqueal.pos_reactions, neg_reactions: editsqueal.neg_reactions, category:editsqueal.category}
    updateSqueals(updates, editsqueal._id);
    for(j=0;j<channels.length;j++){
        if(editsqueal.sender == channels[j].name){
            if(channels[j].type=="$"){
                editCHANNEL = channels[j];
                edit_listposts(1);
            } else if(channels[j].type == "&"){
                editchannel = channels[j];
                edit_listposts(2);
            }
        }
    }
}

document.getElementById("closeeditsqueal").addEventListener("click",async ()=>{
    document.getElementById("sectioneditsqueal").style = "display:none";
    document.getElementById("listsqueals_find").innerHTML = "";
    document.getElementById("datesqueal").value = "";
    document.getElementById("filtersqueal").value = "sender";
    document.getElementById("searchsqueal").value = "";
    document.getElementById("searchsqueal").placeholder = "Search sender";
    arrsquealsdate = [];
    for(i=0;i<squeals.length;i++){
        if(squeals[i].body.photo===''){
            squeals[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        }
    }
    for(i=0;i<squeals.length;i++){
        let videoURL = "";
            if(squeals[i].body.video!=""){
                videoURL = squeals[i].body.video;
            }
        let Address = await getAddressGeolocation(squeals[i].body.position[0], squeals[i].body.position[1]);
        if(squeals[i].channel=="")
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
        else 
            document.getElementById("listsqueals_find").innerHTML += '<div class="card border-light mb-4 mexcard"><div class="card-header" ><img id="imgprofilesquealer" src="'+squeals[i].photoprofile+'" alt=""><h5>'+squeals[i].sender+' from '+squeals[i].channel+'</h5><p class="card-text mb-0 me-3">'+squeals[i].date+'</p><p class="card-text">'+squeals[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+squeals[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+squeals[i].body.link+'">'+squeals[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+squeals[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary editmexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="editmex('+i+')">Edit</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+squeals[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+squeals[i].neg_reactions+'</span></div></div></div>';
        if(squeals[i].body.photo=="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"){
            document.getElementById("imgsquealer").style = "display:none";
        }
        if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        document.getElementById("imgsquealer").removeAttribute("id");
        if(squeals[i].photoprofile==""){
            if(squeals[i].channel=="")
                    document.getElementById("imgprofilesquealer").src = "../img/profile_photo1.png";
                else 
                    document.getElementById("imgprofilesquealer").src = "../img/group_photo1.png";
        }
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
});

document.getElementById("sectioneditsquealreactionssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:flex";
    document.getElementById("sectioneditsquealreceivers").style = "display:none";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:1px solid black";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
});

document.getElementById("sectioneditsquealreceiverssection").addEventListener("click",()=>{
    document.getElementById("sectioneditsquealreactions").style = "display:none";
    document.getElementById("sectioneditsquealreceivers").style = "display:flex";
    document.getElementById("sectioneditsquealreactionssection").style = "border-bottom:0";
    document.getElementById("sectioneditsquealreceiverssection").style = "border-bottom:1px solid black";
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    document.getElementById("searchaddreceivers").value = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
});

function editpositivereactions(){
    let add = document.getElementById("editpositivereactions").value;
    if(add!=""){
    editsqueal.pos_reactions = JSON.parse(editsqueal.pos_reactions) + parseInt(add);
    if(editsqueal.pos_reactions<0){
        editsqueal.pos_reactions = 0;
    }
    if(editsqueal.pos_reactions>0.25*editsqueal.impressions){
        if(editsqueal.neg_reactions>0.25*editsqueal.impressions){
          editsqueal.category = "controversial";
          for(let i=0;i<channels.length;i++){
            if(channels[i].name == "CONTROVERSIAL"){
                channels[i].list_posts.push(editsqueal);
		const updates = {list_posts: channels[i].list_posts};
                updateChannel(updates, channels[i]._id);
            }
          }
        } else {
          editsqueal.category = "popular";
        }
      } else if(editsqueal.neg_reactions>0.25*editsqueal.impressions) {
        editsqueal.category = "unpopular";
      }
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
    savechangessqueal();
    }
}

function editnegativereactions(){
    let add = document.getElementById("editnegativereactions").value;
    if(add!=""){
    editsqueal.neg_reactions = JSON.parse(editsqueal.neg_reactions) + parseInt(add);
    if(editsqueal.neg_reactions<0){
        editsqueal.neg_reactions = 0;
    }
    if(editsqueal.pos_reactions>0.25*editsqueal.impressions){
        if(editsqueal.neg_reactions>0.25*editsqueal.impressions){
          editsqueal.category = "controversial";
          for(let i=0;i<channels.length;i++){
            if(channels[i].name == "CONTROVERSIAL"){
                channels[i].list_posts.push(editsqueal);
		const updates = {list_posts: channels[i].list_posts};
                updateChannel(updates, channels[i]._id);
            }
          }
        } else {
          editsqueal.category = "popular";
        }
      } else if(editsqueal.neg_reactions>0.25*editsqueal.impressions) {
        editsqueal.category = "unpopular";
      }
    document.getElementById("sectioneditsquealreactions").innerHTML = '<h3 style="margin-bottom:2%">Reactions</h3>';
    document.getElementById("sectioneditsquealreactions").innerHTML += '<div><p style="min-width:30px">'+editsqueal.pos_reactions+'</p><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt="" style="margin-right:50px"><input type="number" id="editpositivereactions"><button class="btn btn-outline-primary"  onclick="editpositivereactions()">Edit reactions</button></div><div><p style="min-width:30px">'+editsqueal.neg_reactions+'</p><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt="" style="margin-right:50px"><input type="number" id="editnegativereactions"><button class="btn btn-outline-primary" onclick="editnegativereactions()">Edit reactions</button></div>';
    savechangessqueal();
    }
}

document.getElementById("searchaddreceivers").addEventListener("input",()=>{
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = '';
    input = document.getElementById("searchaddreceivers").value;
    inputsearch = input.toLowerCase();
    arrsquealreceiversusers = [];
    arrsquealreceiverschannels = [];
    if(inputsearch!=""){   
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arrsquealreceiversusers.push(users[i]);
            }
        }
        for(i=0;i<channels.length;i++){
            let user = ((channels[i].name).slice(0,inputsearch.length)).toLowerCase();
                if(inputsearch==user){
                    arrsquealreceiverschannels.push(channels[i]);
                }
            }
        let len = arrsquealreceiverschannels.length + arrsquealreceiversusers.length;
        if(len>0){
            for(i=0;i<arrsquealreceiversusers.length;i++){
                const inreceivers = editsqueal.receivers.find(oggetto => {
                    return oggetto == "@"+arrsquealreceiversusers[i].nickname;
                  });
                if(inreceivers)
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="deleteuserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Remove</button></div>';
                else 
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="adduserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Add</button></div>';
            }
            for(i=0;i<arrsquealreceiverschannels.length;i++){
                const inreceivers = editsqueal.receivers.find(oggetto => {
                    return oggetto == arrsquealreceiverschannels[i].type + arrsquealreceiverschannels[i].name;
                  });
                if(inreceivers)
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="deletechannelreceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
                else 
                    document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="addchannelreceiver('+i+')" class="btn btn-outline-primary">Add</button></div>';
            }
        } else{
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        arrsquealreceiversusers = [];
        arrsquealreceiverschannels = [];
        for(i=0;i<editsqueal.receivers.length;i++)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button><br></div>';
    }
});

function rewritereceiverlist(){
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = "";
    for(i=0;i<arrsquealreceiversusers.length;i++){
        const inreceivers = editsqueal.receivers.find(oggetto => {
            return oggetto == "@"+arrsquealreceiversusers[i].nickname;
          });
        if(inreceivers)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="deleteuserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Remove</button></div>';
        else 
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>@'+arrsquealreceiversusers[i].nickname+'</p><button onclick="adduserreceiver('+i+')" id="changeuserreceiver'+i+'" class="btn btn-outline-primary">Add</button></div>';
    }
    for(i=0;i<arrsquealreceiverschannels.length;i++){
        const inreceivers = editsqueal.receivers.find(oggetto => {
            return oggetto == arrsquealreceiverschannels[i].type + arrsquealreceiverschannels[i].name;
          });
        if(inreceivers)
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="deletechannelreceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
        else 
            document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+arrsquealreceiverschannels[i].type+arrsquealreceiverschannels[i].name+'</p><button id="changechannelreceiver'+i+'" onclick="addchannelreceiver('+i+')" class="btn btn-outline-primary">Add</button></div>';
    }
}

function deletereceiver(x){
    editsqueal.receivers.splice(x,1);
    document.getElementById("sectioneditsquealreceiverslist").innerHTML = "";
    for(i=0;i<editsqueal.receivers.length;i++){
        document.getElementById("sectioneditsquealreceiverslist").innerHTML += '<div><p>'+editsqueal.receivers[i]+'</p><button onclick="deletereceiver('+i+')" class="btn btn-outline-primary">Remove</button></div>';
    }
    savechangessqueal();
}

function deleteuserreceiver(x){
    let y;
    for(i=0;i<editsqueal.receivers.length;i++){
        if(editsqueal.receivers[i]=="@"+arrsquealreceiversusers[x].nickname){
            y = i;
        }
    }
    editsqueal.receivers.splice(y,1);
    savechangessqueal();
    rewritereceiverlist();
}

function adduserreceiver(x){
    editsqueal.receivers.push("@"+arrsquealreceiversusers[x].nickname);
    savechangessqueal();
    rewritereceiverlist();
}

function deletechannelreceiver(x){
    let y;
    for(i=0;i<editsqueal.receivers.length;i++){
        if(editsqueal.receivers[i]==arrsquealreceiverschannels[x].type + arrsquealreceiverschannels[x].name){
            y = i;
        }
    }
    editsqueal.receivers.splice(y,1);
    savechangessqueal();
    rewritereceiverlist();
}

function addchannelreceiver(x){
    editsqueal.receivers.push(arrsquealreceiverschannels[x]);
    savechangessqueal();
    rewritereceiverlist();
}

/*--------------------------------------------------------------------------------------------------------------*/

function channelsbtnclick(){
    document.getElementById("squealhome").style = "display:none";
    document.getElementById("usershome").style = "display:none";
    document.getElementById("channelshome").style = "display:flex";
    document.getElementById("filterchannel").style = "display:inline; color:black; background-color:white; border:1px solid black";
    document.getElementById("filterchannelpopularity").style = "display:inline; color:black; background-color:white; border:1px solid black";
    document.getElementById("filterchannelp").style = "display:inline";
    document.getElementById("filterchannelpopularityp").style = "display:inline";
    document.getElementById("createnewCHANNEL").style = "display:none";
    document.getElementById("filterchannel").value = "name";
    document.getElementById("filterchannelpopularity").value = "nothing";
    document.getElementById("searchchannel").value = "";
    document.getElementById("searchchannel").placeholder = "Search channel";
    document.getElementById("searchchannel").type = "text";
    document.getElementById("listchannel_find").innerHTML = "";
    document.getElementById("filterchanneltype").value = "channels";
    document.getElementById("sectioneditCHANNEL").style = "display:none";
    document.getElementById("sectioneditchannel").style = "display:none";
    if(!document.getElementById("sectioncreateCHANNEL").classList.contains("d-none")){
        document.getElementById("sectioncreateCHANNEL").classList.add("d-none");
        document.getElementById("sectioncreateCHANNEL").classList.remove("d-flex");
    }
    if(!document.getElementById("sectioncreateCHANNELphototype").classList.contains("d-none")){
        document.getElementById("sectioncreateCHANNELphototype").classList.add("d-none");
    }
    arrchannels = [];
    arrCHANNELS = [];
    arrchannelpopularity = [];
    arrsearchchannel = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        } else if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    if((arrchannels.length>0)&(arrchannels.length<8)){
        for(i=0;i<arrchannels.length;i++)
        document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
    } else if(arrchannels.length==0){
        document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
};

document.getElementById("filterchanneltype").addEventListener("change",()=>{
    let channeltype = document.getElementById("filterchanneltype").value;
    document.getElementById("searchchannel").value = "";
    arrCHANNELS = [];
    arrchannels = [];
    arrchannelpopularity = [];
    arrsearchchannel = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        } else if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    switch(channeltype){
        case "channels":
            document.getElementById("filterchannel").style = "display:inline; color:black; background-color:white; border:1px solid black";
            document.getElementById("filterchannelpopularity").style = "display:inline; color:black; background-color:white; border:1px solid black";
            document.getElementById("filterchannelp").style = "display:inline";
            document.getElementById("filterchannelpopularityp").style = "display:inline";
            document.getElementById("createnewCHANNEL").style = "display:none";
            document.getElementById("filterchannel").value = "name";
            document.getElementById("filterchannelpopularity").value = "nothing";
            document.getElementById("searchchannel").placeholder = "Search channel";
            document.getElementById("searchchannel").type = "text";
            document.getElementById("listchannel_find").innerHTML = "";
            if((arrchannels.length>0)&(arrchannels.length<8)){
                for(i=0;i<arrchannels.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            } else if(arrchannels.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
            }
        break;
        case "CHANNELS":
            document.getElementById("filterchannel").style = "display:none";
            document.getElementById("filterchannelpopularity").style = "display:none";
            document.getElementById("filterchannelp").style = "display:none";
            document.getElementById("filterchannelpopularityp").style = "display:none";
            document.getElementById("createnewCHANNEL").style = "display:inline";
            document.getElementById("searchchannel").placeholder = "Search CHANNEL";
            document.getElementById("searchchannel").type = "text";
            document.getElementById("listchannel_find").innerHTML = "";
            if((arrCHANNELS.length>0)&(arrCHANNELS.length<8)){
                for(i=0;i<arrCHANNELS.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrCHANNELS.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
            }
        break;
    }
});

document.getElementById("filterchannel").addEventListener("change",()=>{
    let filterchannel = document.getElementById("filterchannel").value;
    switch(filterchannel){
        case "name":
            document.getElementById("searchchannel").placeholder = "Search channel";
            document.getElementById("searchchannel").type = "text";
        break;
        case "owner":
            document.getElementById("searchchannel").placeholder = "Search channel owner";
            document.getElementById("searchchannel").type = "text";
        break;
        case "post":
            document.getElementById("searchchannel").placeholder = "Search number of posts";
            document.getElementById("searchchannel").type = "number";
        break;
    }
});

document.getElementById("searchchannel").addEventListener("input",()=>{
    let filterchanneltype = document.getElementById("filterchanneltype").value;
    input = document.getElementById("searchchannel").value;
    inputsearch = input.toLowerCase();
    document.getElementById("listchannel_find").innerHTML = "";
    if(filterchanneltype=="channels"){
        let filterchannel = document.getElementById("filterchannel").value;
        document.getElementById("filterchannelpopularity").value = "nothing";
        arrsearchchannel = [];
        arrchannelpopularity = [];
        if(inputsearch!=""){
            switch(filterchannel){
                case "name":
                    for(i=0;i<arrchannels.length;i++){
                        let channel = ((arrchannels[i].name).slice(0,inputsearch.length)).toLowerCase();
                            if(inputsearch==channel){
                                arrsearchchannel.push(arrchannels[i]);
                            }
                        }
                break;
                case "owner":
                    for(i=0;i<arrchannels.length;i++){
                        for(j=0;j<arrchannels[i].list_users.length;j++){
                        let channel = ((arrchannels[i].list_users[j].nickname).slice(0,inputsearch.length)).toLowerCase();
                            if(inputsearch==channel){
                                arrsearchchannel.push(arrchannels[i]);
                            }
                        }
                    }
                break;
                case "post":
                    for(i=0;i<arrchannels.length;i++){
                        let channel = arrchannels[i].list_posts.length;
                            if(inputsearch==channel){
                                arrsearchchannel.push(arrchannels[i]);
                            }
                        }
                break;
            }
            if((arrsearchchannel.length>0)&(arrsearchchannel.length<8)){
                for(i=0;i<arrsearchchannel.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            } else if(arrsearchchannel.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'". Try a new search.</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
            }
        } else {
            arrsearchchannel = arrchannels;
            if((arrsearchchannel.length>0)&(arrsearchchannel.length<8)){
                for(i=0;i<arrsearchchannel.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
            }
        }
    } else {
        arrsearchCHANNEL = [];
        if(inputsearch!=""){
            for(i=0;i<arrCHANNELS.length;i++){
                let channel = ((arrCHANNELS[i].name).slice(0,inputsearch.length)).toLowerCase();
                if(inputsearch==channel){
                    arrsearchCHANNEL.push(arrCHANNELS[i]);
                }
            }
            if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<8)){
                for(i=0;i<arrsearchCHANNEL.length;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrsearchCHANNEL.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
            }
        } else {
            arrsearchCHANNEL = arrCHANNELS;
            if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<8)){
                for(i=0;i<arrsearchCHANNEL.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
            }
        }
    }
});

document.getElementById("filterchannelpopularity").addEventListener("change",()=>{
    if(arrchannels.length>0){
        let filterpopularity = document.getElementById("filterchannelpopularity").value;
        switch(filterpopularity){
            case "top":
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                    arrchannelpopularity.sort(function(a,b){
                        return b.list_users.length - a.list_users.length;
                    });
                } else {
                    arrchannelpopularity = arrchannels;
                    document.getElementById("filterchannel").value = "name";
                    arrchannelpopularity.sort(function(a,b){
                        return b.list_users.length - a.list_users.length;
                    });
                }
            break;
            case "down":
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                    arrchannelpopularity.sort(function(a,b){
                        return a.list_users.length - b.list_users.length;
                    });
                } else {
                    arrchannelpopularity = arrchannels;
                    document.getElementById("filterchannel").value = "name";
                    arrchannelpopularity.sort(function(a,b){
                        return a.list_users.length - b.list_users.length;
                    });
                }
            break;
            default:
                if(arrsearchchannel.length>0){
                    arrchannelpopularity = arrsearchchannel;
                } else {
                    arrchannelpopularity = arrchannels;
                }
            break;
        }
        document.getElementById("listchannel_find").innerHTML = "";
        if((arrchannelpopularity.length>0)&(arrchannelpopularity.length<8)){
            for(i=0;i<arrchannelpopularity.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        } else {
            for(i=0;i<7;i++){
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
            }
            document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
        }
    }
});

function showmore2(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<arrchannelpopularity.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<arrsearchchannel.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    } else {
        for(i=0;i<arrchannels.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless2()">Show less</p>';
    }
}

function showless2(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrchannelpopularity.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannelpopularity[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    } else if(arrsearchchannel.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchchannel[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
}

function showmore4(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrsearchCHANNEL.length>0){
        for(i=0;i<arrsearchCHANNEL.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless4()">Show less</p>';
    } else {
        for(i=0;i<arrCHANNELS.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showless4()">Show less</p>';
    }
}

function showless4(){
    document.getElementById("listchannel_find").innerHTML = "";
    if(arrsearchCHANNEL.length>0){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
    }
}

document.getElementById("closeeditchannel").addEventListener("click",()=>{
    document.getElementById("sectioneditchannel").style = "display:none";
    document.getElementById("listchannel_find").innerHTML = "";
    arrchannels = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="&"){
            arrchannels.push(channels[i]);
        }
    }
    if((arrchannels.length>0)&(arrchannels.length<8)){
        for(i=0;i<arrchannels.length;i++)
        document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
    } else if(arrchannels.length==0){
        document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
    } else {
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrchannels[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editchan('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore2()">Show more</p>';
    }
});

function editchan(x){
    if(arrchannelpopularity.length>0){
        editchannel = arrchannelpopularity[x];
    } else if(arrsearchchannel.length>0){
        editchannel = arrsearchchannel[x];
    } else {
        editchannel = arrchannels[x];
    }
    document.getElementById("sectioneditchannel").style = "display:flex";
    document.getElementById("sectioneditchannelowners").innerHTML = '<h3>Users</h3>';
    if(editchannel.photoprofile!="")
        document.getElementById("sectioneditchannelphoto").src = editchannel.photoprofile;
    else 
        document.getElementById("sectioneditchannelphoto").src = "img/group_photo1.png";
    document.getElementById("sectioneditchannelname").value = editchannel.name;
    if(editchannel.blocked)
        document.getElementById("sectioneditchannelblock").innerText = "Unblock";
    else 
        document.getElementById("sectioneditchannelblock").innerText = "Block";
    for(i=0;i<editchannel.list_users.length;i++){
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p style="cursor:default">'+editchannel.list_users[i].nickname+'</p><button class="btn me-3" style="border-width:0; color:black; cursor:default">'+editchannel.list_users[i].type+'</button><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Remove</button></div>';
    }
}

document.getElementById("sectioneditchannelblock").addEventListener("click",()=>{
    if(editchannel.blocked){
        document.getElementById("sectioneditchannelblock").innerText = "Block";
        editchannel.blocked = false;
    } else {
        document.getElementById("sectioneditchannelblock").innerText = "Unblock";
        editchannel.blocked = true;
    }
    savechangeschannel();
});

function savechangeschannel(){
    for(i=0;i<channels.length;i++){
        if(editchannel.name==channels[i].name){
            channels[i] = editchannel;
        }
    }
    const updates = {list_posts:editchannel.list_posts, list_users: editchannel.list_users, name: editchannel.name, blocked: editchannel.blocked};
    updateChannel(updates, editchannel._id);
}

document.getElementById("sectioneditchannelchangename").addEventListener("click",()=>{
    let isValid = true;
    let name = document.getElementById("sectioneditchannelname").value;
    let name_empty = name.replace(/\s/g,"");
    if((name_empty!="")&(name_empty.length>=3)){
    //controllo validità nome gruppo
        for(i=0;i<channels.length;i++){
            if(name==channels[i].name){   //per evitare che ci siano più gruppi con lo stesso nome
                isValid = false;
                alert("Name already used");
            }
        }
    } else {
        isValid = false;
        alert("Please, insert a valid name for the group");
    }
    if(isValid){
        //salvo il nuovo nome del channel e aggiorno la lista dei canali
        editchannel.name = name;
    }
    savechangeschannel();
})

function deleteownerchannel(x){
    if(editchannel.list_users.length<2){
        alert("There must be at least one owner of the channel. This owner can't be deleted");
    } else {
        editchannel.list_users.splice(x, 1);
    }
    savechangeschannel();
    document.getElementById("sectioneditchannelowners").innerHTML = '<h3>Users</h3>';
    for(i=0;i<editchannel.list_users.length;i++){
        document.getElementById("sectioneditchannelowners").innerHTML += '<div><p style="cursor:default">'+editchannel.list_users[i].nickname+'</p><button class="btn me-3" style="border-width:0; color:black; cursor:default">'+editchannel.list_users[i].type+'</button><button class="btn btn-outline-primary" onclick="deleteownerchannel('+i+')">Remove</button></div>';
    }
}

document.getElementById("createnewCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioncreateCHANNEL").classList.add("d-flex");
    document.getElementById("sectioncreateCHANNEL").classList.remove("d-none");
    document.getElementById("map").classList.add("d-none");
    arrcreateCHANNELowners = [];
    arrcreateCHANNELmessages = [];
    arrcreateCHANNELownersadd = [];
    CHANNELsilenceable.checked = false;
    let userCreator = actualuser;
    userCreator.type = "Creator";
    arrcreateCHANNELowners.push(userCreator);
    document.getElementById("sectioncreateCHANNELphotoimg").src = "img/image.svg";
    document.getElementById("sectioncreateCHANNELphotoimg").style = "filter:invert(1); width:30px; height:30px";
    document.getElementById("sectioncreateCHANNELname").value = "";
    document.getElementById("sectioncreateCHANNELdescription").value = "";
    document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    document.getElementById("textnewmessageCHANNEL").value = "";
    document.getElementById("typenewmessageCHANNEL").value = "Welcome";
    document.getElementById("userrequestnewmessageCHANNEL").value = "";
    document.getElementById("userrepeatnewmessageCHANNEL").value = "";
    document.getElementById("linknewmessageCHANNEL").value = "";
    latitude = "";
    longitude = "";
    document.getElementById("photonewmessage").innerHTML = "";
    document.getElementById("searchaddownerCHANNEL").value = "";
    document.getElementById("searchaddownerCHANNELlist").classList.add('d-none');
    if(!document.getElementById("viewCHANNELownerslist").classList.contains('d-none')){
        document.getElementById("viewCHANNELownerslist").classList.add('d-none');
        document.getElementById("viewCHANNELowners").classList.remove('d-none');
    }
    if(!document.getElementById("addautomaticmessage").classList.contains('collapsed')){
        document.getElementById("addautomaticmessage").classList.add('collapsed');
        document.getElementById("flush-collapseOne").classList.add('collapse');
    }
    if(!document.getElementById("viewCHANNELmessageslist").classList.contains('d-none')){
        document.getElementById("viewCHANNELmessageslist").classList.add('d-none');
        document.getElementById("viewCHANNELmessages").classList.remove('d-none');
    }
});

document.getElementById("closecreateCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioncreateCHANNEL").classList.remove("d-flex");
    document.getElementById("sectioncreateCHANNEL").classList.add("d-none");
});

document.getElementById("closeeditCHANNEL").addEventListener("click",()=>{
    document.getElementById("sectioneditCHANNEL").style = "display:none";
});

async function editCHAN(x){
    if(arrsearchCHANNEL.length>0){
        editCHANNEL = arrsearchCHANNEL[x];
    } else {
        editCHANNEL = arrCHANNELS[x];
    }
    document.getElementById("sectioneditCHANNEL").style = "display:flex";
    document.getElementById("sectioneditCHANNELsquealers").innerHTML = '<div class="d-flex flex-row mb-3"><h3 class="me-3">Squealers</h3><button class="btn btn-outline-primary" onclick="createnewCHANNELsqueal()">Create</button><div>';
    if(editCHANNEL.photoprofile!="")
        document.getElementById("sectioneditCHANNELphoto").src = editCHANNEL.photoprofile;
    else
        document.getElementById("sectioneditCHANNELphoto").src = "img/group_photo1.png";
    document.getElementById("sectioneditCHANNELname").innerText = editCHANNEL.name;
    document.getElementById("sectioneditCHANNELdescription").value = editCHANNEL.description;
    for(i=0;i<editCHANNEL.list_posts.length;i++){
        let videoURL = "";
            if(editCHANNEL.list_posts[i].body.video!=""){
                videoURL = editCHANNEL.list_posts[i].body.video;
            }
        if(editCHANNEL.list_posts[i].body.photo=="")
            editCHANNEL.list_posts[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        let Address = await getAddressGeolocation(editCHANNEL.list_posts[i].body.position[0], editCHANNEL.list_posts[i].body.position[1])
        document.getElementById("sectioneditCHANNELsquealers").innerHTML += '<div class="card mb-3 d-flex flex-column mexcard"><div class="card-header" style=" width:100%; height:70px"><img id="imgprofilesquealer" src="'+editCHANNEL.list_posts[i].photoprofile+'" alt=""><h5>'+editCHANNEL.list_posts[i].sender+'</h5><p class="card-text mb-0 me-3">'+editCHANNEL.list_posts[i].date+'</p><p class="card-text">'+editCHANNEL.list_posts[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+editCHANNEL.list_posts[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+editCHANNEL.list_posts[i].body.link+'">'+editCHANNEL.list_posts[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+editCHANNEL.list_posts[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height: 100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary deletemexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="deletesquealCHANNEL('+i+')">Delete</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].neg_reactions+'</span></div></div></div>'; 
        if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        document.getElementById("imgsquealer").removeAttribute("id");
        if(editCHANNEL.list_posts[i].photoprofile=="")
            document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
}

function createnewCHANNELsqueal(){
    document.getElementById("writenewsqueal").classList.remove('d-none');
    document.getElementById("photonewsqueal").innerHTML = '';
    document.getElementById("linknewsqueal").innerHTML = '';
    if(!document.getElementById("mapnewsqueal").classList.contains('d-none'))
        document.getElementById("mapnewsqueal").classList.add('d-none');
    document.getElementById("mapnewsqueal").innerHTML = '<button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletemap()"><i class="bi-x" style="font-size:20px"></i></button><button style="position: absolute; bottom: 10px; left: 10px; z-index: 1000; border-radius:8px; border:0; padding:6px 12px 6px 12px;" onclick="openGoogleMaps()">Open Map</button>';
    document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
}

document.getElementById("closewritenewsqueal").addEventListener("click",()=>{
    document.getElementById("writenewsqueal").classList.add('d-none');
});

async function deletesquealCHANNEL(x){
    let i = squeals.length - 1;
    while (i >= 0) {
        if ((squeals[i].sender === editCHANNEL.list_posts[x].sender)&(squeals[i].date === editCHANNEL.list_posts[x].date)&(squeals[i].hour === editCHANNEL.list_posts[x].hour)&(squeals[i].seconds === editCHANNEL.list_posts[x].seconds)) {
            await deleteSqueal(squeals[i]._id);
	    squeals.splice(i, 1);
        }
        i--;
    }
    editCHANNEL.list_posts.splice(x,1);
    savechangesCHANNEL();
    document.getElementById("sectioneditCHANNELsquealers").innerHTML = '<div class="d-flex flex-row mb-3"><h3 class="me-3">Squealers</h3><button class="btn btn-outline-primary" onclick="createnewCHANNELsqueal()">Create</button><div>';
    for(i=0;i<editCHANNEL.list_posts.length;i++){
        let videoURL = "";
            if(editCHANNEL.list_posts[i].body.video!=""){
                videoURL = editCHANNEL.list_posts[i].body.video;
            }
        if(editCHANNEL.list_posts[i].body.photo=="")
            editCHANNEL.list_posts[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        let Address = await getAddressGeolocation(editCHANNEL.list_posts[i].body.position[0], editCHANNEL.list_posts[i].body.position[1])
        document.getElementById("sectioneditCHANNELsquealers").innerHTML += '<div class="card border-light mb-3 d-flex flex-column mexcard"><div class="card-header"><img id="imgprofilesquealer" src="'+editCHANNEL.list_posts[i].photoprofile+'" alt=""><h5>'+editCHANNEL.list_posts[i].sender+'</h5><p class="card-text mb-0 me-3">'+editCHANNEL.list_posts[i].date+'</p><p class="card-text">'+editCHANNEL.list_posts[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+editCHANNEL.list_posts[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+editCHANNEL.list_posts[i].body.link+'">'+editCHANNEL.list_posts[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+editCHANNEL.list_posts[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height: 100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary deletemexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="deletesquealCHANNEL('+i+')">Delete</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].neg_reactions+'</span></div></div></div>'; 
        if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        document.getElementById("imgsquealer").removeAttribute("id");
        if(editCHANNEL.list_posts[i].photoprofile=="")
            document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
        document.getElementById("imgprofilesquealer").removeAttribute("id");
    }
}

document.getElementById("sectioneditCHANNELdelete").addEventListener("click",async()=>{
    for(i=0;i<channels.length;i++){
        if(channels[i].name==editCHANNEL.name){
	    await deleteChannel(channels[i]._id);
            channels.splice(i,1);
        }
    }
    for(i=0;i<squeals.length;i++){
        if(editCHANNEL.name == squeals[i].channel){
            await deleteSqueal(squeals[i]._id);
	    squeals.splice(i,1);
	}
    }
    document.getElementById("sectioneditCHANNEL").style = "display:none";
    arrCHANNELS = [];
    for(i=0;i<channels.length;i++){
        if(channels[i].type=="$"){
            arrCHANNELS.push(channels[i]);
        }
    }
    document.getElementById("listchannel_find").innerHTML = '';
    arrsearchCHANNEL = arrCHANNELS;
    if((arrsearchCHANNEL.length>0)&(arrsearchCHANNEL.length<8)){
        for(i=0;i<arrsearchCHANNEL.length;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
    } else if(arrsearchCHANNEL.length>7){
        for(i=0;i<7;i++)
            document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrsearchCHANNEL[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
        document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
    }
});

document.getElementById("sectioneditCHANNELdescription").addEventListener("input",()=>{
    editCHANNEL.description = document.getElementById("sectioneditCHANNELdescription").value;
    savechangesCHANNEL();
});

function savechangesCHANNEL(){
    for(i=0;i<channels.length;i++){
        if(editCHANNEL.name==channels[i].name){
            channels[i] = editCHANNEL;
        }
    }
    const updates = {list_posts:editCHANNEL.list_posts, list_users: editCHANNEL.list_users, name: editCHANNEL.name, blocked: editCHANNEL.blocked};
    updateChannel(updates, editCHANNEL._id);
}

document.getElementById("viewCHANNELowners").addEventListener("click",()=>{
    document.getElementById("viewCHANNELownerslist").classList.remove('d-none');
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("viewCHANNELowners").classList.add('d-none');
});

function closeCHANNELownerslist(){
    document.getElementById("viewCHANNELownerslist").classList.add('d-none');
    document.getElementById("viewCHANNELowners").classList.remove('d-none');
}

document.getElementById("viewCHANNELmessages").addEventListener("click",async ()=>{
    document.getElementById("viewCHANNELmessageslist").classList.remove('d-none');
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
    if(arrcreateCHANNELmessages.length==0){
        document.getElementById("viewCHANNELmessageslist").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no messages already added</p>';
    }
    for(i=0;i<arrcreateCHANNELmessages.length;i++){
        let videoURL = "";
            if(arrcreateCHANNELmessages[i].body.video!=""){
                videoURL = arrcreateCHANNELmessages[i].body.video;
            }
            let Address = await getAddressGeolocation(arrcreateCHANNELmessages[i].body.position[0], arrcreateCHANNELmessages[i].body.position[1]);
        switch(arrcreateCHANNELmessages[i].type){
            case 'Welcome':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p>'+Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
            case 'Answer':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p>'+Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
            case 'Repeat':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].repetition+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p>'+Address+'</p></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
            case 'Casual Images':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
            case 'News':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
            case 'WikiInfo':
                document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
            break;
        }
        if(document.getElementById("recordedVideosquealer")){
        if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        }
    }
    document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
    document.getElementById("viewCHANNELmessages").classList.add('d-none');
});

function showModal(x) {
    num_message = x;
    document.getElementById("linkModal").style.display = "inline";
}

function hideModal() {
    document.getElementById("linkModal").style.display = "none";
}

function handleSubmitLink() {
    let urlLink = document.getElementById("inputLink").value;
    if(isLink(urlLink)){
    document.getElementById("inputLink").value = '';
    document.getElementById("linkModal").style.display = "none";
        if(num_message==1)
            document.getElementById("linknewmessageCHANNEL").innerHTML = '<a class="card-link" id="linknewmessageCHANNELhref" href="'+urlLink+'" style="overflow-x:hidden;width:100%">'+urlLink+'</a><button class="btn btn-danger m-2" onclick="deletelinknewmessage()">&times;</button>';
        else 
            document.getElementById("linknewsqueal").innerHTML = '<a class="card-link" id="linknewsquealhref" href="'+urlLink+'" style="overflow-x:hidden;width:100%">'+urlLink+'</a><button class="btn btn-danger m-2" onclick="deletelinknewmessage()">&times;</button>';
    } else {
        alert("Please insert a link that starts with 'http://' or 'https://'.");
    }
}

function deletelinknewmessage(){
    if(num_message==1)
        document.getElementById("linknewmessageCHANNEL").innerHTML = '';
    else
    document.getElementById("linknewsqueal").innerHTML = '';
}

function isLink(string){
    const regex = /^(http:\/\/|https:\/\/)/;
    return regex.test(string);
  }

function closeCHANNELmessageslist(){
    document.getElementById("viewCHANNELmessageslist").classList.add('d-none');
    document.getElementById("viewCHANNELmessages").classList.remove('d-none');
}

document.getElementById("addautomaticmessage").addEventListener("click",()=>{
    if(document.getElementById("addautomaticmessage").classList.contains('collapsed')){
        document.getElementById("addautomaticmessage").classList.remove('collapsed');
        document.getElementById("flush-collapseOne").classList.remove('collapse');
    } else {
        document.getElementById("addautomaticmessage").classList.add('collapsed');
        document.getElementById("flush-collapseOne").classList.add('collapse');
    }
});

document.getElementById("searchaddownerCHANNEL").addEventListener("input",()=>{
    document.getElementById("searchaddownerCHANNELlist").classList.remove('d-none');
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    input = document.getElementById("searchaddownerCHANNEL").value;
    inputsearch = input.toLowerCase();
    arrcreateCHANNELownersadd = [];
    if(inputsearch!=""){
        for(i=0;i<users.length;i++){
        let user = ((users[i].nickname).slice(0,inputsearch.length)).toLowerCase();
            if(inputsearch==user){
                arrcreateCHANNELownersadd.push(users[i]);
            }
        }
        if(arrcreateCHANNELownersadd.length>0){
            for(i=0;i<arrcreateCHANNELownersadd.length;i++){
                const inreceivers = arrcreateCHANNELowners.find(oggetto => {
                    return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
                  });
                if(!inreceivers){
                    document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
                } else {
                    document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
                }
            }
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no result for "'+inputsearch+'". Try a new search.</p>';
        }
    } else {
        document.getElementById("searchaddownerCHANNELlist").classList.add('d-none');
    }
});

function addownerCHANNEL(x){
    let userselected = arrcreateCHANNELownersadd[x];
    userselected.type = "Modifier";
    arrcreateCHANNELowners.push(userselected);
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    for(i=0;i<arrcreateCHANNELownersadd.length;i++){
        const inreceivers = arrcreateCHANNELowners.find(oggetto => {
            return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
          });
        if(!inreceivers){
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
        }
    }
}

function removeownerCHANNEL(x){
    arrcreateCHANNELowners.splice(x,1);
    document.getElementById("viewCHANNELownerslist").innerHTML = '<h3>List owners CHANNEL</h3>';
    for(i=0;i<arrcreateCHANNELowners.length;i++)
        document.getElementById("viewCHANNELownerslist").innerHTML += '<div><p>'+arrcreateCHANNELowners[i].nickname+'</p><button class="btn btn-outline-primary" onclick="removeownerCHANNEL('+i+')">Remove</button></div>';
    document.getElementById("viewCHANNELownerslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELownerslist()">Hide CHANNEL owners</button>';
    document.getElementById("searchaddownerCHANNELlist").innerHTML = "";
    for(i=0;i<arrcreateCHANNELownersadd.length;i++){
        const inreceivers = arrcreateCHANNELowners.find(oggetto => {
            return oggetto.nickname == arrcreateCHANNELownersadd[i].nickname;
          });
        if(!inreceivers){
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="addownerCHANNEL('+i+')">Add</button></div>';
        } else {
            document.getElementById("searchaddownerCHANNELlist").innerHTML += '<div class="found"><p>'+arrcreateCHANNELownersadd[i].nickname+', '+arrcreateCHANNELownersadd[i].version+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px">Added</button></div>';
        }
    }
}

document.getElementById("typenewmessageCHANNEL").addEventListener("change",()=>{
    let select = document.getElementById("typenewmessageCHANNEL").value;
    switch(select){
        case 'Welcome':
            if(!document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
            if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
            if(document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.remove('d-none');
        break;
        case 'Answer':
            if(document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.remove('d-none');
            if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
            if(document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.remove('d-none');
        break;
        case 'Repeat':
            if(!document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
            if(document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.remove('d-none');
            if(!document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.add('d-none');
        break;
        case 'Casual Images':
            if(document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.remove('d-none');
            if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
            if(!document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.add('d-none');
        break;
        case 'News':
            if(document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.remove('d-none');
            if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
            if(!document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.add('d-none');
        break;
        case 'WikiInfo':
            if(document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("requestnewmessageCHANNEL").classList.remove('d-none');
            if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
            if(!document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
                document.getElementById("squealnewmessageCHANNEL").classList.add('d-none');
        break;
    }
});

document.getElementById("addnewmessageCHANNEL").addEventListener("click", async()=>{
    let textmessage = document.getElementById("textnewmessageCHANNEL").value;
    let textmessage_empty = textmessage.replace(/\s/g,"");
    let select = document.getElementById("typenewmessageCHANNEL").value;
    let userrequesttext = "to "+ document.getElementById("userrequestnewmessageCHANNEL").value;
    let request = userrequesttext.replace(/\s/g,"");
    let repetitionmessage = "every "+ document.getElementById("userrepeatnewmessageCHANNEL").value + " seconds";
    let link = '';
    if(document.getElementById("linknewmessageCHANNEL").innerHTML!=''){
        link = document.getElementById("linknewmessageCHANNELhref").href;
    }
    let photo = document.getElementById("imgnewmessageCHANNEL").src;
    let position = [];
    if(latitude!=""){
    position[0] = latitude;
    }
    if(longitude!=""){
    position[1] = longitude;
    }
    let video = "";
    if(document.getElementById("videonewmessageCHANNEL").src!=window.location.href){
        video = document.getElementById("videonewmessageCHANNEL").src;
    }
    document.getElementById("map").classList.add("d-none");
    document.getElementById("linknewmessageCHANNEL").innerHTML = '';
    let newmessage;
    switch(select){
        case 'Welcome':
            if((textmessage_empty!="")|(link!="")|(video!="")|(photo!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")|(position.length!=0)){
            newmessage = {type:select, request:"", repetition:"", body:{text:textmessage, link:link, photo:photo, position:position, video:video}};
            arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert("The message is empty!");
            }
        break;
        case 'Answer':
            if((textmessage_empty!="")|(link!="")|(photo!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")|(position.length!=0)){
                if(request!="" && request.startsWith('to/') && request!='to/'){
                newmessage = {type:select, request:userrequesttext, repetition:"", body:{text:textmessage, link:link, photo:photo, position:position, video:video}};
                arrcreateCHANNELmessages.push(newmessage);
                } else {
                    alert("User request not valid");
                }
            } else {
                alert("The message is empty!");
            }
        break;
        case 'Repeat':
            let j = false;
                for(let i=0; i<arrcreateCHANNELmessages.length; i++){
                    if(arrcreateCHANNELmessages[i].type=="Repeat"){
                        j=true;
                    }
                }
            if(j==false){
                if((document.getElementById("userrepeatnewmessageCHANNEL").value!="")&&(parseInt(document.getElementById("userrepeatnewmessageCHANNEL").value))>5){
                    newmessage = {type:select, request:"", repetition:repetitionmessage, body:{text:"to /begin", link:"", photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", position:[], video:""}};
                    arrcreateCHANNELmessages.push(newmessage);
                } else {
                    alert('You must write the number of times you want to repeat this message (>5s)');
                }
            } else {
                alert("There is already a repeat message in this channel");
            }
        break;
        case 'Casual Images':
            if(userrequesttext!="to /" && userrequesttext.startsWith("to /")){
                newmessage = {type:select, request:userrequesttext, repetition:"", body:{text:"", link:"", photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", position:[], video:""}};
                arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert('User request not valid');
            }
        break;
        case 'News':
            if(userrequesttext!="to /" && userrequesttext.startsWith("to /")){
                newmessage = {type:select, request:userrequesttext, repetition:"", body:{text:"", link:"", photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", position:[], video:""}};
                arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert('User request not valid');
            }
        break;
        case 'WikiInfo':
            if(userrequesttext!="to /" && userrequesttext.startsWith("to /")){
                newmessage = {type:select, request:userrequesttext, repetition:"", body:{text:"", link:"", photo:"data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", position:[], video:""}};
                arrcreateCHANNELmessages.push(newmessage);
            } else {
                alert('User request not valid');
            }
        break;
    }
    if(!document.getElementById("viewCHANNELmessageslist").classList.contains('d-none')){
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
        for(i=0;i<arrcreateCHANNELmessages.length;i++){
            let videoURL = "";
            if(arrcreateCHANNELmessages[i].body.video!=""){
                videoURL = arrcreateCHANNELmessages[i].body.video;
            }
            let Address = await getAddressGeolocation(arrcreateCHANNELmessages[i].body.position[0], arrcreateCHANNELmessages[i].body.position[1]);
            switch(arrcreateCHANNELmessages[i].type){
                case 'Welcome':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p class="card-text">'+ Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Answer':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Repeat':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].repetition+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Casual Images':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'News':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'WikiInfo':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
            }
            if(arrcreateCHANNELmessages[i].type=='Welcome' | arrcreateCHANNELmessages[i].type=='Answer'){
                if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                    document.getElementById("recordedVideosquealer").classList.remove("d-none");
                document.getElementById("recordedVideosquealer").removeAttribute("id");
            }
                
        }
        document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
    }
    document.getElementById("textnewmessageCHANNEL").value = "";
    document.getElementById("typenewmessageCHANNEL").value = "Welcome";
    document.getElementById("userrequestnewmessageCHANNEL").value = "";
    document.getElementById("linknewmessageCHANNEL").value = "";
    document.getElementById("userrepeatnewmessageCHANNEL").value = "";
    document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    latitude = "";
    longitude = "";
    position = [];
    document.getElementById("photonewmessage").innerHTML = "";
    document.getElementById("videonewmessageCHANNEL").src = "";
    document.getElementById("videonewmessage").innerHTML = "";
    document.getElementById("map").innerHTML = "";
    if(!document.getElementById("requestnewmessageCHANNEL").classList.contains('d-none'))
        document.getElementById("requestnewmessageCHANNEL").classList.add('d-none');
    if(!document.getElementById("repeatnewmessageCHANNEL").classList.contains('d-none'))
        document.getElementById("repeatnewmessageCHANNEL").classList.add('d-none');
    if(document.getElementById("squealnewmessageCHANNEL").classList.contains('d-none'))
        document.getElementById("squealnewmessageCHANNEL").classList.remove('d-none');
});

async function deletenewmessageCHANNEL(x){
    arrcreateCHANNELmessages.splice(x,1);
    document.getElementById("viewCHANNELmessageslist").innerHTML = '<h3>List messages CHANNEL</h3>';
        for(i=0;i<arrcreateCHANNELmessages.length;i++){
            let videoURL = "";
            if(arrcreateCHANNELmessages[i].body.video!=""){
                videoURL = arrcreateCHANNELmessages[i].body.video;
            }
            let Address = await getAddressGeolocation(arrcreateCHANNELmessages[i].body.position[0], arrcreateCHANNELmessages[i].body.position[1]);
            switch(arrcreateCHANNELmessages[i].type){
                case 'Welcome':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Answer':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" style="width:100%;overflow-x:100%" href="'+arrcreateCHANNELmessages[i].body.link+'">'+arrcreateCHANNELmessages[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img src="'+arrcreateCHANNELmessages[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height:100px; width:200px"></video></div></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Repeat':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].repetition+'</p></div><div class="card-body" style=" flex-direction:column"><p class="card-text">'+arrcreateCHANNELmessages[i].body.text+'</p></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'Casual Images':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'News':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
                case 'WikiInfo':
                    document.getElementById("viewCHANNELmessageslist").innerHTML += '<div class="card border-light mb-3 d-flex" style="min-width:400px; flex-direction:column"><div class="card-header" style="width:100%; height:70px"><p class="card-text mb-0 me-3">'+arrcreateCHANNELmessages[i].type+' '+arrcreateCHANNELmessages[i].request+'</p></div><div class="card-body" style=" flex-direction:column"></div><div class="card-footer "><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em" onclick="deletenewmessageCHANNEL('+i+')">Delete</button></div></div>';
                break;
            }
            if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
        }
    document.getElementById("viewCHANNELmessageslist").innerHTML += '<button class="btn btn-outline-info m-2" onclick="closeCHANNELmessageslist()">Hide CHANNEL messages</button>';
}

document.getElementById("sectioncreateCHANNELphoto").addEventListener("click",()=>{
    document.getElementById("sectioncreateCHANNELphototype").classList.remove("d-none");
});

document.getElementById("closecreateCHANNELphototype").addEventListener("click", ()=>{
    document.getElementById("sectioncreateCHANNELphototype").classList.add("d-none");
});

document.getElementById("selectpictureCHANNEL").addEventListener("change", ()=>{
    const file = document.getElementById("selectpictureCHANNEL").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            newphotoprofile = e.target.result;
        };
        reader.readAsDataURL(file);
    }
    document.getElementById("sectioncreateCHANNELphototype").classList.add("d-none");
    document.getElementById("sectioncreateCHANNELphotoimg").src = newphotoprofile;
    document.getElementById("sectioncreateCHANNELphotoimg").style = "filter:invert(0); height:100%; width:auto";
});

document.getElementById("takephotoCHANNEL").addEventListener("click", ()=>{
    document.getElementById("access-camera").classList.remove("d-none");
    document.getElementById("access-camera").classList.add("d-flex");
    num_message = 4;
    document.getElementById("sectioncreateCHANNELphototype").classList.add("d-none");
});

document.getElementById("deletephotoCHANNEL").addEventListener("click", ()=>{
    document.getElementById("sectioncreateCHANNELphototype").classList.add("d-none");
    newphotoprofile = "img/image.svg";
    document.getElementById("sectioncreateCHANNELphotoimg").src = newphotoprofile;
    document.getElementById("sectioncreateCHANNELphotoimg").style = "filter:invert(1); height:30px; width:30px";
});

document.getElementById("btncreatenewCHANNEL").addEventListener("click",async()=>{
    let photo = newphotoprofile;
    let name = document.getElementById("sectioncreateCHANNELname").value;
    let description = document.getElementById("sectioncreateCHANNELdescription").value;
    let silenceable = CHANNELsilenceable.checked;
    let list_users = arrcreateCHANNELowners;
    let list_mess = arrcreateCHANNELmessages;
    let creator = actualuser.nickname;
    let name_empty = name.replace(/\s/g,"");
    let Valid = true;
    if(name===name.toUpperCase()){
    if((name_empty!="")&&(name_empty.length>=3)&&(description!="")&&(list_users.length>0)){
        for(i=0;i<channels.length;i++){
            if(name==channels[i].name){   //per evitare che ci siano più gruppi con lo stesso nome
                Valid = false;
                alert("Name already used");
            }
        }
        if(Valid){
        let newCHANNEL = {creator:creator, photoprofile:photo, photoprofileX:0, photoprofileY:0, name:name, description:description, silenceable:silenceable, list_users:list_users, list_mess:list_mess, usersSilenced:[], type:'$', list_posts:[], popularity:0};
        await addChannel(newCHANNEL);
	channels = await getListChannels();
        alert("CHANNEL creation successfully");
        document.getElementById("sectioncreateCHANNEL").classList.remove("d-flex");
        document.getElementById("sectioncreateCHANNEL").classList.add("d-none");
        document.getElementById("listchannel_find").innerHTML = "";
        arrCHANNELS = [];
	arrsearchCHANNEL = [];
        for(i=0;i<channels.length;i++){
            if(channels[i].type=="$"){
                arrCHANNELS.push(channels[i]);
            }
        }
            if((arrCHANNELS.length>0)&(arrCHANNELS.length<8)){
                for(i=0;i<arrCHANNELS.length;i++)
                document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
            } else if(arrCHANNELS.length==0){
                document.getElementById("listchannel_find").innerHTML += '<h5 style="color:black">No Results</h5><p style="color:black">There were no channels already created</p>';
            } else {
                for(i=0;i<7;i++)
                    document.getElementById("listchannel_find").innerHTML += '<div class="found"><p>'+arrCHANNELS[i].name+'</p><button class="btn btn-outline-primary" style="padding: 0.6em 2em 0.6em 2em; max-height:45px" onclick="editCHAN('+i+')">Edit</button></div>';
                document.getElementById("listchannel_find").innerHTML += '<p class="showmore" onclick="showmore4()">Show more</p>';
            }
        }
    } else {
        alert("Some information are invalid or missing! Please try again.");
    }
    } else {
        alert("The name of a CHANNEL needs to be uppercase");
    }
});

document.getElementById("sendnewsqueal").addEventListener("click", async()=>{
    let text = document.getElementById("textnewsqueal").value;
    let link = '';
    if(document.getElementById("linknewsqueal").innerHTML!=''){
        link = document.getElementById("linknewsquealhref").href;
    }
    let img = document.getElementById("imgnewsqueal").src;
    let video = "";
    if(document.getElementById("videonewsquealCHANNEL").src!=window.location.href){
        video = document.getElementById("videonewsquealCHANNEL").src;
    }
    let position = [];
    if(latitude!=""){
    position[0] = latitude;
    }
    if(longitude!=""){
    position[1] = longitude;
    }
    if((text!="")|(link!="")|(video!="")|(img!="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7")|(position.length!=0)){
        const data = new Date();
        let sender = actualuser.nickname
        let channel = editCHANNEL.name;
        let month;
        if((data.getMonth()+1)<10){
            month = "0" + (data.getMonth()+1);
        } else {
            month = data.getMonth()+1;
        }
        let day;
        if(data.getDate()<10){
            day = "0" + data.getDate();
        } else {
            day = data.getDate();
        }
        let date = day + "/" + month + "/" + data.getFullYear();
        let minutes = data.getMinutes();
        let seconds = data.getSeconds();
        if(minutes<10){
            minutes = "0" + minutes;
        }
        let hour = data.getHours() + ":" + minutes;
        let receivers = [];
        for(i=0;i<editCHANNEL.list_users.length;i++){
            if(editCHANNEL.list_users[i].nickname!=actualuser.nickname)
                receivers.push("@" + editCHANNEL.list_users[i].nickname);
        }
        await addSqueal({sender:sender, typesender:"CHANNELS", body:{text:text, link:link, photo:img, position:position, video:video}, date:date, hour:hour, seconds:seconds, photoprofile:actualuser.photoprofile, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], category:null, receivers:receivers, channel:channel, impressions:0});
        squeals = await getListSqueals();
	editCHANNEL.list_posts.unshift({sender:sender, typesender:"CHANNELS", body:{text:text, link:link, photo:img, position:position, video:video}, date:date, hour:hour, seconds:seconds, photoprofile:actualuser.photoprofile, pos_reactions:0, neg_reactions:0, usersReactions:[], usersViewed:[], answers:[], category:null, receivers:receivers, channel:channel, impressions:0});
        document.getElementById("photonewsqueal").innerHTML = '';
        document.getElementById("linknewsqueal").innerHTML = '';
        if(!document.getElementById("mapnewsqueal").classList.contains('d-none'));
            document.getElementById("mapnewsqueal").classList.add('d-none');
        document.getElementById("mapnewsqueal").innerHTML = '<button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletemap()"><i class="bi-x" style="font-size:20px"></i></button><button style="position: absolute; bottom: 10px; left: 10px; z-index: 1000; border-radius:8px; border:0; padding:6px 12px 6px 12px;" onclick="openGoogleMaps()">Open Map</button>';
        document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        document.getElementById("videonewsquealCHANNEL").src = "";
        document.getElementById("videonewsqueal").innerHTML = "";
        document.getElementById("textnewsqueal").value = "";
        savechangesCHANNEL();
        document.getElementById("writenewsqueal").classList.add('d-none');
        document.getElementById("sectioneditCHANNELsquealers").innerHTML = '<div class="d-flex flex-row mb-3"><h3 class="me-3">Squealers</h3><button class="btn btn-outline-primary" onclick="createnewCHANNELsqueal()">Create</button><div>';
        for(i=0;i<editCHANNEL.list_posts.length;i++){
            if(editCHANNEL.list_posts[i].body.photo=="")
                editCHANNEL.list_posts[i].body.photo = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
                let videoURL = "";
                if(editCHANNEL.list_posts[i].body.video!=""){
                    videoURL = editCHANNEL.list_posts[i].body.video;
                }
            let Address = await getAddressGeolocation(editCHANNEL.list_posts[i].body.position[0], editCHANNEL.list_posts[i].body.position[1]);
            document.getElementById("sectioneditCHANNELsquealers").innerHTML += '<div class="card border-light mb-3 d-flex flex-column mexcard"><div class="card-header" style="width:100%; height:70px"><img id="imgprofilesquealer" src="'+editCHANNEL.list_posts[i].photoprofile+'" alt=""><h5>'+editCHANNEL.list_posts[i].sender+'</h5><p class="card-text mb-0 me-3">'+editCHANNEL.list_posts[i].date+'</p><p class="card-text">'+editCHANNEL.list_posts[i].hour+'</p></div><div class="card-body" style="display:flex; align-items:center; flex-direction:column"><p class="card-text">'+editCHANNEL.list_posts[i].body.text+'</p><p class="card-text">'+Address+'</p><a class="card-link" href="'+editCHANNEL.list_posts[i].body.link+'">'+editCHANNEL.list_posts[i].body.link+'</a><div class="text-center" style="display:flex; flex-direction:column"><img id="imgsquealer" src="'+editCHANNEL.list_posts[i].body.photo+'" class="rounded" alt="..." style="max-height: 150px;"><video id="recordedVideosquealer" controls class="d-none mt-3" src="'+videoURL+'" style="height: 100px; width:200px"></video></div></div><div class="card-footer"><button class="btn btn-outline-primary deletemexbtn" style="padding: 0.6em 2em 0.6em 2em" onclick="deletesquealCHANNEL('+i+')">Delete</button><div class="reactions"><img src="../img/reaction_positive1.png" alt=""><img src="../img/reaction_positive2.png" alt=""><img src="../img/reaction_positive3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].pos_reactions+'</span></div><div class="reactions"><img src="../img/reaction_negative1.png" alt=""><img src="../img/reaction_negative2.png" alt=""><img src="../img/reaction_negative3.png" alt=""><span style="color:black">'+editCHANNEL.list_posts[i].neg_reactions+'</span></div></div></div>'; 
            document.getElementById("imgsquealer").removeAttribute("id");
            if(document.getElementById("recordedVideosquealer").src!=window.location.href)
                document.getElementById("recordedVideosquealer").classList.remove("d-none");
            document.getElementById("recordedVideosquealer").removeAttribute("id");
            if(editCHANNEL.list_posts[i].photoprofile=="")
                document.getElementById("imgprofilesquealer").src = "img/profile_photo1.png";
            document.getElementById("imgprofilesquealer").removeAttribute("id");
            latitude = "";
            longitude = "";
        }
    } else {
        alert("The message is empty!");
    }
});

function edit_listposts(x){
    if(x==1){
        editCHANNEL.list_posts = [];
        for(i=0;i<squeals.length;i++){
            if(editCHANNEL.name == squeals[i].sender)
            editCHANNEL.list_posts.push(squeals[i]);
        }
        savechangesCHANNEL();
    } else {
        editchannel.list_posts = [];
        for(i=0;i<squeals.length;i++){
            if(editchannel.name == squeals[i].sender)
            editchannel.list_posts.push(squeals[i]);
        }
        savechangeschannel();
    }
}

/*-------------------------------------Accesso fotocamera---------------------------------------------------- */

const videoElement = document.getElementById('webcam');
const startButton = document.getElementById('avviaFotocamera');
const captureButton = document.getElementById('catturaFoto');
const canvas = document.getElementById('canvas');
const capturedPhoto = document.getElementById('fotoCatturata');
const usePhoto = document.getElementById('usephoto');
let mediaStream = null;


function accesscamera(x){
    num_message = x;
    document.getElementById("access-camera").classList.remove("d-none");
    document.getElementById("access-camera").classList.add("d-flex");
    videoElement.classList.remove("d-none");
}

startButton.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.classList.remove("d-none");
        videoElement.srcObject = stream;
        capturedPhoto.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
        capturedPhoto.classList.add("d-none");
        usePhoto.classList.add("d-none");
        startButton.classList.add("d-none");
        captureButton.classList.remove("d-none");
        document.getElementById("labelpicturewebcam").classList.add("d-none");
        mediaStream = stream;
    } catch (error) {
        console.error('Errore durante l\'accesso alla fotocamera:', error);
    }
});

captureButton.addEventListener('click', () => {
    if (mediaStream) {
        // Cattura un'immagine dalla fotocamera e visualizzala su un elemento canvas
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        // Mostra l'immagine catturata su un elemento immagine
        capturedPhoto.src = canvas.toDataURL('image/jpeg');
        capturedPhoto.classList.remove("d-none");
        videoElement.classList.add("d-none");
        usePhoto.classList.remove("d-none");
        startButton.classList.remove("d-none");
        captureButton.classList.add("d-none");
        document.getElementById("labelpicturewebcam").classList.remove("d-none");
        mediaStream.getTracks().forEach(track => track.stop());
    }
});

function deletephoto(x){
    if(x==1){
        document.getElementById("photonewmessage").innerHTML = "";
        document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    } else {
        document.getElementById("photonewsqueal").innerHTML = "";
        document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    }
}

usePhoto.addEventListener("click",()=>{
    document.getElementById("access-camera").classList.add("d-none");
    capturedPhoto.classList.add("d-none");
    usePhoto.classList.add("d-none");
    if(num_message==1){
        document.getElementById("imgnewmessageCHANNEL").src = capturedPhoto.src;
        document.getElementById("photonewmessage").innerHTML = '<img src="'+capturedPhoto.src+'" class="rounded" alt="..." style="width:100%; height:100%"></img><button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletephoto(1)"><i class="bi-x" style="font-size:20px"></i></button>';
    } else if(num_message==3){
        document.getElementById("imgnewsqueal").src = capturedPhoto.src;
        document.getElementById("photonewsqueal").innerHTML = '<img src="'+capturedPhoto.src+'" class="rounded" alt="..." style="width:100%; height:100%"></img><button style="position: absolute; top: 10px; right: 10px; color:white; background-color: red; border-radius:8px; border:0" onclick="deletephoto(3)"><i class="bi-x" style="font-size:20px"></i></button>';
    } else { 
        newphotoprofile = capturedPhoto.src;
        document.getElementById("sectioncreateCHANNELphotoimg").src = newphotoprofile;
        document.getElementById("sectioncreateCHANNELphotoimg").style = "filter:invert(0); height:100%; width:auto";
    }
});

document.getElementById("closetakephoto").addEventListener("click",()=>{
    document.getElementById("access-camera").classList.add("d-none");
    capturedPhoto.classList.add("d-none");
    usePhoto.classList.add("d-none");
    if(capturedPhoto.src==""){
        if(num_message==1){
            document.getElementById("imgnewmessageCHANNEL").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            document.getElementById("photonewmessage").innerHTML = '';
        } else if(num_message==3){
            document.getElementById("imgnewsqueal").src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
            document.getElementById("photonewsqueal").innerHTML = '';
        } else { 
            newphotoprofile = capturedPhoto.src;
            document.getElementById("sectioncreateCHANNELphotoimg").src = newphotoprofile;
            document.getElementById("sectioncreateCHANNELphotoimg").style = "filter:invert(0); height:100%; width:auto";
        }
    }
});

function dataURLtoBlob(dataurl) {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

function loadImage(event){
    var reader = new FileReader();
    reader.onload = function(e) {
        var img = new Image();
        img.onload = function() {
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext('2d').drawImage(videoElement, 0, 0);
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            capturedPhoto.src = canvas.toDataURL('image/jpeg');
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(event.target.files[0]);
    capturedPhoto.classList.remove("d-none");
    videoElement.classList.add("d-none");
    usePhoto.classList.remove("d-none");
    startButton.classList.remove("d-none");
    captureButton.classList.add("d-none");
    document.getElementById("labelpicturewebcam").classList.remove("d-none");
}

/*-------------------------------------Accesso geolocalizzazione----------------------------------------------*/

function getposition(x){
    num_message = x;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async(position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            if(x==1){
                document.getElementById("map").classList.remove("d-none");
                if (map != null) {
                    map.remove();
                }
                let Address = await getAddressGeolocation(latitude, longitude);
                document.getElementById("map").innerHTML = '<p style="font-size:16px">'+Address+'</p><button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletemap()"><i class="bi-x" style="font-size:20px"></i></button>';
            } else {
                document.getElementById("mapnewsqueal").classList.remove("d-none");
                if (map2 != null) {
                    map2.remove();
                }
                document.getElementById("mapnewsqueal").innerHTML = '<button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletemap()"><i class="bi-x" style="font-size:20px"></i></button><button style="position: absolute; bottom: 10px; left: 10px; z-index: 1000; border-radius:8px; border:0; padding:6px 12px 6px 12px;" onclick="openGoogleMaps()">Open Map</button>';
                map2 = L.map('mapnewsqueal').setView([latitude, longitude], 13);
                L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {}).addTo(map2);
                
                L.marker([latitude, longitude]).addTo(map2);
            }
        }, (error) => {
          console.error(error);
        });
      } else {
        alert('Geolocation not supported on this browser.');
      }
}

function deletemap() {
    if(num_message==1)
        document.getElementById("map").classList.add("d-none");
    else 
        document.getElementById("mapnewsqueal").classList.add("d-none");
        latitude = "";
        longitude = "";
}

function openGoogleMaps() {
    var url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
}

async function getAddressGeolocation(lat, lon) {
    if (lat === undefined || lon === undefined) {
        return("");
    }
    var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) {
            throw new Error(`Errore di rete: ${response.status} ${response.statusText}`);
        }

        let via = data.address.road || data.address.name || '';
        let citta = data.address.town || data.address.city || data.address.village || '';
        let cap = data.address.postcode || '';
        let nazione = data.address.country || '';

        return `${via}, ${citta}, ${cap}, ${nazione}`;
    } catch (error) {
        console.error("Errore nella richiesta:", error);
        return ""; // Restituisci una stringa vuota o gestisci l'errore come preferisci
    }
}

/*--------------------------------------------accesso videocamera--------------------------------------------*/

let recordedVideo = document.getElementById('recordedVideo');

function accessvideo(x){
    num_message = x;
    document.getElementById("access-video").classList.remove("d-none");
    document.getElementById("access-video").classList.add("d-flex");
}

document.getElementById("videoInput").addEventListener("change",(event)=>{
      var reader = new FileReader();
      reader.onload = (e) => {
        recordedVideo.src = e.target.result;
        if(num_message==1){
            document.getElementById("videonewmessageCHANNEL").src = recordedVideo.src;
            document.getElementById("videonewmessage").innerHTML = '<video src="'+recordedVideo.src+'" class="rounded" alt="..." style="width:100%; height:100%" controls></video><button style="position: absolute; top: 10px; right: 10px; z-index: 1000; color:white; background-color: red; border-radius:8px; border:0" onclick="deletevideo(1)"><i class="bi-x" style="font-size:20px"></i></button>';
        } else if(num_message==3){
            document.getElementById("videonewsqueal").innerHTML += '<video src="'+recordedVideo.src+'" class="rounded" alt="..." style="width:100%; height:100%" controls></video><button style="position: absolute; top: 10px; right: 10px; color:white; background-color: red; border-radius:8px; border:0" onclick="deletevideo(3)"><i class="bi-x" style="font-size:20px"></i></button>';
            document.getElementById("videonewsquealCHANNEL").src = recordedVideo.src;
        }
      }
      reader.readAsDataURL(event.target.files[0]);
    document.getElementById("access-video").classList.add("d-none");
    document.getElementById("access-video").classList.remove("d-flex");
})

document.getElementById("closetakevideo").addEventListener("click", () =>{
    document.getElementById("access-video").classList.add("d-none");
    document.getElementById("access-video").classList.remove("d-flex");
})

function deletevideo(x){
    if(x==1){
        document.getElementById("videonewmessageCHANNEL").src = "";
        document.getElementById("videonewmessage").innerHTML = "";
    } else if(x==3){
        document.getElementById("videonewsquealCHANNEL").src = "";
        document.getElementById("videonewsqueal").innerHTML = "";
    }
}
