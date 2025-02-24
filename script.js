const client_id = '2c9aa60620dd4550818f4e910d5ccd6c'; // Remplace par ton Client ID
const redirect_uri = 'http://127.0.0.1:5500/a.html'; // URL de redirection après login
const scope = 'user-read-private user-read-email user-top-read user-read-playback-state user-read-currently-playing'; // Scopes demandés

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


function fetchSpotifyProfile(token) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(err => {
                    console.error('Erreur API Spotify :', err);
                    throw new Error('Erreur lors de la récupération des données utilisateur: ' + err);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log("Données utilisateur reçues :", data);
            document.getElementById('profileName').innerText = 'Nom du profil: ' + data.display_name;
            document.getElementById('profileEmail').innerText = 'Mail du profil: ' + data.email;

            document.getElementById('loginButton').style.display = 'none';
            document.getElementById('logoutButton').style.display = 'block';
            document.getElementById('out').innerText = 'Log Out';
            document.getElementById('nomU').innerText = data.display_name;
            document.getElementById('imgU').innerHTML = `<img src="${data.images[0].url}" style="width: 35px; height: 30px; border-radius: 50%;border: 1px solid black; object-fit:cover">`;
            document.getElementById('U').style.display = 'none';
            getCurrentTrack();
            getTopTrack();
        })
        .catch(error => console.error('Erreur lors de la récupération des données Spotify:', error));
}



// Déconnexion
document.getElementById('logoutButton').addEventListener('click', function () {
    localStorage.removeItem('spotify_access_token'); // Supprime le token stocké
    window.location.href = redirect_uri; // Recharge la page
});

async function getTopTrack() {
    const accessToken = localStorage.getItem("spotify_access_token");
    if (!accessToken) return alert("Connecte-toi à Spotify d'abord !");

    const response = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=1&time_range=long_term", {
        headers: { "Authorization": `Bearer ${accessToken}` }
    });

    const data = await response.json();
    console.log("Réponse API Spotify:", data); // 🔍 Vérifier la réponse


    if (data.items.length > 0) {
        const topTrack = data.items[0];
        document.getElementById("topTrack").innerHTML = `
            <img src="${topTrack.album.images[0].url}" style="width: 100px; height: 100px; border-radius: 50%;">

            <strong>${topTrack.name}</strong> de ${topTrack.artists.map(a => a.name).join(", ")}
            
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
                <p style="margin-top: 70px !important; margin:0;">  ${data.progress_ms ? `${Math.floor(data.progress_ms / 1000 / 60)}:${Math.floor(data.progress_ms / 1000 % 60).toString().padStart(2, "0")}` : ""}</p>
                </div>
            `;
            console.log("Écoute en cours :", data.item.name, "par", data.item.artists.map(a => a.name).join(", "));
        } else {
            document.getElementById("ecoute").innerText = "Pas d'écoute en cours!";
        }
    } catch (error) {
        console.error('Erreur lors de la récupération de la piste en cours:', error);
        document.getElementById("ecoute").innerText = "Pas d'écoute en cours!";

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
        
            loadingBar.style.width = progress + '%';
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la barre de progression:', error);
    }
}

// Update the progress bar every second
setInterval(updateProgressBar, 1000);