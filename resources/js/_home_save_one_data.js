const saveTempButton = document.getElementById('saveTemps');
saveTempButton.addEventListener('click', () => {
    if (selectedCard) {
        const pilonId = selectedCard.classList[1].split('-')[1];
        const cardFooter = selectedCard.querySelector('.card__footer');

        const temperatureAndHumidity = cardFooter.textContent.match(/\d+\.\d+/g); // Encuentra números decimales

        if (temperatureAndHumidity && temperatureAndHumidity.length === 2) {
            const temperature = parseFloat(temperatureAndHumidity[0]);
            const humidity = parseFloat(temperatureAndHumidity[1]);

            if (!isNaN(temperature) && !isNaN(humidity)) {
                const temperatureData = {
                    pilonId: temperature,
                    temperature: pilonId,
                };

                const humidityData = {
                    pilonId: humidity,
                    humidity: pilonId,
                };

                const jsonTemperatureData = JSON.stringify(temperatureData);
                const jsonHumidityData = JSON.stringify(humidityData);

                fetch('/api/temperatures/save_temp', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonTemperatureData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Temperature saved:', data);
                        $("#successModal").modal("show");
                    })
                    .catch(error => {
                        console.error('Error saving temperature:', error);
                        $("#errorModal").modal("show");
                    });

                fetch('/api/humidities/save_hum', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: jsonHumidityData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log('Humidity saved:', data);
                    })
                    .catch(error => {
                        console.error('Error saving humidity:', error);
                    });
            } else {
                console.error('Invalid temperature or humidity data format');
                $("#errorModal").modal("show");
            }
        } else {
            console.error('Invalid temperature or humidity data format');
            $("#errorModal").modal("show");
        }
    } else {
        console.error('No card is selected');

        const errorModalBody = $("#errorModal").find(".modal-body");
        errorModalBody.html("Please select a pilón if you want to store temperatures and humidity of one.");
        $("#errorModal").modal("show");
    }
});
