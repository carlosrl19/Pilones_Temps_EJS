$(document).ready(function () {
    $('button:contains("Show pilones list and save")').click(function () {
        $('#pilonList').modal('show');
    });

    const pilonCheckboxList = $("#pilonCheckboxList");
    const searchInput = $("#searchInput");

    $.get("/api/pilones", function (data) {
        const generateCheckboxes = function (pilons) {
            pilonCheckboxList.empty(); // Clear previous content

            pilons.forEach(function (pilon) {
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.name = "opcion";
                checkbox.value = pilon.id; // Set the pilon's ID as the checkbox value

                const label = document.createElement("label");
                label.textContent = pilon.nombre + ' - ' + pilon.finca; // Use the pilon's name

                const div = document.createElement("div");
                div.appendChild(checkbox);
                div.appendChild(label);

                pilonCheckboxList.append(div);
            });
        };

        // Generate checkboxes for initial data
        generateCheckboxes(data);

        $("input[name='opcion']").on("change", function () {
            $("input[name='opcion']").not(this).prop("checked", false);
        });

        searchInput.on("input", function () {
            const searchTerm = searchInput.val().toLowerCase();
            const filteredPilons = data.filter(function (pilon) {
                return pilon.nombre.toLowerCase().includes(searchTerm) ||
                    pilon.finca.toLowerCase().includes(searchTerm);
            });
            generateCheckboxes(filteredPilons);
        });
    });

    function saveTemperatureAndHumidityData(selectedPilonId, temperature, humidity) {
        const temperatureData = {
            pilonId: temperature,
            temperature: parseFloat(selectedPilonId),
        };

        const humidityData = {
            pilonId: humidity,
            humidity: parseFloat(selectedPilonId),
        };

        $.ajax({
            url: '/api/temperatures/save_temp',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(temperatureData),
            success: function (response) {
                console.log('Temperature saved:', response);
            },
            error: function (error) {
                console.error('Error saving temperature:', error);
            }
        });

        $.ajax({
            url: '/api/humidities/save_hum',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(humidityData),
            success: function (response) {
                console.log('Humidity saved:', response);
            },
            error: function (error) {
                console.error('Error saving humidity:', error);
            }
        });
    }

    $("#save_Temp_Hum").click(function () {
        const selectedPilonId = $("input[name='opcion']:checked").val();
        const temperatureValue = parseFloat($(".display_temp").text().replace('C°', ''));
        const humidityValue = parseFloat($(".display_hum").text().replace('%', ''));

        if (!selectedPilonId) {
            const errorModalBody = $("#errorModal").find(".modal-body");
            errorModalBody.html("Please select a pilón if you want to store temperatures and humidity of one.");
            $('#pilonList').modal('hide');
            $("#errorModal").modal("show");
            return;
        }

        if (isNaN(temperatureValue)) {
            const errorModalBody = $("#errorModal").find(".modal-body");
            errorModalBody.html("Invalid temperature value. Please, try it again.");
            $('#pilonList').modal('hide');
            $("#errorModal").modal("show");
            return;
        }

        if (isNaN(humidityValue)) {
            const errorModalBody = $("#errorModal").find(".modal-body");
            errorModalBody.html("Invalid humidity value. Please, try it again.");
            $('#pilonList').modal('hide');
            $("#errorModal").modal("show");
            return;
        }

        console.log("ID de Pilon seleccionado:", selectedPilonId);
        console.log("Temperatura a guardar:", temperatureValue);
        console.log("Humedad a guardar:", humidityValue);

        saveTemperatureAndHumidityData(selectedPilonId, temperatureValue, humidityValue);
        $("#pilonList").modal("hide");
        $("#successModal").modal("show");
    });

    const socket = io();

    socket.on('sensorData', (data) => {
        const temperatureDisplay = document.querySelector('.display_temp');
        const humidityDisplay = document.querySelector('.display_hum');

        const parts = data.split(', ');
        if (parts.length === 2) {
            const temperaturePart = parts[0];
            const humidityPart = parts[1];

            const temperatureKeyValue = temperaturePart.split(':');
            const humidityKeyValue = humidityPart.split(':');

            if (temperatureKeyValue.length === 2 && humidityKeyValue.length === 2) {
                const temperature = temperatureKeyValue[1].trim();
                const humidity = humidityKeyValue[1].trim();

                temperatureDisplay.textContent = `${temperature}°`;
                humidityDisplay.textContent = `${humidity}`;
            }
        }
    });
});