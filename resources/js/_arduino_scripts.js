$(document).ready(function () {
    $.get("/api/arduinos", function (data) {
        data.forEach(function (arduino) {
            $("#arduinosList").append(`
                <tr>
                    <td>${arduino.nombre}</td>
                    <td>${arduino.direccion_bits}</td>
                    <td>${arduino.arduino_port}</td>
                    <td>${arduino.pilon_encargado}</td>
                    <td>
                        <button class="btn btn-primary btn-sm edit-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${arduino.id}" data-toggle="modal" data-target="#editArduinoModal"><img
                        src="../../../../resources/images/edit.png" width="30" height="30"></button></button>
                        <button class="btn btn-danger btn-sm delete-btn" style="background-color: rgba(255,255,255,0); border: none;" data-id="${arduino.id}" data-toggle="modal" data-target="#deleteArduinoModal"><img
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
        $("#arduinosList").on("click", ".delete-btn", function () {
            const arduinoId = $(this).data("id");
            const deleteArduinoButton = document.getElementById('deleteArduinoButton');
            deleteArduinoButton.setAttribute('data-arduino-id', arduinoId);
            $("#deleteArduinoModal").modal("show");
        });

        // DELETE => On click
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

        // UPDATE
        $("#arduinosList").on("click", ".edit-btn", function () {
            const arduinoId = $(this).data("id");
            console.log('Selected arduino with ID', arduinoId);

            $.get(`/api/arduinos/${arduinoId}`, function (arduino) {
                $("#editNombre").val(arduino.nombre);
                $("#editDireccion").val(arduino.direccion_bits);
                $("#editPilonEncargado").val(arduino.pilon_encargado);
                $("#EditPort").val(arduino.arduino_port);

                $.get("/api/pilones", function (data) {
                    const pilonSelect = document.getElementById("editPilonEncargado");
                    pilonSelect.innerHTML = "";

                    data.forEach(function (pilon) {
                        const option = document.createElement("option");
                        option.value = pilon.id;
                        option.textContent = pilon.nombre;
                        pilonSelect.appendChild(option);
                    });

                    pilonSelect.value = arduino.pilon_encargado;
                });

                $("#editArduinoModal").modal("show");
                $("#updateArduinoButton").data("id", arduinoId);
            });
        });

        // UPDATE => On click
        $("#updateArduinoButton").on("click", function (event) {
            event.preventDefault();

            const arduinoId = $(this).data("id");
            const nombre = $("#editNombre").val();
            const direccion_bits = $("#editDireccion").val();
            const pilon_encargado = $("#editPilonEncargado").val();
            const arduino_port = $("#EditPort").val();

            $.ajax({
                url: `/api/arduinos/${arduinoId}`,
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

        // CREATE 
        $("#createArduinoForm").submit(function (event) {
            event.preventDefault();

            const nombre = $("#nombre").val();
            const direccion_bits = $("#direccion_bits").val();
            const pilon_encargado = $("#pilon_encargado").val();
            const arduino_port = $("#arduino_port").val();

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

        // PILONES 
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
