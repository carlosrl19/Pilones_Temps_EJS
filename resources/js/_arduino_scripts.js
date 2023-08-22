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

        // Edit modal opening
        $(".edit-btn").on("click", function () {
            const arduinoId = $(this).data("id");

            // Realiza una llamada a la API para obtener la información del Arduino
            $.get(`/api/arduinos/${arduinoId}`, function (arduino) {
                // Llena los campos del formulario de edición con la información del Arduino
                $("#editArduinoId").val(arduino.id);
                $("#editNombre").val(arduino.nombre);
                $("#editDireccion").val(arduino.direccion_bits);
                $("#editPilonEncargado").val(arduino.pilon_encargado);
                $("#EditPort").val(arduino.arduino_port);

                // Muestra el modal de edición
                $("#editArduinoModal").modal("show");
            });
        });

        // Event handler para el botón Delete
        $(".delete-btn").on("click", function () {
            $("#deleteArduinoModal").modal("show");
        });
    });
});
