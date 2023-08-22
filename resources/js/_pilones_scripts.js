// pilon entries content table
$(document).ready(function () {
    // Realizar la llamada a la API para obtener los registros
    $.get("/api/pilones", function (data) {
        // Iterar sobre los registros y mostrarlos en la tabla
        data.forEach(function (pilon) {
            $("#pilonList").append(`
                <tr>
                    <td>${pilon.nombre}</td>
                    <td>${pilon.variedad}</td>
                    <td>${pilon.finca}</td>
                    <td>Stage ${pilon.etapa}</td>
                    <td>${pilon.pn}</td>
                    <td>${pilon.temp_min}</td>
                    <td>${pilon.temp_max}</td>
                    <td>${pilon.fecha_ingreso}</td>
                    <td>${pilon.estado}</td>
                    <td>${pilon.asignado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" data-id="${pilon.id}" data-toggle="modal" data-target="#editPilonModal">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${pilon.id}" data-toggle="modal" data-target="#deletePilonModal">Delete</button>
                    </td>
                </tr>
            `);
        });

        // Inicializar DataTables después de agregar los registros
        $('#myTable').DataTable();

        // Event handler para el botón Delete
        $(".delete-btn").on("click", function () {
            const pilonId = $(this).data("id");
            const deletePilonButton = document.getElementById('deletePilonButton');
            deletePilonButton.setAttribute('data-pilon-id', pilonId);
            $("#deletePilonModal").modal("show");
        });

        // Al hacer clic en el botón "Eliminar Pilón" del modal de eliminación
        $("#deletePilonButton").on("click", function () {
            const pilonId = $(this).data("pilon-id");

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

        // Edit modal opening
        $(".edit-btn").on("click", function () {
            const pilonId = $(this).data("id");
            console.log('Selected pilon with ID', pilonId);

            // Realiza una llamada a la API para obtener la información del pilon
            $.get(`/api/pilones/${pilonId}`, function (pilon) {
                // Llena los campos del formulario de edición con la información del pilon
                $("#editNombre").val(pilon.nombre);
                $("#editFinca").val(pilon.finca);
                $("#editVariedad").val(pilon.variedad);
                $("#editEtapa").val(pilon.etapa);
                $("#editPN").val(pilon.pn);
                $("#editTempMin").val(pilon.temp_min);
                $("#editTempMax").val(pilon.temp_max);
                $("#editEstado").val(pilon.estado);

                // Muestra el modal de edición
                $("#editPilonModal").modal("show");

                // Adjunta el ID del arduino al botón "Save Changes" como atributo personalizado
                $("#updatePilonButton").data("id", pilonId);
            });
        });

        // Al hacer clic en el botón "Save Changes" del modal
        $("#updatePilonButton").on("click", function (event) {
            event.preventDefault();

            const pilonId = $(this).data("id"); // Obtiene el ID del arduino desde el atributo personalizado
            const nombre = $("#editNombre").val();
            const finca = $("#editFinca").val();
            const variedad = $("#editVariedad").val();
            const etapa = $("#editEtapa").val();
            const pn = $("#editPN").val();
            const temp_min = $("#editTempMin").val();
            const temp_max = $("#editTempMax").val();
            const estado = $("#editEstado").val();

            // Realiza una llamada PUT a la API para actualizar la información del pilon
            $.ajax({
                url: `/api/pilones/${pilonId}`,
                method: "PUT",
                data: {
                    nombre,
                    finca,
                    variedad,
                    etapa,
                    pn,
                    temp_min,
                    temp_max,
                    estado,
                },
                success: function (response) {
                    $("#editPilonModal").modal("hide");
                    location.reload();
                },
                error: function (error) {
                    console.error("Error updating pilon:", error);
                }
            });
        });
    });
});
