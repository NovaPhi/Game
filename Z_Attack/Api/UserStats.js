(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();

async function logout(){
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    const response = await fetch(`http://localhost:8081/Logout?user_ID=${sessionUser.user_ID}`, { method: 'GET' });

    const data = await response.json();

    if (data.success){
        localStorage.setItem('sessionUser', JSON.stringify({user_ID: 0, username: null}));
        localStorage.removeItem('playerDeck');
        localStorage.removeItem('sessionUser');
        window.location.href = 'main.html'
    }
};

async function deleteAccount() {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    const response = await fetch(`http://localhost:8081/deleteAccount?user_ID=${sessionUser.user_ID}`);

    const data = await response.json();

    if (data.success) {
        localStorage.setItem('sessionUser', JSON.stringify({ user_ID: 0, username: null }));
        window.location.href = '../HTML/LogIn.html';
    } else {
        //console.log('failed to delete account');
    }
}

//delete user changes the status of the account from 1-0 and change the login logic so that it also checks account status

document.addEventListener('DOMContentLoaded', async () =>{
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;
    //console.log(sessionUser.user_ID);
    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/UserStats?user_ID=${sessionUser.user_ID}`);
        const data = await response.json();
        //console.log(data);
        
         
        function StoH(times){
            var hour = Math.floor(times / 3600);
            var min = Math.floor(times % 3600 / 60);
            var sec = Math.floor(times % 3600 % 60);
            return `${hour.toString()}:${min.toString()}:${sec.toString()}`;
        }
        

        document.getElementById('gamesPlayed').innerHTML = data.total_runs;
        document.getElementById('wins').innerHTML = data.best_score;
        document.getElementById('losses').innerHTML = data.best_level;
        document.getElementById('Playtime').innerHTML = StoH(data.playtime);
  } catch (err) {
        //console.error('Failed to fetch stats:', err);
  }

    
});


document.addEventListener('DOMContentLoaded', () => {
    
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null; 
    
    document.getElementById('usernameDisplay').innerHTML = sessionUser.username

});

