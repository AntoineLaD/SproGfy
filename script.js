const client_id = '2c9aa60620dd4550818f4e910d5ccd6c'; // Remplace par ton Client ID
const redirect_uri = 'http://127.0.0.1:5500/index.html'; // URL de redirection après login
const scope = 'user-read-private user-read-email user-top-read user-read-currently-playing'; // Scopes demandés

document.getElementById('loginButton').addEventListener('click', function() {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${client_id}&response_type=token&redirect_uri=${encodeURIComponent(redirect_uri)}&scope=${encodeURIComponent(scope)}&show_dialog=true`;


    window.location.href = authUrl;
});

// Vérifier si on a un token après la connexion
window.addEventListener('load', function() {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    const access_token = urlParams.get('access_token');

    if (access_token) {
        localStorage.setItem('spotify_access_token', access_token); // Stocker le token
        fetchSpotifyProfile(access_token);
    }
});

// Fonction pour récupérer les infos utilisateur depuis l'API Spotify
function fetchSpotifyProfile(token) {
    fetch('https://api.spotify.com/v1/me', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.display_name) {
            document.getElementById('profileName').innerText = data.display_name;
        }
        if (data.email) {
            document.getElementById('profileEmail').innerText = data.email;
        }
        
        document.getElementById('loginButton').style.display = 'none';
        document.getElementById('logoutButton').style.display = 'inline';
    })
    .catch(error => console.error('Erreur lors de la récupération des données Spotify', error));
}

// Déconnexion
document.getElementById('logoutButton').addEventListener('click', function() {
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

async function getCurrentTrack() {
    const response = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("spotify_access_token")}` }
    });
    const data = await response.json();
    if (data.item) {
        
        document.getElementById("ecoute").innerHTML = `
            <img src="${data.item.album.images[0].url}" style="width: 100px; height: 100px; border-radius: 20%;">
            <strong>${data.item.name}</strong> de ${data.item.artists.map(a => a.name).join(", ")}
            
        `;

    } else {
        document.getElementById("ecoute").innerText = "Pas d'écoute en cours!";
    }
    console.log("Écoute en cours :", data.item.name, "par", data.item.artists.map(a => a.name).join(", "));
}
setInterval(getCurrentTrack, 30000);


function clearData() {
   document.getElementById("ecoute").innerHTML = "";
   document.getElementById("topTrack").innerHTML = "";  
}
