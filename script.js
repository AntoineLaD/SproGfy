const client_id = '2c9aa60620dd4550818f4e910d5ccd6c'; // Remplace par ton Client ID
const redirect_uri = 'http://127.0.0.1:5500/a.html'; // URL de redirection après login
const scope = 'user-read-private user-modify-playback-state user-read-email user-top-read user-read-playback-state user-read-currently-playing user-read-recently-played user-library-read user-follow-read playlist-modify-public playlist-modify-private playlist-read-private'; // Scopes demandés

document.getElementById('loginButton').addEventListener('click', function () {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;


    window.location.href = authUrl;
});

// Vérifier si on a un token après la connexion
window.addEventListener('load', function () {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    let access_token = urlParams.get('access_token');

    if (access_token) {
        localStorage.setItem('spotify_access_token', access_token);
        console.log('Token récupéré et stocké:', access_token);
        fetchSpotifyProfile(access_token);
    } else {
        console.log("Aucun token détecté, demande de connexion.");
    }
});

//récupérer les données du compte utilisateur
async function fetchSpotifyProfile(token) {
    try {
        const response = await fetch('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const err = await response.text();
            console.error('Erreur API Spotify :', err);
            throw new Error('Erreur lors de la récupération des données utilisateur: ' + err);
        }

        const data = await response.json();
        console.log("Données utilisateur reçues :", data);

            // Afficher les données utilisateur
            document.getElementById('profileName').innerHTML = '<p style="height: 25%;"><strong>Nom: </strong>'+data.display_name+'</p>';
            document.getElementById('profileEmail').innerHTML = '<p style="height: 25%;"><strong>Mail: </strong>'+data.email+'</p>';
            document.getElementById('profileCountry').innerHTML = '<p style="height: 25%;"><strong>Pays: </strong>'+data.country+'</p>';
            document.getElementById('profileFollowers').innerHTML = '<p style="height: 25%;"><strong>Nombre de Followers: </strong>'+data.followers.total+'</p>'; 
            document.getElementById('ProfileUser').style.display = 'none';
           

            try{            document.getElementById('imgP').innerHTML = `<img src="${data.images[0].url}" style="margin-left:40px; margin-right:20px;width: 150px; height: 150px; border-radius: 50%;border: 1px solid black; object-fit:cover;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">`;
        }catch (error) {
            document.getElementById('ProfileUser').style.display = 'block';
            document.getElementById('ProfileUser').style.marginLeft = '50px';
            document.getElementById('ProfileUser').style.paddingRight = '0';
            document.getElementById('ProfileUser').style.width = '170px';




            console.error('Erreur lors de la récupération de l\'image:', error);
        }



            // Cacher le bouton de connexion et afficher le bouton de déconnexion

            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('out').innerText = 'Log Out';
            document.getElementById('nomU').innerText = data.display_name;
            document.getElementById('U').style.display = 'none';

            try{
                document.getElementById('imgU').innerHTML = `<img src="${data.images[0].url}" style="width: 35px; height: 30px; border-radius: 50%;border: 1px solid black; object-fit:cover">`;

            } catch (error) {
                console.error('Erreur lors de la récupération de l\'image:', error);
                document.getElementById('U').style.display = 'block';

            }

            // Récupérer les données du compte souhaitées
            getCurrentTrack();
            getTopTrack();
            getRecentlyPlayed();
            getLastLike();
            getLastFollowed();
            getTopArtist();
            searchSpotify();
            const userID = data.id;
            getUserPlaylist(userID);
        } catch (error) {
        console.error('Erreur lors de la récupération des données Spotify:', error);
    }
}


// Déconnexion
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('spotify_access_token'); // Supprime le token stocké
    window.location.href = redirect_uri; // Recharge la page
});

async function getTopTrack() {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=5&time_range=long_term", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data); // 🔍 Vérifier la réponse


    if (data.items.length > 0) {
        const topTrack = data.items[0];
        const topTrack2 = data.items[1];
        const topTrack3 = data.items[2];
        const topTrack4 = data.items[3];
        document.getElementById("topTrack").innerHTML = `

            <div style="display: flex; flex-direction: row ; align-items: center; justify-content: space-between; width: 100%; height: 100%; ">
                <div style="display: flex; flex-direction: column ; align-items: center; width: 25%; height: 100%;justify-content: center;">
                    <img src="${topTrack.album.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">

                     <strong style=" text-align:center;font-size:0.7em; margin-top:2px;">${topTrack.name}</strong> <p style="font-size:0.5em;">de ${topTrack.artists.map(a => a.name).join(", ")}</p>
                 </div>
                 <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                    <img src="${topTrack2.album.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">

                    <strong style="  text-align:center;font-size:0.7em;margin-top:2px;">${topTrack2.name}</strong> <p style="font-size:0.5em;">de ${topTrack2.artists.map(a => a.name).join(", ")}</p>
                </div>
                <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                    <img src="${topTrack3.album.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">

                    <strong style="text-align:center; font-size:0.7em;margin-top:2px;">${topTrack3.name}</strong><p style="font-size:0.5em;">de ${topTrack3.artists.map(a => a.name).join(", ")}</p>
                </div>
                 <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                    <img src="${topTrack4.album.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">

                    <strong style="text-align:center; font-size:0.7em;margin-top:2px;">${topTrack4.name}</strong> <p style="font-size:0.5em;">de ${topTrack4.artists.map(a => a.name).join(", ")}</p>
                </div>
            </div>
            
        `;
    } else {
        document.getElementById("topTrack").innerText = "Aucun morceau trouvé !";
    }
}
getTopTrack();
async function getCurrentTrack() {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) {
        console.error("Aucun token d'accès trouvé. Veuillez vous connecter.");
        return;
    }

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur lors de la récupération de la piste en cours:', errorText);
            return;
        }

        const data = await response.json();

        if (data.item) {
            document.getElementById("ecoute").innerHTML = `
                <div  style="display: flex; flex-direction: column ; align-items: center;">
                <img src="${data.item.album.images[0].url}" style="width: 200px; height: 200px; border-radius: 20%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);"><br>
                <strong>${data.item.name}</strong> de ${data.item.artists.map(a => a.name).join(", ")}<br>
                <br>
                <div style="display: flex; flex-direction: row; align-items: center; justify-content: center;">
                <i class="fa-solid fa-backward" style=" margin-right:5px;cursor:pointer;" onclick="skipPreviousSpotify('${accessToken}');"></i>

                ${data.is_playing ? `<i class="fa-solid fa-circle-pause" style="font-size: 2em;cursor:pointer;" onclick="pauseSpotify('${accessToken}');"></i>` : `<i class="fa-solid fa-circle-play"style="font-size: 2em;cursor:pointer "onclick="playSpotify('${accessToken}'); "></i>`}
                <i class="fa-solid fa-forward" style="  margin-left:5px;cursor:pointer;" onclick="skipSpotify('${accessToken}');"></i>
                </div>

                <p style="margin-top: 20px !important; margin:0;">  ${data.progress_ms ? `${Math.floor(data.progress_ms / 1000 / 60)}:${Math.floor(data.progress_ms / 1000 % 60).toString().padStart(2, "0")}` : ""}</p>
                </div>
            `;
            console.log("Écoute en cours :", data.item.name, "par", data.item.artists.map(a => a.name).join(", "));
        } else {
            document.getElementById("ecoute").innerHTML = '<p style="font-size: 4em;margin-top:20px">Pas d\'écoute en cours!</p>';
            document.getElementById('loading-bar').style.display = 'none';
            document.getElementById('loading-bar-container').style.display = 'none';
    
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la piste en cours:', error);
        document.getElementById("ecoute").innerHTML = '<p style="font-size: 2em;margin-top:120px">Pas d\'écoute en cours!</p>';
        document.getElementById('loading-bar').style.display = 'none';
        document.getElementById('loading-bar-container').style.display = 'none';


    }
}

setInterval(getCurrentTrack, 1000);





function clearData() {
    document.getElementById("ecoute").innerHTML = "";
    document.getElementById("topTrack").innerHTML = "";
}

async function updateProgressBar() {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    try {
        const response = await fetch("https://api.spotify.com/v1/me/player", {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });

        if (!response.ok) {
            console.error('Erreur lors de la récupération des informations de lecture:', await response.text());
            return;
        }

        const data = await response.json();
        if (data.item) {
            document.getElementsByClassName('loading-bar')[0].style.display = 'block';
            document.getElementsByClassName('loading-bar-container')[0].style.display = 'block';
            const progress = (data.progress_ms / data.item.duration_ms) * 100;

            const loadingBar = document.getElementsByClassName('loading-bar')[0];
            loadingBar.style.width = progress + '%';
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la barre de progression:', error);
    }
}

// Update the progress bar every second
setInterval(updateProgressBar, 1000);

async function pauseSpotify(token) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/pause", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log("Playback paused successfully.");
            return true;
        } else {
            const errorText = await response.text();
            console.error("Error pausing playback:", errorText);
            return false;
        }
    } catch (error) {
        console.error("Error pausing playback:", error);
        return false;
    }
}
async function playSpotify(token) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/play", {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log("Playback played successfully.");
            return true;
        } else {
            const errorText = await response.text();
            console.error("Error playing playback:", errorText);
            return false;
        }
    } catch (error) {
        console.error("Error playing playback:", error);
        return false;
    }
}
async function skipSpotify(token) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/next", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log("Playback skiping successfully.");
            return true;
        } else {
            const errorText = await response.text();
            console.error("Error skiping playback:", errorText);
            return false;
        }
    } catch (error) {
        console.error("Error skiping playback:", error);
        return false;
    }
}

async function skipPreviousSpotify(token) {
    try {
        const response = await fetch("https://api.spotify.com/v1/me/player/previous", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            console.log("Playback skiping successfully.");
            return true;
        } else {
            const errorText = await response.text();
            console.error("Error skiping playback:", errorText);
            return false;
        }
    } catch (error) {
        console.error("Error skiping playback:", error);
        return false;
    }
}

async function getRecentlyPlayed() {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    const response = await fetch("https://api.spotify.com/v1/me/player/recently-played?limit=1", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data); // 🔍 Vérifier la réponse

    if (data.items.length > 0) {
        const recentTrack = data.items[0].track;
        document.getElementById("lastListen").innerHTML = `
            <div style="display: flex; flex-direction: column ; align-items: center;">
            <img src="${recentTrack.album.images[0].url}" style="width: 100px; height: 100px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
            <br>
            <strong>${recentTrack.name}</strong> <br>de ${recentTrack.artists.map(a => a.name).join(", ")}
            </div>
        `;
    } else {
        document.getElementById("recentTrack").innerText = "Aucun morceau trouvé !";
    }
}

setInterval(getRecentlyPlayed, 5000);


async function getLastLike(){
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    const response = await fetch("https://api.spotify.com/v1/me/tracks?limit=1", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data);
    if (data.items.length > 0) {
        const lastLike = data.items[0].track;
        document.getElementById("lastLiked").innerHTML = `
            <div style="display: flex; flex-direction: column ; align-items: center;">
            <img src="${lastLike.album.images[0].url}" style="width: 100px; height: 100px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
            <br>
            <strong>${lastLike.name}</strong> <br>de ${lastLike.artists.map(a => a.name).join(", ")}
            </div>
        `;
    } else {
        document.getElementById("lastLiked").innerText = "Pas de like récent";
    }
} 

setInterval(getLastLike, 5000);

async function getLastFollowed(){
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    const response = await fetch("https://api.spotify.com/v1/me/following?type=artist&limit=1", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data);
    if (data.artists.items) {
        const lastFollow = data.artists.items[0];
        document.getElementById("lastFollow").innerHTML = `
            <div style="display: flex; flex-direction: column ; align-items: center;">
            <img src="${lastFollow.images[0].url}" style="width: 100px; height: 100px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);">
            <br>
            <strong>${lastFollow.name}</strong> 
            </div>
        `;
    } else {
        document.getElementById("lastFollow").innerText = "Pas de like récent";
    }
} 

setInterval(getLastFollowed, 5000);


async function getTopArtist(){
    const token = localStorage.getItem("spotify_access_token");
    if (!token) return;

    const response = await fetch("https://api.spotify.com/v1/me/top/artists?limit=5&time_range=long_term", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data); 

    if(data.items.length > 0){
        const topArtist = data.items[0];
        const topArtist2 = data.items[1];
        const topArtist3 = data.items[2];
        const topArtist4 = data.items[3];

        document.getElementById("topArtists").innerHTML = ` 
        
            <div style="display: flex; flex-direction: row ; align-items: center; justify-content: space-between; width: 100%; height: 100%; ">
            <div style="display: flex; flex-direction: column ; align-items: center; width: 25%; height: 100%;justify-content: center;">
                <img src="${topArtist.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
                <strong style=" text-align:center;font-size:0.7em; margin-top:2px;">${topArtist.name}</strong>
            </div>
            <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                <img src="${topArtist2.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
                <strong style="  text-align:center;font-size:0.7em;margin-top:2px;">${topArtist2.name}</strong>
            </div>
            <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                <img src="${topArtist3.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
                <strong style="text-align:center; font-size:0.7em;margin-top:2px;">${topArtist3.name}</strong>
            </div>
            <div style="display: flex; flex-direction: column ; align-items: center;width: 25%; height: 100%;justify-content: center;">
                <img src="${topArtist4.images[0].url}" style="width: 60px; height: 60px; border-radius: 50%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
                <strong style="text-align:center; font-size:0.7em;margin-top:2px;">${topArtist4.name}</strong>
            </div>
            </div>
            
        `;
    }
}

function getValue() {
    // Sélectionner l'élément input et récupérer sa valeur
    var input = document.getElementById("MusicInput").value;
    // Afficher la valeur
    searchSpotify();
}

async function searchSpotify() {

    const query = document.getElementById("MusicInput").value;
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return;

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });
    if(query == ""){
        document.getElementById("musicResult").innerText = "";
        throw error;
    }
    const data = await response.json();
    console.log("Réponse de la recherche API Spotify:", data); // 🔍 Vérifier la réponse    
   
    if (data.tracks.items.length > 0) {
        console.log(data.tracks.total);

        const trackIds = data.tracks.items.map(track => track.id).join(',');
        const likedResponse = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${trackIds}`, {
            headers: { "Authorization": `Bearer ${accessToken}` }
        });
        const likedData = await likedResponse.json();
        const resultHtml = data.tracks.items.map((track, index) => {
            const isLiked = likedData[index];
            return `
            <div style="display: flex; flex-direction: row ;  width:100%; margin-left:10px;border-left:1px solid black;margin-top:1%; ">
                <img src="${track.album.images[0].url}" style="font-size:1,5em;margin:1%;width: 60px; height: 60px; border-radius: 10%;box-shadow: 0 0 10px rgba(0, 0, 0, 0.5)">
                <div style="display: flex; flex-direction: column ;  width: 60%; justify-content: center;">
                    <strong>${track.name}</strong>
                    de ${track.artists.map(a => a.name).join(", ")}
                </div>
                <div style="display:flex; width:30%;align-items:center;justify-content:space-around;">
                    ${isLiked ? '<i class="fa-solid fa-heart" style="font-size:1.3em; color: lightgreen;"></i>' : '<i class="fa-solid fa-heart" style="font-size:1.3em; color: grey;"></i>'}
                    <i class="fa-solid fa-plus" style="font-size:1.3em"></i>
                    <i class="fa-solid fa-play" style="font-size:1.3em"></i>
                </div>
            </div>`;
        }).join('');

        document.getElementById("musicResult").innerHTML = `
        <div style="display: flex; flex-direction: column ; align-items: center;  height: 100%; width:100%">
            ${resultHtml}
        </div>`;
       
        console.log("Resultat de la recherche trouvés:", data.items.name);
    } else {
        document.getElementById("musicResult").innerText = "Aucun morceau trouvé !";
        console.log("Aucun morceau trouvé ! pour la recherche", query);
    }
}

setInterval(searchSpotify, 1000);


async function getUserPlaylist(userID) {
    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) {
        console.error('No access token found');
        return;
    }

    try {
        const response = await fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erreur lors de la récupération des playlists:', errorText);
            return;
        }

        console.log('Réponse API Spotify:', response);
        const data = await response.json();
        console.log('Données des playlists:', data);

        if (data && Array.isArray(data.items)) {
            const playlistHtml = data.items.map(playlist => {
                // Vérifiez si playlist.images est défini et est un tableau
                const imageUrl = playlist.images && Array.isArray(playlist.images) && playlist.images.length > 0
                    ? playlist.images[0].url
                    : 'images.png'; // Fournissez une URL d'image par défaut si nécessaire

                return `
                <div onclick="selectionPlaylist(this);" class="playlistPointer" style="display: flex; flex-direction: row; justify-content: flex-start; align-items: center; cursor: pointer; width: 100%; margin-top: 5%;">
                    <img src="${imageUrl}" style="width: 60px; height: 60px; border-radius: 10%; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); margin-left: 10px; margin-right: 10px;">
                    <strong>${playlist.name}</strong>
                    <p style="display:none">${playlist.id}</p>
                </div>
                `;
            }).join('');

            // Vérifiez que l'élément avec l'ID 'playlistResult' existe
            const playlistContainer = document.getElementById('playlistResult');
            if (playlistContainer) {
                playlistContainer.innerHTML = `
                    <div style="display: flex; flex-direction: column; align-items: center; width: 100%;">
                        ${playlistHtml}
                    </div>
                `;
            } else {
                console.error("Element with ID 'playlistResult' not found");
            }
        } else {
            console.error("Data or data.items is not defined or not an array");
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}



async function selectionPlaylist(element){

    const temp = document.querySelector('.selected');

    if (temp != null){
        temp.classList.remove('selected');
        document.getElementById('supprPlaylist').style.display = "none";

    }
    if (temp == element){
        return;
    }
    element.classList.add('selected');
    document.getElementById('supprPlaylist').innerHTML= `<button style="border:none;outline:none; background-color: red;" >Delete</button>
`;
document.getElementById('supprPlaylist').style.display = "inline";

   return;
}


async function InputInfoNewPlaylist(){
    document.getElementById('buttonPlaylist').style.display = 'none';
    if(document.getElementById('newplaylist').style.display = 'none'){
        document.getElementById('newplaylist').style.display = "block";
  
    }
    document.getElementById('newplaylist').innerHTML = `
<form >
    <label for="name">Playlist name:</label><br>
    <input type="text" id="name" name="playlistName"><br>
    <label for="Pdescription">Description:</label><br>
    <input type="search" id="Pdescription" name="description"><br>
    <p> Visibilité de la playlist</p>
    <input type="radio" id="publ" name="statut" value="PUBL">
    <label for="publ">Public</label><br>
    <input type="radio" id="priv" name="statut" value="PRIV">
    <label for="priv">Private</label><br><br>
    <i class="fa-solid fa-check"style="cursor:pointer;"onClick="createNewPlaylist();" ></i>    
    <i class="fa-solid fa-rotate-left" style="cursor:pointer;"onClick="document.forms[0].reset();"></i>
    <i class="fa-solid fa-xmark" style="cursor:pointer;" onClick="resetInput();"></i>
</form>`;
   
    
}

async function resetInput() {
    document.getElementById('newplaylist').style.display = "none";
    document.getElementById('buttonPlaylist').style.display = "inline";
    return;

    
}

async function createNewPlaylist(){
    const name = document.getElementById('name').value;
    const desc = document.getElementById('Pdescription').value;
    let publice = true;

    const accessToken = localStorage.getItem('spotify_access_token');
    if (!accessToken) return;
    if(document.getElementById('priv').value){
        publice = false;
    }
    try {
        const response = await fetch("https://api.spotify.com/v1/me/playlists", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name,
                description: desc,
                public: publice
            })
        });

        if (response.ok) {
            const playlistData = await response.json();
            console.log('Nouvelle playlist créée:', playlistData);
            document.forms[0].reset();
            resetInput();
            alert('succes de la creation de playlist');
            const reponse = await fetch('https://api.spotify.com/v1/me', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            if (!reponse.ok) {
                const err = await reponse.text();
                console.error('Erreur API Spotify :', err);
                throw new Error('Erreur lors de la récupération des données utilisateur: ' + err);
            }
    
            const data = await reponse.json();

            const user = data.id;

            await getUserPlaylist(user);
         

        } else {
            const errorText = await response.text();
            console.error('Erreur lors de la création de la playlist:', errorText);
        }
    } catch (error){
        console.error('erreur:', error);
        return false;
    }
}


async function getPlaylistId(){
    if(document.querySelector('.selected')){
        const id = document.getElementById('playlistPointer').playlist.id;
        console.log('Selected playlist ID:', id);
    }
}