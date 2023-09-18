// TURNING / WETTING MODAL
$("#options").on("click", function () {
    $("#turningWettingModal").modal("show");
});

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
    $('#task_date').val(today);
});

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


// CREATE 
$("#turning_wetting_Form").submit(function (event) {
    event.preventDefault();

    const trabajo = $("#trabajo").val();
    const encargado = $("#encargado").val();
    const selected_pilon = $("#selected_pilon").val();
    const task_date = $("#task_date").val();
    const start_time = $("#start_time").val();

    fetch(`/api/pilones/virado_mojado`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            trabajo,
            encargado,
            selected_pilon,
            task_date,
            start_time
        })
    })
        .then(response => {
            if (response.ok) {
                location.reload();
            } else {
                throw new Error('Error creating new task.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

// WORKERS
document.addEventListener("DOMContentLoaded", function () {
    fetch("/api/workers")
        .then(response => response.json())
        .then(data => {
            const encargadoSelect = document.getElementById("encargado");
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