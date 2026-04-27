const ctx = document.getElementById('myChart');
let currentChart = null;

const CHART_CONFIG = {
    gamesOverTime: {type: 'line', label: 'Games played'},
    highscoreDistribution: {type: 'bar',  label: 'Highscore'},
    cardsDistribution: { type: 'bar',  label: 'Cards unlocked'}
};

async function loadChart(chartName){
    const config = CHART_CONFIG[chartName];
    if (!config) return;

    try {
        const response = await fetch(`http://localhost:8081/stats/${chartName}`);
        const data = await response.json();
        createChart(data, config.type, config.label);
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    document.querySelectorAll('.chart-selector .graphButton').forEach(btn => {
        btn.addEventListener('click', () => loadChart(btn.dataset.chart));
    });

    loadChart('gamesOverTime');
});

function createChart(payload, type, datasetLabel){
  if (currentChart) currentChart.destroy();
  currentChart = new Chart(ctx, {
    type: type,
    data: {
      labels: payload.labels,
      datasets: [{
        label: datasetLabel,
        data: payload.data,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.35)',
        borderWidth: 2,
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false
    }
  });
}