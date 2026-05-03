/*
Data graphics logic and API connection file.
In this file, we establish the API connection necesary for fetching the data used in our graphics.
We also use the Chart.js library to create the charts.
For Chart.js usage, the video by Digital Fox was very useful and acted as main guide for this part of the project
https://www.youtube.com/watch?v=XPOSEf40SkQ
*/

// Load the chart's canvas and creates new variable to store the chart
const ctx = document.getElementById('myChart');
let currentChart = null;

// Create object for the different types of charts, defining name, type and label
const CHART_CONFIG = {
    gamesOverTime: {type: 'line', label: 'Games played'},
    highscoreDistribution: {type: 'bar',  label: 'Highscore'},
    cardsDistribution: { type: 'bar',  label: 'Cards unlocked'}
};

// API endpoint connection to retrieve chart's data
async function loadChart(chartName){
    // Selects chart
    const config = CHART_CONFIG[chartName];
    if (!config) return;

    // Calls the appropiate endpoint depending on selected chart
    try {
        const response = await fetch(`http://localhost:8081/stats/${chartName}`);
        const data = await response.json();
        createChart(data, config.type, config.label); // Calls createChart method with the selected chart's data
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Checks logged in user and redirects to log in page if there is no logged in user
    const stored = localStorage.getItem('sessionUser');
    const sessionUser = stored ? JSON.parse(stored) : null;

    if (!sessionUser || sessionUser.user_ID === 0) {
        window.location.href = 'LogIn.html';
        return;
    }

    // Select the chart based on HTML's dataset (each chart's button). Based on this button, the chart is called
    document.querySelectorAll('.chart-selector .graphButton').forEach(btn => { // Dataset usage and chart calling function sugested by AI
        btn.addEventListener('click', () => loadChart(btn.dataset.chart));
    });

    loadChart('gamesOverTime');
});

// Create chart function. Highly based on Digital Fox's tutorial
function createChart(payload, type, datasetLabel){
  if (currentChart) currentChart.destroy(); // Destroy the chart that is currently on the canvas to avoid two charts at once
  currentChart = new Chart(ctx, { //Creates the new chart
    type: type, // Type defined in object
    data: {
      labels: payload.labels, // Labels retrieved from endpoint's JSON
      datasets: [{
        label: datasetLabel, // Label defined in object
        data: payload.data, // Data retrieved from endpoint's JSON
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