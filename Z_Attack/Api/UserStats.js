function logout(){
    localStorage.setItem('sessionUser', JSON.stringify({user_ID: 0, username: null}));
    window.location.href = 'main.html'
}
//delete user changes the status of the account from 1-0 and change the login logic so that it also checks account status

document.addEventListener('DOMContentLoaded', async () =>{
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    try {
        const response = await fetch(`http://localhost:8081/UserStats?user_id=${sessionUser.user_ID}`);
        const data = await response.json();
        

        document.getElementById('gamesPlayed').innerHTML = data.total_runs;
        document.getElementById('wins').innerHTML = data.best_score;
        document.getElementById('losses').innerHTML = data.best_level;
        document.getElementById('Playtime').innerHTML = data.playtime;
  } catch (err) {
        console.error('Failed to fetch stats:', err);
  }

    
});


document.addEventListener('DOMContentLoaded', () => {
    
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null; 
    
    document.getElementById('usernameDisplay').innerHTML = sessionUser.username

});

