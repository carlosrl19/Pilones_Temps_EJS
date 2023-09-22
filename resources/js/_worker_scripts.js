$(document).ready(function () {
    $.get("/api/workers", function (data) {
        data.forEach(function (worker) {
            $("#workersList").append(`
                <tr>
                    <td>${worker.nombre}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${worker.id}" data-toggle="modal" data-target="#editWorkerModal"><img
                        src="../../../../resources/images/edit.png" width="30" height="30"></button></button>
                        <button class="btn btn-danger btn-sm delete-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${worker.id}" data-toggle="modal" data-target="#deleteWorkerModal"><img
                        src="../../../../resources/images/delete.png" width="30" height="30"></button></button>
                    </td>
                </tr>
            `);
        });

        $('#myTable').DataTable({
            dom: 'lBfrtip',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Export to Excel',
                    className: 'btn btn-primary dt-buttons btnExcel',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                },
                {
                    extend: 'print',
                    text: 'Print / Save PDF',
                    className: 'btn btn-secondary dt-buttons btnPrint',
                    exportOptions: {
                        columns: [0, 1, 2, 3]
                    }
                }
            ],
        });

        // DELETE
        $("#workersList").on("click", ".delete-btn", function () {
            const workerId = $(this).data("id");
            const deleteWorkerButton = document.getElementById('deleteWorkerButton');
            deleteWorkerButton.setAttribute('data-worker-id', workerId);
            $("#deleteWorkerModal").modal("show");
        });

        // DELETE => On click
        $("#deleteWorkerButton").on("click", function () {
            const workerId = $(this).data("worker-id");

            fetch(`/api/workers/${workerId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        throw new Error('Error deleting worker');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        // UPDATE MODAL
        $("#workersList").on("click", ".edit-btn", function () {
            const workerId = $(this).data("id");

            $.get(`/api/workers/${workerId}`, function (worker) {
                $("#editNombre").val(worker.nombre);

                $("#editWorkerModal").modal("show");
                $("#updateWorkerButton").data("id", workerId);
            });
        });

        // UPDATE => On click
        $("#updateWorkerButton").on("click", async function (event) {
            event.preventDefault();

            const workerId = $(this).data("id");
            const nombre = $("#editNombre").val();

            const requestBody = {
                nombre,
            };

            try {
                const response = await fetch(`/api/workers/${workerId}`, {
                    method: "PUT",
                    headers: {
                        "Content-type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    $("#editWorkerModal").modal("hide");
                    location.reload();
                } else {
                    const errorData = await response.json();
                    console.error("Error updating worker:", errorData);
                }
            } catch (error) {
                console.error("Error updating worker:", error);
            }
        });

        // CREATE 
        $("#createWorkerForm").submit(function (event) {
            event.preventDefault();

            const nombre = $("#nombre").val();

            console.log(nombre);

            fetch(`/api/workers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                })
            })
                .then(response => {
                    if (response.ok) {
                        $("#createWorkerModal").modal("hide");

                        const successModalBody = $("#successWorkerModal").find(".modal-body");
                        successModalBody.html("New worker created correctly.");
                        $("#successWorkerModal").modal("show");
                    } else {
                        throw new Error('Error creating new worker.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });
    });
});
