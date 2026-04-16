


document.addEventListener('DOMContentLoaded', () => {
    
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null; 
    ////console.log(sessionUser.role);

    //console.log("sessionUser:", sessionUser);
    //console.log("user_ID:", sessionUser.user_ID);
    //console.log("username:", sessionUser.username);
    console.log("role:", sessionUser.role);

    if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 2) {
      document.getElementById('topBar').innerHTML = `<a href="UserStats.html" class="nav-btn">${sessionUser.username}</a>`;
    }else if (sessionUser && sessionUser.user_ID !== 0 && sessionUser.username !== null && sessionUser.role == 1) {
      //console.log("true");
      document.getElementById('topBar').innerHTML = `<a href="AdminPage.html" class="nav-btn">${sessionUser.username}</a>`;
    }else {
      document.getElementById('topBar').innerHTML = `<a href="LogIn.html" class="nav-btn">Login</a>`;
    }
});