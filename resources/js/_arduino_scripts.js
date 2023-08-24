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
            const arduinoId = $(this).data("id");
            const deleteArduinoButton = document.getElementById('deleteArduinoButton');
            deleteArduinoButton.setAttribute('data-arduino-id', arduinoId);
            $("#deleteArduinoModal").modal("show");

            // Al hacer clic en el botón "Eliminar Pilón" del modal de eliminación
            $("#deleteArduinoButton").on("click", function () {
                const arduinoId = $(this).data("arduino-id");

                fetch(`/api/arduinos/${arduinoId}`, {
                    method: 'DELETE'
                })
                    .then(response => {
                        if (response.ok) {
                            location.reload();
                        } else {
                            throw new Error('Error al eliminar el arduino.');
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
            });
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


        // Al hacer clic en el botón "Save pilón" del modal de creación
        $("#createPilonButton").on("click", function (event) {
            event.preventDefault();

            const nombre = $("#nombre").val();
            const direccion_bits = $("#direccion_bits").val();
            const pilon_encargado = $("#pilon_encargado").val();
            const arduino_port = $("#arduino_port").val();

            console.log("Nombre:", nombre);
            console.log("Direccion Bits:", direccion_bits);
            console.log("Pilón Encargado:", pilon_encargado);
            console.log("Arduino Port:", arduino_port);

            // Realiza una llamada POST a la API para crear un nuevo Arduino
            $.ajax({
                url: "/arduinos/create", // Ruta para la creación de arduinos
                method: "POST",
                data: {
                    nombre,
                    direccion_bits,
                    pilon_encargado,
                    arduino_port
                },
                success: function (response) {
                    location.reload();
                },
                error: function (error) {
                    console.error("Error creating Arduino:", error);
                }
            });
        });

        // Realizar la llamada a la API para obtener los registros de pilones
        $.get("/api/pilones", function (data) {
            // Iterar sobre los registros y mostrarlos en el select
            data.forEach(function (pilon) {
                $("#pilon_encargado").append(`<option value="${pilon.id}">${pilon.nombre}</option>`);
            });
        });
    });
});
