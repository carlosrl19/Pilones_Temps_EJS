$(document).ready(function () {
    $('button:contains("Show pilones list")').click(function () {
        $('#pilonList').modal('show');
    });

    const pilonCheckboxList = $("#pilonCheckboxList");
    const searchInput = $("#searchInput");
    const pilonInfoContainer = $(".pilon_info");

    function updatePilonInfo(pilon) {
        pilonInfoContainer.html(`
            <p>Pilón's name:<strong> ${pilon.nombre}</strong></p>
            <p>Pilón's propierty:<strong> ${pilon.finca}</strong></p>
            <p>Pilón's tobacco stage:<strong> ${pilon.variedad}</strong></p>
            <p>Pilón's pn:<strong> ${pilon.pn}</strong></p>
            <p>Pilón's minimum allowed temperature:<strong> ${pilon.temp_min} ºC</strong></p>
            <p>Pilón's maximum allowed temperature:<strong> ${pilon.temp_max} ºC</strong></p>
            <p>Pilón's entry date:<strong> ${new Date(pilon.fecha_ingreso).toISOString().slice(0, 10)}</strong></p>
        `);
    }

    $.get("/api/pilones", function (data) {
        const generateCheckboxes = function (pilons) {
            pilonCheckboxList.empty();

            pilons.forEach(function (pilon) {
                if (pilon.estado !== "Finished") {
                    const checkbox = document.createElement("input");
                    checkbox.type = "checkbox";
                    checkbox.name = "opcion";
                    checkbox.value = pilon.id;

                    const label = document.createElement("label");
                    label.textContent = pilon.nombre + ' - ' + pilon.finca;

                    const div = document.createElement("div");
                    div.appendChild(checkbox);
                    div.appendChild(label);

                    pilonCheckboxList.append(div);
                }
            });
        };

        generateCheckboxes(data);

        $("input[name='opcion']").on("change", function () {
            $("input[name='opcion']").not(this).prop("checked", false);

            const selectedPilonId = $(this).val();
            if (selectedPilonId) {
                $.get(`/api/pilones/${selectedPilonId}`, function (pilon) {
                    updatePilonInfo(pilon);
                });
            } else {
                pilonInfoContainer.empty();
            }
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