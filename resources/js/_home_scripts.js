const paginationContainer = document.querySelector('.pagination');
const container = document.querySelector('.card-container');
const cardsPerPage = 16;
let selectedCard = null;
let datosDeArduinoAsignados = null;

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

                    card.addEventListener('click', () => {
                        if (selectedCard === card) {
                            card.classList.remove('card-clicked');
                            selectedCard = null;
                        } else {
                            if (selectedCard) {
                                selectedCard.classList.remove('card-clicked');
                            }

                            card.classList.add('card-clicked');
                            selectedCard = card;
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

                        console.log('Temperature:', temperature);
                        console.log('Humidity:', humidity);

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