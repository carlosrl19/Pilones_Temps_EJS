// MODAL FILTERS
const openFilterModalButton = document.getElementById('openFilterModal');
const filterModal = new bootstrap.Modal(document.getElementById('filterModal'));

openFilterModalButton.addEventListener('click', () => {
    filterModal.show();
});


// A - Z / Z - A

const ordenarAZButton = document.getElementById('ordenarAZ');
const ordenarZAButton = document.getElementById('ordenarZA');

ordenarAZButton.addEventListener('click', () => {
    ordenarCards('ascendente');
});

ordenarZAButton.addEventListener('click', () => {
    ordenarCards('descendente');
});

function ordenarCards(orden) {
    // Get all the cards
    const cards = Array.from(container.querySelectorAll('.card'));

    // Sort the cards by name
    cards.sort((a, b) => {
        const nombreA = a.querySelector('.card__title').textContent.toLowerCase();
        const nombreB = b.querySelector('.card__title').textContent.toLowerCase();

        if (orden === 'ascendente') {
            return nombreA.localeCompare(nombreB);
        } else if (orden === 'descendente') {
            return nombreB.localeCompare(nombreA);
        }
    });

    // Clear the container
    container.innerHTML = '';

    // Add the sorted cards back to the container
    cards.forEach(card => {
        container.appendChild(card);
    });
}


// FINCA

const ordenarFincaAZButton = document.getElementById('ordenarFincaAZ');
const ordenarFincaZAButton = document.getElementById('ordenarFincaZA');

ordenarFincaAZButton.addEventListener('click', () => {
    ordenarCardsPorFinca('ascendente');
});

ordenarFincaZAButton.addEventListener('click', () => {
    ordenarCardsPorFinca('descendente');
});

function ordenarCardsPorFinca(orden) {
    // Get all the cards
    const cards = Array.from(container.querySelectorAll('.card'));

    // Sort the cards by the "finca" field
    cards.sort((a, b) => {
        const fincaA = a.querySelector('.card__content').textContent.match(/Property: (.+)/)[1].toLowerCase();
        const fincaB = b.querySelector('.card__content').textContent.match(/Property: (.+)/)[1].toLowerCase();

        if (orden === 'ascendente') {
            return fincaA.localeCompare(fincaB);
        } else if (orden === 'descendente') {
            return fincaB.localeCompare(fincaA);
        }
    });

    // Clear the container
    container.innerHTML = '';

    // Add the sorted cards back to the container
    cards.forEach(card => {
        container.appendChild(card);
    });
}


// VARIEDAD

const ordenarVariedadAZButton = document.getElementById('ordenarVariedadAZ');
const ordenarVariedadZAButton = document.getElementById('ordenarVariedadZA');

ordenarVariedadAZButton.addEventListener('click', () => {
    ordenarCardsPorVariedad('ascendente');
});

ordenarVariedadZAButton.addEventListener('click', () => {
    ordenarCardsPorVariedad('descendente');
});

function ordenarCardsPorVariedad(orden) {
    // Get all the cards
    const cards = Array.from(container.querySelectorAll('.card'));

    // Sort the cards by the "variedad" field
    cards.sort((a, b) => {
        const variedadA = a.querySelector('.card__content').textContent.match(/Variety: (.+)/)[1].toLowerCase();
        const variedadB = b.querySelector('.card__content').textContent.match(/Variety: (.+)/)[1].toLowerCase();

        if (orden === 'ascendente') {
            return variedadA.localeCompare(variedadB);
        } else if (orden === 'descendente') {
            return variedadB.localeCompare(variedadA);
        }
    });

    // Clear the container
    container.innerHTML = '';

    // Add the sorted cards back to the container
    cards.forEach(card => {
        container.appendChild(card);
    });
}


// TEMPS FILTER

const ordenarPorTempMayorButton = document.getElementById('ordenarPorTempMayor');
const ordenarPorTempMenorButton = document.getElementById('ordenarPorTempMenor');

ordenarPorTempMayorButton.addEventListener('click', () => {
    ordenarCardsPorTemperatura('mayor');
});

ordenarPorTempMenorButton.addEventListener('click', () => {
    ordenarCardsPorTemperatura('menor');
});

function ordenarCardsPorTemperatura(orden) {
    // Get all the cards
    const cards = Array.from(container.querySelectorAll('.card'));

    // Sort the cards based on the temperature in their card_footer and temp_min
    cards.sort((a, b) => {
        const temperaturaA = parseFloat(a.querySelector('.card__footer').textContent.split(' ')[0]);
        const tempMinA = parseFloat(a.querySelector('.card__content').textContent.match(/Temp. min: (.+)/)[1]);

        const temperaturaB = parseFloat(b.querySelector('.card__footer').textContent.split(' ')[0]);
        const tempMinB = parseFloat(b.querySelector('.card__content').textContent.match(/Temp. min: (.+)/)[1]);

        if (orden === 'mayor') {
            return temperaturaA > tempMinA ? -1 : 1;
        } else if (orden === 'menor') {
            return temperaturaA < tempMinA ? -1 : 1;
        }
    });

    // Clean the container
    container.innerHTML = '';

    //  Add the sorted cards back to the container
    cards.forEach(card => {
        container.appendChild(card);
    });
}