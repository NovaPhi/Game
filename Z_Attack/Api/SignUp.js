document.getElementById('btnCreate').addEventListener('click', async () => {
    const username = document.getElementById('Username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;

    //console.log('values:', username, password, email); // verify values are read

    const response = await fetch('http://localhost:8081/SignUp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email })
    });

    const data = await response.json();

    if (data.success) {
        window.location.href = 'LogIn.html';
    } else {
        //console.log(data.message);
    }
});