const paginationContainer = document.querySelector('.pagination');
const container = document.querySelector('.card-container');
const cardsPerPage = 16;

fetch('/api/pilones')
    .then(response => response.json())
    .then(data => {
        const pilones = data;

        for (let i = 0; i < pilones.length; i++) {
            const pilon = pilones[i];
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
        <div class="card__footer">78 ºC | 25%</div>
      `;

            card.innerHTML = cardContent;
            container.appendChild(card);

            card.classList.add('card', `pilon-${pilon.id}`);
        }

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