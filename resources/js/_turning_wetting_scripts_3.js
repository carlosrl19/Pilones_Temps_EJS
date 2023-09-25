/* 

Script to tasks modal in pilones list.

*/

// Checkbox script
var showInfoElement = document.querySelector('.show_info');
var containerInfoElement = document.querySelector('.container_info');

showInfoElement.addEventListener('click', function () {
    containerInfoElement.classList.toggle('show');
});

var checkboxes = document.querySelectorAll('input[type="checkbox"]');

for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].addEventListener('click', function () {
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j] !== this) {
                checkboxes[j].checked = false;
            }
        }

        // Show / Hide task_info div
        var task_info_div = document.getElementById("task_info");
        
        // Styles added / removed
        if (this.checked) {
            task_info_div.style.opacity = "1";
            task_info_div.style.transition = "opacity 2.5s ease-in-out";

        } else {
            task_info_div.style.opacity = "0";
            task_info_div.style.transition = "opacity 2.5s ease-in-out";
        }
    });
}

// Task information script: This script will change dinamically the task information.


// Chart.JS script
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
