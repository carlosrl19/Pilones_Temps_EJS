// TURNING / WETTING MODAL
$("#options").on("click", function () {
    $("#turningWettingModal").modal("show");
});

$(document).ready(function () {
    $.get("/api/pilones_task", function (data) {
        data.forEach(function (pilonTask) {
            const task_date = new Date(pilonTask.task_date).toISOString().split('T')[0]; // UTC format
            $("#tasksList").append(`
                <tr>
                    <td>${pilonTask.person_in_charge}</td>
                    <td>${pilonTask.task}</td>
                    <td>${pilonTask.pilon_selected}</td>
                    <td>${task_date}</td>
                    <td>${pilonTask.start_time}</td>
                    <td>${pilonTask.end_time}</td>                   
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${pilonTask.id}" data-toggle="modal" data-target="#editPilonTaskModal"><img
                        src="../../../../resources/images/edit.png" width="30" height="30"></button></button>
                        <button class="btn btn-danger btn-sm delete-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${pilonTask.id}" data-toggle="modal" data-target="#deletePilonTaskModal"><img
                        src="../../../../resources/images/delete.png" width="30" height="30"></button></button>
                    </td>
                </tr>
            `);
        });

        $(document).ready(function () {
            $('#turningTable').DataTable({
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export to Excel',
                        className: 'btn btn-primary dt-buttons btnExcel',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5]
                        }
                    },
                    {
                        extend: 'print',
                        text: 'Print / Save PDF',
                        className: 'btn btn-secondary dt-buttons btnPrint',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5]
                        }
                    }
                ],
                "iDisplayLength": 25,
                "aoColumnDefs": [
                    { "bSearchable": true, "aTargets": [0] },
                    { "bSearchable": true, "aTargets": [1] },
                    { "bSearchable": true, "aTargets": [2] },
                    { "bSearchable": true, "aTargets": [3] },
                    { "bSearchable": false, "aTargets": [4] },
                    { "bSearchable": false, "aTargets": [5] },
                ],
                scrollY: "75vh",
                scrollCollapse: true,
                search: {
                    regex: true, // Enables the use of regular expressions in search
                    smart: false // Disables automatic filtering of DataTables to allow exact searches
                }
            });
        });
    });

    // UPDATE MODAL
    $("#tasksList").on("click", ".edit-btn", function () {
        const taskId = $(this).data("id");

        $.get(`/api/pilones_task/${taskId}`, function (task) {
            $("#editTask").val(task.task);
            $("#EditPilon_selected").val(task.pilon_selected);
            $("#EditTask_date").val(formattedDate);
            const formattedDate = new Date(task.task_date).toISOString().split('T')[0];

            $.get("/api/workers", function (data) {
                const person_in_chargeSelect = document.getElementById("EditPerson_in_charge");
                person_in_chargeSelect.innerHTML = "";

                data.forEach(function (worker) {
                    const option = document.createElement("option");
                    option.value = worker.nombre;
                    option.textContent = worker.nombre;
                    person_in_chargeSelect.appendChild(option);
                });

                person_in_chargeSelect.value = task.person_in_charge;

                $("#EditStart_time").val(task.start_time);
                $("#EditEnd_time").val(task.end_time);

                $("#editPilonTaskModal").modal("show");
                $("#updateTurningWettingButton").data("id", taskId);
            });
        });
    });

    // UPDATE => On click
    $("#updateTurningWettingButton").on("click", async function (event) {
        event.preventDefault();

        const taskId = $(this).data("id");
        const task = $("#editTask").val();
        const person_in_charge = $("#EditPerson_in_charge").val();
        const pilon_selected = $("#EditPilon_selected").val();
        const task_date = $("#EditTask_date").val();
        const start_time = $("#EditStart_time").val();
        const end_time = $("#EditEnd_time").val();

        const requestBody = {
            task,
            person_in_charge,
            pilon_selected,
            task_date,
            start_time,
            end_time,
        };

        try {
            const response = await fetch(`/api/pilones_task/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });

            if (response.ok) {
                $("#editPilonTaskModal").modal("hide");
                location.reload();
            } else {
                const errorData = await response.json();
                console.error("Error updating pilón task:", errorData);
            }
        } catch (error) {
            console.error("Error updating pilón task:", error);
        }
    });

    // CREATE 
    $("#turning_wetting_Form").submit(function (event) {
        event.preventDefault();

        const task = $("#task").val();
        const person_in_charge = $("#person_in_charge").val();
        const pilon_selected = $("#pilon_selected").val();
        const task_date = $("#task_date").val();
        const start_time = $("#start_time").val();
        const end_time = $("#end_time").val();

        fetch(`/api/pilones_task/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                task,
                person_in_charge,
                pilon_selected,
                task_date,
                start_time,
                end_time,
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
});