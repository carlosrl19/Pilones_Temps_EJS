// AUTOSELECTED DATE (task_date)
$(document).ready(function () {
    var now = new Date();
    var month = (now.getMonth() + 1);
    var day = now.getDate();
    if (month < 10)
        month = "0" + month;
    if (day < 10)
        day = "0" + day;
    var today = now.getFullYear() + '-' + month + '-' + day;
    $('#task_start_date').val(today);
});

task_end_date.min = new Date().toISOString().split("T")[0];

// AUTOSELECTED TIME (start_time)
var timeField = document.getElementById("start_time");
var now = new Date();

var hours = now.getHours();
var minutes = now.getMinutes() + 2;

if (hours < 10) {
    hours = "0" + hours;
}
if (minutes < 10) {
    minutes = "0" + minutes;
}
timeField.value = hours + ":" + minutes;

// AUTOSELECTED TIME (end_time)
var timeField = document.getElementById("end_time");
var now = new Date();

var hours = now.getHours() + 1;
var minutes = now.getMinutes() + 2;

if (hours < 10) {
    hours = "0" + hours;
}
if (minutes < 10) {
    minutes = "0" + minutes;
}
timeField.value = hours + ":" + minutes;


// WORKERS LIST
document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/workers")
        .then(response => response.json())
        .then(data => {
            const encargadoSelect = document.getElementById("person_in_charge");
            data.forEach(worker => {
                const option = document.createElement("option");
                option.value = worker.nombre;
                option.textContent = worker.nombre;
                encargadoSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error("Error:", error);
        });
});


// Get all the checkboxes
var checkboxes = document.querySelectorAll('input[type="checkbox"]');

// Loop through the checkboxes
for (var i = 0; i < checkboxes.length; i++) {
    // Add a click event listener to each checkbox
    checkboxes[i].addEventListener('click', function () {
        // Uncheck all the other checkboxes
        for (var j = 0; j < checkboxes.length; j++) {
            if (checkboxes[j] !== this) {
                checkboxes[j].checked = false;
            }
        }
    });
}



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
