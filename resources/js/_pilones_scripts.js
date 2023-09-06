$(document).ready(function () {
    $.get("/api/pilones", function (data) {
        data.forEach(function (pilón) {
            const fechaIngreso = new Date(pilón.fecha_ingreso).toISOString().split('T')[0]; // UTC format
            $("#pilonList").append(`
                <tr>
                    <td>${pilón.nombre}</td>
                    <td>${pilón.variedad}</td>
                    <td>${pilón.finca}</td>
                    <td>Stage ${pilón.etapa}</td>
                    <td>${pilón.pn}</td>
                    <td>${pilón.temp_min}</td>
                    <td>${pilón.temp_max}</td>
                    <td>${fechaIngreso}</td>
                    <td>${pilón.estado}</td>
                    <td>${pilón.arduino_asignado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${pilón.id}" data-toggle="modal" data-target="#editPilonModal">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${pilón.id}" data-toggle="modal" data-target="#deletePilonModal">Delete</button>
                    </td>
                </tr>
            `);
        });

        $(document).ready(function () {
            $('#myTable').DataTable({
                dom: 'lBfrtip',
                buttons: [
                    {
                        extend: 'excelHtml5',
                        text: 'Export to Excel',
                        className: 'btn btn-primary dt-buttons btnExcel'
                    },
                    {
                        extend: 'print',
                        text: 'Print / Save PDF',
                        className: 'btn btn-secondary dt-buttons btnPrint',
                        exportOptions: {
                            modifier: {
                                selected: null
                            }
                        }
                    }
                ],
            });
        });

        // DELETE BUTTON
        $("#pilonList").on("click", ".delete-btn", function () {
            const pilonId = $(this).data("id");
            const deletePilonButton = document.getElementById('deletePilonButton');
            deletePilonButton.setAttribute('data-pilón-id', pilonId);
            $("#deletePilonModal").modal("show");
        });

        // On click
        $("#deletePilonButton").on("click", function () {
            const pilonId = $(this).data("pilón-id");

            fetch(`/api/pilones/${pilonId}`, {
                method: 'DELETE'
            })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        throw new Error('Error al eliminar el pilón.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        // UPDATE MODAL
        $("#pilonList").on("click", ".edit-btn", function () {
            const pilonId = $(this).data("id");
            console.log('Selected pilón with ID', pilonId);

            $.get(`/api/pilones/${pilonId}`, function (pilón) {
                $("#editNombre").val(pilón.nombre);
                $("#editFinca").val(pilón.finca);
                $("#editVariedad").val(pilón.variedad);
                $("#editEtapa").val(pilón.etapa);
                $("#editPN").val(pilón.pn);
                $("#editTempMin").val(pilón.temp_min);
                $("#editTempMax").val(pilón.temp_max);
                $("#editEstado").val(pilón.estado);

                $("#editPilonModal").modal("show");
                $("#updatePilonButton").data("id", pilonId);
            });
        });

        // On click
        $("#updatePilonButton").on("click", async function (event) {
            event.preventDefault();

            const pilonId = $(this).data("id");
            const nombre = $("#editNombre").val();
            const finca = $("#editFinca").val();
            const variedad = $("#editVariedad").val();
            const etapa = $("#editEtapa").val();
            const pn = $("#editPN").val();
            const temp_min = $("#editTempMin").val();
            const temp_max = $("#editTempMax").val();
            const estado = $("#editEstado").val();

            const requestBody = {
                nombre,
                finca,
                variedad,
                etapa,
                pn,
                temp_min,
                temp_max,
                estado,
            };

            try {
                const response = await fetch(`/api/pilones/${pilonId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    $("#editPilonModal").modal("hide");
                    location.reload();
                } else {
                    const errorData = await response.json();
                    console.error("Error updating pilón:", errorData);
                }
            } catch (error) {
                console.error("Error updating pilón:", error);
            }
        });

        // CREATE MODAL
        $("#createPilonForm").submit(async function (event) {
            event.preventDefault();

            const nombre = $("#nombre").val();
            const finca = $("#finca").val();
            const variedad = $("#variedad").val();
            const etapa = $("#etapa").val();
            const pn = $("#pn").val();
            const temp_min = $("#temp_min").val();
            const temp_max = $("#temp_max").val();
            const estado = $("#estado").val();

            const requestBody = {
                nombre,
                finca,
                variedad,
                etapa,
                pn,
                temp_min,
                temp_max,
                estado,
            };

            try {
                const response = await fetch('/api/pilones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody),
                });

                if (response.ok) {
                    $("#successModal").modal("show");
                    location.reload();
                } else {
                    const errorData = await response.json();
                    console.error('Error creating pilón:', errorData);
                }
            } catch (error) {
                console.error('Error creating pilón:', error);
            }
        });
    });
});
