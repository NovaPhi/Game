document.addEventListener("DOMContentLoaded", () => {
    loadLeaderboard();
});

function formatPlaytime(seconds) {
    if (!seconds) return '—';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function rankLabel(i) {
    if (i === 0) return '🥇';
    if (i === 1) return '🥈';
    if (i === 2) return '🥉';
    return i + 1;
}

async function loadLeaderboard() {
    const loadingMsg = document.getElementById('loading-msg');
    const errorMsg   = document.getElementById('error-msg');
    const table      = document.getElementById('leaderboard-table');
    const tbody      = document.getElementById('leaderboard-body');

    try {
        const res = await fetch('http://localhost:8081/leaderboard');

        // 🔍 DEBUG útil
        console.log("STATUS:", res.status);

        if (!res.ok) throw new Error("HTTP error");

        const data = await res.json();
        console.log("DATA:", data);

        if (!data.success || !data.leaderboard) {
            throw new Error("Formato incorrecto");
        }

        loadingMsg.style.display = 'none';
        table.style.display = 'table';

        tbody.innerHTML = ""; // limpiar

        data.leaderboard.forEach((row, i) => {
            const tr = document.createElement('tr');

            if (i === 0) tr.classList.add('rank-1');
            else if (i === 1) tr.classList.add('rank-2');
            else if (i === 2) tr.classList.add('rank-3');

            tr.innerHTML = `
                <td>${rankLabel(i)}</td>
                <td>${row.username}</td>
                <td>${Number(row.best_score).toLocaleString()}</td>
                <td>${row.best_level}</td>
                <td>${Number(row.total_xp).toLocaleString()}</td>
                <td>${row.total_runs}</td>
                <td class="playtime-cell">${formatPlaytime(row.playtime)}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Leaderboard error:", err);

        loadingMsg.style.display = 'none';
        errorMsg.style.display = 'block';
    }
}