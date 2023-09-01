const paginationContainer = document.querySelector('.pagination');
const container = document.querySelector('.card-container');
const cardsPerPage = 16;

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
                container.appendChild(card);

                card.classList.add('card', `pilon-${pilon.id}`);
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
                        cardFooter.innerHTML = `${temperature}º <br> ${humidity}`;

                        const pilonId = cardFooter.parentElement.classList[1].split('-')[1];
                        const pilon = pilones.find(p => p.id == pilonId);

                        if (parseFloat(temperature) > pilon.temp_max) {
                            cardFooter.parentElement.classList.add('high-temperature');
                            cardFooter.parentElement.classList.remove('low-temperature');
                            cardFooter.parentElement.classList.remove('success-temperature');
                        } 
                        
                        else if (parseFloat(temperature) < pilon.temp_min) {
                            cardFooter.parentElement.classList.add('low-temperature');
                            cardFooter.parentElement.classList.remove('high-temperature');
                            cardFooter.parentElement.classList.remove('success-temperature');
                        } 
                        
                        else {
                            cardFooter.parentElement.classList.add('success-temperature');
                            cardFooter.parentElement.classList.remove('high-temperature');
                            cardFooter.parentElement.classList.remove('low-temperature');
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
        console.error('Error al obtener los datos de los pilones:', error);
    });