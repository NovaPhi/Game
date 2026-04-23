(function applySettings() {
    const brightness = localStorage.getItem('brightness') ?? 100;
    const colorblind = localStorage.getItem('colorblind') || 'none';

    document.body.style.filter = `brightness(${brightness}%)`;

    document.body.classList.remove('deuteranopia', 'protanopia', 'tritanopia');
    if (colorblind !== 'none') document.body.classList.add(colorblind);
})();


document.addEventListener('DOMContentLoaded', async () => {
  const stored = localStorage.getItem('sessionUser');
  const sessionUser = stored ? JSON.parse(stored) : null;

  if (!sessionUser || sessionUser.user_ID === 0) {
    window.location.href = 'LogIn.html';
    return;
  }

  const tableBody = document.getElementById('logsTable');
  const connectionLogsBody = document.getElementById('connectionLogsTable');
  const usersTableBody = document.getElementById('usersTable');

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

  try{
    const response = await fetch(`http://localhost:8081/LogsTable`);
    const data = await response.json();

    connectionLogsBody.innerHTML = "";

    if (!data.Logs || data.Logs.length === 0) {
      connectionLogsBody.innerHTML = `<tr><td colspan="7">No logs found</td></tr>`;
      return;
    }

    data.Logs.forEach(log => {
      const row = document.createElement("tr");

      const cells = [
        log.log_id,
        log.user_ID,
        log.connection_date,
        log.disconnection_date ?? "Active",
        log.ip_address,
        log.location,
        log.device_browser
      ];

      cells.forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(td);
      });

      connectionLogsBody.appendChild(row);
    });

  }catch (err) {
    console.error(err);
    connectionLogsBody.innerHTML = `<tr><td colspan="7">Error loading Connection logs</td></tr>`;
  }

  try {
    const response = await fetch(`http://localhost:8081/UserRegistry`);
    const data = await response.json();

    usersTableBody.innerHTML = "";

    if (!data.Users || data.Users.length === 0) {
      usersTableBody.innerHTML = `<tr><td colspan="7">No users found</td></tr>`;
      return;
    }

    data.Users.forEach(user => {
      const row = document.createElement("tr");

      const cells = [
        user.id,
        user.username,
        user.email,
        user.role,
        user.status,
        user.created,
      ];

      cells.forEach(value => {
        const td = document.createElement("td");
        td.textContent = value;
        row.appendChild(td);
      });

      usersTableBody.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    usersTableBody.innerHTML = `<tr><td colspan="7">Error loading User Registry</td></tr>`;
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

async function logout(){
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    const response = await fetch(`http://localhost:8081/Logout?user_ID=${sessionUser.user_ID}`, { method: 'GET' });

    const data = await response.json();

    if (data.success){
        localStorage.removeItem('playerDeck');
        localStorage.removeItem('sessionUser');
        localStorage.setItem('sessionUser', JSON.stringify({user_ID: 0, username: null}));
        window.location.href = 'main.html'
    }
};

