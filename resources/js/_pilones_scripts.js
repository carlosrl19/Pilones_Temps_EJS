// TURNING / WETTING MODAL
$("#pilonList").on("click", ".graphics-btn", function () {
    $("#turningWettingGraphicsModal").modal("show");
});

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
                        <button class="btn btn-danger btn-sm graphics-btn" style="background-color: transparent; border: none;" data-id="${pilón.id}" data-toggle="modal" data-target="#turningWettingGraphicsModal"><img
                        src="../../../../resources/images/graphics.png" width="30" height="30"></button></button>
                        <button class="btn btn-primary btn-sm details-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${pilón.id}" data-toggle="modal" data-target="#detailsPilonModal"><img
                        src="../../../../resources/images/details.png" width="30" height="30"></button></button>
                        <button class="btn btn-primary btn-sm edit-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${pilón.id}" data-toggle="modal" data-target="#editPilonModal"><img
                        src="../../../../resources/images/edit.png" width="30" height="30"></button></button>
                        <button class="btn btn-danger btn-sm delete-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${pilón.id}" data-toggle="modal" data-target="#deletePilonModal"><img
                        src="../../../../resources/images/delete.png" width="30" height="30"></button></button>
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
                        className: 'btn btn-primary dt-buttons btnExcel',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                        }
                    },
                    {
                        extend: 'print',
                        text: 'Print / Save PDF',
                        className: 'btn btn-secondary dt-buttons btnPrint',
                        exportOptions: {
                            columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                        }
                    }
                ],
                "iDisplayLength": 100,
                "aoColumnDefs": [
                    { "bSearchable": true, "aTargets": [0] },
                    { "bSearchable": true, "aTargets": [1] },
                    { "bSearchable": true, "aTargets": [2] },
                    { "bSearchable": true, "aTargets": [3] },
                    { "bSearchable": false, "aTargets": [4] },
                    { "bSearchable": false, "aTargets": [5] },
                    { "bSearchable": false, "aTargets": [6] },
                    { "bSearchable": true, "aTargets": [7] },
                    { "bSearchable": false, "aTargets": [8] },
                ],
                scrollY: "75vh",
                scrollCollapse: true,
                search: {
                    regex: true,
                    smart: false
                }
            });
            
            // Show/Hide columns
            const table = $('#myTable').DataTable();

            $('a.toggle-vis').on('click', function (e) {
                e.preventDefault();

                let columnIdx = $(this).data('column');
                let column = table.column(columnIdx);

                // Toggle the visibility
                column.visible(!column.visible());

                // Change color of options
                if (column.visible()) {
                    $(this).addClass('active-option');
                    $(this).removeClass('inactive-option');
                } else {
                    $(this).removeClass('active-option');
                    $(this).addClass('inactive-option');
                }
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

            $.get(`/api/pilones/${pilonId}`, function (pilón) {
                $("#editNombre").val(pilón.nombre);
                $("#editFinca").val(pilón.finca);
                $("#editVariedad").val(pilón.variedad);
                $("#editCorte").val(pilón.corte);
                $("#editClase").val(pilón.clase);
                $("#editCosecha").val(pilón.cosecha);
                $("#editEtapa").val(pilón.etapa);
                $("#editPN").val(pilón.pn);
                $("#editTipo").val(pilón.tipo_tabaco);
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
            const corte = $("#editCorte").val();
            const clase = $("#editClase").val();
            const cosecha = $("#editCosecha").val();
            const etapa = $("#editEtapa").val();
            const pn = $("#editPN").val();
            const tipo_tabaco = $("#editTipo").val();
            const temp_min = $("#editTempMin").val();
            const temp_max = $("#editTempMax").val();
            const estado = $("#editEstado").val();

            const requestBody = {
                nombre,
                finca,
                variedad,
                corte,
                clase,
                cosecha,
                etapa,
                tipo_tabaco,
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
            const corte = $("#corte").val();
            const clase = $("#clase").val();
            const cosecha = $("#cosecha").val();
            const tipo_tabaco = $("#tipo_tabaco").val();
            const variedad = $("#variedad").val();
            const etapa = $("#etapa").val();
            const pn = $("#pn").val();
            const temp_min = $("#temp_min").val();
            const temp_max = $("#temp_max").val();
            const estado = $("#estado").val();

            const requestBody = {
                nombre,
                finca,
                corte,
                clase,
                cosecha,
                tipo_tabaco,
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

        // DETAILS MODAL
        $("#pilonList").on("click", ".details-btn", function () {
            const pilonId = $(this).data("id");
            console.log('Selected pilón with ID', pilonId);

            $.get(`/api/pilones/${pilonId}`, function (pilon) {
                // Limpia cualquier contenido anterior en el modal
                $("#detailsPilonModal .modal-body").empty();

                // Crea elementos HTML para mostrar los detalles del pilón
                const detailsContainer = $("#detailsPilonModal .modal-body");
                detailsContainer.append(`<p><strong>Pilón's name:</strong> ${pilon.nombre}</p>`);
                detailsContainer.append(`<p><strong>Pilón's entry date:</strong> ${new Date(pilon.fecha_ingreso).toISOString().slice(0, 10)}</p>`);
                detailsContainer.append(`<p><strong>Farm source:</strong> ${pilon.finca}</p>`);
                detailsContainer.append(`<p><strong>Tobacco variety:</strong> ${pilon.variedad}</p>`);
                detailsContainer.append(`<p><strong>Tobacco cutting:</strong> ${pilon.corte}</p>`);
                detailsContainer.append(`<p><strong>Tobacco class:</strong> ${pilon.clase}</p>`);
                detailsContainer.append(`<p><strong>Tobacco harvest:</strong> ${pilon.cosecha}</p>`);
                detailsContainer.append(`<p><strong>Tobacco stage:</strong> Stage ${pilon.etapa}</p>`);
                detailsContainer.append(`<p><strong>Tobacco type:</strong> ${pilon.tipo_tabaco}</p>`);
                detailsContainer.append(`<p><strong>Tobacco PN:</strong> ${pilon.pn}</p>`);
                detailsContainer.append(`<p><strong>Min. accepted temperature:</strong> ${pilon.temp_min} Cº</p>`);
                detailsContainer.append(`<p><strong>Max. accepted temperature:</strong> ${pilon.temp_max} Cº</p>`);
                detailsContainer.append(`<p><strong>Pilón state:</strong> ${pilon.estado}</p>`);

                // Abre el modal
                $("#detailsPilonModal").modal("show");
            });
        });
    });
});