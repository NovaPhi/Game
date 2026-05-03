(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

const music = document.getElementById('bgMusic');
//Done with help of claude
if (music) {
    const savedVolume = Math.min(60, Math.max(0, parseInt(localStorage.getItem('volume')) || 30));
    music.addEventListener('canplay', () => {
        music.volume = savedVolume / 100;
    }, { once: true });
    music.volume = savedVolume / 100;
}

//document.addEventListener('DOMContentLoaded', () => {
//    
//    
//
//    const stored = localStorage.getItem('sessionUser');
//    const sessionUser = stored ? JSON.parse(stored) : null; 
//    ////console.log(sessionUser.role);
//
//    //console.log("sessionUser:", sessionUser);
//    //console.log("user_ID:", sessionUser.user_ID);
//    //console.log("username:", sessionUser.username);
//    //console.log("role:", sessionUser.role);
//
//    if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 2) {
//      document.getElementById('topBar').innerHTML = `<a href="UserStats.html" class="nav-btn">${sessionUser.username}</a>`;
//    }else if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 1) {
//      //console.log("true");
//      document.getElementById('topBar').innerHTML = `<a href="AdminPage.html" class="nav-btn">${sessionUser.username}</a>`;
//    }else {
//      document.getElementById('topBar').innerHTML = `<a href="LogIn.html" class="nav-btn">Login</a>`;
//    }
//});

// Sets music volume and renders the nav bar link based on the user's session and role
document.addEventListener('DOMContentLoaded', () => {
    const music = document.querySelector('audio');
    if (music) {
        const savedVolume = localStorage.getItem('volume') ?? 50;
        music.volume = savedVolume / 100;
        music.addEventListener('canplay', () => {
            music.volume = savedVolume / 100;
        }, { once: true });
    }

    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 2) {
        document.getElementById('topBar').innerHTML = `<a href="UserStats.html" class="nav-btn">${sessionUser.username}</a>`;
    } else if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 1) {
        document.getElementById('topBar').innerHTML = `<a href="AdminPage.html" class="nav-btn">${sessionUser.username}</a>`;
    } else {
        document.getElementById('topBar').innerHTML = `<a href="LogIn.html" class="nav-btn">Login</a>`;
    }
});

// Redirects to the game if the player has a deck saved, otherwise sends them to the card selector
function goToGame() {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    let hasDeck = false;
    try {
        const parsed = JSON.parse(localStorage.getItem('playerDeck'));
        hasDeck = Array.isArray(parsed) && parsed.length > 0;
    } catch (e) {
        hasDeck = false;
    }

    window.location.href = hasDeck ? 'game.html' : 'cards.html';
}