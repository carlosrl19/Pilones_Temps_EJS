const paginationContainer = document.querySelector('.pagination');
const container = document.querySelector('.card-container');
const cardsPerPage = 16;
let selectedCard = null;
let datosDeArduinoAsignados = null;
let lastUpdateTimestamps = {};

function cargarDatosDeArduinoAsignados() {
    fetch('/api/arduinos')
        .then(response => response.json())
        .then(data => {
            datosDeArduinoAsignados = data;
            crearCardsConTemperatura();
        })
        .catch(error => {
            const errorModalBody = $("#errorModal").find(".modal-body");
            errorModalBody.html("Error getting data from Arduino assigned: ", error);
            $("#errorModal").modal("show");
        });
}

function crearCardsConTemperatura() {
    fetch('/api/pilones')
        .then(response => response.json())
        .then(data => {
            const pilones = data;

            for (let i = 0; i < pilones.length; i++) {
                const pilon = pilones[i];

                if (pilon.estado !== "Finished") {
                    const card = document.createElement('div');
                    card.classList.add('card');

                    const cardContent = `
                        <h3 class="card__title">${pilon.nombre}</h3>
                        <p class="card__content">
                            ${'Property: ' + pilon.finca}<br>
                            ${'Variety: ' + pilon.variedad}<br>
                            ${'PN: ' + pilon.pn}<br>
                            ${'Temp. min: ' + pilon.temp_min}<br>
                            ${'Temp. max: ' + pilon.temp_max}<br>
                        </p>
                        <div class="card__date">${new Date(pilon.fecha_ingreso).toISOString().slice(0, 10)}</div>
                        <div class="card__footer"></div>
                    `;

                    card.innerHTML = cardContent;
                    const optionsLink = document.getElementById('options');

                    card.addEventListener('click', () => {
                        if (selectedCard === card) {
                            card.classList.remove('card-clicked');
                            optionsLink.style.display = 'none';
                            selectedCard = null;
                            document.getElementById('selected_pilon').value = '';
                        } else {
                            if (selectedCard) {
                                selectedCard.classList.remove('card-clicked');
                                optionsLink.style.display = 'none';
                            }

                            card.classList.add('card-clicked');
                            optionsLink.style.display = 'inline-block';
                            selectedCard = card;

                            // Obtiene el nombre y finca del pilón y actualiza el campo selected_pilon (turning_wetting)
                            const pilonInfo = card.querySelector('.card__title').textContent;
                            document.getElementById('selected_pilon').value = pilonInfo;
                        }
                    });

                    container.appendChild(card);

                    card.classList.add('card', `pilon-${pilon.id}`);

                    const arduinoAsignado = datosDeArduinoAsignados.find(arduino => arduino.pilon_encargado === pilon.id);
                    if (arduinoAsignado) {
                        const cardFooter = card.querySelector('.card__footer');
                        cardFooter.innerHTML = `${arduinoAsignado.temperatura}`;
                    }
                }
            }

            const socket = io();

            socket.on('sensorData', (data) => {
                const parts = data.split(', ');
                if (parts.length === 2) {
                    const temperaturePart = parts[0];
                    const humidityPart = parts[1];

                    const temperatureKeyValue = temperaturePart.split(':');
                    const humidityKeyValue = humidityPart.split(':');

                    if (temperatureKeyValue.length === 2 && humidityKeyValue.length === 2) {
                        const temperature = temperatureKeyValue[1].trim();
                        const humidity = humidityKeyValue[1].trim();

                        const cardFooters = document.querySelectorAll('.card__footer');
                        cardFooters.forEach((cardFooter, index) => {
                            const pilonId = cardFooter.parentElement.classList[1].split('-')[1];
                            const pilon = pilones.find(p => p.id == pilonId);

                            const arduinoAsignado = datosDeArduinoAsignados.find(arduino => arduino.pilon_encargado == pilonId);

                            if (arduinoAsignado && arduinoAsignado.pilon_encargado == pilonId) {
                                cardFooter.innerHTML = `${temperature}º ${humidity}`;

                                if (parseFloat(temperature) > pilon.temp_max) {
                                    cardFooter.parentElement.classList.add('high-temperature');
                                    cardFooter.parentElement.classList.remove('low-temperature');
                                    cardFooter.parentElement.classList.remove('success-temperature');

                                } else if (parseFloat(temperature) < pilon.temp_min) {
                                    cardFooter.parentElement.classList.add('low-temperature');
                                    cardFooter.parentElement.classList.remove('high-temperature');
                                    cardFooter.parentElement.classList.remove('success-temperature');

                                } else {
                                    cardFooter.parentElement.classList.add('success-temperature');
                                    cardFooter.parentElement.classList.remove('high-temperature');
                                    cardFooter.parentElement.classList.remove('low-temperature');
                                }
                            }

                            const cardFooters = document.querySelectorAll('.card__footer');
                            cardFooters.forEach(cardFooter => {
                                const pilonId = cardFooter.parentElement.classList[1].split('-')[1];
                                lastUpdateTimestamps[pilonId] = Date.now(); // Inicializa los timestamps
                            });

                            // Crea un intervalo para verificar si ha pasado más de 2 segundos desde la última actualización
                            setInterval(() => {
                                const currentTime = Date.now();
                                cardFooters.forEach(cardFooter => {
                                    const pilonId = cardFooter.parentElement.classList[1].split('-')[1];
                                    const lastUpdate = lastUpdateTimestamps[pilonId];
                                    if (lastUpdate && (currentTime - lastUpdate > 2000)) { // 2000 ms = 2 segundos
                                        cardFooter.parentElement.classList.add('warning-temperature'); // Cambia el color a amarillo
                                        cardFooter.parentElement.classList.remove('success-temperature');
                                        cardFooter.parentElement.classList.remove('high-temperature');
                                        cardFooter.parentElement.classList.remove('low-temperature');
                                    }
                                });
                            }, 1000); // Comprueba cada segundo
                        });
                    }
                }
            });


            const totalPages = Math.ceil(pilones.length / cardsPerPage);

            for (let i = 1; i <= totalPages; i++) {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = i;
                paginationContainer.appendChild(link);
            }

            const paginationLinks = document.querySelectorAll('.pagination a');
            paginationLinks[0].classList.add('page-active');

            paginationLinks.forEach(link => {
                link.addEventListener('click', event => {
                    event.preventDefault();
                    showPage(link.textContent);

                    paginationLinks.forEach(paginationLink => {
                        paginationLink.classList.remove('page-active');
                    });

                    link.classList.add('page-active');
                });
            });

            function showPage(pageNumber) {
                const startIndex = (pageNumber - 1) * cardsPerPage;
                const endIndex = startIndex + cardsPerPage;

                Array.from(container.children).forEach(card => {
                    card.style.display = 'none';
                });

                for (let i = startIndex; i < endIndex; i++) {
                    if (container.children[i]) {
                        container.children[i].style.display = 'block';
                    }
                }
            }

            showPage(1);

        })
        .catch(error => {
            const errorModalBody = $("#errorModal").find(".modal-body");
            errorModalBody.html('Error fetching pilones data:', error);
            $("#errorModal").modal("show");
        });
}
cargarDatosDeArduinoAsignados();
