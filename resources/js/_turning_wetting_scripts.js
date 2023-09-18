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


/* 
################
#   CONFIGS    #
################

*/