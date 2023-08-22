// Arduino entries content table
$(document).ready(function () {
    // Realizar la llamada a la API para obtener los registros
    $.get("/api/arduinos", function (data) {
        // Iterar sobre los registros y mostrarlos en la tabla
        data.forEach(function (arduino) {
            $("#arduinosList").append(`
                <tr>
                    <td>${arduino.nombre}</td>
                    <td>${arduino.direccion_bits}</td>
                    <td>${arduino.arduino_port}</td>
                    <td>
                    <button class="btn btn-primary btn-sm edit-btn" data-id="${arduino.id}" data-toggle="modal" data-target="#editArduinoModal">Edit</button>
                        <button class="btn btn-danger btn-sm delete-btn" data-id="${arduino.id}" data-toggle="modal" data-target="#deleteArduinoModal">Delete</button>
                    </td>
                </tr>
            `);
        });

        // Inicializar DataTables después de agregar los registros
        $('#myTable').DataTable();

        // Event handler para el botón Delete
        $(".delete-btn").on("click", function () {
            $("#deleteArduinoModal").modal("show");
        });

        // Edit modal opening
        $(".edit-btn").on("click", function () {
            const arduinoId = $(this).data("id");
            console.log('Selected arduino with ID', arduinoId);

            // Realiza una llamada a la API para obtener la información del Arduino
            $.get(`/api/arduinos/${arduinoId}`, function (arduino) {
                // Llena los campos del formulario de edición con la información del Arduino
                $("#editNombre").val(arduino.nombre);
                $("#editDireccion").val(arduino.direccion_bits);
                $("#editPilonEncargado").val(arduino.pilon_encargado);
                $("#EditPort").val(arduino.arduino_port);

                // Muestra el modal de edición
                $("#editArduinoModal").modal("show");

                // Adjunta el ID del arduino al botón "Save Changes" como atributo personalizado
                $("#updateArduinoButton").data("id", arduinoId);
            });
        });

        // Al hacer clic en el botón "Save Changes" del modal
        $("#updateArduinoButton").on("click", function (event) {
            event.preventDefault();

            const arduinoId = $(this).data("id"); // Obtiene el ID del arduino desde el atributo personalizado
            const nombre = $("#editNombre").val();
            const direccion_bits = $("#editDireccion").val();
            const pilon_encargado = $("#editPilonEncargado").val();
            const arduino_port = $("#EditPort").val();

            // Realiza una llamada PUT a la API para actualizar la información del Arduino
            $.ajax({
                url: `/api/arduinos/${arduinoId}`, // Aquí se incluye el ID en la URL
                method: "PUT",
                data: {
                    nombre,
                    direccion_bits,
                    pilon_encargado,
                    arduino_port
                },
                success: function (response) {
                    $("#editArduinoModal").modal("hide");
                    location.reload();
                },
                error: function (error) {
                    console.error("Error updating Arduino:", error);
                }
            });
        });
    });
});
