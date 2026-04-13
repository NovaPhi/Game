


document.addEventListener('DOMContentLoaded', () => {
    
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null; 
    
    if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null) {
      document.getElementById('topBar').innerHTML = `<a href="UserStats.html" class="nav-btn">${sessionUser.username}</a>`;
    } else {
      document.getElementById('topBar').innerHTML = `<a href="LogIn.html" class="nav-btn">Login</a>`;
    }
});