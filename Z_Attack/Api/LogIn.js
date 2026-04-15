document.getElementById('btnSignin').addEventListener('click', async () => {
    const btn = document.getElementById('btnSignin');

    const Username = document.getElementById('Username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('http://localhost:8081/Login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Username, password })
    });

    const data = await response.json();

    if (data.success) {
        //console.log(data.user_ID);
        localStorage.setItem('sessionUser', JSON.stringify({user_ID: data.user_ID , username: data.username, role: data.role}));
        btn.textContent = 'Welcome Back...';
        btn.style.color = '#4caf50';
        btn.style.borderColor = '#4caf50';
        btn.style.textShadow = '0 0 8px rgba(76, 175, 80, 0.8)';

        localStorage

        setTimeout(() => {
            window.location.href = '../HTML/main.html';
        }, 2000);
    } else {
        btn.textContent = 'Access Denied...';
        btn.style.color = '#e53935';
        btn.style.borderColor = '#e53935';

        setTimeout(() => {
            btn.textContent = 'Sign In';
            btn.style.color = '';
            btn.style.borderColor = '';
            btn.disabled = false; // re-enable so they can try again
        }, 2000);
    }
});

