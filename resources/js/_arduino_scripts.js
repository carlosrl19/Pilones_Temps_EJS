$(document).ready(function () {
    $.get("/api/arduinos", function (data) {
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

        $('#myTable').DataTable();


        // Event handler para el botón Delete (delegación de eventos)
        $("#arduinosList").on("click", ".delete-btn", function () {
            const arduinoId = $(this).data("id");
            const deleteArduinoButton = document.getElementById('deleteArduinoButton');
            deleteArduinoButton.setAttribute('data-arduino-id', arduinoId);
            $("#deleteArduinoModal").modal("show");
        });

        // On click del botón Delete dentro del modal
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

        // Edit modal opening
        $("#arduinosList").on("click", ".edit-btn", function () {
            const arduinoId = $(this).data("id");
            console.log('Selected arduino with ID', arduinoId);

            // Realiza una llamada a la API para obtener la información del Arduino
            $.get(`/api/arduinos/${arduinoId}`, function (arduino) {
                // Llena los campos del formulario de edición con la información del Arduino
                $("#editNombre").val(arduino.nombre);
                $("#editDireccion").val(arduino.direccion_bits);
                $("#editPilonEncargado").val(arduino.pilon_encargado);
                $("#EditPort").val(arduino.arduino_port);

                // Cargar opciones de pilones al select de edición
                $.get("/api/pilones", function (data) {
                    const pilonSelect = document.getElementById("editPilonEncargado");
                    pilonSelect.innerHTML = ""; // Limpiar opciones anteriores

                    data.forEach(function (pilon) {
                        const option = document.createElement("option");
                        option.value = pilon.id;
                        option.textContent = pilon.nombre;
                        pilonSelect.appendChild(option);
                    });

                    // Establecer el valor seleccionado en el select
                    pilonSelect.value = arduino.pilon_encargado;
                });

                // Muestra el modal de edición
                $("#editArduinoModal").modal("show");

                // Adjunta el ID del arduino al botón "Save Changes" como atributo personalizado
                $("#updateArduinoButton").data("id", arduinoId);
            });
        });

        // On click del botón "Save Changes" del modal de edición
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

        // Al enviar el formulario de creación
        $("#createArduinoForm").submit(function (event) {
            event.preventDefault();

            const nombre = $("#nombre").val();
            const direccion_bits = $("#direccion_bits").val();
            const pilon_encargado = $("#pilon_encargado").val();
            const arduino_port = $("#arduino_port").val();

            // Realiza una llamada POST a la API para crear un nuevo Arduino
            fetch(`/api/arduinos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nombre,
                    direccion_bits,
                    pilon_encargado,
                    arduino_port
                })
            })
                .then(response => {
                    if (response.ok) {
                        location.reload();
                    } else {
                        throw new Error('Error al crear el arduino.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        });

        // Cargar opciones de pilones al select
        $.get("/api/pilones", function (data) {
            const pilonSelect = document.getElementById("pilon_encargado");
            data.forEach(function (pilon) {
                const option = document.createElement("option");
                option.value = pilon.id;
                option.textContent = pilon.nombre;
                pilonSelect.appendChild(option);
            });
        });
    });
});
