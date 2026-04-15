document.addEventListener('DOMContentLoaded', async () => {
  const stored = localStorage.getItem('sessionUser');
  const sessionUser = stored ? JSON.parse(stored) : null;

  if (!sessionUser || sessionUser.user_ID === 0) {
    window.location.href = 'LogIn.html';
    return;
  }

  const tableBody = document.getElementById('logsTable');

  const statusMap = {
    1: "active",
    2: "banned",
    3: "disabled"
  };

  try {
    const response = await fetch(`http://localhost:8081/Admin`);
    const data = await response.json();

    tableBody.innerHTML = "";

    if (!data.Users || data.Users.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="2">No users found</td></tr>`;
      return;
    }

    data.Users.forEach(user => {
      const row = document.createElement("tr");

      const userCell = document.createElement("td");
      userCell.textContent = user.username;

      const actionCell = document.createElement("td");
      actionCell.textContent = statusMap[user.Stauts] || "unknown";

      const btnCell = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Ban"
      btn.onclick = () => banbutton(user.user_ID);
      

      btnCell.appendChild(btn);
      
      row.appendChild(userCell);
      row.appendChild(actionCell);
      row.appendChild(btnCell);

      tableBody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    tableBody.innerHTML = `<tr><td colspan="2">Error loading User</td></tr>`;
  }
});

function banbutton(user_ID) {
    console.log("sending ", user_ID)
    fetch('http://localhost:8081/Admin', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            user_ID: user_ID
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success){
            location.reload();
        }
        console.log(data);
    })
    .catch(err => console.error(err));
    
};

function logout(){
    localStorage.setItem('sessionUser', JSON.stringify({user_ID: 0, username: null}));
    window.location.href = 'main.html'
};