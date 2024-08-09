document.addEventListener('DOMContentLoaded', (event) => {
    const ctx = document.getElementById('waterLevelChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'line',
        data: { // Data to be rendered in the chart -- move this to back end eventually
            labels: ['1-01', '1-02', '1-03', '1-04', '1-05', '1-06', '1-07', '1-08'],
            datasets: [{
                label: 'Water Level',
                data: [3600.12, 3600.73, 3601.22, 3601.54, 3601.43, 3602.32, 3602.21, 3601.45],
                borderColor: 'rgba(25, 150, 189, 1)',
                fill: true,
                backgroundColor: 'rgba(25, 150, 189, 0.2)',
                borderWidth: 1,
                pointRadius: 0
            }]
        } // Configuration options go here
    });
});
